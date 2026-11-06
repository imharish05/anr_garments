import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    removeFromCart,
    updateQuantity,
    totalItems,
    subtotal
  } = useCart();

  if (!isCartOpen) return null;

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
              <ShoppingBag className="w-5 h-5 text-amber-300" />
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

          {/* Delivery perk banner */}
          <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 flex items-center gap-2 text-xs text-emerald-800 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Eligible for Free Express Hospital Delivery!</span>
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
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-[#1A175A] text-white text-xs font-bold"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div
                  key={`${item.id}-${item.color}-${item.size}-${index}`}
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
                          onClick={() => removeFromCart(item.id, item.color, item.size)}
                          className="text-slate-400 hover:text-rose-600 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>Color: <strong>{item.color}</strong></span>
                        <span>•</span>
                        <span>Size: <strong>{item.size}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center border border-slate-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.color, item.size, -1)}
                          className="p-1 hover:bg-slate-100 text-slate-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.color, item.size, 1)}
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
                <span>Shipping & Handling</span>
                <span className="font-bold text-emerald-600 uppercase tracking-wide">Free</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#1A175A] pt-2 border-t border-slate-200">
                <span>Total Estimated</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>

              <button
                onClick={() => alert(`Proceeding to checkout with ${totalItems} items (₹${subtotal.toLocaleString()}). Thank you for choosing ANR Hospital Garments!`)}
                className="w-full py-3.5 px-4 rounded-xl bg-[#1A175A] hover:bg-[#141247] text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
              >
                <span>Proceed to Doctor Checkout</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
