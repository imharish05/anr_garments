import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategoriesTree, getCategoryPageLink } from '../services/api';
import ProductImage from './ProductImage';
import { AnimatedText, ScrollReveal } from './MotionPrimitives';
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
  RefreshCw,
  FolderOpen,
} from 'lucide-react';

const HEX = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

// Faint abstract medical icons scattered on the background
const BG_ICONS = [
  { Icon: Stethoscope, top: '6%', left: '4%', size: 64, rotate: -15, tone: 'navy', mobile: true },
  { Icon: Pill, top: '10%', left: '30%', size: 40, rotate: 35, tone: 'blue' },
  { Icon: HeartPulse, top: '5%', left: '62%', size: 56, rotate: 10, tone: 'navy' },
  { Icon: Syringe, top: '8%', left: '88%', size: 60, rotate: 40, tone: 'navy', mobile: true },
  { Icon: Cross, top: '42%', left: '1.5%', size: 36, rotate: 0, tone: 'blue' },
  { Icon: Dna, top: '44%', left: '95%', size: 52, rotate: -20, tone: 'blue' },
  { Icon: Microscope, top: '82%', left: '6%', size: 58, rotate: 8, tone: 'navy', mobile: true },
  { Icon: Thermometer, top: '84%', left: '34%', size: 46, rotate: -30, tone: 'blue' },
  { Icon: Bandage, top: '86%', left: '64%', size: 48, rotate: 25, tone: 'navy' },
  { Icon: Cross, top: '80%', left: '92%', size: 40, rotate: 0, tone: 'navy', mobile: true },
];

const ShopByCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const railRef = useRef(null);

  const loadCategories = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError('');
    try {
      const list = await fetchCategoriesTree(forceRefresh);
      setCategories(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err?.message || 'Unable to load categories.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

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
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-blue-500/[0.08] blur-3xl" />

        {/* Scattered icons */}
        {BG_ICONS.map(({ Icon, top, left, size, rotate, tone, mobile }, k) => (
          <Icon
            key={k}
            strokeWidth={1.4}
            className={`absolute ${mobile ? '' : 'hidden sm:block'} ${
              tone === 'blue' ? 'text-blue-600/20' : 'text-[#1A175A]/[0.09]'
            }`}
            style={{ top, left, width: size, height: size, transform: `rotate(${rotate}deg)` }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <ScrollReveal direction="pop" className="inline-block">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.28em] text-blue-700 mb-3">
              Our Range
            </p>
          </ScrollReveal>
          <AnimatedText
            as="h2"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A175A] tracking-tight block"
          >
            Shop by Category
          </AnimatedText>
          <ScrollReveal direction="scale" delay={180}>
            <div className="mx-auto mt-4 h-[3px] w-14 rounded-full bg-[#1A175A]" />
          </ScrollReveal>
        </div>

        {/* Single-line hexagon row: centered when it fits, scrolls when it doesn't */}
        {loading ? (
          <div className="flex justify-center gap-4 py-4 overflow-hidden">
            {[0, 1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="w-[170px] sm:w-[210px] aspect-[1/1.1547] skeleton-bone flex-shrink-0"
                style={{ clipPath: HEX }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-8 text-center max-w-xl mx-auto">
            <p className="text-sm font-semibold text-[#1A175A] mb-3">{error}</p>
            <button
              type="button"
              onClick={() => loadCategories(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A175A] text-white text-xs font-bold hover:bg-blue-900 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Categories
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-10 text-center max-w-xl mx-auto">
            <FolderOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No active categories available right now.</p>
          </div>
        ) : (
        <div className="relative">
          <div
            ref={railRef}
            onScroll={updateArrows}
            className="overflow-x-auto py-8 -my-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <ScrollReveal
              staggerChildren
              staggerMs={75}
              triggerKey={categories.length}
              className="flex w-max mx-auto gap-3 sm:gap-4 px-2 [--w:176px] sm:[--w:210px] lg:[--w:226px]"
            >
              {categories.map((cat, i) => {
                const to =
                  cat.link && cat.link.startsWith('/')
                    ? cat.link
                    : cat.href && cat.href.startsWith('/')
                    ? cat.href
                    : getCategoryPageLink(cat.slug);

                return (
                  <Link
                    key={cat.id || cat.slug || i}
                    to={to}
                    aria-label={cat.name}
                    draggable={false}
                    className="group relative block flex-shrink-0 transition-transform duration-500 hover:scale-[1.06]"
                    style={{ width: 'var(--w)', height: 'calc(var(--w) * 1.1547)' }}
                  >
                    <span
                      className="absolute inset-0 bg-[#1A175A] group-hover:bg-blue-600 transition-colors duration-500"
                      style={{ clipPath: HEX }}
                    />
                    <span
                      className="absolute inset-[4px] overflow-hidden bg-slate-800"
                      style={{ clipPath: HEX }}
                    >
                      <ProductImage
                        src={cat.image}
                        alt=""
                        draggable={false}
                        fallbackLabel=""
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        containerClassName="w-full h-full bg-[#1A175A]/90 text-blue-200/70"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-[#0D0A35]/90 via-[#110E3F]/25 to-transparent" />

                      <span className="absolute inset-x-0 bottom-[24%] px-4 text-center text-white">
                        <span className="block text-xs font-bold tracking-[0.26em] text-blue-200">
                          {pad(i)}
                        </span>
                        <span className="block mt-1 text-base sm:text-xl font-bold leading-snug drop-shadow-sm">
                          {cat.name}
                        </span>
                      </span>
                    </span>
                  </Link>
                );
              })}
            </ScrollReveal>
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
        )}
      </div>
    </section>
  );
};

export default ShopByCategory;