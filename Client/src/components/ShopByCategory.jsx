import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../data/mockData';
import { fetchCategoriesTree } from '../services/api';
import {
  Sparkles,
  ArrowRight,
  Shirt,
  ShieldCheck,
  Layers,
  HeartHandshake,
  Bed,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';

// Maps category id/slug/name to representative clean Lucide icon
const getCategoryIcon = (val = '') => {
  const clean = String(val || '').toLowerCase();
  if (clean.includes('scrub') && !clean.includes('under')) return Shirt;
  if (clean.includes('apron') || clean.includes('coat')) return ShieldCheck;
  if (clean.includes('under')) return Layers;
  if (clean.includes('patient')) return HeartHandshake;
  if (clean.includes('linen') || clean.includes('drape') || clean.includes('bed')) return Bed;
  return Sparkles;
};

const ShopByCategory = () => {
  const [categories, setCategories] = useState(CATEGORIES);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    let isMounted = true;
    fetchCategoriesTree().then((list) => {
      if (isMounted && list && list.length > 0) {
        // Merge startingPrice, shortLabel and badge from mockData if missing
        const enhanced = list.map((cat, idx) => {
          const fallback = CATEGORIES[idx] || {};
          return {
            ...fallback,
            ...cat,
            startingPrice: cat.startingPrice || fallback.startingPrice || '',
            shortLabel: cat.shortLabel || fallback.shortLabel || cat.name,
            badge: cat.badge || fallback.badge || 'Direct Factory'
          };
        });
        setCategories(enhanced);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCategories =
    activeFilter === 'all'
      ? categories
      : categories.filter((cat) => (cat.id || cat.slug) === activeFilter);

  return (
    <section id="shop-categories" className="scroll-mt-24 py-16 sm:py-20 bg-[#F8FAFC] border-b border-slate-200/70 relative">
      {/* Secondary anchor for direct '#categories' links */}
      <span id="categories" className="absolute -top-24 left-0" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-200">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1A175A] text-xs font-bold uppercase tracking-wider mb-3 border border-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Bangalore Direct Manufacturing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A175A] tracking-tight">
              Shop by Category
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
              Explore our core medical garment lines engineered for long hospital shifts, physician authority, patient dignity, and sterile theatre performance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#bulk-inquiry"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:border-[#1A175A] hover:bg-[#1A175A] text-[#1A175A] hover:text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all group"
            >
              <span>Bulk Institutional Inquiry</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-400" />
            </a>
          </div>
        </div>

        {/* Quick Filter Tabs for Category Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-[#1A175A] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>All Categories ({categories.length})</span>
          </button>

          {categories.map((cat) => {
            const catId = cat.id || cat.slug;
            const isSelected = activeFilter === catId;
            const Icon = getCategoryIcon(catId);
            return (
              <button
                key={catId}
                type="button"
                onClick={() => setActiveFilter(catId)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#1A175A] text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{cat.shortLabel || cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {filteredCategories.map((cat, index) => {
            const catId = cat.id || cat.slug || index;
            const Icon = getCategoryIcon(cat.slug || cat.name || catId);
            const targetHref = cat.link || cat.href || '#scrubs-collection';

            return (
              <div
                key={catId}
                className="group relative bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 hover:border-[#1A175A]/40 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Aspect Ratio */}
                  <div className="relative aspect-[4/3.2] overflow-hidden bg-slate-100">
                    <img
                      src={cat.image}
                      alt={cat.title || cat.name}
                      className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=700&q=80';
                      }}
                    />

                    {/* Gradient overlay for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20 opacity-70 group-hover:opacity-50 transition-opacity" />

                    {/* Floating Badge (Top Left) */}
                    <span className="absolute top-3 left-3 bg-white/95 text-[#1A175A] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-xs flex items-center gap-1">
                      <Icon className="w-3 h-3 text-[#1A175A]" />
                      <span>{cat.badge || 'Direct Factory'}</span>
                    </span>

                    {/* Starting Price or Style Count (Top Right) */}
                    {cat.startingPrice && (
                      <span className="absolute top-3 right-3 bg-[#1A175A] text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm border border-white/20">
                        {cat.startingPrice.includes('Quote') ? cat.startingPrice : `From ${cat.startingPrice}`}
                      </span>
                    )}

                    {/* Category Title on image (Quick preview) */}
                    <div className="absolute bottom-2.5 left-3 right-3 text-white">
                      <span className="text-[10px] font-semibold text-blue-200 uppercase tracking-wider block">
                        {cat.count || 'Medical Grade'}
                      </span>
                      <h3 className="text-base font-bold leading-tight drop-shadow-sm group-hover:text-amber-300 transition-colors">
                        {cat.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                      {cat.description}
                    </p>

                    {/* Subcategories preview chips */}
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {cat.subcategories.slice(0, 3).map((sub, i) => (
                          <a
                            key={i}
                            href={sub.href || targetHref}
                            className="text-[10px] font-semibold text-slate-600 bg-slate-100 hover:bg-blue-50 hover:text-[#1A175A] px-2 py-0.5 rounded-md transition-colors"
                          >
                            {sub.name || sub.label}
                          </a>
                        ))}
                        {cat.subcategories.length > 3 && (
                          <span className="text-[10px] font-semibold text-slate-400 px-1 py-0.5">
                            +{cat.subcategories.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="p-3 sm:px-4 bg-slate-50 border-t border-slate-100">
                  <a
                    href={targetHref}
                    className="w-full flex items-center justify-between text-xs font-bold text-[#1A175A] group-hover:text-blue-700 py-1 transition-colors"
                  >
                    <span>Explore Collection</span>
                    <div className="w-6 h-6 rounded-full bg-white group-hover:bg-[#1A175A] text-[#1A175A] group-hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs">
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust & Feature Ribbon */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="flex items-center gap-3.5 pt-3 md:pt-0">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1A175A] flex items-center justify-center flex-shrink-0">
                <Shirt className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1A175A] uppercase tracking-wide">
                  Tailored Medical Cuts
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Unisex, contoured women’s fit, and tactical multi-pocket cargo scrubs.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 pt-4 md:pt-0 md:pl-5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1A175A] uppercase tracking-wide">
                  Custom Crest & Name Embroidery
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Computerized doctor name & hospital logo embroidery on coats & scrubs.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 pt-4 md:pt-0 md:pl-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1A175A] uppercase tracking-wide">
                  Factory Direct Pricing
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct dispatch from Girinagar, Bangalore with special bulk institutional rates.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ShopByCategory;
