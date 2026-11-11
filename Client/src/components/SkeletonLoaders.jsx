import React from 'react';

/**
 * Light-toned Skeleton Loader for Product Detail Page (/product/:slug)
 */
export const ProductDetailSkeleton = () => {
  return (
    <div className="bg-white py-8 sm:py-12 font-sans">
      {/* Breadcrumb Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="h-4 skeleton-bone rounded-md w-64 max-w-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

          {/* Left Column: Image & Thumbnails Skeleton */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[4/5] rounded-3xl skeleton-bone" />

            {/* Thumbnails */}
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-24 rounded-2xl skeleton-bone shrink-0" />
              ))}
            </div>

            {/* Feature Badges Skeleton */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-2xl skeleton-bone-soft border border-slate-100 h-16" />
              ))}
            </div>
          </div>

          {/* Right Column: Configuration & Actions Skeleton */}
          <div className="lg:col-span-5 space-y-6">
            {/* Title & SKU */}
            <div className="space-y-2.5">
              <div className="h-3.5 skeleton-bone rounded-md w-36" />
              <div className="h-8 skeleton-bone rounded-xl w-5/6" />
              <div className="h-8 skeleton-bone rounded-xl w-3/4" />
              <div className="h-5 skeleton-bone rounded-full w-48 mt-2" />
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-2xl skeleton-bone-soft border border-slate-100 h-20" />

            {/* Color Swatches */}
            <div className="space-y-2">
              <div className="h-3.5 skeleton-bone rounded-md w-28" />
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-7 h-7 rounded-full skeleton-bone" />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-3.5 skeleton-bone rounded-md w-24" />
                <div className="h-3.5 skeleton-bone rounded-md w-20" />
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="h-9 rounded-xl skeleton-bone" />
                ))}
              </div>
            </div>

            {/* Cut / Style Config */}
            <div className="space-y-2">
              <div className="h-3.5 skeleton-bone rounded-md w-32" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-14 rounded-xl skeleton-bone" />
                <div className="h-14 rounded-xl skeleton-bone" />
              </div>
            </div>

            {/* Custom Embroidery Studio Box */}
            <div className="p-5 rounded-2xl skeleton-bone-soft h-28 border border-slate-100" />

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="h-14 rounded-2xl skeleton-bone" />
              <div className="h-14 rounded-2xl skeleton-bone-soft border border-slate-100" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/**
 * Light Skeleton Loader for Customer Account Orders (/account)
 */
export const OrderCardSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div className="space-y-1.5">
          <div className="h-4 skeleton-bone rounded-md w-32" />
          <div className="h-3 skeleton-bone rounded-md w-24" />
        </div>
        <div className="h-8 skeleton-bone rounded-xl w-28" />
      </div>

      {/* 6-Stage Stepper Skeleton */}
      <div className="space-y-3 pt-2">
        <div className="h-3 skeleton-bone rounded-md w-40" />
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-2 rounded-full skeleton-bone" />
              <div className="h-2.5 skeleton-bone rounded mx-auto w-12" />
            </div>
          ))}
        </div>
      </div>

      {/* Items Preview Skeleton */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        {[1, 2].map((i) => (
          <div key={i} className="flex justify-between items-center py-2">
            <div className="space-y-1">
              <div className="h-3.5 skeleton-bone rounded-md w-48" />
              <div className="h-3 skeleton-bone rounded-md w-28" />
            </div>
            <div className="h-4 skeleton-bone rounded-md w-16" />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Light Skeleton Loader for Institutional Bulk Discount Tiers (/bulk-order)
 */
export const BulkTierSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-6 rounded-2xl border border-slate-200/70 bg-slate-50/70 space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-3 skeleton-bone rounded-md w-24" />
            <div className="h-5 skeleton-bone rounded-full w-16" />
          </div>
          <div className="h-8 skeleton-bone rounded-xl w-32" />
          <div className="h-3.5 skeleton-bone rounded-md w-full" />
          <div className="h-3.5 skeleton-bone rounded-md w-3/4" />
          <div className="pt-3 border-t border-slate-100 h-4 skeleton-bone rounded w-1/2" />
        </div>
      ))}
    </div>
  );
};

/**
 * Light-toned Skeleton Loader for Product Cards (Matches ProductCard.jsx)
 */
export const ProductCardSkeleton = () => {
  return (
    <div className="relative flex h-full flex-col rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200/70">
      <div className="aspect-[4/5] rounded-xl skeleton-bone w-full mb-3" />
      <div className="space-y-2 flex-1">
        <div className="flex justify-between items-center">
          <div className="h-3 skeleton-bone rounded w-24" />
          <div className="h-3 skeleton-bone rounded w-12" />
        </div>
        <div className="h-4 skeleton-bone rounded w-full" />
        <div className="h-4 skeleton-bone rounded w-3/4" />
        <div className="flex items-baseline gap-2 pt-1">
          <div className="h-6 skeleton-bone rounded w-20" />
          <div className="h-4 skeleton-bone rounded w-14" />
        </div>
      </div>
      <div className="pt-3 space-y-2 border-t border-slate-100 mt-2">
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-4 h-4 rounded-full skeleton-bone" />
          ))}
        </div>
        <div className="flex gap-1">
          {['S', 'M', 'L', 'XL', '2X'].map((size) => (
            <div key={size} className="flex-1 h-7 rounded-md skeleton-bone" />
          ))}
        </div>
      </div>
      <div className="h-10 skeleton-bone rounded-xl w-full mt-3" />
    </div>
  );
};

/**
 * Section-level Skeleton matching ProductCollectionSection layout so LazySection
 * transitions into loading ProductCards without layout jump or blinking.
 */
export const ProductCollectionSkeleton = ({ bgClass = 'bg-white' }) => {
  return (
    <section className={`py-16 ${bgClass} border-b border-slate-100`} aria-label="Loading product collection">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2.5">
            <div className="h-3 w-36 rounded skeleton-bone" />
            <div className="h-9 w-72 max-w-full rounded-lg skeleton-bone" />
            <div className="h-4 w-96 max-w-full rounded skeleton-bone-soft" />
          </div>
          <div className="h-4 w-32 rounded skeleton-bone" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map((idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Light Skeleton Loader for Coupons (Offers Section & Checkout)
 */
export const CouponCardSkeleton = () => {
  return (
    <div className="flex flex-col sm:flex-row rounded-3xl bg-white border border-slate-200/80 p-5 shadow-sm gap-4">
      <div className="w-full sm:w-28 h-20 skeleton-bone rounded-2xl shrink-0" />
      <div className="flex-1 space-y-2.5">
        <div className="flex justify-between">
          <div className="h-5 skeleton-bone rounded-md w-28" />
          <div className="h-4 skeleton-bone rounded-full w-16" />
        </div>
        <div className="h-3.5 skeleton-bone rounded w-full" />
        <div className="h-3 skeleton-bone rounded w-2/3" />
        <div className="h-8 skeleton-bone-soft rounded-xl w-32 mt-2" />
      </div>
    </div>
  );
};

/**
 * Light Skeleton Loader for Search Results List
 */
export const SearchItemSkeleton = () => {
  return (
    <div className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 bg-white">
      <div className="w-16 h-20 skeleton-bone rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 skeleton-bone rounded w-20" />
        <div className="h-4 skeleton-bone rounded w-48" />
        <div className="h-5 skeleton-bone rounded w-24" />
      </div>
    </div>
  );
};
