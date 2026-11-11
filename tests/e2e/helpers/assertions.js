/**
 * Assertion utilities for opaque-box E2E testing.
 */

class AssertionError extends Error {
  constructor(message, actual, expected) {
    super(message);
    this.name = 'AssertionError';
    this.actual = actual;
    this.expected = expected;
  }
}

function assert(condition, message = 'Assertion failed') {
  if (!condition) {
    throw new AssertionError(message, condition, true);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    const msg = message || `Expected ${JSON.stringify(actual)} to strictly equal ${JSON.stringify(expected)}`;
    throw new AssertionError(msg, actual, expected);
  }
}

function assertDeepEqual(actual, expected, message) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    const msg = message || `Expected ${actualStr} to deeply equal ${expectedStr}`;
    throw new AssertionError(msg, actual, expected);
  }
}

function assertIncludes(haystack, needle, message) {
  const contains = typeof haystack === 'string'
    ? haystack.includes(needle)
    : Array.isArray(haystack)
    ? haystack.includes(needle)
    : false;
  if (!contains) {
    const msg = message || `Expected ${JSON.stringify(haystack)} to include ${JSON.stringify(needle)}`;
    throw new AssertionError(msg, haystack, needle);
  }
}

function assertMatch(string, regex, message) {
  if (!regex.test(string)) {
    const msg = message || `Expected "${string}" to match pattern ${regex}`;
    throw new AssertionError(msg, string, regex);
  }
}

function assertGreaterThan(actual, threshold, message) {
  if (!(actual > threshold)) {
    const msg = message || `Expected ${actual} to be strictly greater than ${threshold}`;
    throw new AssertionError(msg, actual, threshold);
  }
}

function assertGreaterThanOrEqual(actual, threshold, message) {
  if (!(actual >= threshold)) {
    const msg = message || `Expected ${actual} to be >= ${threshold}`;
    throw new AssertionError(msg, actual, threshold);
  }
}

function assertNoFatalErrors(errors, contextMsg = '') {
  const fatalPatterns = [
    /setWishlistCount is not a function/i,
    /Objects are not valid as a React child/i,
    /Uncaught TypeError/i,
    /Uncaught ReferenceError/i,
    /WebSocket closed/i,
  ];

  const matched = [];
  for (const err of errors) {
    for (const pat of fatalPatterns) {
      if (pat.test(err)) {
        matched.push(err);
      }
    }
  }

  if (matched.length > 0) {
    throw new AssertionError(
      `Fatal error(s) detected ${contextMsg}: ${matched.join(' | ')}`,
      matched,
      []
    );
  }
}

module.exports = {
  AssertionError,
  assert,
  assertEqual,
  assertDeepEqual,
  assertIncludes,
  assertMatch,
  assertGreaterThan,
  assertGreaterThanOrEqual,
  assertNoFatalErrors,
};
