'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const { createRateLimiter } = require('./rateLimiter');

const startEphemeralServer = (app) =>
  new Promise((resolve) => {
    const server = app.listen(0, '127.0.0.1', () => {
      const address = server.address();
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${address.port}`,
      });
    });
  });

test('createRateLimiter enforces limit and returns structured 429 response with standard headers', async () => {
  const app = express();
  app.set('trust proxy', 1);

  const testLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    limit: 2,
    message: 'Too many test requests.',
  });

  app.get('/ping', testLimiter, (_req, res) => {
    res.json({ success: true });
  });

  const { server, baseUrl } = await startEphemeralServer(app);
  try {
    const r1 = await fetch(`${baseUrl}/ping`, {
      headers: { 'x-forwarded-for': '203.0.113.10' },
    });
    assert.equal(r1.status, 200);
    assert.equal(r1.headers.get('ratelimit-limit'), '2');
    assert.equal(r1.headers.get('ratelimit-remaining'), '1');

    const r2 = await fetch(`${baseUrl}/ping`, {
      headers: { 'x-forwarded-for': '203.0.113.10' },
    });
    assert.equal(r2.status, 200);
    assert.equal(r2.headers.get('ratelimit-remaining'), '0');

    const r3 = await fetch(`${baseUrl}/ping`, {
      headers: { 'x-forwarded-for': '203.0.113.10' },
    });
    assert.equal(r3.status, 429);
    const body = await r3.json();
    assert.equal(body.success, false);
    assert.equal(body.code, 'RATE_LIMITED');
    assert.equal(body.message, 'Too many test requests.');
    assert.ok(Number(body.retryAfterSeconds) >= 1);
    assert.ok(Number(r3.headers.get('retry-after')) >= 1);

    // Distinct IP is not blocked by the first IP's limit
    const rOtherIp = await fetch(`${baseUrl}/ping`, {
      headers: { 'x-forwarded-for': '203.0.113.11' },
    });
    assert.equal(rOtherIp.status, 200);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('server app mounts cleanly with safe trust proxy setting and skips rate limit on health endpoint', async () => {
  const app = require('../app');
  assert.notEqual(app.get('trust proxy'), true);

  const { server, baseUrl } = await startEphemeralServer(app);
  try {
    const res = await fetch(`${baseUrl}/api/health`, {
      headers: { 'x-forwarded-for': '203.0.113.12' },
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'ok');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
