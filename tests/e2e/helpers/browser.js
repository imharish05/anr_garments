/**
 * Browser management helper for Playwright E2E test harness.
 * Connects to Chromium / Chrome / Edge headless instances and instruments console & error traps.
 */

const { chromium } = require('playwright');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

let globalBrowser = null;

/**
 * Launch or reuse a shared browser instance.
 */
async function getBrowser(options = {}) {
  if (globalBrowser) return globalBrowser;

  const launchOptions = {
    headless: options.headless !== undefined ? options.headless : true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  };

  try {
    globalBrowser = await chromium.launch(launchOptions);
  } catch (err1) {
    try {
      globalBrowser = await chromium.launch({ ...launchOptions, channel: 'chrome' });
    } catch (err2) {
      globalBrowser = await chromium.launch({ ...launchOptions, channel: 'msedge' });
    }
  }

  return globalBrowser;
}

/**
 * Creates a fresh page with isolated context and event listeners.
 */
async function createTestPage(options = {}) {
  const browser = await getBrowser(options);
  const context = await browser.newContext({
    viewport: options.viewport || { width: 1280, height: 800 },
    userAgent: options.userAgent,
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  const consoleErrors = [];
  const consoleWarnings = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error') {
      consoleErrors.push(text);
    } else if (msg.type() === 'warning') {
      consoleWarnings.push(text);
    }
  });

  page.on('pageerror', (err) => {
    pageErrors.push(err.message || String(err));
  });

  // Attach diagnostic collectors
  page.getErrors = () => ({
    consoleErrors: [...consoleErrors],
    pageErrors: [...pageErrors],
    consoleWarnings: [...consoleWarnings],
    allErrors: [...consoleErrors, ...pageErrors],
  });

  page.clearErrors = () => {
    consoleErrors.length = 0;
    pageErrors.length = 0;
    consoleWarnings.length = 0;
  };

  page.gotoApp = async (path = '/', navOptions = {}) => {
    const url = path.startsWith('http') ? path : `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    return page.goto(url, {
      waitUntil: navOptions.waitUntil || 'domcontentloaded',
      timeout: navOptions.timeout || 15000,
      ...navOptions,
    });
  };

  page.setLocalStorage = async (key, val) => {
    await page.evaluate(({ k, v }) => {
      localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
    }, { k: key, v: val });
  };

  page.getLocalStorage = async (key) => {
    return page.evaluate((k) => {
      const raw = localStorage.getItem(k);
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    }, key);
  };

  return { page, context, browser };
}

async function closeGlobalBrowser() {
  if (globalBrowser) {
    try {
      await globalBrowser.close();
    } catch {
      // ignore
    }
    globalBrowser = null;
  }
}

module.exports = {
  BASE_URL,
  API_BASE_URL,
  getBrowser,
  createTestPage,
  closeGlobalBrowser,
};
