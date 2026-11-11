import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import { useCart, formatColorLabel } from '../context/CartContext';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, addToCart } = useCart();

  const handleMoveToCart = (product) => {
    const fallbackColor = product.color || product.colors?.[0];
    addToCart(product, formatColorLabel(fallbackColor), product.size || 'M');
    removeFromWishlist(product.id);
  };

  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Saved Hospital Uniforms (Wishlist)' }]} />

      <section className="py-12 sm:py-16 bg-slate-50 min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#1A175A]">
                Healthcare Wardrobe
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1">
                Your Saved Uniforms ({wishlistItems.length})
              </h1>
            </div>

            <Link
              to="/products"
              className="text-xs font-bold text-[#1A175A] hover:underline flex items-center gap-1.5"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-slate-200 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Your Wishlist is Empty</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Save your favorite scrub suits, lab coats, and doctor aprons to compare colors and place bulk team orders later.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A175A] hover:bg-[#141247] text-white text-xs font-bold shadow-md transition-all"
              >
                <span>Browse Scrub Collections</span>
                <ArrowRight className="w-4 h-4 text-blue-200" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden group">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-rose-600 shadow-sm hover:scale-110 transition-transform"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        {item.category || 'Medical Apparel'}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mt-0.5">
                        {item.name}
                      </h4>
                      <div className="text-base font-black text-[#1A175A] mt-2">
                        ₹{(item.price || 1299).toLocaleString()}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <button
                        type="button"
                        onClick={() => handleMoveToCart(item)}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#1A175A] hover:bg-[#141247] text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-blue-200" />
                        <span>Move to Bag</span>
                      </button>

                      <Link
                        to={`/product/${item.slug || item.id}`}
                        className="block text-center text-[11px] text-slate-500 hover:text-[#1A175A] font-semibold"
                      >
                        View Full Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </Layout>
  );
};

export default WishlistPage;