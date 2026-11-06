// Abuse protection for the website's forms — contact, homepage lead capture
// and admin login. Server-side only:
//
//   - ALTCHA proof-of-work puzzle. Self-hosted: challenges are created and
//     verified here, nothing goes to a third party. Each solved puzzle is
//     single-use and expires.
//   - Honeypot field. Hidden from people; bots that fill every input reveal
//     themselves.
//   - Email limits: per-IP rate limit and a global daily cap, so even solved
//     puzzles can't turn the contact form into a spam cannon (SES cost and
//     sender reputation).
//   - Content checks: header-injection-safe single-line values, link limit.

const crypto = require('crypto');
const { createChallenge, randomInt, CappedMap } = require('altcha-lib');
// verify() is what altcha-lib's Express plugin calls: signature, solution,
// expiry, then marks the puzzle used in the store (replay protection).
const { verify } = require('altcha-lib/frameworks/shared');
const { deriveKey } = require('altcha-lib/algorithms/pbkdf2');
const { createRateLimiter, createDailyBudget, envInt } = require('./nixbot');

// Puzzle difficulty. PBKDF2 `cost` iterations per attempt, and the solution
// lies at a random attempt in [COUNTER_MIN, COUNTER_MAX]. 2000 / 500-1500
// benchmarks at ~1.2s on one CPU core; the widget splits the work across
// cores, so ~0.5s on desktops and ~1-1.5s on mid-range phones. Each attempt
// a bot makes costs the same.
const ALTCHA_ALGORITHM = 'PBKDF2/SHA-256';
const ALTCHA_COST = envInt('ALTCHA_COST', 2000);
const ALTCHA_COUNTER_MIN = envInt('ALTCHA_COUNTER_MIN', 500);
const ALTCHA_COUNTER_MAX = envInt('ALTCHA_COUNTER_MAX', 1500);
// Long enough to solve the puzzle first and then fill in a long message.
const ALTCHA_EXPIRES_MS = 30 * 60 * 1000;

// Signing secrets. A random secret per process is fine for a single server:
// a restart only invalidates puzzles solved in the last few minutes. Set
// ALTCHA_HMAC_SECRET to keep them valid across restarts or multiple instances.
const HMAC_SECRET = process.env.ALTCHA_HMAC_SECRET || crypto.randomBytes(32).toString('hex');
const HMAC_KEY_SECRET = crypto.createHash('sha256').update(`altcha-key:${HMAC_SECRET}`).digest('hex');

// Solved puzzles already used — each one works for a single submission.
// Capped so a flood can't exhaust memory; entries expire with the challenge.
const usedPuzzles = new CappedMap({ maxSize: 20000 });

/** Issues a new signed puzzle for the widget (GET /api/altcha/challenge). */
async function newChallenge() {
  return createChallenge({
    algorithm: ALTCHA_ALGORITHM,
    cost: ALTCHA_COST,
    counter: randomInt(ALTCHA_COUNTER_MIN, ALTCHA_COUNTER_MAX),
    deriveKey,
    hmacSignatureSecret: HMAC_SECRET,
    hmacKeySignatureSecret: HMAC_KEY_SECRET,
    expiresAt: new Date(Date.now() + ALTCHA_EXPIRES_MS),
  });
}

/**
 * Checks a widget payload: valid signature, solved, not expired, not reused.
 * @returns {Promise<boolean>}
 */
async function verifyPuzzle(payload) {
  if (typeof payload !== 'string' || !payload || payload.length > 5000) return false;
  try {
    const { error } = await verify(payload, deriveKey, HMAC_SECRET, HMAC_KEY_SECRET, usedPuzzles);
    return !error;
  } catch (err) {
    // verify() reports bad payloads in `error`; a throw is a bug — log it.
    console.error('ALTCHA verification crashed:', err);
    return false;
  }
}

/** True when the hidden honeypot field was filled in — a bot, not a person. */
function isHoneypotFilled(body) {
  const value = body && body[HONEYPOT_FIELD];
  return typeof value === 'string' && value.trim() !== '';
}
// Deliberately unappealing to browser autofill (unlike "website" or "phone2").
const HONEYPOT_FIELD = 'contact_me_by_fax_only';

/** Collapses a value into one header-safe line (no CR/LF injection). */
function singleLine(value) {
  return String(value).replace(/[\r\n\t]+/g, ' ').trim();
}

/** Links in a message — enquiries rarely need more than a couple. */
function countLinks(text) {
  return (String(text).match(/https?:\/\/|www\./gi) || []).length;
}
const MAX_LINKS = 3;

// Every email the forms send (contact + homepage lead) shares these limits.
const emailLimiter = createRateLimiter({
  perMinute: envInt('FORM_EMAILS_PER_MINUTE', 2),
  perHour: envInt('FORM_EMAILS_PER_HOUR', 5),
});
const emailBudget = createDailyBudget(envInt('FORM_EMAILS_DAILY_LIMIT', 200));

module.exports = {
  HONEYPOT_FIELD,
  MAX_LINKS,
  newChallenge,
  verifyPuzzle,
  isHoneypotFilled,
  singleLine,
  countLinks,
  emailLimiter,
  emailBudget,
};
