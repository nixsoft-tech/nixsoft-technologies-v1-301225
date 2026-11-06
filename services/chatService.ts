// All AI calls are proxied through the backend (POST /api/chat), which picks
// the provider (Grok, falling back to DeepSeek), applies the NixBot guardrails,
// and logs the conversation, so no API key ever ships in the browser bundle.
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

const FALLBACK_REPLY =
  "I'm having trouble connecting to the knowledge base. Please try again or contact our team directly.";

/** One earlier turn. `sig` is the server's signature on a bot reply — send it back unchanged. */
export type ChatHistoryTurn = { role: 'user' | 'model'; parts: { text: string }[]; sig?: string };

export type ChatReply = { reply: string; sig?: string };

export const sendChatMessage = async (
  history: ChatHistoryTurn[],
  message: string,
  sessionId: string
): Promise<ChatReply> => {
  try {
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, message, sessionId }),
    });
    const data = await response.json().catch(() => ({}));
    // Rate-limit and busy responses carry a friendly `reply` to show as-is.
    if (typeof data.reply === 'string' && data.reply) {
      return { reply: data.reply, sig: response.ok && typeof data.sig === 'string' ? data.sig : undefined };
    }
    return { reply: FALLBACK_REPLY };
  } catch (error) {
    console.error('Chat API error:', error);
    return { reply: FALLBACK_REPLY };
  }
};
