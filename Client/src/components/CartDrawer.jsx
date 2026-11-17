import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCart, formatColorLabel } from '../context/CartContext';
import { getImageUrl } from '../services/api';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Sparkles, Scissors } from 'lucide-react';

const CartDrawer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    removeFromCart,
    updateQuantity,
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
                {totalItems} items
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
                  className="flex gap-4 p-3 rounded-2xl border border-slate-200 bg-white shadow-xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-xl bg-slate-100 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id, item.color, item.size, item.embroidery, item.pocket)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-slate-100 transition-colors shrink-0 -mt-0.5 -mr-1"
                          title="Remove item"
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

                      {/* Custom Embroidery Details (Clean, structured editorial layout) */}
                      {item.embroidery && (
                        <div className="mt-2.5 pl-2.5 border-l-2 border-[#1A175A] space-y-1.5 text-[11px] text-slate-700">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A175A]">
                            <Scissors className="w-3.5 h-3.5 text-[#1A175A]" />
                            <span>Custom Embroidery</span>
                            {Number(item.embroidery.price || 0) > 0 && (
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-full border border-blue-200">
                                +₹{item.embroidery.price}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 gap-1 text-[11px]">
                            {item.embroidery.doctorName && (
                              <div className="leading-tight">
                                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mr-1">Line 1:</span>
                                <strong className="text-slate-900 font-semibold">{item.embroidery.doctorName}</strong>
                              </div>
                            )}
                            {item.embroidery.designation && (
                              <div className="leading-tight">
                                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mr-1">Line 2:</span>
                                <strong className="text-slate-900 font-semibold">{item.embroidery.designation}</strong>
                              </div>
                            )}
                            {(item.embroidery.threadColor || item.embroidery.placement) && (
                              <div className="text-[10px] text-slate-600 flex items-center gap-1.5 flex-wrap pt-0.5">
                                {item.embroidery.threadColor && (
                                  <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                                    Thread: <strong className="text-slate-800">{item.embroidery.threadColor}</strong>
                                  </span>
                                )}
                                {item.embroidery.placement && (
                                  <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 capitalize">
                                    Placement: <strong className="text-slate-800">{String(item.embroidery.placement).replace(/-/g, ' ')}</strong>
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {item.embroidery.hasLogo && (
                            <div className="flex items-center gap-2 pt-1 text-[10.5px] text-emerald-800 font-medium">
                              {item.embroidery.logoUrl && (
                                <img
                                  src={getImageUrl(item.embroidery.logoUrl)}
                                  alt="Logo Crest"
                                  className="w-5 h-5 object-contain rounded bg-white border border-slate-200 shrink-0"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              )}
                              <span className="flex items-center gap-1 font-semibold text-emerald-700">
                                <span>✓</span>
                                <span>Hospital Crest Attached</span>
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center border border-slate-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.color, item.size, -1, item.embroidery, item.pocket)}
                          className="p-1 hover:bg-slate-100 text-slate-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.color, item.size, 1, item.embroidery, item.pocket)}
                          className="p-1 hover:bg-slate-100 text-slate-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-[#1A175A]">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
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