process.env.ADMIN_PASSWORD = 'test_admin_password';
// Chat logs go to a throwaway folder, not server/logs.
process.env.CHAT_LOGS_DIR = require('fs').mkdtempSync(require('path').join(require('os').tmpdir(), 'nixsoft-api-logs-'));
process.env.XAI_API_KEY = ''; // No AI provider keys → demo mode
process.env.DEEPSEEK_API_KEY = '';
process.env.ALLOWED_ORIGINS = 'http://localhost:3000';

const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const app = require('../index.js');

test('Nixsoft Backend API Integration Tests', async (t) => {
  let server;
  let baseUrl;

  t.before(() => {
    return new Promise((resolve) => {
      server = http.createServer(app);
      server.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://localhost:${port}`;
        console.log(`Test server running at ${baseUrl}`);
        resolve();
      });
    });
  });

  t.after(() => {
    return new Promise((resolve) => {
      server.close(resolve);
    });
  });

  await t.test('POST /api/chat - Demo Mode & Input Validation', async () => {
    // 1. Valid request in demo mode
    const res1 = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello' })
    });
    assert.strictEqual(res1.status, 200);
    const data1 = await res1.json();
    assert.ok(data1.reply);
    assert.match(data1.reply, /demo mode/i);

    // 2. Invalid request - missing message
    const res2 = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert.strictEqual(res2.status, 400);
  });

  await t.test('POST /api/contact - Validation & SMTP', async () => {
    // 1. Missing parameters -> 503 Service Unavailable when SMTP not configured
    app.locals.transporter = null;
    const resUnconfigured = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        company: 'ACME',
        message: 'Hello, I need DevOps support.'
      })
    });
    assert.strictEqual(resUnconfigured.status, 503);

    // Set up a mock transporter
    let sentMail = null;
    app.locals.transporter = {
      sendMail: async (options) => {
        sentMail = options;
        return { messageId: 'mock-id-123' };
      }
    };

    // 2. Invalid email format -> 400 Bad Request
    const resInvalid = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'invalid-email',
        company: 'ACME',
        message: 'Hello, I need DevOps support.'
      })
    });
    assert.strictEqual(resInvalid.status, 400);
    const dataInvalid = await resInvalid.json();
    assert.ok(dataInvalid.error);

    // 3. Valid contact form submission -> 200 OK
    const resValid = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        company: 'ACME',
        message: 'Hello, I need DevOps support.'
      })
    });
    assert.strictEqual(resValid.status, 200);
    assert.ok(sentMail);
    assert.strictEqual(sentMail.replyTo, 'john@example.com');
  });

  await t.test('Admin Login, Locks, JWT & Chats Endpoint', async () => {
    // 1. Login with incorrect password
    const resLoginFail = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong_password' })
    });
    assert.strictEqual(resLoginFail.status, 401);

    // 2. Fetch chats without auth header -> 401
    const resChatsNoAuth = await fetch(`${baseUrl}/api/admin/chats`);
    assert.strictEqual(resChatsNoAuth.status, 401);

    // 3. Login with correct password
    const resLoginSuccess = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'test_admin_password' })
    });
    assert.strictEqual(resLoginSuccess.status, 200);
    const loginData = await resLoginSuccess.json();
    assert.ok(loginData.token);

    // 4. Fetch chats with valid token
    const resChatsSuccess = await fetch(`${baseUrl}/api/admin/chats`, {
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    assert.strictEqual(resChatsSuccess.status, 200);

    // 5. Test date validation on chats endpoint
    const resChatsInvalidDate = await fetch(`${baseUrl}/api/admin/chats?from=invalid`, {
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    assert.strictEqual(resChatsInvalidDate.status, 400);
  });
});
