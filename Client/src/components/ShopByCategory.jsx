import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CATEGORIES } from '../data/mockData';
import { fetchCategoriesTree } from '../services/api';
import {
  Stethoscope,
  Syringe,
  Pill,
  HeartPulse,
  Thermometer,
  Microscope,
  Cross,
  Dna,
  Bandage,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=700&q=80';

const HEX = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

// Faint abstract medical icons scattered on the background
const BG_ICONS = [
  { Icon: Stethoscope, top: '6%', left: '4%', size: 64, rotate: -15, tone: 'navy', mobile: true },
  { Icon: Pill, top: '10%', left: '30%', size: 40, rotate: 35, tone: 'gold' },
  { Icon: HeartPulse, top: '5%', left: '62%', size: 56, rotate: 10, tone: 'navy' },
  { Icon: Syringe, top: '8%', left: '88%', size: 60, rotate: 40, tone: 'navy', mobile: true },
  { Icon: Cross, top: '42%', left: '1.5%', size: 36, rotate: 0, tone: 'gold' },
  { Icon: Dna, top: '44%', left: '95%', size: 52, rotate: -20, tone: 'gold' },
  { Icon: Microscope, top: '82%', left: '6%', size: 58, rotate: 8, tone: 'navy', mobile: true },
  { Icon: Thermometer, top: '84%', left: '34%', size: 46, rotate: -30, tone: 'gold' },
  { Icon: Bandage, top: '86%', left: '64%', size: 48, rotate: 25, tone: 'navy' },
  { Icon: Cross, top: '80%', left: '92%', size: 40, rotate: 0, tone: 'navy', mobile: true },
];

const ShopByCategory = () => {
  const [categories, setCategories] = useState(CATEGORIES);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const railRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    fetchCategoriesTree().then((list) => {
      if (isMounted && list && list.length > 0) {
        const enhanced = list.map((cat, idx) => {
          const fallback = CATEGORIES[idx] || {};
          return {
            ...fallback,
            ...cat,
            shortLabel: cat.shortLabel || fallback.shortLabel || cat.name,
          };
        });
        setCategories(enhanced);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const updateArrows = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(max > 4 && el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener('resize', updateArrows);
    return () => window.removeEventListener('resize', updateArrows);
  }, [categories, updateArrows]);

  const scrollByCard = (dir) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: 'smooth' });
  };

  const pad = (i) => String(i + 1).padStart(2, '0');

  return (
    <section
      id="shop-categories"
      className="scroll-mt-24 py-14 sm:py-20 bg-gradient-to-b from-[#F7F8FC] via-white to-[#F7F8FC] relative overflow-hidden"
    >
      <span id="categories" className="absolute -top-24 left-0" aria-hidden="true" />

      {/* Abstract medical background */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        {/* ECG heartbeat line */}
        <svg
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 w-full h-40 sm:h-56 text-[#1A175A]/[0.07]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0 60 H380 L410 60 L430 20 L460 100 L485 40 L505 60 H760 L790 60 L810 10 L840 110 L865 45 L885 60 H1200"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Soft glow blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#1A175A]/[0.04] blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-amber-300/[0.12] blur-3xl" />

        {/* Scattered icons */}
        {BG_ICONS.map(({ Icon, top, left, size, rotate, tone, mobile }, k) => (
          <Icon
            key={k}
            strokeWidth={1.4}
            className={`absolute ${mobile ? '' : 'hidden sm:block'} ${
              tone === 'gold' ? 'text-amber-500/25' : 'text-[#1A175A]/[0.09]'
            }`}
            style={{ top, left, width: size, height: size, transform: `rotate(${rotate}deg)` }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600 mb-3">
            Our Range
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A175A] tracking-tight">
            Shop by Category
          </h2>
          <div className="mx-auto mt-4 h-[3px] w-12 rounded-full bg-amber-400" />
        </div>

        {/* Single-line hexagon row: centered when it fits, scrolls when it doesn't */}
        <div className="relative">
          <div
            ref={railRef}
            onScroll={updateArrows}
            className="overflow-x-auto py-8 -my-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex w-max mx-auto gap-3 sm:gap-4 px-2 [--w:170px] sm:[--w:210px] lg:[--w:225px]">
              {categories.map((cat, i) => {
                const href = cat.link || cat.href || '#scrubs-collection';

                return (
                  <a
                    key={cat.id || cat.slug || i}
                    href={href}
                    aria-label={cat.name}
                    draggable={false}
                    className="group relative block flex-shrink-0 transition-transform duration-500 hover:scale-[1.06]"
                    style={{ width: 'var(--w)', height: 'calc(var(--w) * 1.1547)' }}
                  >
                    <span
                      className="absolute inset-0 bg-[#1A175A] group-hover:bg-amber-400 transition-colors duration-500"
                      style={{ clipPath: HEX }}
                    />
                    <span
                      className="absolute inset-[4px] overflow-hidden bg-slate-200"
                      style={{ clipPath: HEX }}
                    >
                      <img
                        src={cat.image}
                        alt=""
                        loading="lazy"
                        draggable={false}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_IMG;
                        }}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-[#110E3F]/85 via-[#110E3F]/10 to-transparent" />

                      <span className="absolute inset-x-0 bottom-[26%] px-3 text-center text-white">
                        <span className="block text-[10px] tracking-[0.3em] text-amber-300">
                          {pad(i)}
                        </span>
                        <span className="block mt-0.5 text-sm sm:text-lg font-semibold leading-tight">
                          {cat.shortLabel || cat.name}
                        </span>
                      </span>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Arrows appear only when the row overflows */}
          {canPrev && (
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Scroll left"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 text-[#1A175A] shadow-md flex items-center justify-center hover:bg-[#1A175A] hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {canNext && (
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Scroll right"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 text-[#1A175A] shadow-md flex items-center justify-center hover:bg-[#1A175A] hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;