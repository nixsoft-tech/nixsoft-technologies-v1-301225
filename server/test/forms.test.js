// Abuse protection on the emailing forms (/api/contact, /api/lead) and admin
// login. Own process, so the limits below don't affect the other test files.
process.env.ADMIN_PASSWORD = 'test_admin_password';
process.env.CHAT_LOGS_DIR = require('fs').mkdtempSync(require('path').join(require('os').tmpdir(), 'nixsoft-forms-logs-'));
process.env.XAI_API_KEY = '';
process.env.DEEPSEEK_API_KEY = '';
process.env.ALLOWED_ORIGINS = 'http://localhost:3000';
process.env.CONTACT_EMAIL = 'sales@nixsoftech.in';
process.env.FORM_EMAILS_PER_MINUTE = '3';
process.env.FORM_EMAILS_PER_HOUR = '100';
process.env.FORM_EMAILS_DAILY_LIMIT = '4';
const { EASY_PUZZLE_ENV, solvedPuzzle } = require('./puzzle');
Object.assign(process.env, EASY_PUZZLE_ENV);

const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const app = require('../index.js');
const { HONEYPOT_FIELD } = require('../formguard');

const CONTACT = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  company: 'ACME',
  message: 'We need managed DevOps support.',
};

test('form abuse protection', async (t) => {
  const server = http.createServer(app).listen(0);
  const baseUrl = `http://localhost:${server.address().port}`;
  t.after(() => server.close());

  const sent = [];
  app.locals.transporter = { sendMail: async (options) => { sent.push(options); return {}; } };
  const post = (path, body) => fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  // The order below matters: the per-minute limit is 3 emails and the daily
  // cap 4, counted across both forms for this one client IP.

  await t.test('challenge endpoint issues uncached, signed puzzles', async () => {
    const res = await fetch(`${baseUrl}/api/altcha/challenge`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get('cache-control'), 'no-store');
    const challenge = await res.json();
    assert.ok(challenge.signature);
    assert.strictEqual(challenge.parameters.algorithm, 'PBKDF2/SHA-256');
  });

  await t.test('no puzzle, a forged one, or a reused one -> 403, nothing sent', async () => {
    assert.strictEqual((await post('/api/contact', CONTACT)).status, 403);
    assert.strictEqual((await post('/api/contact', { ...CONTACT, altcha: 'bm90IGEgcHV6emxl' })).status, 403);

    const puzzle = await solvedPuzzle(baseUrl);
    assert.strictEqual((await post('/api/contact', { ...CONTACT, altcha: puzzle })).status, 200); // email 1
    const replay = await post('/api/contact', { ...CONTACT, altcha: puzzle });
    assert.strictEqual(replay.status, 403);
    assert.strictEqual((await replay.json()).code, 'PUZZLE');
    assert.strictEqual(sent.length, 1);
  });

  await t.test('honeypot filled -> fake success, nothing sent, puzzle not needed', async () => {
    const res = await post('/api/contact', { ...CONTACT, [HONEYPOT_FIELD]: 'call me' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(sent.length, 1);
  });

  await t.test('too many links -> 400 before any puzzle work', async () => {
    const spam = 'Buy now https://a.example https://b.example https://c.example www.d.example';
    const res = await post('/api/contact', { ...CONTACT, message: spam, altcha: await solvedPuzzle(baseUrl) });
    assert.strictEqual(res.status, 400);
  });

  await t.test('line breaks in name/company cannot inject email headers', async () => {
    const res = await post('/api/contact', {
      ...CONTACT,
      name: 'Eve\r\nBcc: victim@example.com',
      altcha: await solvedPuzzle(baseUrl),
    }); // email 2
    assert.strictEqual(res.status, 200);
    const mail = sent.at(-1);
    assert.doesNotMatch(mail.subject, /[\r\n]/);
    assert.match(mail.subject, /^New Inquiry from Eve Bcc: victim@example\.com \(ACME\)$/);
  });

  await t.test('homepage lead form emails sales@ with the visitor as reply-to', async () => {
    assert.strictEqual((await post('/api/lead', { email: 'not-an-email', altcha: await solvedPuzzle(baseUrl) })).status, 400);
    assert.strictEqual((await post('/api/lead', { email: 'cto@acme.example' })).status, 403);

    const res = await post('/api/lead', { email: 'cto@acme.example', altcha: await solvedPuzzle(baseUrl) }); // email 3
    assert.strictEqual(res.status, 200);
    const mail = sent.at(-1);
    assert.strictEqual(mail.to, 'sales@nixsoftech.in');
    assert.strictEqual(mail.replyTo, 'cto@acme.example');
    assert.match(mail.subject, /^New lead from the homepage: cto@acme\.example$/);
  });

  await t.test('per-IP limit: the 4th email within a minute -> 429', async () => {
    const res = await post('/api/lead', { email: 'cfo@acme.example', altcha: await solvedPuzzle(baseUrl) });
    assert.strictEqual(res.status, 429);
    assert.strictEqual((await res.json()).code, 'RATE_LIMIT');
    assert.ok(Number(res.headers.get('retry-after')) > 0);
    assert.strictEqual(sent.length, 3);
  });

  await t.test('global daily cap -> 503 once reached, whatever the IP', async () => {
    // Fresh per-IP allowance, so only the daily cap (4) can stop email 5.
    const formguard = require('../formguard');
    formguard.emailLimiter.check = () => ({ ok: true });
    assert.strictEqual((await post('/api/lead', { email: 'a@acme.example', altcha: await solvedPuzzle(baseUrl) })).status, 200); // email 4
    const res = await post('/api/lead', { email: 'b@acme.example', altcha: await solvedPuzzle(baseUrl) });
    assert.strictEqual(res.status, 503);
    assert.strictEqual((await res.json()).code, 'DAILY_CAP');
    assert.strictEqual(sent.length, 4);
  });

  await t.test('admin login needs a solved puzzle before the password is checked', async () => {
    const res = await post('/api/admin/login', { password: 'test_admin_password' });
    assert.strictEqual(res.status, 403);
    const ok = await post('/api/admin/login', { password: 'test_admin_password', altcha: await solvedPuzzle(baseUrl) });
    assert.strictEqual(ok.status, 200);
  });
});
