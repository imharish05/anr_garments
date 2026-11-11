'use strict';

const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

/**
 * Normalize client IP across IPv4 and IPv6 subnets for rate-limit keys.
 */
const clientIpKey = (req) => ipKeyGenerator(req.ip || req.socket?.remoteAddress || '127.0.0.1');

/**
 * Shared express-rate-limit factory with consistent headers and JSON 429 payloads.
 */
const createRateLimiter = ({
  windowMs,
  limit,
  message = 'Too many requests. Please slow down and try again shortly.',
  skip,
  keyGenerator = clientIpKey,
}) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator,
    skip,
    handler: (req, res, _next, options) => {
      const resetTime = req.rateLimit?.resetTime;
      const retryAfterSeconds = resetTime
        ? Math.max(1, Math.ceil((new Date(resetTime).getTime() - Date.now()) / 1000))
        : Math.max(1, Math.ceil(options.windowMs / 1000));

      res.setHeader('Retry-After', String(retryAfterSeconds));
      res.status(options.statusCode || 429).json({
        success: false,
        code: 'RATE_LIMITED',
        message: typeof message === 'string' ? message : message.message,
        retryAfterSeconds,
      });
    },
  });

const generalApiLimiter = createRateLimiter({
  windowMs: 15 * MINUTE,
  limit: Number(process.env.RATE_LIMIT_GENERAL_MAX) || 600,
  message: 'Too many API requests from your IP. Please wait a few minutes and try again.',
  skip: (req) =>
    req.path === '/health' ||
    req.path === '/payments/webhook/razorpay',
});

const authLimiter = createRateLimiter({
  windowMs: 15 * MINUTE,
  limit: Number(process.env.RATE_LIMIT_AUTH_MAX) || 25,
  message: 'Too many authentication attempts. Please try again after 15 minutes.',
});

const otpLimiter = createRateLimiter({
  windowMs: 15 * MINUTE,
  limit: Number(process.env.RATE_LIMIT_OTP_MAX) || 8,
  message: 'Too many verification code requests. Please wait 15 minutes before requesting another code.',
});

const resetLimiter = createRateLimiter({
  windowMs: 1 * HOUR,
  limit: Number(process.env.RATE_LIMIT_RESET_MAX) || 5,
  message: 'Too many password reset attempts. Please try again after an hour.',
});

const refreshTokenLimiter = createRateLimiter({
  windowMs: 15 * MINUTE,
  limit: Number(process.env.RATE_LIMIT_REFRESH_MAX) || 40,
  message: 'Too many session refresh requests. Please sign in again shortly.',
});

const publicFormLimiter = createRateLimiter({
  windowMs: 15 * MINUTE,
  limit: Number(process.env.RATE_LIMIT_FORM_MAX) || 10,
  message: 'Too many form submissions. Please wait a few minutes before submitting again.',
});

const orderLimiter = createRateLimiter({
  windowMs: 15 * MINUTE,
  limit: Number(process.env.RATE_LIMIT_ORDER_MAX) || 15,
  message: 'Too many order requests from this connection. Please wait a few minutes and try again.',
});

const paymentLimiter = createRateLimiter({
  windowMs: 15 * MINUTE,
  limit: Number(process.env.RATE_LIMIT_PAYMENT_MAX) || 20,
  message: 'Too many payment attempts. Please wait a few minutes before retrying checkout.',
});

const searchLimiter = createRateLimiter({
  windowMs: 1 * MINUTE,
  limit: Number(process.env.RATE_LIMIT_SEARCH_MAX) || 45,
  message: 'Too many search requests. Please pause briefly before searching again.',
});

const couponLimiter = createRateLimiter({
  windowMs: 15 * MINUTE,
  limit: Number(process.env.RATE_LIMIT_COUPON_MAX) || 25,
  message: 'Too many coupon validation attempts. Please wait 15 minutes before trying again.',
});

const writeActionLimiter = createRateLimiter({
  windowMs: 15 * MINUTE,
  limit: Number(process.env.RATE_LIMIT_WRITE_MAX) || 60,
  message: 'Too many update actions in a short window. Please wait a moment and try again.',
});

module.exports = {
  createRateLimiter,
  clientIpKey,
  generalApiLimiter,
  authLimiter,
  otpLimiter,
  resetLimiter,
  refreshTokenLimiter,
  publicFormLimiter,
  orderLimiter,
  paymentLimiter,
  searchLimiter,
  couponLimiter,
  writeActionLimiter,
};
