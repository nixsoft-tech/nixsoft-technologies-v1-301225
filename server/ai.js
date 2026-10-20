// ─── AI chat providers ───────────────────────────────────────────────────────
// Server-side only: API keys never reach the browser.
//
// Providers are tried in the order given by AI_PROVIDERS (default
// "grok,deepseek"). A provider without an API key is skipped; if one fails
// (bad key, rate limit, timeout, outage) the next one is tried, so a single
// provider problem doesn't take the chatbot down.
//
//   AI_PROVIDERS       grok,deepseek      priority order
//   XAI_API_KEY        —                  Grok (xAI) key
//   XAI_MODEL          grok-4.7           https://docs.x.ai/developers/models
//   DEEPSEEK_API_KEY   —                  DeepSeek key
//   DEEPSEEK_MODEL     deepseek-flash     https://api-docs.deepseek.com
//   AI_TIMEOUT_MS      20000              per-provider request timeout

const DEFAULT_TIMEOUT_MS = 20000;
const MAX_REPLY_TOKENS = 500; // NixBot replies are 2-3 sentences

/** Pull the reply text out of an xAI Responses API body. */
function extractResponsesText(data) {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim();
  }
  const parts = [];
  for (const item of data?.output || []) {
    if (item?.type !== 'message') continue;
    for (const c of item.content || []) {
      if (c?.type === 'output_text' && typeof c.text === 'string') parts.push(c.text);
    }
  }
  return parts.join('').trim();
}

/** Pull the reply text out of an OpenAI-style Chat Completions body. */
function extractChatCompletionText(data) {
  const content = data?.choices?.[0]?.message?.content;
  return typeof content === 'string' ? content.trim() : '';
}

async function postJson(url, apiKey, body, timeoutMs) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) {
    // Include a short snippet of the provider's error body for diagnosis.
    // Never include request headers — they carry the API key.
    const snippet = (await res.text().catch(() => '')).slice(0, 300);
    const err = new Error(`HTTP ${res.status} ${snippet}`.trim());
    err.status = res.status;
    throw err;
  }
  return res.json();
}

const PROVIDERS = {
  grok: {
    label: 'Grok (xAI)',
    apiKey: () => process.env.XAI_API_KEY || '',
    model: () => process.env.XAI_MODEL || 'grok-4.7',
    // xAI recommends the Responses API; Chat Completions is legacy there.
    async generate({ system, messages, timeoutMs }) {
      const data = await postJson('https://api.x.ai/v1/responses', this.apiKey(), {
        model: this.model(),
        instructions: system,
        input: messages,
        temperature: 0.7,
        max_output_tokens: MAX_REPLY_TOKENS,
        store: false, // don't keep visitor conversations on xAI's servers
      }, timeoutMs);
      return extractResponsesText(data);
    },
  },
  deepseek: {
    label: 'DeepSeek',
    apiKey: () => process.env.DEEPSEEK_API_KEY || '',
    model: () => process.env.DEEPSEEK_MODEL || 'deepseek-flash',
    async generate({ system, messages, timeoutMs }) {
      const data = await postJson('https://api.deepseek.com/chat/completions', this.apiKey(), {
        model: this.model(),
        messages: [{ role: 'system', content: system }, ...messages],
        temperature: 0.7,
        max_tokens: MAX_REPLY_TOKENS,
        stream: false,
      }, timeoutMs);
      return extractChatCompletionText(data);
    },
  },
};

/** Providers that have an API key, in priority order. */
function configuredProviders() {
  const order = (process.env.AI_PROVIDERS || 'grok,deepseek')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const seen = new Set();
  const list = [];
  for (const name of order) {
    if (seen.has(name)) continue;
    seen.add(name);
    const provider = PROVIDERS[name];
    if (!provider) {
      console.warn(`WARN: Unknown AI provider "${name}" in AI_PROVIDERS — ignored.`);
      continue;
    }
    if (provider.apiKey()) list.push({ name, provider });
  }
  return list;
}

/**
 * Generate a reply, trying each configured provider in order.
 * @param {{ system: string, messages: {role: 'user'|'assistant', content: string}[] }} input
 * @returns {Promise<{ reply: string, provider: string }>}
 */
async function generateReply({ system, messages }) {
  const providers = configuredProviders();
  if (providers.length === 0) {
    throw new Error('No AI provider is configured');
  }
  const timeoutMs = Number(process.env.AI_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS;
  const failures = [];
  for (const { name, provider } of providers) {
    try {
      const reply = await provider.generate({ system, messages, timeoutMs });
      if (!reply) throw new Error('Empty reply');
      return { reply, provider: name };
    } catch (err) {
      const reason = err?.name === 'TimeoutError' ? `timed out after ${timeoutMs}ms` : err?.message;
      console.error(`[AI] ${provider.label} (${provider.model()}) failed: ${reason}`);
      failures.push(name);
    }
  }
  throw new Error(`All AI providers failed: ${failures.join(', ')}`);
}

module.exports = {
  generateReply,
  configuredProviders,
  extractResponsesText,
  extractChatCompletionText,
  PROVIDERS,
};
