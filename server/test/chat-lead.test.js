// NixBot lead capture (POST /api/chat/lead). Own process, so its email
// limits don't affect the other test files.
process.env.ADMIN_PASSWORD = 'test_admin_password';
process.env.CHAT_LOGS_DIR = require('fs').mkdtempSync(require('path').join(require('os').tmpdir(), 'nixsoft-lead-logs-'));
process.env.XAI_API_KEY = ''; // demo mode: /api/chat answers without an AI provider
process.env.DEEPSEEK_API_KEY = '';
process.env.ALLOWED_ORIGINS = 'http://localhost:3000';
process.env.CONTACT_EMAIL = 'sales@nixsoftech.in';
process.env.FORM_EMAILS_PER_MINUTE = '10';
process.env.FORM_EMAILS_PER_HOUR = '100';
process.env.FORM_EMAILS_DAILY_LIMIT = '100';
const { EASY_PUZZLE_ENV, solvedPuzzle } = require('./puzzle');
Object.assign(process.env, EASY_PUZZLE_ENV);

const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const fs = require('fs');
const path = require('path');
const app = require('../index.js');
const { HONEYPOT_FIELD } = require('../formguard');

const SESSION = 'leadtest01';
const LEAD = { name: 'Asha Rao', email: 'asha@bank.example', sessionId: SESSION };

test('NixBot lead capture', async (t) => {
  const server = http.createServer(app).listen(0);
  const baseUrl = `http://localhost:${server.address().port}`;
  t.after(() => server.close());

  const sent = [];
  app.locals.transporter = { sendMail: async (options) => { sent.push(options); return {}; } };
  const post = (p, body) => fetch(`${baseUrl}${p}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  // Two turns of conversation in this session (demo-mode replies).
  for (const message of ['Do you manage PostgreSQL?', 'What does 24x7 support include?']) {
    assert.strictEqual((await post('/api/chat', { message, history: [], sessionId: SESSION })).status, 200);
  }

  await t.test('invalid details -> 400, nothing sent', async () => {
    const puzzle = await solvedPuzzle(baseUrl);
    for (const bad of [
      { ...LEAD, name: 'A' },
      { ...LEAD, email: 'not-an-email' },
      { ...LEAD, phone: 'call me maybe' },
      { ...LEAD, sessionId: '../../etc' },
    ]) {
      assert.strictEqual((await post('/api/chat/lead', { ...bad, altcha: puzzle })).status, 400);
    }
    assert.strictEqual(sent.length, 0);
  });

  await t.test('no puzzle -> 403; filled honeypot -> fake success; nothing sent', async () => {
    const res = await post('/api/chat/lead', LEAD);
    assert.strictEqual(res.status, 403);
    assert.strictEqual((await res.json()).code, 'PUZZLE');
    assert.strictEqual((await post('/api/chat/lead', { ...LEAD, [HONEYPOT_FIELD]: 'x' })).status, 200);
    assert.strictEqual(sent.length, 0);
  });

  await t.test('emails sales@ the details and the logged conversation; logs the lead', async () => {
    const res = await post('/api/chat/lead', { ...LEAD, phone: '+91 98200 12345', altcha: await solvedPuzzle(baseUrl) });
    assert.strictEqual(res.status, 200);
    const mail = sent.at(-1);
    assert.strictEqual(mail.to, 'sales@nixsoftech.in');
    assert.strictEqual(mail.replyTo, 'asha@bank.example');
    assert.strictEqual(mail.subject, 'NixBot lead: Asha Rao (asha@bank.example)');
    assert.match(mail.text, /Phone: \+91 98200 12345/);
    assert.match(mail.text, /Visitor: Do you manage PostgreSQL\?/);
    assert.match(mail.text, /Visitor: What does 24x7 support include\?/);
    assert.match(mail.text, /NixBot: I'm currently in demo mode/);

    const today = new Date().toISOString().split('T')[0];
    const logs = JSON.parse(fs.readFileSync(path.join(process.env.CHAT_LOGS_DIR, `${today}.json`), 'utf8'));
    const lead = logs.find((e) => e.role === 'lead' && e.sessionId === SESSION);
    assert.ok(lead, 'lead entry in the chat log');
    assert.match(lead.text, /Name: Asha Rao \| Email: asha@bank\.example \| Phone: \+91 98200 12345/);
  });

  await t.test('phone is optional; line breaks cannot inject headers', async () => {
    const res = await post('/api/chat/lead', {
      ...LEAD,
      name: 'Eve\r\nBcc: victim@example.com',
      altcha: await solvedPuzzle(baseUrl),
    });
    assert.strictEqual(res.status, 200);
    const mail = sent.at(-1);
    assert.doesNotMatch(mail.subject, /[\r\n]/);
    assert.match(mail.text, /Phone: -/);
  });
});
