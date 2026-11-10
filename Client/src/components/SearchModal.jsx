import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { ALL_PRODUCTS, CATEGORIES } from '../data/mockData';
import { fetchCategoriesTree, fetchProducts } from '../services/api';
import {
  Search,
  X,
  ShoppingBag,
  Check,
  ArrowRight,
  Star
} from 'lucide-react';

const SearchModal = ({ isOpen, onClose }) => {
  const { addToCart, searchQuery, setSearchQuery } = useCart();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("ALL");
  const [categories, setCategories] = useState(CATEGORIES);
  const [productsList, setProductsList] = useState(ALL_PRODUCTS);
  const [addedProductId, setAddedProductId] = useState(null);
  const inputRef = useRef(null);

  // Fetch dynamic categories tree and live products from backend
  useEffect(() => {
    let isMounted = true;
    fetchProducts().then((liveProducts) => {
      if (isMounted && liveProducts && liveProducts.length > 0) {
        setProductsList(liveProducts);
      }
    });
    fetchCategoriesTree().then((list) => {
      if (isMounted && list && list.length > 0) {
        setCategories(list);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Autofocus input on open and lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter products based on searchQuery and category filter
  const filteredProducts = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();

    return productsList.filter((product) => {
      // Category filter
      if (activeCategoryFilter !== "ALL") {
        const catMatch = (product.category || '').toLowerCase();
        const filterMatch = activeCategoryFilter.toLowerCase();
        if (!catMatch.includes(filterMatch) && !filterMatch.includes(catMatch)) return false;
      }

      if (!q) return true;

      // Text match across fields
      const nameMatch = product.name?.toLowerCase().includes(q);
      const catMatch = product.category?.toLowerCase().includes(q);
      const skuMatch = product.sku?.toLowerCase().includes(q);
      const overviewMatch = product.overview?.toLowerCase().includes(q);

      return nameMatch || catMatch || skuMatch || overviewMatch;
    });
  }, [productsList, searchQuery, activeCategoryFilter]);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product, "#1A175A", "M");
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  const handleSelectProduct = (sectionId) => {
    onClose();
    if (sectionId) {
      setTimeout(() => {
        const el = document.querySelector(sectionId) || document.getElementById(sectionId.replace('#', ''));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8 z-10 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Search Products"
      >
        {/* Header Search Input Bar */}
        <div className="p-4 bg-[#1A175A] text-white border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-blue-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name, category, or fabric..."
                className="w-full bg-[#110E3F] text-white placeholder-blue-300/60 pl-10 pr-9 py-2.5 rounded-xl text-sm border border-white/15 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white p-0.5"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 scrollbar-hide">
            <button
              type="button"
              onClick={() => setActiveCategoryFilter("ALL")}
              className={`px-3 py-1 rounded-lg font-semibold text-xs whitespace-nowrap transition-colors ${
                activeCategoryFilter === "ALL"
                  ? 'bg-amber-400 text-[#1A175A]'
                  : 'bg-white/10 text-blue-100 hover:bg-white/20'
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => {
              const isActive = activeCategoryFilter === cat.name;
              return (
                <button
                  key={cat.id || cat.name}
                  type="button"
                  onClick={() => setActiveCategoryFilter(isActive ? "ALL" : cat.name)}
                  className={`px-3 py-1 rounded-lg font-semibold text-xs whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-amber-400 text-[#1A175A]'
                      : 'bg-white/10 text-blue-100 hover:bg-white/20'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body: Compact & Professional Products List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-slate-50">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredProducts.map((product) => {
                const isAdded = addedProductId === product.id;
                return (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.sectionId)}
                    className="group bg-white rounded-xl border border-slate-200 p-2.5 hover:border-[#1A175A]/40 hover:shadow-md transition-all cursor-pointer flex items-center gap-3"
                  >
                    {/* Small Product Thumbnail */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/anr-hero-banner.jpg';
                        }}
                      />
                      {product.badge && (
                        <span className="absolute bottom-0 inset-x-0 bg-[#1A175A]/85 text-white text-[8px] font-bold text-center py-0.5 truncate">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block truncate">
                        {product.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#1A175A] transition-colors truncate">
                        {product.name}
                      </h4>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-xs font-black text-[#1A175A]">
                          ₹{typeof product.price === 'number' ? product.price.toLocaleString('en-IN') : product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ₹{typeof product.originalPrice === 'number' ? product.originalPrice.toLocaleString('en-IN') : product.originalPrice}
                          </span>
                        )}
                        {product.rating && (
                          <span className="text-[10px] text-slate-500 inline-flex items-center gap-0.5 ml-auto">
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            {product.rating}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Add Button */}
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(product, e)}
                      className={`p-2 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-[#1A175A] hover:bg-[#1A175A] hover:text-white'
                      }`}
                      title={isAdded ? 'Added' : 'Add to bag'}
                    >
                      {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-10 px-4 bg-white rounded-xl border border-dashed border-slate-300">
              <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800 mb-1">
                No matching garments found
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                No results for "{searchQuery}". Try searching for scrubs, aprons, underscrubs, or patient wear.
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(""); setActiveCategoryFilter("ALL"); }}
                className="px-4 py-1.5 rounded-lg bg-[#1A175A] text-white text-xs font-bold hover:bg-blue-900 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Minimal Professional Footer */}
        <div className="px-4 py-2.5 bg-white border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span className="text-[11px] font-medium">
            Showing <strong className="text-slate-700">{filteredProducts.length}</strong> items
          </span>
          <span className="text-[11px]">
            Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px] font-mono">ESC</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
