import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCart, formatColorLabel } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';

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

  if (!isCartOpen) return null;

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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col font-sans">
          
          {/* Header */}
          <div className="p-5 bg-[#1A175A] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-200" />
              <h2 className="text-base font-bold">Your Hospital Apparel Bag</h2>
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
                <h4 className="text-base font-bold text-slate-800">Your bag is empty</h4>
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
                    View Bag Page
                  </Link>
                </div>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div
                  key={`${item.id}-${formatColorLabel(item.color)}-${item.size}-${index}`}
                  className="flex gap-4 p-3 rounded-2xl border border-slate-200 bg-white shadow-xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-xl bg-slate-100 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id, item.color, item.size, item.embroidery)}
                          className="text-slate-400 hover:text-rose-600 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>Color: <strong>{typeof item.color === 'object' && item.color !== null ? (item.color.name || item.color.hex) : item.color}</strong></span>
                        <span>•</span>
                        <span>Size: <strong>{item.size}</strong></span>
                      </div>

                      {/* Custom Embroidery Tag */}
                      {item.embroidery && (
                        <div className="mt-1.5 p-1.5 rounded-lg bg-blue-50 border border-blue-200/80 text-[10px] text-[#1A175A] space-y-0.5">
                          <div className="flex items-center gap-1 font-bold">
                            <Sparkles className="w-3 h-3 text-blue-700" />
                            <span>Custom Embroidery (+₹{item.embroidery.price})</span>
                          </div>
                          {item.embroidery.doctorName && (
                            <div className="truncate text-slate-700">
                              Name: <strong>{item.embroidery.doctorName}</strong>
                            </div>
                          )}
                          {item.embroidery.designation && (
                            <div className="truncate text-slate-600">
                              Dept: {item.embroidery.designation}
                            </div>
                          )}
                          {item.embroidery.hasLogo && (
                            <div className="text-emerald-700 font-semibold">
                              ✓ Hospital Crest Logo Included
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center border border-slate-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.color, item.size, -1, item.embroidery)}
                          className="p-1 hover:bg-slate-100 text-slate-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.color, item.size, 1, item.embroidery)}
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
                <span>Proceed to Doctor Checkout</span>
                <ArrowRight className="w-4 h-4 text-blue-200" />
              </button>

              <Link
                to="/cart"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl border border-[#1A175A]/20 hover:border-[#1A175A] text-[#1A175A] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#1A175A]" />
                <span>View Full Bag (/cart)</span>
              </Link>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Requires Doctor Sign In • Secure Bangalore Dispatch</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;