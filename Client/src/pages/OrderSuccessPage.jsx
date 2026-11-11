import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import { fetchCustomerOrderById } from '../services/api';
import { formatColorLabel } from '../context/CartContext';
import useStorefrontSetting from '../hooks/useStorefrontSetting';
import {
  CheckCircle2,
  Package,
  Printer,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const normalizeDisplayOrder = (raw, fallbackId) => {
  if (!raw) return null;
  const items = Array.isArray(raw.items)
    ? raw.items.map((it) => {
        const sv = it.selectedVariant && typeof it.selectedVariant === 'object' ? it.selectedVariant : {};
        return {
          name: it.name || it.productName || 'Medical Apparel',
          quantity: Number(it.quantity) || 1,
          price: Number(it.price ?? it.unitPrice ?? 0),
          size: it.size || sv.Size || sv.size || '',
          color: formatColorLabel(it.color || sv.Color || sv.color || '', ''),
          embroidery: it.embroidery || null,
        };
      })
    : [];

  return {
    orderId: raw.orderNumber || raw.orderId || raw.id || fallbackId,
    customerName: raw.customerName || raw.shippingAddress?.name || raw.customer?.name || '',
    customerPhone: raw.customerPhone || raw.shippingAddress?.phone || raw.customer?.phone || '',
    totalAmount: Number(raw.totalAmount ?? 0),
    paymentMethod: raw.paymentMethod || '',
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

  useEffect(() => {
    if (initialOrder || !orderId) return;
    let isMounted = true;
    fetchCustomerOrderById(orderId)
      .then((fetched) => {
        if (!isMounted) return;
        if (fetched) {
          setOrder(normalizeDisplayOrder(fetched, orderId));
        } else {
          setError('We could not find an order matching that reference ID.');
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || 'Unable to verify order details right now.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [initialOrder, orderId]);

  const handlePrint = () => {
    window.print();
  };

  const supportPhone = Array.isArray(storefront?.phones) ? storefront.phones[0] : '';

  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Order Confirmed' }]} />

      <section className="py-14 sm:py-20 bg-slate-50 min-h-[80vh] font-sans">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {loading ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 space-y-6">
              <div className="w-20 h-20 rounded-full skeleton-bone mx-auto" />
              <div className="h-7 w-2/3 skeleton-bone rounded mx-auto" />
              <div className="h-4 w-1/2 skeleton-bone-soft rounded mx-auto" />
              <div className="h-40 rounded-2xl skeleton-bone-soft" />
            </div>
          ) : !order ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
              <h1 className="text-2xl font-black text-slate-900">Order Details Unavailable</h1>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {error || 'We could not load this order summary. Check your recent orders in My Account.'}
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Link
                  to="/account"
                  className="px-5 py-2.5 rounded-xl bg-[#1A175A] text-white text-xs font-bold"
                >
                  View My Orders
                </Link>
                <Link
                  to="/"
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/90 shadow-xl shadow-[#1A175A]/5 text-center space-y-6">

              <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Order Confirmed
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
                  Thank You for Ordering with ANR
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Your medical apparel order has been registered at our manufacturing unit. We will send updates to your registered contact.
                </p>
              </div>

              {/* Order Details Card */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-slate-200">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Order Reference ID
                    </div>
                    <div className="text-lg font-black text-[#1A175A] font-mono mt-0.5">
                      #{order.orderId}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Total Amount
                    </div>
                    <div className="text-lg font-black text-slate-900 mt-0.5">
                      ₹{Number(order.totalAmount || 0).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                  <div>
                    <div className="font-bold text-slate-800">Healthcare Customer</div>
                    <div>{order.customerName || 'Verified Customer'}</div>
                    {order.customerPhone && <div className="text-slate-500">{order.customerPhone}</div>}
                  </div>

                  <div>
                    <div className="font-bold text-slate-800">Payment Option</div>
                    <div>
                      {String(order.paymentMethod || '').toUpperCase().includes('COD')
                        ? 'Cash on Delivery (Pay on Arrival)'
                        : 'Online Paid (Razorpay Secure Gateway)'}
                    </div>
                  </div>
                </div>

                {/* Items Preview */}
                {order.items && order.items.length > 0 && (
                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Ordered Apparel Items
                    </div>
                    <div className="space-y-1.5">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-slate-800">
                            {it.quantity}x {it.name}
                            {(it.size || it.color) ? ` (${[it.size, it.color].filter(Boolean).join(', ')})` : ''}
                            {it.embroidery && (
                              <span className="text-blue-700 font-semibold ml-1.5">
                                [+Embroidery: {it.embroidery.doctorName || 'Custom'}]
                              </span>
                            )}
                          </span>
                          <span className="font-bold text-slate-900">
                            ₹{(it.price * it.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Production & Dispatch Note */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-left text-xs text-[#1A175A] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">Factory Dispatch Timeline</div>
                  <div className="text-slate-600 leading-relaxed">
                    Plain medical garments dispatch within <strong>24 to 48 hours</strong>. Customized embroidery garments require <strong>3 to 5 business days</strong> for digitization and sterilization before dispatch.
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-white border border-slate-300 hover:border-[#1A175A] text-[#1A175A] font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Official Receipt</span>
                </button>

                <Link
                  to="/account"
                  className="flex-1 py-3.5 px-4 rounded-xl bg-[#1A175A] hover:bg-[#141247] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <Package className="w-4 h-4 text-blue-200" />
                  <span>Track Order in Account</span>
                </Link>
              </div>

              {supportPhone && (
                <div className="text-xs text-slate-500 pt-2">
                  Need assistance? Call dispatch desk at{' '}
                  <a href={`tel:${supportPhone}`} className="font-bold text-[#1A175A] hover:underline">
                    {supportPhone}
                  </a>
                </div>
              )}

            </div>
          )}

        </div>
      </section>
    </Layout>
  );
};

export default OrderSuccessPage;