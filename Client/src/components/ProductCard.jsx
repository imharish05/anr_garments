import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, Eye, Heart, BadgePercent } from 'lucide-react';
import ProductImage from './ProductImage';
import { normalizeColorOption } from '../services/api';

const SIZES = ["S", "M", "L", "XL", "2XL"];
const MAX_COLORS = 5;

const ProductCard = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const isLiked = Boolean(product?.id != null && isInWishlist(product.id));
  const [showAllColors, setShowAllColors] = useState(false);

  // second photo: product.hoverImage, or product.images?.[1]
  const altImage = product.hoverImage || product.images?.[1] || null;

  const allColors = (product.colors || []).map(normalizeColorOption).filter(Boolean);
  const safeColorIdx = selectedColorIdx < allColors.length ? selectedColorIdx : 0;
  const activeColor = allColors[safeColorIdx] || { name: 'Navy Blue', hex: '#1A175A', image: '' };
  const visibleColors = showAllColors ? allColors : allColors.slice(0, MAX_COLORS);
  const extraColors = showAllColors ? 0 : Math.max(0, allColors.length - MAX_COLORS);
  const savings = product.originalPrice ? product.originalPrice - product.price : 0;
  const displayImage = (safeColorIdx > 0 && activeColor.image) ? activeColor.image : product.image;

  const productLink = `/product/${product.slug || product.id}${selectedSize ? `?size=${selectedSize}` : ''}${activeColor?.hex ? `&color=${encodeURIComponent(activeColor.hex)}` : ''}`;

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product?.id) return;
    if (isLiked) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <article className="group relative flex h-full flex-col rounded-xl sm:rounded-2xl bg-white p-2 sm:p-3 shadow-sm ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1A175A]/10">
      {/* ---------- Image (clicking opens Product Detail Page) ---------- */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg sm:rounded-xl bg-white">
        <Link
          to={productLink}
          className="absolute inset-0 block h-full w-full cursor-pointer"
          aria-label={`View details of ${product.name}`}
        >
          {/* primary */}
          <ProductImage
            src={displayImage}
            alt={product.name}
            fallbackLabel="No product image"
            containerClassName={`absolute inset-0 h-full w-full bg-white ${
              altImage ? 'opacity-100 [@media(hover:hover)]:group-hover:opacity-0' : ''
            }`}
            className={`absolute inset-0 h-full w-full object-contain object-center p-2 transition-all duration-500 ease-out ${
              altImage ? '[@media(hover:hover)]:group-hover:opacity-0' : 'group-hover:scale-[1.04]'
            }`}
          />
          {/* secondary / hover view */}
          {altImage && (
            <img
              src={altImage}
              alt={`${product.name} – hover view`}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              className="absolute inset-0 h-full w-full scale-105 bg-[#F5F6FA] object-contain object-center opacity-0 transition-all duration-500 ease-out [@media(hover:hover)]:group-hover:scale-100 [@media(hover:hover)]:group-hover:opacity-100"
            />
          )}

          {/* soft vignette so overlays always read on primary */}
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/15 via-transparent to-slate-950/5 transition-opacity duration-300 ${
              altImage ? '[@media(hover:hover)]:group-hover:opacity-0' : ''
            }`}
          />
        </Link>

        {/* Badge */}
        {product.badge && (
          <span
            className={`pointer-events-none absolute left-2 top-2 sm:left-3 sm:top-3 z-10 rounded-full bg-white/95 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#1A175A] shadow-sm transition-opacity duration-200 ${
              altImage ? '[@media(hover:hover)]:group-hover:opacity-0' : ''
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={isLiked}
          className={`absolute right-2 top-2 sm:right-3 sm:top-3 z-10 grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-full shadow-sm transition-transform duration-150 ${
            isLiked
              ? 'scale-105 bg-rose-50 text-rose-600'
              : 'bg-white/95 text-slate-600 hover:scale-110 hover:text-rose-500'
          }`}
        >
          <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Discount */}
        {product.discount && (
          <span
            className={`pointer-events-none absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-10 inline-flex items-center gap-0.5 sm:gap-1 rounded-full bg-emerald-500 px-1.5 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-white shadow-md transition-opacity duration-300 ${
              altImage ? '[@media(hover:hover)]:group-hover:opacity-0' : ''
            }`}
          >
            <BadgePercent className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            {product.discount}
          </span>
        )}

        {/* Photo indicator dots */}
        {altImage && (
          <div className="pointer-events-none absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-10 flex items-center gap-1" aria-hidden="true">
            <span className="h-1.5 w-3.5 rounded-full bg-white shadow transition-all duration-300 [@media(hover:hover)]:group-hover:w-1.5 [@media(hover:hover)]:group-hover:opacity-60" />
            <span className="h-1.5 w-1.5 rounded-full bg-white opacity-60 shadow transition-all duration-300 [@media(hover:hover)]:group-hover:w-3.5 [@media(hover:hover)]:group-hover:opacity-100" />
          </div>
        )}
      </div>

      {/* ---------- Details ---------- */}
      <div className="flex flex-1 flex-col pt-2.5 sm:pt-3.5 pb-0.5 sm:pb-1">
        {/* category + rating */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          <span className="truncate text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            {product.category}
          </span>
          {Number(product.rating) > 0 ? (
            <span className="inline-flex flex-none items-center gap-0.5 sm:gap-1 rounded-full bg-blue-50 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-[#1A175A]">
              <Star className="h-2.5 w-2.5 fill-[#1A175A] text-[#1A175A]" />
              {product.rating}
              {Number(product.reviews) > 0 ? <span className="font-medium text-blue-700/70 hidden min-[420px]:inline">({product.reviews})</span> : null}
            </span>
          ) : null}
        </div>

        {/* title */}
        <h3 className="mt-1 sm:mt-1.5 line-clamp-2 min-h-[2rem] sm:min-h-[2.4rem] text-xs sm:text-[14px] font-bold leading-tight sm:leading-snug text-slate-900 transition-colors group-hover:text-[#1A175A]">
          <Link to={productLink} className="hover:underline">
            {product.name}
          </Link>
        </h3>

        {/* price */}
        <div className="mt-1.5 sm:mt-2.5 flex flex-wrap items-baseline gap-x-1.5 sm:gap-x-2 gap-y-0.5">
          <span className="text-base sm:text-xl font-black tracking-tight text-[#1A175A]">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-[10px] sm:text-xs font-medium text-slate-400 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
          {savings > 0 && (
            <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-600 block sm:inline">
              Save ₹{savings.toLocaleString()}
            </span>
          )}
        </div>

        {/* options */}
        <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-2.5 border-t border-slate-100 pt-2 sm:pt-3">
          {/* Colors shown in circles, no color code */}
          {allColors.length > 0 && (
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Colour:
              </span>
              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                {visibleColors.map((colorObj, idx) => {
                  const active = idx === safeColorIdx;
                  return (
                    <button
                      key={`${colorObj.name}-${colorObj.hex}-${idx}`}
                      type="button"
                      onClick={() => setSelectedColorIdx(idx)}
                      title={colorObj.name}
                      aria-label={`Select colour ${colorObj.name}`}
                      aria-pressed={active}
                      className={`h-4 w-4 sm:h-5 sm:w-5 rounded-full transition-all duration-150 cursor-pointer ${
                        active
                          ? 'bg-white p-[1px] sm:p-[1.5px] border-2 border-[#1A175A] shadow-xs'
                          : 'border border-slate-300 hover:border-slate-500 hover:scale-105'
                      }`}
                      style={active ? undefined : { backgroundColor: colorObj.hex }}
                    >
                      {active ? (
                        <span
                          className="w-full h-full rounded-full block"
                          style={{
                            backgroundColor: colorObj.hex,
                            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
                          }}
                        />
                      ) : null}
                    </button>
                  );
                })}
                {extraColors > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowAllColors(true)}
                    aria-label={`Show ${extraColors} more colours`}
                    className="grid h-4 sm:h-5 px-1.5 sm:px-2 place-items-center rounded-full bg-slate-100 text-[9px] sm:text-[10px] font-bold text-slate-600 hover:bg-[#1A175A] hover:text-white transition-colors"
                  >
                    +{extraColors}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Compact Size Selector */}
          <div className="space-y-1 sm:space-y-1.5">
            <div className="flex items-center justify-between text-[9px] sm:text-[10px]">
              <span className="font-bold uppercase tracking-wider text-slate-400">Size</span>
              <span className="font-semibold text-slate-500">Selected: <strong className="text-[#1A175A]">{selectedSize}</strong></span>
            </div>
            <div className="grid grid-cols-5 gap-0.5 sm:gap-1">
              {SIZES.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  aria-pressed={selectedSize === sz}
                  className={`rounded sm:rounded-md py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold transition-all duration-150 ${
                    selectedSize === sz
                      ? 'border border-[#1A175A] bg-[#1A175A] text-white shadow-xs'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-[#1A175A] hover:text-[#1A175A]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* View Product Button */}
        <Link
          to={productLink}
          className="mt-auto pt-2.5 sm:pt-3 flex w-full items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl px-2 py-2 sm:py-2.5 text-xs sm:text-[13px] font-bold text-white bg-[#1A175A] shadow-md shadow-[#1A175A]/20 transition-all duration-200 hover:bg-[#282479] hover:shadow-lg hover:shadow-[#1A175A]/25 active:scale-[0.98]"
        >
          <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-none" />
          <span>View Product</span>
        </Link>
      </div>
    </article>
  );
};

export default ProductCard;
