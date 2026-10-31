// Contact form over Amazon SES. Runs in its own process (node --test runs each
// file separately), so SES_REGION can be set before index.js reads it.
process.env.ADMIN_PASSWORD = 'test_admin_password';
process.env.CHAT_LOGS_DIR = require('fs').mkdtempSync(require('path').join(require('os').tmpdir(), 'nixsoft-ses-logs-'));
process.env.XAI_API_KEY = '';
process.env.DEEPSEEK_API_KEY = '';
process.env.ALLOWED_ORIGINS = 'http://localhost:3000';
process.env.SES_REGION = 'ap-south-1';
process.env.SMTP_FROM = 'website@nixsoftech.in';
process.env.SMTP_USER = 'AKIAEXAMPLESMTPUSER'; // an SES-style login, never a valid sender
process.env.CONTACT_EMAIL = 'sales@nixsoftech.in';

const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const { SendEmailCommand } = require('@aws-sdk/client-sesv2');
const app = require('../index.js');

test('POST /api/contact sends through Amazon SES when SES_REGION is set', async () => {
  // The real nodemailer SES transport and SDK command; only the network call
  // to AWS is replaced, so no credentials are needed.
  const sesTransport = app.locals.transporter.transporter;
  assert.strictEqual(sesTransport.name, 'SESTransport');
  let sent = null;
  sesTransport.ses.sesClient.send = async (command) => {
    sent = command;
    return { MessageId: 'test-message-id' };
  };

  const server = http.createServer(app).listen(0);
  try {
    const res = await fetch(`http://localhost:${server.address().port}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jane Doe',
        email: 'jane@example.com',
        company: 'ACME',
        message: 'We need managed DevOps support.',
      }),
    });
    assert.strictEqual(res.status, 200);
  } finally {
    server.close();
  }

  assert.ok(sent instanceof SendEmailCommand);
  // Sender is SMTP_FROM, not the SES login in SMTP_USER
  assert.match(sent.input.FromEmailAddress, /website@nixsoftech\.in/);
  assert.deepStrictEqual(sent.input.Destination.ToAddresses, ['sales@nixsoftech.in']);
  const raw = sent.input.Content.Raw.Data.toString();
  assert.match(raw, /^From: "?Nixsoft Website"? <website@nixsoftech\.in>\r?$/m);
  assert.match(raw, /^To: sales@nixsoftech\.in\r?$/m);
  assert.match(raw, /^Reply-To: jane@example\.com/m);
  assert.match(raw, /^Subject: New Inquiry from Jane Doe \(ACME\)/m);
});
