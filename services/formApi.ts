// Submits the website's emailing forms (contact, homepage lead) and turns the
// server's abuse-protection responses (server/formguard.js) into messages.

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

/** Hidden "honeypot" input — must match HONEYPOT_FIELD in server/formguard.js. */
export const HONEYPOT_FIELD = 'contact_me_by_fax_only';

export type FormResult =
  | { ok: true }
  | { ok: false; message: string };

const FALLBACK = 'email us at sales@nixsoftech.in';

export async function submitForm(path: string, body: Record<string, unknown>): Promise<FormResult> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    return { ok: false, message: 'Network error. Please check your connection and try again.' };
  }
  if (res.ok) return { ok: true };

  const data = await res.json().catch(() => ({} as { code?: string }));
  switch (data.code) {
    case 'PUZZLE':
      return { ok: false, message: 'The "I\'m not a robot" check expired or failed. Please tick it again and resend.' };
    case 'RATE_LIMIT':
      return { ok: false, message: `You've sent several messages in a short time. Please wait a few minutes, or ${FALLBACK}.` };
    case 'DAILY_CAP':
      return { ok: false, message: `We can't accept more messages online today. Please ${FALLBACK} — we'll reply promptly.` };
  }
  if (res.status === 400) {
    return { ok: false, message: 'Some details look invalid (messages may contain at most 3 links). Please check and try again.' };
  }
  return { ok: false, message: `Failed to send. Please try again later, or ${FALLBACK}.` };
}
