import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import { fetchCustomerOrderById, getImageUrl } from '../services/api';
import { formatColorLabel } from '../context/CartContext';
import useStorefrontSetting from '../hooks/useStorefrontSetting';
import {
  CheckCircle2,
  Package,
  Printer,
  ShieldCheck,
  AlertCircle,
  Scissors,
  Download,
  Copy,
  Check,
  MapPin,
  Phone,
  User,
  CreditCard,
  ShoppingBag,
  Clock,
  Sparkles
} from 'lucide-react';

const parseJsonObj = (val) => {
  if (!val) return null;
  let parsed = val;
  for (let i = 0; i < 5; i++) {
    if (typeof parsed === 'string') {
      const trimmed = parsed.trim();
      if (
        (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
        (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
        (trimmed.startsWith('"') && trimmed.endsWith('"'))
      ) {
        try {
          const next = JSON.parse(parsed);
          if (next === parsed) break;
          parsed = next;
        } catch {
          break;
        }
      } else {
        break;
      }
    } else {
      break;
    }
  }
  if (Array.isArray(parsed) && parsed.length > 0) parsed = parsed[0];
  if (typeof parsed === 'object' && parsed !== null) return parsed;
  return null;
};

const getPlaceholderSvg = (name = 'Medical Apparel') => {
  const initial = (name || 'M').charAt(0).toUpperCase();
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="120" viewBox="0 0 100 120" fill="%23f8fafc"><rect width="100" height="120" fill="%23f8fafc"/><path d="M30 20 L50 35 L70 20 L85 35 L75 100 L25 100 L15 35 Z" fill="%23e2e8f0" stroke="%23cbd5e1" stroke-width="2"/><text x="50" y="70" font-family="sans-serif" font-size="22" font-weight="bold" fill="%2364748b" text-anchor="middle">${initial}</text></svg>`;
};

const formatDate = (dateString) => {
  if (!dateString) return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

const normalizeDisplayOrder = (raw, fallbackId) => {
  if (!raw) return null;

  const rawShippingAddr = parseJsonObj(raw.shippingAddress) || raw.shippingAddress;
  const rawBillingAddr = parseJsonObj(raw.billingAddress) || raw.billingAddress;

  const items = Array.isArray(raw.items)
    ? raw.items.map((it) => {
        const sv = parseJsonObj(it.selectedVariant) || {};

        let emb = parseJsonObj(it.embroidery) || parseJsonObj(sv?.customEmbroidery) || parseJsonObj(sv?.embroidery) || null;
        if (emb && typeof emb === 'object') {
          emb = {
            doctorName: emb.doctorName || emb.name || '',
            designation: emb.designation || emb.dept || emb.department || '',
            threadColor: emb.threadColor || emb.color || 'Clinical White',
            placement: emb.placement || 'Right Chest',
            hasLogo: Boolean(emb.hasLogo || emb.logoUrl || emb.logoFileName),
            logoUrl: emb.logoUrl || '',
            logoFileName: emb.logoFileName || '',
            price: Number(emb.price || 0),
          };
        } else {
          emb = null;
        }

        const size = it.size || sv.Size || sv.size || '';
        const color = formatColorLabel(it.color || sv.Color || sv.color || '', '');
        const pocket = it.pocket || sv.Pocket || sv.pocket || '';

        const EXCLUDE_KEYS = new Set(['id', 'sku', 'variantId', 'productId', 'stock', 'price', 'mrp', 'customEmbroidery', 'embroidery', 'Size', 'size', 'Color', 'color', 'Pocket', 'pocket']);
        const extraVariantEntries = sv && typeof sv === 'object'
          ? Object.entries(sv).filter(([k, v]) => !EXCLUDE_KEYS.has(k) && v !== undefined && v !== null && v !== '')
          : [];

        const unitPrice = Number(it.unitPrice ?? it.price ?? 0);
        const qty = Number(it.quantity) || 1;
        const lineTotal = Number(it.totalPrice ?? (unitPrice * qty));

        const image = it.displayImage || it.productImage || it.image || it.variantImage || (it.product && (it.product.defaultProductImage || it.product.images?.[0])) || '';

        return {
          id: it.id || it.productId || Math.random(),
          name: it.productName || it.name || 'Medical Apparel',
          sku: it.sku || it.product?.sku || '',
          image: image ? getImageUrl(image) : '',
          quantity: qty,
          unitPrice,
          totalPrice: lineTotal,
          size,
          color,
          pocket,
          extraVariants: extraVariantEntries,
          embroidery: emb,
        };
      })
    : [];

  const customerName = raw.customerName || (typeof rawShippingAddr === 'object' && (rawShippingAddr?.fullName || rawShippingAddr?.name || `${rawShippingAddr?.firstName || ''} ${rawShippingAddr?.lastName || ''}`.trim())) || raw.customer?.name || '';
  const customerPhone = raw.customerPhone || (typeof rawShippingAddr === 'object' && (rawShippingAddr?.phone || rawShippingAddr?.mobile)) || raw.customer?.phone || '';
  const customerEmail = raw.customerEmail || (typeof rawShippingAddr === 'object' && rawShippingAddr?.email) || raw.customer?.email || '';

  return {
    orderId: raw.orderNumber || raw.orderId || raw.id || fallbackId,
    numericId: raw.id,
    customerName,
    customerPhone,
    customerEmail,
    shippingAddress: rawShippingAddr,
    billingAddress: rawBillingAddr,
    subtotal: Number(raw.subtotal ?? 0),
    discountAmount: Number(raw.discountAmount ?? 0),
    shippingAmount: Number(raw.shippingAmount ?? 0),
    totalAmount: Number(raw.totalAmount ?? 0),
    paymentMethod: raw.paymentMethod || '',
    paymentStatus: raw.paymentStatus || '',
    status: raw.status || 'CONFIRMED',
    createdAt: raw.createdAt || '',
    items,
  };
};

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const { data: storefront } = useStorefrontSetting('storefront');

  const initialOrder = normalizeDisplayOrder(location.state?.order, orderId);
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(!initialOrder && Boolean(orderId));
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    // Always fetch in background to ensure all media relations and order status are fresh
    let isMounted = true;
    fetchCustomerOrderById(orderId)
      .then((fetched) => {
        if (!isMounted) return;
        if (fetched) {
          setOrder(normalizeDisplayOrder(fetched, orderId));
        } else if (!initialOrder) {
          setError('We could not find an order matching that reference ID.');
        }
      })
      .catch((err) => {
        if (isMounted && !initialOrder) {
          setError(err?.message || 'Unable to verify order details right now.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    if (!order?.orderId) return;
    try {
      navigator.clipboard.writeText(String(order.orderId));
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {}
  };

  const supportPhone = Array.isArray(storefront?.phones) ? storefront.phones[0] : (storefront?.phone || '9986044574');
  const isCod = String(order?.paymentMethod || '').toUpperCase().includes('COD');

  // Compute calculated items breakdown
  const itemsSubtotal = (order?.items || []).reduce((sum, it) => sum + (it.unitPrice * it.quantity), 0);
  const embroideryTotal = (order?.items || []).reduce((sum, it) => sum + (Number(it.embroidery?.price || 0) * it.quantity), 0);

  return (
    <Layout>
      <div className="no-print">
        <Breadcrumbs items={[{ label: 'Order Confirmed' }]} />
      </div>

      <section className="py-8 sm:py-14 bg-slate-50/70 min-h-[85vh] font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {loading ? (
            <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/90 shadow-sm space-y-6 max-w-3xl mx-auto">
              <div className="w-20 h-20 rounded-full skeleton-bone mx-auto" />
              <div className="h-7 w-2/3 skeleton-bone rounded mx-auto" />
              <div className="h-4 w-1/2 skeleton-bone-soft rounded mx-auto" />
              <div className="h-52 rounded-2xl skeleton-bone-soft mt-8" />
            </div>
          ) : !order ? (
            <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/90 shadow-sm text-center space-y-4 max-w-xl mx-auto">
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
              <h1 className="text-2xl font-black text-slate-900">Order Details Unavailable</h1>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {error || 'We could not load this order summary. Check your recent orders in My Account.'}
              </p>
              <div className="flex justify-center gap-3 pt-4">
                <Link
                  to="/account"
                  className="px-5 py-2.5 rounded-xl bg-[#1A175A] text-white text-xs font-bold hover:bg-[#141247] transition-colors"
                >
                  View My Orders
                </Link>
                <Link
                  to="/"
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            /* Single Seamless Master Document (No box-inside-box!) */
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-[#1A175A]/5 overflow-hidden">

              {/* 1. Header Banner & Order Confirmation Seal */}
              <div className="p-6 sm:p-10 text-center pb-8 border-b border-slate-100">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/80 mb-4 transition-transform hover:scale-105">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] uppercase font-extrabold tracking-widest text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Order Confirmed
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Thank You for Ordering with ANR
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                    Your medical apparel order has been recorded at our manufacturing facility. We will send dispatch & tracking updates to your registered contact.
                  </p>
                </div>

                {/* Sleek Reference Strip (Inline, unboxed pill) */}
                <div className="inline-flex items-center gap-3 mt-5 px-4 py-2 rounded-full bg-slate-100/80 border border-slate-200 text-xs text-slate-600">
                  <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    Order Ref:
                  </span>
                  <strong className="font-mono font-black text-[#1A175A] text-sm">
                    #{order.orderId}
                  </strong>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="p-1 rounded hover:bg-white text-slate-500 hover:text-[#1A175A] transition-colors relative"
                    title="Copy Order ID"
                    aria-label="Copy Order ID"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 text-[11px]">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
              </div>

              {/* 2. Order Summary Metadata Strip (Clean 4-column borderless grid, NO nested boxes) */}
              <div className="px-6 sm:px-10 py-6 bg-slate-50/70 border-b border-slate-200/80">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Healthcare Customer</span>
                    </div>
                    <div className="font-bold text-slate-900 text-sm">
                      {order.customerName || 'Verified Healthcare Professional'}
                    </div>
                    {order.customerPhone && (
                      <div className="text-slate-500 mt-0.5">{order.customerPhone}</div>
                    )}
                    {order.customerEmail && (
                      <div className="text-slate-400 text-[11px] truncate mt-0.5">{order.customerEmail}</div>
                    )}
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>Delivery Location</span>
                    </div>
                    {order.shippingAddress && typeof order.shippingAddress === 'object' ? (
                      <div className="text-slate-700 leading-snug">
                        {order.shippingAddress.hospitalName && (
                          <div className="font-semibold text-slate-900">{order.shippingAddress.hospitalName}</div>
                        )}
                        <div>
                          {[order.shippingAddress.addressLine || order.shippingAddress.addressLine1, order.shippingAddress.city].filter(Boolean).join(', ')}
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          {[order.shippingAddress.state, order.shippingAddress.pincode || order.shippingAddress.postalCode].filter(Boolean).join(' - ')}
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-600">Direct Healthcare Clinic Delivery</div>
                    )}
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      <span>Payment Method</span>
                    </div>
                    <div className="font-semibold text-slate-800">
                      {isCod ? 'Cash on Delivery (COD)' : 'Online Payment (Razorpay)'}
                    </div>
                    <div className="mt-1">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        isCod
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {isCod ? 'Pay on Arrival' : 'Verified Paid'}
                      </span>
                    </div>
                  </div>

                  <div className="lg:text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Total Order Value
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-[#1A175A]">
                      ₹{Number(order.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                      All Taxes & Shipping Included
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Purchased Items & Customization Specifications (Matching Image 3 table format) */}
              <div className="p-6 sm:p-10 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2">
                  <h3 className="font-playfair font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#1A175A]" />
                    <span>Purchased Items ({order.items?.length || 0})</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">
                    Verified Medical Specifications
                  </span>
                </div>

                {/* Open, un-congested table matching Image 3 */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[620px]">
                      <thead>
                        <tr className="bg-slate-50/90 border-b border-slate-200 text-[10px] uppercase tracking-wider font-bold text-slate-500">
                          <th className="py-3 px-4 font-bold">Item & Variant Details</th>
                          <th className="py-3 px-4 text-center font-bold w-20">Qty</th>
                          <th className="py-3 px-4 text-right font-bold w-28">Unit Price</th>
                          <th className="py-3 px-4 text-right font-bold w-32">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {(order.items || []).map((item, idx) => {
                          const emb = item.embroidery;
                          const logoDownloadUrl = emb?.logoUrl ? getImageUrl(emb.logoUrl) : null;

                          return (
                            <tr key={item.id || idx} className="hover:bg-slate-50/40 transition-colors">
                              {/* Item & Variant Column */}
                              <td className="py-4 px-4 align-top">
                                <div className="flex items-start gap-4">
                                  <img
                                    src={item.image || getPlaceholderSvg(item.name)}
                                    alt={item.name}
                                    className="w-14 h-16 sm:w-16 sm:h-20 object-cover rounded-lg border border-slate-200 bg-slate-50 shrink-0 mt-0.5 shadow-2xs"
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = getPlaceholderSvg(item.name);
                                    }}
                                  />

                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                                      {item.name}
                                    </h4>
                                    {item.sku && (
                                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                        SKU: {item.sku}
                                      </p>
                                    )}

                                    {/* Variant Attributes Badges */}
                                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                      {item.size && (
                                        <span className="text-[10.5px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200">
                                          <span className="text-slate-400 mr-1">Size:</span>
                                          <strong className="text-slate-800">{item.size}</strong>
                                        </span>
                                      )}
                                      {item.color && (
                                        <span className="text-[10.5px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200">
                                          <span className="text-slate-400 mr-1">Color:</span>
                                          <strong className="text-slate-800">{item.color}</strong>
                                        </span>
                                      )}
                                      {item.pocket && (
                                        <span className="text-[10.5px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200">
                                          <span className="text-slate-400 mr-1">Pocket:</span>
                                          <strong className="text-slate-800">{item.pocket}</strong>
                                        </span>
                                      )}
                                      {Array.isArray(item.extraVariants) && item.extraVariants.map(([k, v]) => (
                                        <span key={k} className="text-[10.5px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200">
                                          <span className="capitalize text-slate-400 mr-1">{k}:</span>
                                          <strong className="text-slate-800">{v}</strong>
                                        </span>
                                      ))}
                                    </div>

                                    {/* Custom Embroidery Specification (Clean editorial layout matching Image 3, NO boxes) */}
                                    {emb && (emb.doctorName || emb.designation || emb.hasLogo || emb.logoUrl || emb.logoFileName) && (
                                      <div className="mt-3.5 pl-3.5 border-l-2 border-[#1A175A]/40 space-y-2.5 max-w-xl">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <Scissors className="w-3.5 h-3.5 text-[#1A175A]" />
                                          <span className="font-bold text-[#1A175A] text-xs">
                                            Custom Computerized Embroidery
                                          </span>
                                          {emb.price > 0 && (
                                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                              +₹{emb.price} Add-on
                                            </span>
                                          )}
                                        </div>

                                        {/* Clean 2-column key-value grid (NO boxes around items!) */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs pt-0.5">
                                          <div>
                                            <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                              Line 1: Doctor / Staff Name
                                            </span>
                                            <span className="font-semibold text-slate-900 block mt-0.5">
                                              {emb.doctorName || <span className="text-slate-400 font-normal italic">None</span>}
                                            </span>
                                          </div>

                                          <div>
                                            <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                              Line 2: Department / Specialty
                                            </span>
                                            <span className="font-semibold text-slate-900 block mt-0.5">
                                              {emb.designation || <span className="text-slate-400 font-normal italic">None</span>}
                                            </span>
                                          </div>

                                          <div>
                                            <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                              Thread Color
                                            </span>
                                            <span className="font-semibold text-slate-800 block mt-0.5">
                                              {emb.threadColor || 'Clinical White'}
                                            </span>
                                          </div>

                                          <div>
                                            <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                              Placement Location
                                            </span>
                                            <span className="font-semibold text-slate-800 block capitalize mt-0.5">
                                              {emb.placement ? String(emb.placement).replace(/-/g, ' ') : 'Right Chest'}
                                            </span>
                                          </div>
                                        </div>

                                        {/* Hospital Crest Logo Row (Seamless inline row, NO nested card) */}
                                        {emb.hasLogo && (
                                          <div className="flex items-center justify-between gap-3 pt-2 mt-1 border-t border-slate-100 flex-wrap">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                              {emb.logoUrl ? (
                                                <img
                                                  src={getImageUrl(emb.logoUrl)}
                                                  alt="Hospital Crest"
                                                  className="w-8 h-8 object-contain rounded border border-slate-200 bg-white p-0.5 shrink-0"
                                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                />
                                              ) : (
                                                <div className="w-8 h-8 rounded border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                                  <Sparkles className="w-4 h-4 text-slate-500" />
                                                </div>
                                              )}
                                              <div className="min-w-0">
                                                <div className="text-xs font-bold text-slate-900 truncate max-w-[240px]">
                                                  {emb.logoFileName && !/^[0-9a-f-]{25,}/i.test(emb.logoFileName)
                                                    ? emb.logoFileName
                                                    : 'Hospital Crest Attached'}
                                                </div>
                                                <div className="text-[10.5px] text-emerald-700 font-semibold flex items-center gap-1">
                                                  <span>✓</span>
                                                  <span>Verified Crest for Tajima Digitization</span>
                                                </div>
                                              </div>
                                            </div>

                                            {logoDownloadUrl && (
                                              <a
                                                href={logoDownloadUrl}
                                                download={emb.logoFileName || 'hospital-crest-logo'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A175A] hover:bg-[#141247] text-white text-xs font-bold transition-colors shadow-2xs"
                                              >
                                                <Download className="w-3.5 h-3.5" />
                                                <span>Download</span>
                                              </a>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Quantity Column */}
                              <td className="py-4 px-4 align-top text-center font-bold text-slate-800 text-sm">
                                × {item.quantity}
                              </td>

                              {/* Unit Price Column */}
                              <td className="py-4 px-4 align-top text-right text-slate-700 font-medium">
                                ₹{item.unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>

                              {/* Line Total Column */}
                              <td className="py-4 px-4 align-top text-right font-black text-slate-900 text-sm">
                                ₹{item.totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* 4. Production Timeline & Order Financial Summary (Clean 2-sided strip) */}
              <div className="px-6 sm:px-10 py-6 border-t border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                {/* Left: Dispatch Notice */}
                <div className="flex items-start gap-3 max-w-lg text-xs">
                  <ShieldCheck className="w-5 h-5 text-[#1A175A] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900">Factory Dispatch Timeline</div>
                    <div className="text-slate-600 leading-relaxed">
                      Plain medical garments dispatch within <strong>24 to 48 hours</strong>. Customized embroidery garments require <strong>3 to 5 business days</strong> for Tajima digitization, multi-head embroidery, and clinical sterilization before dispatch.
                    </div>
                  </div>
                </div>

                {/* Right: Subtotal Calculation */}
                <div className="w-full md:w-auto md:min-w-[260px] text-xs space-y-1.5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200">
                  <div className="flex justify-between text-slate-600">
                    <span>Garments Subtotal:</span>
                    <span className="font-semibold text-slate-900">
                      ₹{itemsSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {embroideryTotal > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Custom Embroidery:</span>
                      <span className="font-semibold text-slate-900">
                        +₹{embroideryTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Clinical Shipping:</span>
                    <span className="font-bold text-emerald-700">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total Paid / Due:</span>
                    <span className="text-[#1A175A]">
                      ₹{Number(order.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. Action Controls Footer */}
              <div className="p-6 sm:px-10 py-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white no-print">
                <div className="text-xs text-slate-500">
                  {supportPhone && (
                    <span>
                      Need assistance? Call dispatch desk at{' '}
                      <a href={`tel:${supportPhone}`} className="font-bold text-[#1A175A] hover:underline">
                        {supportPhone}
                      </a>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex-1 sm:flex-initial py-3 px-5 rounded-xl bg-white border border-slate-300 hover:border-[#1A175A] text-[#1A175A] font-bold text-xs shadow-2xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Official Receipt</span>
                  </button>

                  <Link
                    to="/account"
                    className="flex-1 sm:flex-initial py-3 px-5 rounded-xl bg-[#1A175A] hover:bg-[#141247] text-white font-bold text-xs shadow-md shadow-[#1A175A]/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    <Package className="w-4 h-4 text-blue-200" />
                    <span>Track Order in Account</span>
                  </Link>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>
    </Layout>
  );
};

export default OrderSuccessPage;
