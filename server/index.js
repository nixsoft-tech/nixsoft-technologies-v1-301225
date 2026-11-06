const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs-extra');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { generateReply, configuredProviders } = require('./ai');
const nixbot = require('./nixbot');
const formguard = require('./formguard');

const app = express();
const PORT = 5000;

// Behind nginx-proxy — trust the first proxy hop so req.ip reflects the client
app.set('trust proxy', 1);

// ─── Startup configuration checks (fail closed) ──────────────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  console.error('FATAL: ADMIN_PASSWORD is not set. Refusing to start.');
  process.exit(1);
}

{
  const providers = configuredProviders();
  if (providers.length === 0) {
    console.warn('WARN: No AI provider key set (XAI_API_KEY / DEEPSEEK_API_KEY) — /api/chat will respond in demo mode.');
  } else {
    console.log(`AI providers (in priority order): ${providers.map((p) => `${p.provider.label} [${p.provider.model()}]`).join(' → ')}`);
  }
}

// Contact-form email goes through Amazon SES when SES_REGION is set, else SMTP.
const SES_REGION = process.env.SES_REGION;
const SMTP_CONFIGURED =
  !!process.env.SMTP_PASS && process.env.SMTP_PASS !== 'your_app_password';
// SES SMTP/API usernames aren't email addresses, so the sender is its own
// setting; SMTP_USER is the fallback for the Gmail setup, where they match.
const MAIL_FROM = process.env.SMTP_FROM || process.env.SMTP_USER;
// The website's own SES configuration set. Naming one on every send overrides
// the identity's default set — today MailBluster's — so reconnecting or
// removing MailBluster can't break the contact form.
const SES_CONFIGURATION_SET = process.env.SES_CONFIGURATION_SET;
if (SES_REGION) {
  console.log(`Contact email: Amazon SES (${SES_REGION}), from ${MAIL_FROM}` +
    (SES_CONFIGURATION_SET ? `, configuration set ${SES_CONFIGURATION_SET}` : ', identity\'s default configuration set'));
  if (!process.env.SMTP_FROM) {
    console.warn('WARN: SES_REGION is set but SMTP_FROM is not — set it to an address on the verified SES domain.');
  }
} else if (!SMTP_CONFIGURED) {
  console.warn('WARN: Neither SES_REGION nor SMTP_PASS is set — /api/contact is disabled.');
}

// ─── CORS: explicit origin allow-list ─────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS ||
  'http://localhost:3000,http://localhost:3001')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Allow same-origin / non-browser requests (no Origin header)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
}));

app.use(express.json({ limit: '100kb' }));

const LOGS_DIR = process.env.CHAT_LOGS_DIR || path.join(__dirname, 'logs', 'chats');
fs.ensureDirSync(LOGS_DIR);

// Clean up chat logs older than 90 days (or configured CHAT_RETENTION_DAYS)
async function purgeOldLogs() {
  const retentionDays = Number(process.env.CHAT_RETENTION_DAYS) || 90;
  console.log(`[Purge] Running chat logs sweep. Retention: ${retentionDays} days.`);
  try {
    const files = await fs.readdir(LOGS_DIR);
    const now = new Date();
    let count = 0;
    for (const file of files) {
      if (file.endsWith('.json')) {
        const dateStr = file.replace('.json', '');
        // Force parsing in UTC to match new Date().toISOString()
        const fileDate = new Date(dateStr + 'T00:00:00Z');
        if (isNaN(fileDate.getTime())) continue;

        const diffTime = now.getTime() - fileDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        if (diffDays > retentionDays) {
          const filePath = path.join(LOGS_DIR, file);
          await fs.remove(filePath);
          console.log(`[Purge] Deleted old log file: ${file}`);
          count++;
        }
      }
    }
    console.log(`[Purge] Sweep complete. Deleted ${count} file(s).`);
  } catch (err) {
    console.error('[Purge] Failed to sweep chat logs:', err);
  }
}

// Trigger purge on startup
purgeOldLogs();

// Trigger purge daily (every 24 hours). unref() so this timer alone doesn't
// keep the process alive — the listening server does that in production, and
// the test runner can exit once its tests finish.
setInterval(purgeOldLogs, 24 * 60 * 60 * 1000).unref();

// Constant-time credential comparison (hash both sides to equalize length)
function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

// ─── Chat logging (server-side only) ──────────────────────────────────────────
// Only /api/chat writes logs, from the message it received and the reply it
// actually sent, so transcripts in the admin viewer can't be forged from the
// browser. Writes are serialized so concurrent visitors don't lose entries.
let logQueue = Promise.resolve();

function appendChatLog(entries) {
  const today = new Date().toISOString().split('T')[0];
  const logFile = path.join(LOGS_DIR, `${today}.json`);
  logQueue = logQueue
    .then(async () => {
      const logs = (await fs.pathExists(logFile)) ? await fs.readJson(logFile) : [];
      logs.push(...entries);
      await fs.writeJson(logFile, logs, { spaces: 2 });
    })
    .catch((err) => console.error('Logging error:', err));
  return logQueue;
}

// ─── Chat API (AI proxy — keeps provider API keys server-side) ───────────────
// Guardrails live in nixbot.js: system prompt, signed history, input/output
// screening, and per-IP plus daily cost ceilings.
const chatLimiter = nixbot.createRateLimiter({
  perMinute: nixbot.envInt('CHAT_RATE_PER_MINUTE', 8),
  perHour: nixbot.envInt('CHAT_RATE_PER_HOUR', 60),
});
const dailyBudget = nixbot.createDailyBudget(nixbot.envInt('AI_DAILY_LIMIT', 1500));

const DEMO_REPLY = "I'm currently in demo mode (API Key missing). I can tell you that Nixsoft specializes in Open-Source Automation and Security!";
const RATE_LIMIT_REPLY = "You're sending messages faster than I can keep up. Please wait a moment, or email sales@nixsoftech.in for a detailed discussion.";
const BUSY_REPLY = "I'm unavailable for the rest of today. Please email sales@nixsoftech.in or use the contact form, and our team will get back to you.";

app.post('/api/chat', async (req, res) => {
  const { history, message, sessionId } = req.body || {};

  const cleanMessage = nixbot.validateMessage(message);
  if (!cleanMessage) {
    return res.status(400).json({ error: 'Invalid message' });
  }
  if (history !== undefined && !Array.isArray(history)) {
    return res.status(400).json({ error: 'Invalid history' });
  }
  const session = typeof sessionId === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(sessionId)
    ? sessionId
    : 'unknown';

  const limit = chatLimiter.check(req.ip);
  if (!limit.ok) {
    res.set('Retry-After', String(limit.retryAfterSec));
    return res.status(429).json({ error: 'Too many messages', reply: RATE_LIMIT_REPLY });
  }

  const respond = (reply) => {
    const now = new Date().toISOString();
    appendChatLog([
      { timestamp: now, sessionId: session, role: 'user', text: cleanMessage },
      { timestamp: now, sessionId: session, role: 'model', text: reply },
    ]);
    return res.json({ reply, sig: nixbot.signReply(reply) });
  };

  if (configuredProviders().length === 0) {
    return respond(DEMO_REPLY);
  }
  if (!dailyBudget.take()) {
    console.warn('[AI] Daily chat budget (AI_DAILY_LIMIT) reached — replying with the busy message.');
    return res.status(503).json({ error: 'Daily limit reached', reply: BUSY_REPLY });
  }

  try {
    const messages = nixbot.buildMessages(history, cleanMessage);
    const { reply: raw } = await generateReply({ system: nixbot.SYSTEM_PROMPT, messages });
    const { reply, blocked } = nixbot.screenReply(raw);
    if (blocked) {
      console.warn(`[AI] Blocked a reply that looked like a prompt leak (session ${session}).`);
    }
    return respond(reply);
  } catch (err) {
    console.error('AI chat error:', err.message);
    return res.status(502).json({ error: 'Upstream AI service failed' });
  }
});

// ─── JWT Authentication Helpers ──────────────────────────────────────────────
function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return Buffer.from(str, 'base64').toString();
}

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

function signJwt(payload, expirySeconds = 3600) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + expirySeconds;
  const fullPayload = { ...payload, exp };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest();
  const encodedSignature = base64UrlEncode(signature);

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

function verifyJwt(token) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest();

  const expectedSignature = base64UrlEncode(signature);
  if (!safeEqual(encodedSignature, expectedSignature)) {
    return null; // Invalid signature
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

// ─── Admin Logs API ───────────────────────────────────────────────────────────
// Simple per-IP lockout: 5 failed attempts per 15-minute window
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

app.post('/api/admin/login', async (req, res) => {
  const { password, altcha } = req.body || {};
  const ip = req.ip;
  const now = Date.now();

  const record = loginAttempts.get(ip);
  if (record && now - record.firstAt > ATTEMPT_WINDOW_MS) {
    loginAttempts.delete(ip);
  }
  const current = loginAttempts.get(ip);
  if (current && current.count >= MAX_ATTEMPTS) {
    return res.status(429).json({ error: 'Too many failed attempts. Try again later.' });
  }

  // Puzzle before the password check: password guessing costs a solved puzzle
  // per attempt on top of the lockout. Doesn't count as a failed attempt.
  if (!(await formguard.verifyPuzzle(altcha))) {
    return res.status(403).json({ error: 'Verification failed', code: 'PUZZLE' });
  }

  if (typeof password !== 'string' || !password || !safeEqual(password, ADMIN_PASSWORD)) {
    const entry = loginAttempts.get(ip) || { count: 0, firstAt: now };
    entry.count += 1;
    loginAttempts.set(ip, entry);
    return res.status(401).json({ error: 'Unauthorized' });
  }

  loginAttempts.delete(ip);
  const token = signJwt({ admin: true }, 3600); // 1 hour token
  res.json({ success: true, token });
});

app.get('/api/admin/chats', async (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.replace(/^Bearer\s+/i, '');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const decoded = verifyJwt(token);
  if (!decoded || !decoded.admin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { from, to } = req.query;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if ((from && !dateRegex.test(from)) || (to && !dateRegex.test(to))) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    let startDateStr = from;
    let endDateStr = to;

    if (!startDateStr) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);
      startDateStr = thirtyDaysAgo.toISOString().split('T')[0];
    }
    if (!endDateStr) {
      endDateStr = new Date().toISOString().split('T')[0];
    }

    const files = await fs.readdir(LOGS_DIR);
    const allLogs = {};
    for (const file of files) {
      if (file.endsWith('.json')) {
        const date = file.replace('.json', '');
        if (date >= startDateStr && date <= endDateStr) {
          allLogs[date] = await fs.readJson(path.join(LOGS_DIR, file));
        }
      }
    }
    res.json(allLogs);
  } catch (err) {
    console.error('Failed to read logs:', err);
    res.status(500).json({ error: 'Failed to read logs' });
  }
});

// ─── Contact Email API ────────────────────────────────────────────────────────
// Transporter is created once at startup and reused across requests.
function createMailTransport() {
  if (SES_REGION) {
    // The AWS SDK finds credentials itself: on EC2, from the instance's IAM
    // role (no secret stored on the server); elsewhere, AWS_* env vars.
    const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2');
    return nodemailer.createTransport({
      SES: { sesClient: new SESv2Client({ region: SES_REGION }), SendEmailCommand },
    });
  }
  if (SMTP_CONFIGURED) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
}
app.locals.transporter = createMailTransport();

// Server-side validation mirroring the rules in pages/Contact.tsx
function validateContact({ name, email, phone, company, message }) {
  const errors = [];
  if (typeof name !== 'string' || name.trim().length < 2 || name.length > 100) {
    errors.push('Invalid name');
  }
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    errors.push('Invalid email');
  }
  if (phone !== undefined && (typeof phone !== 'string' || !/^\+?[\d\s\-().]{7,20}$/.test(phone))) {
    errors.push('Invalid phone');
  }
  if (typeof company !== 'string' || !company.trim() || company.length > 200) {
    errors.push('Invalid company');
  }
  if (typeof message !== 'string' || message.trim().length < 10 || message.length > 2000) {
    errors.push('Invalid message');
  }
  return errors;
}

// ─── Form abuse protection (see formguard.js) ────────────────────────────────
// Puzzles for the forms' ALTCHA widget. Covered by nginx-proxy's /api/ limit.
app.get('/api/altcha/challenge', async (req, res, next) => {
  try {
    res.set('Cache-Control', 'no-store').json(await formguard.newChallenge());
  } catch (err) {
    next(err);
  }
});

/**
 * Runs the checks every emailing form shares, after field validation:
 * honeypot, puzzle, per-IP limit, daily cap. Sends the response itself and
 * returns false when the email must not be sent.
 */
async function guardEmailForm(req, res) {
  const body = req.body || {};
  // A filled honeypot means a bot. Report success so it moves on; send nothing.
  if (formguard.isHoneypotFilled(body)) {
    res.status(200).json({ success: true });
    return false;
  }
  if (!(await formguard.verifyPuzzle(body.altcha))) {
    res.status(403).json({ error: 'Verification failed', code: 'PUZZLE' });
    return false;
  }
  const limit = formguard.emailLimiter.check(req.ip);
  if (!limit.ok) {
    res.set('Retry-After', String(limit.retryAfterSec));
    res.status(429).json({ error: 'Too many messages', code: 'RATE_LIMIT' });
    return false;
  }
  if (!formguard.emailBudget.take()) {
    console.warn('WARN: daily form email cap reached — rejecting until UTC midnight.');
    res.status(503).json({ error: 'Email is temporarily unavailable', code: 'DAILY_CAP' });
    return false;
  }
  return true;
}

/** Sends one form notification to CONTACT_EMAIL; responds 200 or 500. */
async function sendFormEmail(res, { subject, text, replyTo }) {
  const mailOptions = {
    from: `"Nixsoft Website" <${MAIL_FROM}>`,
    to: process.env.CONTACT_EMAIL,
    replyTo,
    subject: formguard.singleLine(subject),
    text,
  };
  // Extra SendEmail parameters for the SES transport (SMTP ignores this key)
  if (SES_REGION && SES_CONFIGURATION_SET) {
    mailOptions.ses = { ConfigurationSetName: SES_CONFIGURATION_SET };
  }
  try {
    await app.locals.transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
}

app.post('/api/contact', async (req, res) => {
  if (!app.locals.transporter) {
    return res.status(503).json({ error: 'Email service is not configured' });
  }

  const body = req.body || {};
  const errors = validateContact(body);
  if (typeof body.message === 'string' && formguard.countLinks(body.message) > formguard.MAX_LINKS) {
    errors.push(`Too many links (max ${formguard.MAX_LINKS})`);
  }
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  if (!(await guardEmailForm(req, res))) return;

  const { name, email, phone, company, message } = body;
  const line = formguard.singleLine;
  await sendFormEmail(res, {
    subject: `New Inquiry from ${line(name)} (${line(company)})`,
    text: `Name: ${line(name)}\nEmail: ${email}\nPhone: ${phone ? line(phone) : '-'}\nCompany: ${line(company)}\nMessage: ${message}`,
    replyTo: email,
  });
});

// Homepage "work email" lead form
app.post('/api/lead', async (req, res) => {
  if (!app.locals.transporter) {
    return res.status(503).json({ error: 'Email service is not configured' });
  }

  const { email } = req.body || {};
  if (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Validation failed', details: ['Invalid email'] });
  }
  if (!(await guardEmailForm(req, res))) return;

  await sendFormEmail(res, {
    subject: `New lead from the homepage: ${email}`,
    text: `Work email: ${email}\nSource: homepage — "Get Your Free Infrastructure Audit"\n\nNo other details were given — reply to this email to reach them.`,
    replyTo: email,
  });
});

// ─── NixBot lead capture ──────────────────────────────────────────────────────
// After two answers the chat widget asks for name + email (phone optional)
// before it continues. The details go to sales@ together with the
// conversation so far, read from the server's own chat log (not from the
// browser), and are added to the log so the admin viewer shows them.
const CHAT_LEAD_TRANSCRIPT_MAX = 40; // most recent turns included in the email

function validateChatLead({ name, email, phone, sessionId }) {
  const errors = [];
  if (typeof name !== 'string' || name.trim().length < 2 || name.length > 100) errors.push('Invalid name');
  if (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Invalid email');
  if (phone !== undefined && phone !== '' && (typeof phone !== 'string' || !/^\+?[0-9 ()-]{7,20}$/.test(phone))) errors.push('Invalid phone');
  if (typeof sessionId !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(sessionId)) errors.push('Invalid session');
  return errors;
}

/** This session's logged turns (today's and yesterday's log files, UTC). */
async function sessionTranscript(sessionId) {
  await logQueue; // include the reply that was just logged
  const day = (offset) => new Date(Date.now() - offset * 86400000).toISOString().split('T')[0];
  const entries = [];
  for (const d of [day(1), day(0)]) {
    const file = path.join(LOGS_DIR, `${d}.json`);
    if (await fs.pathExists(file)) {
      const logs = await fs.readJson(file).catch(() => []);
      entries.push(...logs.filter((e) => e.sessionId === sessionId && (e.role === 'user' || e.role === 'model')));
    }
  }
  return entries.slice(-CHAT_LEAD_TRANSCRIPT_MAX);
}

app.post('/api/chat/lead', async (req, res) => {
  if (!app.locals.transporter) {
    return res.status(503).json({ error: 'Email service is not configured' });
  }
  const body = req.body || {};
  const errors = validateChatLead(body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  if (!(await guardEmailForm(req, res))) return;

  const line = formguard.singleLine;
  const name = line(body.name.trim());
  const phone = body.phone ? line(body.phone) : '';
  const details = `Name: ${name}\nEmail: ${body.email}\nPhone: ${phone || '-'}`;

  const transcript = await sessionTranscript(body.sessionId);
  await appendChatLog([{
    timestamp: new Date().toISOString(),
    sessionId: body.sessionId,
    role: 'lead',
    text: details.replace(/\n/g, ' | '),
  }]);

  const conversation = transcript.length
    ? transcript.map((e) => `${e.role === 'user' ? 'Visitor' : 'NixBot'}: ${String(e.text).slice(0, 1500)}`).join('\n\n')
    : '(not found in the chat log)';
  await sendFormEmail(res, {
    subject: `NixBot lead: ${name} (${line(body.email)})`,
    text: `${details}\nSource: NixBot chat (session ${body.sessionId})\n\nConversation so far:\n\n${conversation}`,
    replyTo: body.email,
  });
});

// Clean error responses — never leak stack traces to clients
app.use((err, req, res, next) => {
  if (err && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'Origin not allowed' });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

module.exports = app;
