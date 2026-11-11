import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import { OrderCardSkeleton } from '../components/SkeletonLoaders';
import { useCart, formatColorLabel } from '../context/CartContext';
import { fetchCustomerOrders, requestOrderCancellation } from '../services/api';
import {
  User,
  Package,
  AlertCircle,
  Sparkles,
  LogOut,
  MapPin,
  RefreshCw,
  X
} from 'lucide-react';

const TRACKING_STAGES = [
  { id: 'PLACED', label: 'Order Placed' },
  { id: 'CONFIRMED', label: 'Payment Confirmed' },
  { id: 'PROCESSING', label: 'In Production & Embroidery' },
  { id: 'PACKED', label: 'Quality Inspected' },
  { id: 'SHIPPED', label: 'Dispatched from Bangalore' },
  { id: 'DELIVERED', label: 'Delivered at Clinic' },
];

const AccountPage = () => {
  const navigate = useNavigate();
  const { currentUser, logoutUser } = useCart();

  const user = useMemo(() => {
    if (currentUser) return currentUser;
    try {
      return JSON.parse(localStorage.getItem('anr_user') || 'null');
    } catch {
      return null;
    }
  }, [currentUser]);

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'addresses'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  // Cancellation modal state
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('Ordered wrong size or colour');
  const [cancelSubmitting, setCancelSubmitting] = useState(false);
  const [cancelFeedback, setCancelFeedback] = useState({ success: '', error: '' });

  const loadOrders = useCallback(async () => {
    setLoadingOrders(true);
    setOrdersError('');
    try {
      const res = await fetchCustomerOrders();
      setOrders(Array.isArray(res) ? res : []);
    } catch (err) {
      setOrdersError(err?.message || 'Unable to load your orders right now.');
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/account');
      return;
    }
    loadOrders();
  }, [user, navigate, loadOrders]);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const getStageIndex = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
      case 'PLACED': return 0;
      case 'CONFIRMED': return 1;
      case 'PROCESSING': return 2;
      case 'PACKED': return 3;
      case 'SHIPPED': return 4;
      case 'DELIVERED': return 5;
      case 'CANCELLED': return -1;
      default: return 2;
    }
  };

  const isEligibleForCancellation = (order) => {
    const s = (order.status || '').toUpperCase();
    // Pre-shipment only per proposal
    return s !== 'SHIPPED' && s !== 'DELIVERED' && s !== 'CANCELLED' && s !== 'CANCELLATION_REQUESTED';
  };

  const handleConfirmCancel = async () => {
    if (!cancelModalOrder) return;
    setCancelSubmitting(true);
    setCancelFeedback({ success: '', error: '' });

    try {
      const res = await requestOrderCancellation(cancelModalOrder.id, cancelReason);
      const orderRef = cancelModalOrder.orderNumber || cancelModalOrder.id;
      setCancelFeedback({
        success: res?.message || `Order #${orderRef} cancelled prior to dispatch.`,
        error: ''
      });
      setOrders(prev => prev.map(o => o.id === cancelModalOrder.id ? { ...o, status: 'CANCELLED' } : o));
      setTimeout(() => {
        setCancelModalOrder(null);
        setCancelFeedback({ success: '', error: '' });
      }, 2200);
    } catch (err) {
      setCancelFeedback({
        success: '',
        error: err?.message || 'Unable to cancel this order right now. Please contact support or try again.'
      });
    } finally {
      setCancelSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Doctor Portal & Orders' }]} />

      <section className="py-10 sm:py-16 bg-slate-50 min-h-screen font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Profile Bar */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1A175A] text-white font-black text-xl flex items-center justify-center shadow-md">
                {user.name?.[0]?.toUpperCase() || 'D'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user.name}</h1>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Verified Healthcare Professional
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                  <span>{user.contact}</span>
                  <span>•</span>
                  <span>Bangalore Hospital Priority Account</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6 border-b border-slate-200 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeTab === 'orders'
                  ? 'border-[#1A175A] text-[#1A175A]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>My Orders & Shipments ({orders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('addresses')}
              className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeTab === 'addresses'
                  ? 'border-[#1A175A] text-[#1A175A]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Hospital Delivery Addresses</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeTab === 'profile'
                  ? 'border-[#1A175A] text-[#1A175A]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile & Tax Credentials</span>
            </button>
          </div>

          {/* TAB 1: ORDERS & TRACKING */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {loadingOrders ? (
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <OrderCardSkeleton key={i} />
                  ))}
                </div>
              ) : ordersError ? (
                <div className="bg-white rounded-3xl p-8 text-center max-w-md mx-auto border border-red-200">
                  <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-900">Unable to load orders</h3>
                  <p className="text-xs text-slate-600 mt-1">{ordersError}</p>
                  <button
                    type="button"
                    onClick={loadOrders}
                    className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1A175A] text-white text-xs font-bold hover:bg-blue-900"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retry Orders
                  </button>
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-slate-200">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800">No Orders Placed Yet</h3>
                  <p className="text-xs text-slate-500 mt-1">Order your first clinical scrub suit or consultation coat.</p>
                  <Link to="/" className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-[#1A175A] text-white text-xs font-bold">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                orders.map((ord) => {
                  const stageIdx = getStageIndex(ord.status);
                  const isCancelled = ord.status === 'CANCELLED';
                  const canCancel = isEligibleForCancellation(ord);

                  return (
                    <div
                      key={ord.id}
                      className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6"
                    >
                      {/* Top Order Summary */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-[#1A175A]">
                              #{ord.orderNumber || ord.id}
                            </span>
                            <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                              isCancelled
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                              {ord.status || 'CONFIRMED'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Total Paid</div>
                            <div className="text-base font-black text-slate-900">
                              ₹{Number(ord.totalAmount || 0).toLocaleString()}
                            </div>
                          </div>

                          {/* Cancellation Trigger (Pre-shipment only per proposal!) */}
                          {canCancel && (
                            <button
                              type="button"
                              onClick={() => setCancelModalOrder(ord)}
                              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors"
                            >
                              Request Cancellation
                            </button>
                          )}
                        </div>
                      </div>

                      {/* 6-Stage Tracking Stepper */}
                      {!isCancelled ? (
                        <div className="pt-2">
                          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                            Bangalore Factory Shipment Tracking
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                            {TRACKING_STAGES.map((stg, i) => {
                              const done = stageIdx >= i;
                              const current = stageIdx === i;
                              return (
                                <div key={stg.id} className="space-y-2 text-center">
                                  <div className={`h-2 rounded-full transition-all ${
                                    done
                                      ? 'bg-emerald-500'
                                      : 'bg-slate-200'
                                  }`} />
                                  <div className={`text-[10px] font-bold ${
                                    current
                                      ? 'text-[#1A175A]'
                                      : done
                                        ? 'text-emerald-700'
                                        : 'text-slate-400'
                                  }`}>
                                    {stg.label}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2.5">
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>This order was cancelled prior to dispatch. Eligible refund is being routed through Razorpay to your original account.</span>
                        </div>
                      )}

                      {/* Itemized Garments List */}
                      <div className="space-y-3 pt-4 border-t border-slate-100">
                        {ord.items?.map((it, idx) => {
                          const itemName = it.name || it.productName || 'Medical Uniform';
                          const unitPrice = Number(it.unitPrice ?? it.price ?? 0);
                          const lineTotal = Number(it.totalPrice ?? unitPrice * (it.quantity || 1));
                          const variantMeta = it.selectedVariant && typeof it.selectedVariant === 'object'
                            ? Object.entries(it.selectedVariant).map(([k, v]) => `${k}: ${typeof v === 'object' && v !== null ? formatColorLabel(v, '') : v}`).join(' • ')
                            : [it.color && `Colour: ${formatColorLabel(it.color, '')}`, it.size && `Size: ${it.size}`].filter(Boolean).join(' • ');

                          return (
                            <div key={idx} className="flex justify-between items-start text-xs text-slate-700">
                              <div>
                                <div className="font-bold text-slate-900">{it.quantity}x {itemName}</div>
                                {variantMeta && (
                                  <div className="text-[11px] text-slate-500">
                                    {variantMeta}
                                  </div>
                                )}
                                {it.embroidery && (
                                  <div className="text-[10px] text-[#1A175A] bg-blue-50 rounded px-2 py-0.5 mt-1 inline-flex items-center gap-1 font-semibold">
                                    <Sparkles className="w-2.5 h-2.5 text-blue-700" />
                                    <span>Custom Tajima Embroidery: {it.embroidery.doctorName || 'Name Included'}</span>
                                  </div>
                                )}
                              </div>
                              <div className="font-bold text-[#1A175A]">
                                ₹{lineTotal.toLocaleString()}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Saved Healthcare Addresses</h3>
              {(() => {
                const savedAddresses = orders
                  .map((o) => o.shippingAddress)
                  .filter((addr) => addr && (addr.addressLine || addr.addressLine1 || addr.city));
                if (savedAddresses.length === 0) {
                  return (
                    <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-xs text-slate-500 text-center">
                      No delivery addresses saved yet. Your shipping details from placed orders will appear here.
                    </div>
                  );
                }
                return savedAddresses.slice(0, 5).map((addr, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                    <div className="font-bold text-[#1A175A]">
                      {addr.hospitalName || addr.name || `Delivery Address ${idx + 1}`}
                    </div>
                    {(addr.addressLine || addr.addressLine1) && (
                      <div>{addr.addressLine || addr.addressLine1}</div>
                    )}
                    <div>
                      {[addr.city, addr.state].filter(Boolean).join(', ')}
                      {(addr.pincode || addr.postalCode) ? ` - ${addr.pincode || addr.postalCode}` : ''}
                    </div>
                    {addr.phone && <div className="text-slate-500 pt-1">Phone: {addr.phone}</div>}
                  </div>
                ));
              })()}
            </div>
          )}

          {/* TAB 3: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4 max-w-xl">
              <h3 className="text-base font-bold text-slate-900">Healthcare Professional Details</h3>
              <div className="space-y-3 text-xs text-slate-700">
                <div>
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">Name</span>
                  <span className="font-bold text-slate-900 text-sm">{user.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">Contact</span>
                  <span className="font-mono">{user.contact}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">Designation</span>
                  <span>{user.type || 'Healthcare Partner'}</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Pre-Shipment Order Cancellation Modal (Proposal Page 10) */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Request Pre-Shipment Cancellation
                </h3>
                <p className="text-xs text-slate-500">Order #{cancelModalOrder.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {cancelFeedback.success && (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold">
                {cancelFeedback.success}
              </div>
            )}

            {cancelFeedback.error && (
              <div className="p-4 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold">
                {cancelFeedback.error}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Reason for Cancellation
                </label>
                <select
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="Ordered wrong size or colour">Ordered wrong size or colour</option>
                  <option value="Typo in custom doctor embroidery name">Typo in custom doctor embroidery name</option>
                  <option value="Delayed clinical procurement schedule">Delayed clinical procurement schedule</option>
                  <option value="Duplicate order placed">Duplicate order placed</option>
                  <option value="Other healthcare requirement change">Other healthcare requirement change</option>
                </select>
              </div>

              {/* Refund breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Order Total:</span>
                  <span className="font-bold text-slate-900">₹{cancelModalOrder.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Cancellation Deduction:</span>
                  <span className="font-bold text-emerald-600">₹0 (Full Refund Prior to Dispatch)</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#1A175A] pt-1.5 border-t border-slate-200">
                  <span>Eligible Refund Amount:</span>
                  <span>₹{cancelModalOrder.totalAmount?.toLocaleString()}</span>
                </div>
              </div>

              {/* Hospital Hygiene Policy Notice */}
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-[#1A175A] leading-relaxed">
                ⚠️ <strong>Hospital Hygiene Notice:</strong> In accordance with biomedical apparel regulations, orders cannot be returned or cancelled once dispatched from our Bangalore facility. Cancellations are only honored while the order is in production before courier handover.
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Keep Order
              </button>

              <button
                type="button"
                disabled={cancelSubmitting}
                onClick={handleConfirmCancel}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md disabled:opacity-60"
              >
                {cancelSubmitting ? 'Cancelling…' : 'Confirm Cancellation'}
              </button>
            </div>

          </div>
        </div>
      )}

    </Layout>
  );
};

export default AccountPage;