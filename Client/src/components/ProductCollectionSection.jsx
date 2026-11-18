import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, PackageOpen, RefreshCw } from 'lucide-react';
import { fetchCategoriesTree, fetchProducts, getCategoryPageLink } from '../services/api';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from './SkeletonLoaders';
import { AnimatedText, ScrollReveal } from './MotionPrimitives';

const EMPTY_LIST = [];

const ProductCollectionSection = ({
  id,
  bgClass = 'bg-white',
  eyebrow,
  title,
  subtitle,
  ctaText = 'Request Hospital Bulk Quote',
  ctaTo = '/bulk-order',
  categorySlugs = EMPTY_LIST,
  categoryIds = EMPTY_LIST,
  namePattern,
  limit = 12,
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dynamicCtaTo, setDynamicCtaTo] = useState(ctaTo);

  const railRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const slugsKey = categorySlugs.join(',');
  const idsKey = categoryIds.join(',');
  const patternSource = namePattern ? namePattern.source : '';
  const patternFlags = namePattern ? namePattern.flags : '';

  const updateArrows = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 6);
    setCanNext(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  useEffect(() => {
    updateArrows();
    const handleResize = () => updateArrows();
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(updateArrows, 150);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [products, updateArrows]);

  const scrollByDirection = (dir) => {
    const el = railRef.current;
    if (!el) return;
    const firstChild = el.firstElementChild;
    const cardWidth = firstChild ? firstChild.getBoundingClientRect().width : 280;
    const gap = 24;
    const scrollStep = cardWidth + gap;
    el.scrollBy({ left: dir * scrollStep, behavior: 'smooth' });
  };

  // Dynamically resolve button link to live category page URL
  useEffect(() => {
    let isMounted = true;
    const resolveLink = async () => {
      try {
        const tree = await fetchCategoriesTree().catch(() => []);
        if (!Array.isArray(tree) || tree.length === 0) return;
        const slugs = slugsKey ? slugsKey.split(',') : EMPTY_LIST;
        const ids = idsKey ? idsKey.split(',').map(Number) : EMPTY_LIST;
        const regex = patternSource ? new RegExp(patternSource, patternFlags) : null;

        const matched = tree.find((c) => {
          if (slugs.includes(c.slug)) return true;
          if (ids.includes(c.id)) return true;
          if (regex && (regex.test(c.name || '') || regex.test(c.slug || ''))) return true;
          return false;
        });

        if (matched && matched.slug && isMounted) {
          setDynamicCtaTo(getCategoryPageLink(matched.slug));
        }
      } catch {
        // Fallback to default ctaTo
      }
    };
    resolveLink();
    return () => { isMounted = false; };
  }, [slugsKey, idsKey, patternSource, patternFlags, ctaTo]);

  const loadProducts = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError('');
    try {
      const slugs = slugsKey ? slugsKey.split(',') : EMPTY_LIST;
      const ids = idsKey ? idsKey.split(',').map(Number) : EMPTY_LIST;
      const regex = patternSource ? new RegExp(patternSource, patternFlags) : null;

      // Always fetch catalog list (up to 100) so cross-category and namePattern matches are found
      const fullList = await fetchProducts({ limit: 100, forceRefresh });

      const matched = (fullList || []).filter((p) => {
        if (!p) return false;
        if (slugs.includes(p.categorySlug)) return true;
        if (ids.includes(p.categoryId)) return true;
        if (regex && (regex.test(p.category || '') || regex.test(p.name || '') || regex.test(p.categorySlug || ''))) return true;
        return false;
      });

      // Filter: Show ONLY products where admin toggled Best Seller OR New Arrival (and product is active)
      const promoOnly = matched.filter((p) => {
        const isActive = p.isActive !== false && p.raw?.isActive !== false;
        if (!isActive) return false;
        const isBest = p.isBestSeller === true || p.isBestSeller === 'true' || p.isBestSeller === 1 ||
                       p.raw?.isBestSeller === true || p.raw?.isBestSeller === 'true' || p.raw?.isBestSeller === 1;
        const isNew = p.isNewArrival === true || p.isNewArrival === 'true' || p.isNewArrival === 1 ||
                      p.raw?.isNewArrival === true || p.raw?.isNewArrival === 'true' || p.raw?.isNewArrival === 1;
        return Boolean(isBest || isNew);
      });

      setProducts(promoOnly);
      if (promoOnly.length > 0 && promoOnly[0]?.categorySlug) {
        setDynamicCtaTo(getCategoryPageLink(promoOnly[0].categorySlug));
      }
    } catch (err) {
      setError(err?.message || 'Unable to load products right now.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [slugsKey, idsKey, patternSource, patternFlags]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Gracefully hide section if category has no products or was deleted
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section id={id} className={`py-16 ${bgClass} border-b border-slate-100 `}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-1.5">
            {eyebrow && (
              <ScrollReveal direction="pop" className="inline-block">
                <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-blue-700">
                  {eyebrow}
                </span>
              </ScrollReveal>
            )}
            <AnimatedText
              as="h2"
              className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A175A] tracking-tight block"
            >
              {title}
            </AnimatedText>
            {subtitle && (
              <AnimatedText
                as="p"
                mode="words"
                delay={120}
                className="text-sm text-slate-600 max-w-2xl"
              >
                {subtitle}
              </AnimatedText>
            )}
          </div>

          {(dynamicCtaTo || ctaTo) && (
            <Link
              to={dynamicCtaTo || ctaTo}
              className="mt-2 md:mt-0 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1A175A] hover:text-blue-700 transition-colors group shrink-0"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-2.5 sm:gap-x-6 gap-y-4 sm:gap-y-8">
            {[0, 1, 2, 3].map((idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-8 text-center">
            <p className="text-sm font-semibold text-[#1A175A] mb-3">
              {error}
            </p>
            <button
              type="button"
              onClick={() => loadProducts(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A175A] text-white text-xs font-bold hover:bg-blue-900 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Loading Collection
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-10 text-center">
            <PackageOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              No active products found in this collection.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Check back soon or reach out to our institutional desk for custom orders.
            </p>
          </div>
        ) : products.length > 4 ? (
          <div className="relative group/slider">
            <div
              ref={railRef}
              onScroll={updateArrows}
              className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth py-4 -my-4 px-1 -mx-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="shrink-0 w-[calc(80%-10px)] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Left Arrow Button */}
            <button
              type="button"
              onClick={() => scrollByDirection(-1)}
              disabled={!canPrev}
              aria-label="Previous products"
              className={`absolute -left-3 sm:-left-5 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200 text-[#1A175A] shadow-xl flex items-center justify-center transition-all duration-200 ${
                canPrev
                  ? 'opacity-100 hover:bg-[#1A175A] hover:text-white hover:scale-105 active:scale-95 cursor-pointer'
                  : 'opacity-0 pointer-events-none'
              }`}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Right Arrow Button */}
            <button
              type="button"
              onClick={() => scrollByDirection(1)}
              disabled={!canNext}
              aria-label="Next products"
              className={`absolute -right-3 sm:-right-5 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200 text-[#1A175A] shadow-xl flex items-center justify-center transition-all duration-200 ${
                canNext
                  ? 'opacity-100 hover:bg-[#1A175A] hover:text-white hover:scale-105 active:scale-95 cursor-pointer'
                  : 'opacity-0 pointer-events-none'
              }`}
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        ) : (
          <ScrollReveal
            staggerChildren
            staggerMs={65}
            triggerKey={products.length}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-2.5 sm:gap-x-6 gap-y-4 sm:gap-y-8"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};

export default ProductCollectionSection;
