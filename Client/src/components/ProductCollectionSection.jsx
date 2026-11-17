import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PackageOpen, RefreshCw } from 'lucide-react';
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

  const slugsKey = categorySlugs.join(',');
  const idsKey = categoryIds.join(',');
  const patternSource = namePattern ? namePattern.source : '';
  const patternFlags = namePattern ? namePattern.flags : '';

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

      let list = [];
      const primary = slugs[0];
      if (primary) {
        try {
          const direct = await fetchProducts({ category: primary, limit, forceRefresh });
          if (Array.isArray(direct) && direct.length > 0) {
            list = direct;
          }
        } catch {
          // fallback to catalog below
        }
      }

      if (!list || list.length === 0) {
        const fullList = await fetchProducts({ limit: 100, forceRefresh });
        list = (fullList || []).filter((p) => {
          if (slugs.includes(p.categorySlug)) return true;
          if (ids.includes(p.categoryId)) return true;
          if (regex && (regex.test(p.category || '') || regex.test(p.name || '') || regex.test(p.categorySlug || ''))) return true;
          return false;
        });
      }

      setProducts(list.slice(0, limit));
      if (list.length > 0 && list[0]?.categorySlug) {
        setDynamicCtaTo(getCategoryPageLink(list[0].categorySlug));
      }
    } catch (err) {
      setError(err?.message || 'Unable to load products right now.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [limit, slugsKey, idsKey, patternSource, patternFlags]);

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
