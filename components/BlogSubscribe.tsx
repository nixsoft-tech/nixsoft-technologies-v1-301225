import React, { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import Honeypot from './Honeypot';
import { submitForm, HONEYPOT_FIELD } from '../services/formApi';
import { trackLead } from './Analytics';

const AltchaWidget = lazy(() => import('./AltchaWidget'));

/**
 * "Get new articles by email" box on the blog page. Same checks as the
 * homepage email form (bot puzzle, honeypot, rate limits) through /api/lead
 * with source "blog": each sign-up is emailed to sales@, who add it to the
 * mailing list by hand.
 */
const BlogSubscribe: React.FC = () => {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // The puzzle appears once the visitor starts on the form.
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [puzzle, setPuzzle] = useState<string | null>(null);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!puzzle) {
      setShowPuzzle(true);
      setError('Please tick "I\'m not a robot" first.');
      return;
    }
    setError(null);
    setSending(true);
    const result = await submitForm('/api/lead', { email, source: 'blog', altcha: puzzle, [HONEYPOT_FIELD]: honeypot });
    setSending(false);
    // Each solved puzzle works once, so start a fresh one whatever happened.
    setPuzzle(null);
    setPuzzleKey((k) => k + 1);
    if (result.ok) {
      if (!honeypot) trackLead('blog_subscribe');
      setDone(true);
      setEmail('');
    } else {
      setError(result.message);
    }
  };

  return (
    <section className="py-20 bg-nixBlue relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        <h2 className="text-3xl font-display font-bold text-white mb-4">Stay ahead of the curve</h2>
        <p className="text-blue-100 mb-8">Get our new articles on DevOps, databases and security by email.</p>
        {done ? (
          <p role="status" className="max-w-md mx-auto bg-white text-green-700 p-4 rounded-xl font-semibold">
            Thank you! We'll email you when we publish a new article.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="work@company.com"
                aria-label="Your email address"
                value={email}
                onFocus={() => setShowPuzzle(true)}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-nixGreen/50"
              />
              <button
                type="submit"
                disabled={sending}
                className="bg-nixGreen hover:bg-green-400 text-nixBlue font-bold px-8 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : 'Subscribe'}
              </button>
            </div>
            <Honeypot value={honeypot} onChange={setHoneypot} />
            {showPuzzle && (
              <div className="mt-4 min-h-[60px] flex justify-center">
                <Suspense fallback={null}>
                  <AltchaWidget
                    key={puzzleKey}
                    onChange={(payload) => {
                      setPuzzle(payload);
                      if (payload) setError(null);
                    }}
                  />
                </Suspense>
              </div>
            )}
            {error && <p role="alert" className="text-white bg-red-600/80 rounded-lg text-sm mt-3 px-3 py-2">{error}</p>}
          </form>
        )}
        <p className="text-xs text-blue-200 mt-4">
          Only new articles, no spam. See our{' '}
          <Link to="/privacy-policy" className="underline hover:text-white">privacy policy</Link>.
        </p>
      </div>
    </section>
  );
};

export default BlogSubscribe;
