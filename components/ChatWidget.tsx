import React, { useState, useRef, useEffect, useMemo, lazy, Suspense } from 'react';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';
import Honeypot from './Honeypot';
import { submitForm, HONEYPOT_FIELD } from '../services/formApi';
import DOMPurify from 'dompurify';
import { sendChatMessage } from '../services/chatService';

// Move type outside component to avoid redefinition on each render.
// `sig` is the server's signature on a bot reply; it's sent back with the
// history so the server can tell real earlier replies from forged ones.
type Message = { role: 'user' | 'model'; text: string; sig?: string };

const MAX_MESSAGE_CHARS = 1000; // matches the server limit

// Lead capture: after this many real answers NixBot asks for name and email
// (phone optional) before the chat continues. Sent to sales@ with the
// conversation (POST /api/chat/lead). Remembered in this browser so a
// returning visitor isn't asked again.
const LEAD_AFTER_REPLIES = 2;
const LEAD_STORAGE_KEY = 'nixbot-lead-given';
const LEAD_PROMPT =
  'Happy to keep helping! Before we continue, could you share your **name** and **email**? Your phone number is optional. Our team may follow up if you need more detail.';

// The puzzle widget (~90 KB) loads only when the details form appears.
const AltchaWidget = lazy(() => import('./AltchaWidget'));

/** In-chat form for name, email and optional phone. */
const LeadForm: React.FC<{ sessionId: string; onDone: (name: string) => void }> = ({ sessionId, onDone }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [puzzle, setPuzzle] = useState<string | null>(null);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  // Bring the whole form into view (the puzzle widget loads a moment later
  // and makes it taller) and put the cursor in the name field.
  useEffect(() => {
    nameRef.current?.focus({ preventScroll: true });
    const timers = [100, 600].map((ms) => setTimeout(() => formRef.current?.scrollIntoView({ block: 'end' }), ms));
    return () => timers.forEach(clearTimeout);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) return setError('Please enter your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Please enter a valid email address.');
    if (phone.trim() && !/^\+?[0-9 ()-]{7,20}$/.test(phone.trim())) return setError('Please check the phone number, or leave it empty.');
    if (!puzzle) return setError("Please tick \"I'm not a robot\" first.");
    setSending(true);
    const result = await submitForm('/api/chat/lead', {
      name: name.trim(), email: email.trim(), phone: phone.trim(), sessionId, altcha: puzzle, [HONEYPOT_FIELD]: honeypot,
    });
    setSending(false);
    if (result.ok) return onDone(name.trim());
    // Each solved puzzle works once: start a fresh one.
    setPuzzle(null);
    setPuzzleKey((k) => k + 1);
    setError(result.message);
  };

  const field = 'w-full text-sm p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nixBlue/20';
  return (
    <form ref={formRef} onSubmit={submit} noValidate className="relative bg-white border border-gray-200 rounded-xl p-3 shadow-sm space-y-2" aria-label="Your details to continue the chat">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <input ref={nameRef} className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Name *" aria-label="Name" autoComplete="name" maxLength={100} />
      <input className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email *" aria-label="Email" autoComplete="email" maxLength={254} />
      <input className={field} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)" aria-label="Phone (optional)" autoComplete="tel" maxLength={20} />
      <Suspense fallback={null}>
        <AltchaWidget key={puzzleKey} onChange={setPuzzle} />
      </Suspense>
      {error && <p className="text-xs text-red-500" role="alert">{error}</p>}
      <button type="submit" disabled={sending} className="w-full p-2 bg-nixBlue text-white text-sm font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50">
        {sending ? 'Sending…' : 'Continue chat'}
      </button>
      <p className="text-[11px] text-slate-400 leading-snug">
        We use these details only to reply to you. See our <a href="/privacy-policy" className="underline">Privacy Policy</a>.
      </p>
    </form>
  );
};

// ─── Formatting helper (defined outside component — no recreation on render) ──
// Bot text is untrusted: escape any HTML first, then apply the small markdown
// subset NixBot is told to use. The sanitizer below only lets through the tags
// this function itself produces — no links, images, or other markup.
const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function formatBotText(raw: string): string {
  return escapeHtml(raw)
    .replace(/### (.*?)\n/g, '<h3 class="font-bold text-nixBlue mt-2 mb-1">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/\n[*-] (.*?)(?=\n|$)/g, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\n/g, '<br />');
}

const SANITIZE_OPTIONS = { ALLOWED_TAGS: ['h3', 'strong', 'em', 'li', 'br'], ALLOWED_ATTR: ['class'] };

// ─── Individual bot message bubble with memoized formatting ──────────────────
const BotBubble: React.FC<{ text: string }> = React.memo(({ text }) => {
  const html = useMemo(
    () => DOMPurify.sanitize(formatBotText(text), SANITIZE_OPTIONS),
    [text]
  );
  return (
    <div
      className="space-y-2"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 11));
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hi! I am NixBot. Ask me about our security benchmarks or automation services.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lead capture state. The stored flag is read after mount (the prerendered
  // HTML has no localStorage).
  const [leadGiven, setLeadGiven] = useState(false);
  useEffect(() => {
    try { setLeadGiven(localStorage.getItem(LEAD_STORAGE_KEY) === '1'); } catch { /* storage blocked */ }
  }, []);
  // Real answers carry the server's signature; error and rate-limit messages don't count.
  const answered = messages.filter((m) => m.role === 'model' && m.sig).length;
  const needLead = !leadGiven && answered >= LEAD_AFTER_REPLIES;
  const askedRef = useRef(false);
  useEffect(() => {
    if (needLead && !askedRef.current && !isLoading) {
      askedRef.current = true;
      setMessages((prev) => [...prev, { role: 'model', text: LEAD_PROMPT }]);
    }
  }, [needLead, isLoading]);

  const handleLeadDone = (name: string) => {
    try { localStorage.setItem(LEAD_STORAGE_KEY, '1'); } catch { /* storage blocked */ }
    setLeadGiven(true);
    setMessages((prev) => [...prev, { role: 'model', text: `Thanks, ${name.split(' ')[0]}! What else would you like to know?` }]);
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Keep a mutable ref in sync with state to fix the stale-closure bug.
  // We always read from this ref when building the history to send to the AI.
  const messagesRef = useRef<Message[]>(messages);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  const toggleChat = () => setIsOpen(prev => !prev);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const userMessage = input.trim();
    if (!userMessage || needLead) return;

    setInput('');
    setError(null);

    const newUserMsg: Message = { role: 'user', text: userMessage };
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    // Build history from the ref (always up-to-date, no stale-closure issue).
    // The server logs the conversation itself.
    const history = messagesRef.current.map(m => ({
      role: m.role,
      parts: [{ text: m.text }],
      ...(m.sig ? { sig: m.sig } : {}),
    }));

    try {
      const { reply, sig } = await sendChatMessage(history, userMessage, sessionId);
      setMessages(prev => [...prev, { role: 'model', text: reply, sig }]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('Something went wrong. Please try again.');
      setMessages(prev => [...prev, {
        role: 'model',
        text: "I'm having trouble connecting. Please try again or contact our team directly."
      }]);
    } finally {
      // Guaranteed to run — isLoading will never be stuck
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          isOpen ? 'bg-slate-800 rotate-90' : 'bg-nixGreen hover:bg-green-400'
        } text-white`}
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} color="#0f172a" fill="#0f172a" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-in-up"
          style={{ height: '500px' }}
          role="dialog"
          aria-label="NixBot Chat Assistant"
        >
          {/* Header */}
          <div className="bg-nixBlue p-4 flex items-center space-x-3">
            <div className="bg-white/10 p-2 rounded-full">
              <Bot size={20} className="text-nixGreen" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">NixBot Assistant</h3>
              <p className="text-blue-200 text-xs">AI-powered assistant</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-xl p-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-nixBlue text-white rounded-br-none'
                    : 'bg-white border border-gray-200 text-slate-700 rounded-bl-none shadow-sm'
                }`}>
                  {msg.role === 'user'
                    ? msg.text
                    : <BotBubble text={msg.text} />
                  }
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-xl rounded-bl-none shadow-sm">
                  <Loader2 size={16} className="animate-spin text-nixBlue" />
                </div>
              </div>
            )}

            {error && (
              <p className="text-center text-xs text-red-400">{error}</p>
            )}

            {needLead && !isLoading && <LeadForm sessionId={sessionId} onDone={handleLeadDone} />}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder={needLead ? 'Share your details above to continue' : 'Ask about DevOps or Security...'}
                maxLength={MAX_MESSAGE_CHARS}
                className="flex-1 text-sm p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-nixBlue/20"
                aria-label="Chat input"
                disabled={isLoading || needLead}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || needLead || !input.trim()}
                className="p-2 bg-nixBlue text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
