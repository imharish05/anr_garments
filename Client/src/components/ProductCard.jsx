import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Star, ShoppingBag, Heart, Check } from 'lucide-react';

const SIZES = ["S", "M", "L", "XL", "2XL"];

const ProductCard = ({ product }) => {
  const { addToCart, wishlistCount, setWishlistCount } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "#1A175A");
  const [selectedSize, setSelectedSize] = useState("M");
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    setWishlistCount(prev => isLiked ? Math.max(0, prev - 1) : prev + 1);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="bg-[#1A175A] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
              {product.badge}
            </span>
          )}
          {product.discount && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              {product.discount}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 shadow-md ${
            isLiked
              ? 'bg-rose-50 text-rose-600 scale-110'
              : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Bottom Quick Feature Highlights */}
        {product.features && (
          <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            {product.features.slice(0, 2).map((feat, idx) => (
              <span
                key={idx}
                className="bg-[#141247]/90 text-white text-[9px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm"
              >
                ✓ {feat}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Product Details Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-blue-800 font-semibold uppercase tracking-wider text-[10px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-slate-700 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 text-[10px]">({product.reviews})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#1A175A] transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-lg font-extrabold text-[#1A175A]">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Interactive Swatches and Size Selector */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          {/* Color swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-500 font-medium mr-1">Color:</span>
              {product.colors.map((cHex) => (
                <button
                  key={cHex}
                  onClick={() => setSelectedColor(cHex)}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    selectedColor === cHex
                      ? 'ring-2 ring-[#1A175A] ring-offset-1 scale-110'
                      : 'border-slate-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: cHex }}
                  title={cHex}
                />
              ))}
            </div>
          )}

          {/* Size picker */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-500 font-medium mr-1">Size:</span>
            {SIZES.map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSize(sz)}
                className={`text-[10px] px-2 py-0.5 rounded font-semibold border transition-colors ${
                  selectedSize === sz
                    ? 'bg-[#1A175A] text-white border-[#1A175A]'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-sm ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#1A175A] hover:bg-[#141247] text-white hover:shadow-md'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
