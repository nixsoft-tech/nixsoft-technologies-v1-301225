// All AI calls are proxied through the backend (POST /api/chat), which picks
// the provider (Grok, falling back to DeepSeek), so no API key ever ships in
// the browser bundle.
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

const FALLBACK_REPLY =
  "I'm having trouble connecting to the knowledge base. Please try again or contact our team directly.";

export const sendChatMessage = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string
): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, message }),
    });
    if (!response.ok) {
      return FALLBACK_REPLY;
    }
    const data = await response.json();
    return typeof data.reply === 'string' && data.reply ? data.reply : FALLBACK_REPLY;
  } catch (error) {
    console.error('Chat API error:', error);
    return FALLBACK_REPLY;
  }
};
