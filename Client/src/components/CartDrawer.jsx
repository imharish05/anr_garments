import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCart, formatColorLabel } from '../context/CartContext';
import { getImageUrl } from '../services/api';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Scissors, Pencil, Check } from 'lucide-react';

/* ---------- Embroidery ---------- */
const THREAD_OPTIONS = ['Clinical White', 'Navy Blue', 'Black', 'Royal Blue', 'Maroon', 'Gold', 'Silver'];
const PLACEMENT_OPTIONS = ['right-chest', 'left-chest', 'pocket', 'sleeve'];
const MAX_LINE = 20;

const formatPlacement = (p) => {
  if (!p) return '';
  return String(p).replace(/[-_]/g, ' ').trim().replace(/\b\w/g, (c) => c.toUpperCase());
};

const withCurrent = (options, current) =>
  current && !options.includes(current) ? [current, ...options] : options;

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-[12px] text-slate-900 focus:outline-none focus:border-[#1A175A] focus:ring-1 focus:ring-[#1A175A]';

const EmbroideryDetails = ({ embroidery, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(embroidery);
  const price = Number(embroidery.price || 0);

  const startEdit = () => { setDraft(embroidery); setEditing(true); };
  const set = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));
  const save = () => { onSave?.(draft); setEditing(false); };

  const rows = [
    ['Line 1', embroidery.doctorName],
    ['Line 2', embroidery.designation],
    ['Thread', embroidery.threadColor],
    ['Placement', formatPlacement(embroidery.placement)],
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-2.5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#1A175A]">
          <Scissors className="w-3.5 h-3.5" />
          <span>Custom Embroidery</span>
          {price > 0 && (
            <span className="text-[11px] font-semibold text-slate-500">+₹{price.toLocaleString()}</span>
          )}
        </div>
        {!editing && onSave && (
          <button
            type="button"
            onClick={startEdit}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold text-[#1A175A] hover:bg-[#1A175A]/10"
          >
            <Pencil className="w-3 h-3" />
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <label className="block text-[11px] text-slate-500">
              <span className="flex justify-between mb-1">
                <span>Line 1</span>
                <span>{(draft.doctorName || '').length}/{MAX_LINE}</span>
              </span>
              <input
                className={inputCls}
                value={draft.doctorName || ''}
                maxLength={MAX_LINE}
                onChange={set('doctorName')}
              />
            </label>
            <label className="block text-[11px] text-slate-500">
              <span className="flex justify-between mb-1">
                <span>Line 2</span>
                <span>{(draft.designation || '').length}/{MAX_LINE}</span>
              </span>
              <input
                className={inputCls}
                value={draft.designation || ''}
                maxLength={MAX_LINE}
                onChange={set('designation')}
              />
            </label>
            <label className="block text-[11px] text-slate-500">
              <span className="block mb-1">Thread</span>
              <select className={inputCls} value={draft.threadColor || ''} onChange={set('threadColor')}>
                {withCurrent(THREAD_OPTIONS, draft.threadColor).map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className="block text-[11px] text-slate-500">
              <span className="block mb-1">Placement</span>
              <select className={inputCls} value={draft.placement || ''} onChange={set('placement')}>
                {withCurrent(PLACEMENT_OPTIONS, draft.placement).map((o) => (
                  <option key={o} value={o}>{formatPlacement(o)}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              className="inline-flex items-center gap-1 rounded-lg bg-[#1A175A] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#141247]"
            >
              <Check className="w-3 h-3" />
              Save
            </button>
          </div>
        </div>
      ) : (
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[12px]">
          {rows.map(([label, value]) => (
            <React.Fragment key={label}>
              <dt className="text-slate-500">{label}</dt>
              <dd className="font-semibold text-slate-900 break-words min-w-0">{value || '—'}</dd>
            </React.Fragment>
          ))}
        </dl>
      )}
    </div>
  );
};

/* ---------- Drawer ---------- */
const CartDrawer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    removeFromCart,
    updateQuantity,
    updateEmbroidery,
    totalItems,
    subtotal,
    currentUser
  } = useCart();

  useEffect(() => {
    setIsCartOpen(false);
  }, [location.pathname, location.search, setIsCartOpen]);

  // Lock background scroll when drawer is open and handle ESC key
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setIsCartOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isCartOpen, setIsCartOpen]);

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    // Requirement #2: Mandatory login before checkout
    const loggedIn = currentUser || localStorage.getItem('anr_user');
    if (loggedIn) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=/checkout');
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${
        isCartOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
      }`}
      aria-hidden={!isCartOpen}
    >
      {/* Backdrop with smooth fade */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-out ${
          isCartOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
        <div
          className={`w-screen max-w-md bg-white shadow-2xl flex flex-col font-sans h-full pointer-events-auto transform transition-transform duration-300 ease-out ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >

          {/* Header */}
          <div className="p-5 bg-[#1A175A] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-200" />
              <h2 className="text-base font-bold">Shopping Cart</h2>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-800">Your cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explore our classic scrubs, ecoflex stretch sets, and doctor lab coats.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                  <Link
                    to="/products"
                    onClick={() => setIsCartOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-[#1A175A] text-white text-xs font-bold hover:bg-[#141247] transition-colors"
                  >
                    Browse Catalog
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-[#1A175A] text-xs font-bold hover:border-[#1A175A] transition-colors"
                  >
                    View Cart Page
                  </Link>
                </div>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div
                  key={`${item.id}-${formatColorLabel(item.color)}-${item.size}-${item.pocket || ''}-${index}`}
                  className="p-3 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3"
                >
                  {/* Top row: image + basic info */}
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-24 object-cover rounded-xl bg-slate-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id, item.color, item.size, item.embroidery, item.pocket)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-slate-100 transition-colors shrink-0 -mt-0.5 -mr-1"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200/60">
                          <span className="text-slate-400 mr-1">Color:</span>
                          <strong className="font-semibold text-slate-800">
                            {typeof item.color === 'object' && item.color !== null ? (item.color.name || item.color.hex) : item.color}
                          </strong>
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200/60">
                          <span className="text-slate-400 mr-1">Size:</span>
                          <strong className="font-semibold text-slate-800">{item.size}</strong>
                        </span>
                        {item.pocket && (
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200/60">
                            <span className="text-slate-400 mr-1">Pocket:</span>
                            <strong className="font-semibold text-slate-800">{item.pocket}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Custom embroidery: full width so it has room */}
                  {item.embroidery && (
                    <EmbroideryDetails
                      embroidery={item.embroidery}
                      onSave={
                        updateEmbroidery
                          ? (next) => updateEmbroidery(item.id, item.color, item.size, item.embroidery, item.pocket, next)
                          : undefined
                      }
                    />
                  )}

                  {/* Quantity + line total */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center border border-slate-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.color, item.size, -1, item.embroidery, item.pocket)}
                        className="p-1 hover:bg-slate-100 text-slate-600"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.color, item.size, 1, item.embroidery, item.pocket)}
                        className="p-1 hover:bg-slate-100 text-slate-600"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-extrabold text-[#1A175A]">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-bold text-slate-900">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Direct Hospital Shipping</span>
                <span className="font-bold text-emerald-600 uppercase tracking-wide">Free</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#1A175A] pt-2 border-t border-slate-200">
                <span>Total Payable</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>

              <button
                type="button"
                onClick={handleProceedCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-[#1A175A] hover:bg-[#141247] text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-blue-200" />
              </button>

              <Link
                to="/cart"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl border border-[#1A175A]/20 hover:border-[#1A175A] text-[#1A175A] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#1A175A]" />
                <span>View Full Cart</span>
              </Link>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Secure Checkout • Express Hospital Dispatch</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;