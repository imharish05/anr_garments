import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import { useCart, formatColorLabel } from '../context/CartContext';
import { fetchSetting, validateCouponApi, createCheckoutOrder, initiatePaymentApi, verifyPaymentApi } from '../services/api';

const loadRazorpayScript = () => new Promise((resolve) => {
  if (typeof window !== 'undefined' && window.Razorpay) {
    resolve(true);
    return;
  }
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});
import {
  CreditCard,
  Building2,
  AlertCircle,
  Truck,
  ShoppingBag,
  Sparkles,
  Lock,
  Check
} from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, totalItems, clearCart, currentUser } = useCart();

  // Redirect if not logged in (Requirement #2)
  useEffect(() => {
    const loggedIn = currentUser || localStorage.getItem('anr_user');
    if (!loggedIn) {
      navigate('/login?redirect=/checkout');
    }
  }, [currentUser, navigate]);

  // Payment settings from Admin
  const [paymentSettings, setPaymentSettings] = useState({
    enableCod: true,
    enableOnline: true,
    razorpayKeyId: '',
    codMinimumOrder: 0,
    codMaximumOrder: 50000
  });

  // Form states
  const userObj = currentUser || (() => {
    try {
      return JSON.parse(localStorage.getItem('anr_user') || '{}');
    } catch {
      return {};
    }
  })();

  const [customerName, setCustomerName] = useState(userObj.name || '');
  const [customerPhone, setCustomerPhone] = useState(userObj.contact?.match(/^\d+$/) ? userObj.contact : '');
  const [customerEmail, setCustomerEmail] = useState(userObj.contact?.includes('@') ? userObj.contact : '');
  const [hospitalName, setHospitalName] = useState(userObj.hospital || '');

  // Address
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // GST Invoice
  const [needGstInvoice, setNeedGstInvoice] = useState(false);
  const [gstin, setGstin] = useState('');
  const [legalEntityName, setLegalEntityName] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState('ONLINE'); // 'ONLINE' | 'COD'

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Policy checkbox
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Load payment settings
  useEffect(() => {
    fetchSetting('payment')
      .then((data) => {
        if (data) {
          setPaymentSettings(data);
          if (!data.enableCod) {
            setPaymentMethod('ONLINE');
          }
        }
      })
      .catch(() => null)
      .finally(() => {
        setLoadingSettings(false);
      });
  }, []);

  // Calculate discounts (supports both admin schema type/value and calculated server discountAmount)
  const discountAmount = appliedCoupon ? (
    appliedCoupon.calculatedDiscount !== undefined
      ? Math.min(subtotal, Math.round(Number(appliedCoupon.calculatedDiscount) || 0))
      : (appliedCoupon.type || appliedCoupon.discountType) === 'PERCENT'
        ? Math.min(
            Math.round((subtotal * Number(appliedCoupon.value ?? appliedCoupon.discountValue ?? 0)) / 100),
            Number(appliedCoupon.maxDiscount || Infinity)
          )
        : Math.min(subtotal, Number(appliedCoupon.value ?? appliedCoupon.discountValue ?? 0))
  ) : 0;

  const finalPayable = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;

    try {
      const res = await validateCouponApi(couponCode, subtotal);
      if (res?.valid && res?.coupon) {
        setAppliedCoupon({
          ...res.coupon,
          calculatedDiscount: res.discountAmount,
        });
      } else {
        setAppliedCoupon(null);
        setCouponError(res?.message || 'Invalid or expired coupon voucher code');
      }
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(err?.message || 'Invalid or expired coupon voucher code');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!termsAccepted) {
      setErrorMsg('Please acknowledge and accept the hospital apparel hygiene and cancellation policy.');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !addressLine.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      setErrorMsg('Please complete all required delivery address fields.');
      return;
    }

    setSubmitting(true);

    const shippingAddress = {
      name: customerName.trim(),
      phone: customerPhone.trim(),
      email: customerEmail.trim(),
      hospitalName: hospitalName.trim(),
      addressLine: addressLine.trim(),
      addressLine1: addressLine.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      postalCode: pincode.trim(),
    };

    const billingAddress = needGstInvoice
      ? {
          ...shippingAddress,
          legalEntityName: legalEntityName.trim(),
          gstin: gstin.trim().toUpperCase(),
        }
      : shippingAddress;

    const orderPayload = {
      shippingAddress,
      billingAddress,
      items: cartItems.map((item) => ({
        productId: item.productId || item.id,
        variantId: item.variantId || null,
        name: item.name,
        color: formatColorLabel(item.color),
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        embroidery: item.embroidery || null,
      })),
      paymentMethod,
      couponCode: appliedCoupon?.code || null,
      notes: hospitalName.trim() ? `Facility: ${hospitalName.trim()}` : 'Storefront Direct Order',
    };

    try {
      const res = await createCheckoutOrder(orderPayload);
      const createdOrder = res?.order;
      const createdOrderId = createdOrder?.id;

      if (!createdOrderId) {
        throw new Error('Order could not be confirmed by the server. Please try again.');
      }

      if (paymentMethod === 'COD') {
        clearCart();
        navigate(`/order-success/${createdOrderId}`, {
          state: { order: createdOrder },
        });
        return;
      }

      // Online payment flow via Razorpay
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error('Unable to load Razorpay payment checkout. Please check your connection and retry.');
      }

      const initRes = await initiatePaymentApi(createdOrderId);
      const rzpKey = initRes?.key || paymentSettings?.razorpayKeyId;
      if (!rzpKey || !initRes?.order_id) {
        throw new Error('Online payment gateway is currently unavailable.');
      }

      await new Promise((resolve, reject) => {
        const options = {
          key: rzpKey,
          amount: initRes.amount,
          currency: initRes.currency || 'INR',
          name: initRes.name || 'ANR Hospital Garments',
          description: initRes.description || `Order ${createdOrder.orderNumber || createdOrderId}`,
          order_id: initRes.order_id,
          prefill: {
            name: customerName.trim(),
            email: customerEmail.trim(),
            contact: customerPhone.trim(),
          },
          handler: async (rzpResponse) => {
            try {
              await verifyPaymentApi({
                orderId: createdOrderId,
                razorpayPaymentId: rzpResponse.razorpay_payment_id,
                razorpayOrderId: rzpResponse.razorpay_order_id,
                razorpaySignature: rzpResponse.razorpay_signature,
              });
              clearCart();
              navigate(`/order-success/${createdOrderId}`, {
                state: { order: { ...createdOrder, paymentStatus: 'PAID', status: 'PAID' } },
              });
              resolve();
            } catch (verifyErr) {
              reject(verifyErr);
            }
          },
          modal: {
            ondismiss: () => {
              reject(new Error('Payment window closed before completion. Your cart items are still saved.'));
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (failure) => {
          reject(new Error(failure?.error?.description || 'Payment failed on Razorpay. Please try again.'));
        });
        rzp.open();
      });
    } catch (err) {
      setErrorMsg(err?.message || 'Unable to place your order right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="py-24 text-center max-w-md mx-auto px-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Your Apparel Bag is Empty</h2>
          <p className="text-xs text-slate-500">Add medical scrub suits or consultation coats before proceeding to checkout.</p>
          <Link to="/" className="inline-block px-6 py-3 rounded-xl bg-[#1A175A] text-white text-xs font-bold">
            Shop Scrubs & Coats
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Doctor Checkout' }]} />

      <section className="py-10 sm:py-14 bg-slate-50 min-h-screen font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#1A175A]">
              Secure Healthcare Procurement
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1">
              Doctor & Hospital Checkout
            </h1>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left 7 Cols: Address, GST, Payment Method */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 1. Doctor & Facility Contact */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Building2 className="w-5 h-5 text-[#1A175A]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    1. Healthcare Professional & Hospital
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Doctor / Practitioner Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="Dr. Arjun Mehta"
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Hospital / Clinic / Department
                    </label>
                    <input
                      type="text"
                      value={hospitalName}
                      onChange={e => setHospitalName(e.target.value)}
                      placeholder="e.g. Manipal Hospital, Cardiology"
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Mobile Number (For Courier OTP) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address (For Tax Invoice) *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      placeholder="doctor@hospital.com"
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Truck className="w-5 h-5 text-[#1A175A]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    2. Hospital / Clinic Delivery Address
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Building, Street & Floor / Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine}
                    onChange={e => setAddressLine(e.target.value)}
                    placeholder="e.g. 3rd Floor, Surgery Wing, No. 45 Outer Ring Road"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="Bengaluru"
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={e => setState(e.target.value)}
                      placeholder="Karnataka"
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={e => setPincode(e.target.value)}
                      placeholder="560085"
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                    />
                  </div>
                </div>
              </div>

              {/* 3. GST Commercial Tax Invoice Toggle */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
                <label className="flex items-center gap-2.5 text-xs font-bold text-slate-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needGstInvoice}
                    onChange={e => setNeedGstInvoice(e.target.checked)}
                    className="w-4 h-4 accent-[#1A175A] rounded"
                  />
                  <span>Require Official GST Tax Invoice for Clinic / Hospital Tax Credit (ITC)</span>
                </label>

                {needGstInvoice && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Registered Legal Business / Entity Name
                      </label>
                      <input
                        type="text"
                        value={legalEntityName}
                        onChange={e => setLegalEntityName(e.target.value)}
                        placeholder="e.g. Carewell Health Services Pvt Ltd"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        15-Digit GSTIN Number
                      </label>
                      <input
                        type="text"
                        maxLength={15}
                        value={gstin}
                        onChange={e => setGstin(e.target.value.toUpperCase())}
                        placeholder="29AAAAA0000A1Z5"
                        className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg uppercase"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Payment Options (Dynamic Cash on Delivery per Directive #3) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <CreditCard className="w-5 h-5 text-[#1A175A]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    3. Payment Method
                  </h3>
                </div>

                <div className="space-y-3">
                  {loadingSettings ? (
                    <div className="space-y-3">
                      <div className="h-20 rounded-2xl skeleton-bone" />
                      <div className="h-20 rounded-2xl skeleton-bone" />
                    </div>
                  ) : (
                    <>
                      {/* Online Payment Card (Razorpay Test Mode) */}
                      {paymentSettings.enableOnline && (
                        <label className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                          paymentMethod === 'ONLINE'
                            ? 'border-[#1A175A] bg-[#1A175A]/5 ring-1 ring-[#1A175A]'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value="ONLINE"
                                checked={paymentMethod === 'ONLINE'}
                                onChange={() => setPaymentMethod('ONLINE')}
                                className="w-4 h-4 accent-[#1A175A]"
                              />
                              <div>
                                <div className="text-xs font-bold text-slate-900">
                                  Online Payment (Razorpay: UPI, Cards, Net Banking)
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  Instant checkout via GPay, PhonePe, Cards or Net Banking. Sandbox Key: <span className="font-mono font-bold text-[#1A175A]">{paymentSettings.razorpayKeyId}</span>
                                </div>
                              </div>
                            </div>
                            <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Fastest Dispatch
                            </span>
                          </div>
                        </label>
                      )}

                      {/* Cash on Delivery Card (Dynamic: completely hidden if disabled in admin!) */}
                      {paymentSettings.enableCod && (
                        <label className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                          paymentMethod === 'COD'
                            ? 'border-[#1A175A] bg-[#1A175A]/5 ring-1 ring-[#1A175A]'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value="COD"
                                checked={paymentMethod === 'COD'}
                                onChange={() => setPaymentMethod('COD')}
                                className="w-4 h-4 accent-[#1A175A]"
                              />
                              <div>
                                <div className="text-xs font-bold text-slate-900">
                                  Cash on Delivery (COD)
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  Pay cash or UPI to courier agent upon delivery at hospital / clinic.
                                </div>
                              </div>
                            </div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              Pay on Arrival
                            </span>
                          </div>
                        </label>
                      )}
                    </>
                  )}
                </div>
              </div>

            </div>

            {/* Right 5 Cols: Order Summary, Coupons & Final Button */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-xs text-slate-400 font-semibold">{totalItems} garments</span>
                </h3>

                {/* Items Mini List */}
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex gap-3 text-xs pb-3 border-b border-slate-100 last:border-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                        className="w-14 h-16 object-cover rounded-xl bg-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 truncate">{item.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Qty: {item.quantity} • Color: {typeof item.color === 'object' && item.color !== null ? (item.color.name || item.color.hex) : item.color} • Size: {item.size}
                        </div>
                        {item.embroidery && (
                          <div className="text-[10px] text-[#1A175A] bg-blue-50 rounded px-1.5 py-0.5 mt-1 inline-flex items-center gap-1 font-semibold">
                            <Sparkles className="w-2.5 h-2.5 text-blue-700" />
                            <span>Embroidery: {item.embroidery.doctorName || 'Custom'}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right font-extrabold text-[#1A175A] shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Box */}
                <div className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="ENTER PROMO COUPON"
                      className="flex-1 px-3 py-2 text-xs font-mono uppercase bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 rounded-xl bg-[#1A175A] text-white text-xs font-bold hover:bg-[#141247]"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
                  {appliedCoupon && (
                    <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-₹{discountAmount})</span>
                    </p>
                  )}
                </div>

                {/* Totals Breakdown */}
                <div className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Garments Subtotal</span>
                    <span className="font-bold text-slate-900">₹{subtotal.toLocaleString()}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promotional Discount</span>
                      <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Direct Bangalore Dispatch Freight</span>
                    <span className="font-bold text-emerald-600 uppercase">Free</span>
                  </div>

                  <div className="flex justify-between">
                    <span>GST (Input Tax Credit Eligible)</span>
                    <span className="font-bold text-slate-500">Included</span>
                  </div>

                  <div className="flex justify-between text-base font-black text-[#1A175A] pt-3 border-t border-slate-200">
                    <span>Total Amount Payable</span>
                    <span>₹{finalPayable.toLocaleString()}</span>
                  </div>
                </div>

                {/* Mandatory Hygiene & Cancellation Policy Checkbox */}
                <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 space-y-2">
                  <label className="flex items-start gap-2.5 text-xs text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={termsAccepted}
                      onChange={e => setTermsAccepted(e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-[#1A175A] rounded shrink-0"
                    />
                    <span className="leading-snug">
                      I accept the <strong>Terms & Conditions</strong> and acknowledge that, due to hospital hygiene and clinical sterilization regulations, <strong>orders cannot be returned or exchanged once dispatched</strong>. Cancellations are permitted strictly prior to dispatch.
                    </span>
                  </label>
                </div>

                {/* Place Order CTA */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-2xl bg-[#1A175A] hover:bg-[#141247] text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] disabled:opacity-70"
                >
                  <Lock className="w-4 h-4 text-blue-200" />
                  <span>
                    {submitting
                      ? 'Confirming Order…'
                      : paymentMethod === 'COD'
                        ? `Confirm Cash on Delivery Order • ₹${finalPayable.toLocaleString()}`
                        : `Pay Online (Razorpay) • ₹${finalPayable.toLocaleString()}`}
                  </span>
                </button>

                <div className="text-center text-[11px] text-slate-500">
                  🔒 256-Bit SSL Encrypted Healthcare Checkout
                </div>

              </div>

            </div>

          </form>

        </div>
      </section>
    </Layout>
  );
};

export default CheckoutPage;