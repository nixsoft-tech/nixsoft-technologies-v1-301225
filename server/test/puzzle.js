// Test helper: solves the server's ALTCHA puzzle the way the browser widget
// does. Test files set ALTCHA_COST / ALTCHA_COUNTER_* tiny before requiring
// index.js, so solving takes milliseconds instead of a second.
const { solveChallenge } = require('altcha-lib');
const { deriveKey } = require('altcha-lib/algorithms/pbkdf2');

const EASY_PUZZLE_ENV = {
  ALTCHA_COST: '1',
  ALTCHA_COUNTER_MIN: '1',
  ALTCHA_COUNTER_MAX: '20',
};

/** Fetches a challenge from the running server and returns the widget payload. */
async function solvedPuzzle(baseUrl) {
  const challenge = await (await fetch(`${baseUrl}/api/altcha/challenge`)).json();
  const solution = await solveChallenge({ challenge, deriveKey });
  return Buffer.from(JSON.stringify({ challenge, solution })).toString('base64');
}

module.exports = { EASY_PUZZLE_ENV, solvedPuzzle };
