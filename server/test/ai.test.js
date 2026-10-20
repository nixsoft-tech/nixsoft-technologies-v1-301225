// Unit tests for the AI provider chain. `fetch` is mocked, so no real API is called.
const test = require('node:test');
const assert = require('node:assert');
const {
  generateReply, configuredProviders, extractResponsesText, extractChatCompletionText,
} = require('../ai');

const ENV_KEYS = ['AI_PROVIDERS', 'XAI_API_KEY', 'XAI_MODEL', 'DEEPSEEK_API_KEY', 'DEEPSEEK_MODEL', 'AI_TIMEOUT_MS'];
const realFetch = global.fetch;
const realError = console.error;

/** Mock fetch with a handler (url, body) → { status, json }; records every call. */
function mockFetch(handler) {
  const calls = [];
  global.fetch = async (url, init) => {
    const body = JSON.parse(init.body);
    calls.push({ url, body, auth: init.headers.Authorization });
    const { status = 200, json = {} } = await handler(url, body);
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => json,
      text: async () => JSON.stringify(json),
    };
  };
  return calls;
}

const grokOk = (text) => ({ json: { output: [{ type: 'message', content: [{ type: 'output_text', text }] }] } });
const deepseekOk = (text) => ({ json: { choices: [{ message: { role: 'assistant', content: text } }] } });
const input = { system: 'You are NixBot.', messages: [{ role: 'user', content: 'Hi' }] };

test('AI provider chain', async (t) => {
  const saved = {};
  t.beforeEach(() => {
    for (const k of ENV_KEYS) { saved[k] = process.env[k]; delete process.env[k]; }
    console.error = () => {}; // failures are logged by design; keep test output clean
  });
  t.afterEach(() => {
    for (const k of ENV_KEYS) { if (saved[k] === undefined) delete process.env[k]; else process.env[k] = saved[k]; }
    global.fetch = realFetch;
    console.error = realError;
  });

  await t.test('only providers with a key are configured, in AI_PROVIDERS order', () => {
    assert.deepStrictEqual(configuredProviders().map((p) => p.name), []);
    process.env.DEEPSEEK_API_KEY = 'ds';
    assert.deepStrictEqual(configuredProviders().map((p) => p.name), ['deepseek']);
    process.env.XAI_API_KEY = 'xai';
    assert.deepStrictEqual(configuredProviders().map((p) => p.name), ['grok', 'deepseek']);
    process.env.AI_PROVIDERS = 'deepseek, grok';
    assert.deepStrictEqual(configuredProviders().map((p) => p.name), ['deepseek', 'grok']);
  });

  await t.test('Grok is called through the xAI Responses API', async () => {
    process.env.XAI_API_KEY = 'xai-test';
    const calls = mockFetch(() => grokOk('Hello from Grok'));
    const result = await generateReply(input);
    assert.deepStrictEqual(result, { reply: 'Hello from Grok', provider: 'grok' });
    assert.strictEqual(calls[0].url, 'https://api.x.ai/v1/responses');
    assert.strictEqual(calls[0].auth, 'Bearer xai-test');
    assert.strictEqual(calls[0].body.model, 'grok-4.7');
    assert.strictEqual(calls[0].body.instructions, 'You are NixBot.');
    assert.deepStrictEqual(calls[0].body.input, input.messages);
    assert.strictEqual(calls[0].body.store, false);
  });

  await t.test('DeepSeek is called through Chat Completions with a system message', async () => {
    process.env.DEEPSEEK_API_KEY = 'ds-test';
    const calls = mockFetch(() => deepseekOk('Hello from DeepSeek'));
    const result = await generateReply(input);
    assert.deepStrictEqual(result, { reply: 'Hello from DeepSeek', provider: 'deepseek' });
    assert.strictEqual(calls[0].url, 'https://api.deepseek.com/chat/completions');
    assert.strictEqual(calls[0].body.model, 'deepseek-flash');
    assert.deepStrictEqual(calls[0].body.messages[0], { role: 'system', content: 'You are NixBot.' });
  });

  await t.test('falls back to DeepSeek when Grok rejects the key', async () => {
    process.env.XAI_API_KEY = 'bad-key';
    process.env.DEEPSEEK_API_KEY = 'ds-test';
    const calls = mockFetch((url) => (url.includes('x.ai')
      ? { status: 401, json: { error: 'Incorrect API key' } }
      : deepseekOk('Fallback reply')));
    const result = await generateReply(input);
    assert.deepStrictEqual(result, { reply: 'Fallback reply', provider: 'deepseek' });
    assert.strictEqual(calls.length, 2);
  });

  await t.test('an empty reply counts as a failure and triggers fallback', async () => {
    process.env.XAI_API_KEY = 'xai-test';
    process.env.DEEPSEEK_API_KEY = 'ds-test';
    mockFetch((url) => (url.includes('x.ai') ? { json: { output: [] } } : deepseekOk('Non-empty')));
    assert.strictEqual((await generateReply(input)).provider, 'deepseek');
  });

  await t.test('throws when every provider fails', async () => {
    process.env.XAI_API_KEY = 'x';
    process.env.DEEPSEEK_API_KEY = 'd';
    mockFetch(() => ({ status: 503, json: { error: 'unavailable' } }));
    await assert.rejects(generateReply(input), /All AI providers failed: grok, deepseek/);
  });

  await t.test('model names can be overridden with env vars', async () => {
    process.env.XAI_API_KEY = 'x';
    process.env.XAI_MODEL = 'grok-custom';
    const calls = mockFetch(() => grokOk('ok'));
    await generateReply(input);
    assert.strictEqual(calls[0].body.model, 'grok-custom');
  });
});

test('reply extraction', () => {
  assert.strictEqual(extractResponsesText({ output_text: ' direct ' }), 'direct');
  assert.strictEqual(extractResponsesText({
    output: [
      { type: 'reasoning', summary: [] },
      { type: 'message', content: [{ type: 'output_text', text: 'Part 1. ' }, { type: 'output_text', text: 'Part 2.' }] },
    ],
  }), 'Part 1. Part 2.');
  assert.strictEqual(extractResponsesText({}), '');
  assert.strictEqual(extractChatCompletionText({ choices: [{ message: { content: ' hi ' } }] }), 'hi');
  assert.strictEqual(extractChatCompletionText({ choices: [] }), '');
});
