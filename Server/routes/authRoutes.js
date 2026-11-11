'use strict';
const router = require('express').Router();
const {
  authLimiter,
  otpLimiter,
  resetLimiter,
  refreshTokenLimiter,
} = require('../middleware/rateLimiter');
const {
  register, login, sendLoginOtp, verifyLoginOtp, getProfile, updateProfile, changePassword,
  adminLogin, adminRegister,
  refresh, getRefreshToken, getMe,
  forgotPassword, verifyOtp, resetPassword,
  sendCheckoutOtp, verifyCheckoutOtp
} = require('../controllers/authController');
const { verifyCustomer, verifyAdmin } = require('../middleware/auth');

// ── Customer Auth ─────────────────────────────────────────────────────────────
router.post('/register',            authLimiter, register);
router.post('/login',               authLimiter, login);
router.post('/send-login-otp',      otpLimiter, sendLoginOtp);
router.post('/verify-login-otp',    authLimiter, verifyLoginOtp);
router.post('/forgot-password',     resetLimiter, forgotPassword);
router.post('/verify-otp',          resetLimiter, verifyOtp);
router.post('/reset-password',      resetLimiter, resetPassword);
router.post('/send-checkout-otp',   otpLimiter, sendCheckoutOtp);
router.post('/verify-checkout-otp', authLimiter, verifyCheckoutOtp);

router.post('/refresh',           refreshTokenLimiter, refresh);
router.post('/get-refresh-token', refreshTokenLimiter, getRefreshToken);
router.get('/getme',              getMe);
router.get('/me',                 getMe);
router.get('/profile',            verifyCustomer, getProfile);
router.put('/profile',            verifyCustomer, updateProfile);
router.put('/change-password',    authLimiter, verifyCustomer, changePassword);

// ── Admin Auth ────────────────────────────────────────────────────────────────
router.post('/admin/login',    authLimiter, adminLogin);
router.post('/admin/register', verifyAdmin,  adminRegister);  // 🔒 requires valid admin JWT

module.exports = router;
