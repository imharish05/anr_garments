import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TopAnnouncementBar from '../components/TopAnnouncementBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LazyCartDrawer from '../components/LazyCartDrawer';
import { useCart } from '../context/CartContext';
import { sendLoginOtpApi, verifyLoginOtpApi } from '../services/api';
import { ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/';
  const { loginUser, setIsCartOpen } = useCart();

  useEffect(() => {
    if (setIsCartOpen) setIsCartOpen(false);
  }, [setIsCartOpen]);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for Resend Code
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const res = await sendLoginOtpApi(cleanEmail);
      setIsOtpSent(true);
      setSuccessMessage(res.message || `Verification code sent to ${cleanEmail}`);
      setResendCooldown(30);
    } catch (err) {
      setErrorMessage(err?.message || 'Unable to send verification code. Please check your email and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    if (!cleanOtp || cleanOtp.length < 4) {
      setErrorMessage('Please enter the verification code sent to your email');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyLoginOtpApi(cleanEmail, cleanOtp);
      if (res.token) {
        localStorage.setItem('anr_token', res.token);
      }
      if (res.customer) {
        loginUser(res.customer);
      }
      setSuccessMessage('Verification successful! Signing you in...');
      setTimeout(() => {
        navigate(redirectTarget);
      }, 500);
    } catch (err) {
      setErrorMessage(err?.message || 'Incorrect or expired verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetEmail = () => {
    setIsOtpSent(false);
    setOtp('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-slate-800 font-sans antialiased selection:bg-[#1A175A] selection:text-white">
      {/* 1. Standard Top Announcement Bar */}
      <TopAnnouncementBar />

      {/* 2. Main Site Navigation */}
      <Navbar />

      {/* 3. Main Login Content — Minimal, Uncongested, Focused */}
      <main className="flex-1 flex items-center justify-center py-16 sm:py-24 px-4 sm:px-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 sm:p-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-[#1A175A] tracking-tight">
              {isOtpSent ? 'Enter Verification Code' : 'Sign In'}
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              {isOtpSent ? (
                <>
                  Code sent to <span className="font-semibold text-slate-700">{email}</span>
                </>
              ) : (
                'Enter your email to receive a login verification code.'
              )}
            </p>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && !errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Step 1: Email Form */}
          {!isOtpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label
                  htmlFor="email-input"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email-input"
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@hospital.com"
                  className="w-full px-4 py-3 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A175A] focus:border-transparent transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-[#1A175A] hover:bg-[#141247] text-white font-bold text-sm rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-200" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Login OTP</span>
                    <ArrowRight className="w-4 h-4 text-blue-200" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Step 2: OTP Form */
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label
                  htmlFor="otp-input"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center"
                >
                  Verification Code
                </label>
                <input
                  id="otp-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full px-4 py-3 text-center text-2xl font-bold tracking-[0.3em] text-[#1A175A] bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A175A] focus:border-transparent transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="w-full py-3.5 px-4 bg-[#1A175A] hover:bg-[#141247] text-white font-bold text-sm rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-200" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify &amp; Sign In</span>
                    <CheckCircle2 className="w-4 h-4 text-blue-200" />
                  </>
                )}
              </button>

              {/* Sub-actions */}
              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={handleResetEmail}
                  className="text-slate-500 hover:text-[#1A175A] transition font-medium cursor-pointer"
                >
                  Change Email
                </button>

                <button
                  type="button"
                  onClick={() => handleSendOtp()}
                  disabled={loading || resendCooldown > 0}
                  className="text-[#1A175A] hover:text-blue-700 font-bold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                </button>
              </div>
            </form>
          )}

        </div>
      </main>

      {/* 4. Standard Site Footer */}
      <Footer />

      {/* 5. Cart Drawer (available site-wide) */}
      <LazyCartDrawer />
    </div>
  );
};

export default LoginPage;
