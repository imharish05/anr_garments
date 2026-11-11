import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Building2,
  Truck,
  Check,
  ChevronLeft
} from 'lucide-react';

/**
 * R4 Safety: Guards against React 19 "Objects are not valid as a React child"
 * if color is an object with {name, hex, image} or an un-sanitized legacy item.
 */
const formatColor = (color) => {
  if (!color) return 'Standard Navy';
  if (typeof color === 'object' && color !== null) {
    return color.name || color.hex || 'Standard Navy';
  }
  return String(color);
};

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    currentUser
  } = useCart();

  // Redirect unauthenticated doctors to login before checkout
  const handleProceedCheckout = () => {
    const loggedIn = currentUser || localStorage.getItem('anr_user');
    if (loggedIn) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=/checkout');
    }
  };

  return (
    <Layout>
      {/* 1. Breadcrumbs Navigation */}
      <Breadcrumbs items={[{ label: 'Shopping Bag' }]} />

      <section className="py-8 sm:py-12 bg-slate-50 min-h-[75vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* 2. Empty State View */}
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 sm:p-16 text-center max-w-lg mx-auto border border-slate-200/80 shadow-sm space-y-6">
              <div className="w-20 h-20 rounded-full bg-slate-100 text-[#1A175A] flex items-center justify-center mx-auto shadow-inner">
                <ShoppingBag className="w-10 h-10 text-slate-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Your Shopping Bag is Empty
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Looks like you haven't added any tailored medical scrubs, lab coats, or doctor aprons to your bag yet.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#1A175A] hover:bg-[#141247] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <span>Browse Medical Scrubs & Coats</span>
                  <ArrowRight className="w-4 h-4 text-blue-200" />
                </Link>
              </div>
              <div className="pt-6 border-t border-slate-100 flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" /> Free Dispatch Across India
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1A175A]" /> Autoclave Safe Quality
                </span>
              </div>
            </div>
          ) : (
            /* 3. Populated State View (Responsive 2-Column Layout) */
            <div>
              {/* Page Title & Quick Actions Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-widest text-[#1A175A]">
                    Healthcare Order Summary
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1">
                    Your Shopping Bag ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                  </h1>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 transition-colors p-1"
                    title="Remove all items from bag"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Bag</span>
                  </button>
                  <Link
                    to="/products"
                    className="text-xs font-bold text-[#1A175A] hover:underline flex items-center gap-1.5"
                  >
                    <span>Continue Shopping</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* 2-Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column (8 cols): Cart Items List */}
                <div className="lg:col-span-8 space-y-4">
                  {cartItems.map((item, index) => (
                    <div
                      key={`${item.id}-${typeof item.color === 'object' ? item.color?.name : item.color}-${item.size}-${index}`}
                      className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 sm:gap-5"
                    >
                      {/* Product Thumbnail */}
                      <Link
                        to={`/product/${item.slug || item.id}`}
                        className="w-full sm:w-28 h-32 sm:h-32 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 group block"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* Product Details & Controls */}
                      <div className="flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <Link
                                to={`/product/${item.slug || item.id}`}
                                className="text-sm sm:text-base font-bold text-slate-900 hover:text-[#1A175A] transition-colors line-clamp-1"
                              >
                                {item.name}
                              </Link>
                              <div className="text-xs text-slate-500 font-medium mt-0.5">
                                ₹{Number(item.price || 0).toLocaleString()} per unit
                              </div>
                            </div>

                            {/* Remove Item Button */}
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id, item.color, item.size, item.embroidery)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Remove item from bag"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Attribute Badges: Safe Color & Size */}
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                              Color: <strong className="ml-1 text-slate-900">{formatColor(item.color)}</strong>
                            </span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                              Size: <strong className="ml-1 text-slate-900">{item.size}</strong>
                            </span>
                          </div>

                          {/* Custom Embroidery Breakdown */}
                          {item.embroidery && (
                            <div className="mt-3 p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-[#1A175A] space-y-1">
                              <div className="flex items-center justify-between font-bold">
                                <div className="flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                                  <span>Custom Hospital Embroidery</span>
                                </div>
                                <span className="text-[11px] font-extrabold text-blue-800">
                                  +₹{item.embroidery.price || 150}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-1 text-[11px] text-slate-700">
                                {item.embroidery.doctorName && (
                                  <div>Name: <strong>{item.embroidery.doctorName}</strong></div>
                                )}
                                {item.embroidery.designation && (
                                  <div>Dept: <strong>{item.embroidery.designation}</strong></div>
                                )}
                                {item.embroidery.hasLogo && (
                                  <div className="text-emerald-700 font-bold flex items-center gap-1 sm:col-span-2">
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span>Hospital Crest Logo Included</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Bottom Row: Quantity Stepper & Line Subtotal */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          {/* Quantity Stepper */}
                          <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.color, item.size, -1, item.embroidery)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-10 text-center text-xs font-bold text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.color, item.size, 1, item.embroidery)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Line Subtotal */}
                          <div className="text-right">
                            <span className="text-xs text-slate-400 block font-medium">Subtotal</span>
                            <span className="text-base sm:text-lg font-black text-[#1A175A]">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Left Column Bottom Helper Links */}
                  <div className="flex items-center justify-between pt-2">
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A175A] hover:underline"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Add More Garments</span>
                    </Link>
                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      Empty Entire Bag
                    </button>
                  </div>
                </div>

                {/* Right Column (4 cols): Order Summary Card */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24 space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <h3 className="text-base font-black text-slate-900">
                        Order Summary
                      </h3>
                      <span className="text-xs font-semibold text-slate-400">
                        {totalItems} garments
                      </span>
                    </div>

                    {/* Breakdown Lines */}
                    <div className="space-y-3 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Garments Subtotal</span>
                        <span className="font-bold text-slate-900">₹{subtotal.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Direct Bangalore Dispatch</span>
                        <span className="font-bold text-emerald-600 uppercase tracking-wide">Free</span>
                      </div>

                      <div className="flex justify-between">
                        <span>GST (Input Tax Credit Eligible)</span>
                        <span className="font-semibold text-slate-500">Included</span>
                      </div>

                      <div className="flex justify-between items-baseline pt-4 border-t border-slate-200">
                        <span className="text-sm font-bold text-slate-800">Total Payable</span>
                        <span className="text-2xl font-black text-[#1A175A]">
                          ₹{subtotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Institutional B2B Tax Notice */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Building2 className="w-3.5 h-3.5 text-[#1A175A]" />
                        <span>Institutional Tax Invoice</span>
                      </div>
                      <p className="leading-relaxed">
                        Official B2B GST tax invoice with your hospital/clinic GSTIN will be generated at checkout for Input Tax Credit (ITC).
                      </p>
                    </div>

                    {/* Primary CTA: Doctor Checkout */}
                    <button
                      type="button"
                      onClick={handleProceedCheckout}
                      className="w-full py-4 px-6 rounded-xl bg-[#1A175A] hover:bg-[#141247] text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
                    >
                      <span>Proceed to Doctor Checkout</span>
                      <ArrowRight className="w-4 h-4 text-blue-200" />
                    </button>

                    {/* Secondary CTA: Continue Browsing */}
                    <Link
                      to="/products"
                      className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors text-center"
                    >
                      <span>Continue Browsing Catalog</span>
                    </Link>

                    {/* Hospital Trust Assurances */}
                    <div className="pt-4 border-t border-slate-100 space-y-2.5 text-[11px] text-slate-500">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Direct Bangalore express hospital dispatch</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#1A175A] flex-shrink-0" />
                        <span>Autoclave & clinical sterilization tested textiles</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>100% verified medical apparel standards</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </section>
    </Layout>
  );
};

export default CartPage;
