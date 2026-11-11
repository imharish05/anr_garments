/**
 * Lightweight, zero-dependency async test harness for Playwright E2E suites.
 */

const { createTestPage, closeGlobalBrowser } = require('./browser');

class TestSuite {
  constructor(name) {
    this.name = name;
    this.tests = [];
    this.beforeAllHooks = [];
    this.afterAllHooks = [];
    this.beforeEachHooks = [];
    this.afterEachHooks = [];
  }

  test(title, fn, options = {}) {
    this.tests.push({ title, fn, options });
  }

  beforeAll(fn) {
    this.beforeAllHooks.push(fn);
  }

  afterAll(fn) {
    this.afterAllHooks.push(fn);
  }

  beforeEach(fn) {
    this.beforeEachHooks.push(fn);
  }

  afterEach(fn) {
    this.afterEachHooks.push(fn);
  }
}

const registeredSuites = [];

function describe(suiteName, fn) {
  const suite = new TestSuite(suiteName);
  registeredSuites.push(suite);
  fn(suite);
  return suite;
}

async function runAllSuites(filter = {}) {
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    durationMs: 0,
    suites: [],
  };

  const startTime = Date.now();

  for (const suite of registeredSuites) {
    if (filter.suite && !suite.name.toLowerCase().includes(filter.suite.toLowerCase())) {
      continue;
    }

    const suiteResult = {
      name: suite.name,
      tests: [],
      passed: 0,
      failed: 0,
      skipped: 0,
    };

    console.log(`\n\x1b[1m\x1b[36m▶ Suite: ${suite.name}\x1b[0m`);

    try {
      for (const hook of suite.beforeAllHooks) {
        await hook();
      }
    } catch (err) {
      console.error(`  \x1b[31m✖ Suite beforeAll failed:\x1b[0m`, err);
    }

    for (const testItem of suite.tests) {
      if (filter.test && !testItem.title.toLowerCase().includes(filter.test.toLowerCase())) {
        continue;
      }

      results.total++;
      const testStart = Date.now();
      let testError = null;

      // Create isolated page fixture for the test if requested
      let fixture = null;
      try {
        fixture = await createTestPage(testItem.options.pageOptions || {});
      } catch (err) {
        testError = err;
      }

      if (!testError && fixture) {
        try {
          for (const hook of suite.beforeEachHooks) {
            await hook(fixture);
          }

          const timeoutMs = testItem.options.timeout || 30000;
          const testPromise = testItem.fn(fixture);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Test timed out after ${timeoutMs}ms`)), timeoutMs)
          );

          await Promise.race([testPromise, timeoutPromise]);

          for (const hook of suite.afterEachHooks) {
            await hook(fixture);
          }
        } catch (err) {
          testError = err;
        } finally {
          try {
            await fixture.context.close();
          } catch {
            // ignore
          }
        }
      }

      const duration = Date.now() - testStart;

      if (!testError) {
        results.passed++;
        suiteResult.passed++;
        console.log(`  \x1b[32m✔\x1b[0m ${testItem.title} \x1b[90m(${duration}ms)\x1b[0m`);
        suiteResult.tests.push({ title: testItem.title, passed: true, duration });
      } else {
        results.failed++;
        suiteResult.failed++;
        console.log(`  \x1b[31m✖\x1b[0m ${testItem.title} \x1b[90m(${duration}ms)\x1b[0m`);
        console.log(`    \x1b[31m${testError.message || testError}\x1b[0m`);
        if (testError.stack) {
          const stackLine = testError.stack.split('\n')[1] || '';
          console.log(`    \x1b[90m${stackLine.trim()}\x1b[0m`);
        }
        suiteResult.tests.push({
          title: testItem.title,
          passed: false,
          duration,
          error: testError.message || String(testError),
          stack: testError.stack,
        });
      }
    }

    try {
      for (const hook of suite.afterAllHooks) {
        await hook();
      }
    } catch (err) {
      console.error(`  \x1b[31m✖ Suite afterAll failed:\x1b[0m`, err);
    }

    results.suites.push(suiteResult);
  }

  await closeGlobalBrowser();
  results.durationMs = Date.now() - startTime;
  return results;
}

module.exports = {
  describe,
  runAllSuites,
  registeredSuites,
};
