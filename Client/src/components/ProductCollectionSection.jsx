import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PackageOpen, RefreshCw } from 'lucide-react';
import { fetchProducts } from '../services/api';
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

  const primarySlug = categorySlugs.length === 1 ? categorySlugs[0] : undefined;
  const slugsKey = categorySlugs.join(',');
  const idsKey = categoryIds.join(',');
  const patternSource = namePattern ? namePattern.source : '';
  const patternFlags = namePattern ? namePattern.flags : '';

  const loadProducts = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError('');
    try {
      const list = await fetchProducts(
        primarySlug ? { category: primarySlug, limit, forceRefresh } : { limit: 100, forceRefresh }
      );
      const slugs = slugsKey ? slugsKey.split(',') : EMPTY_LIST;
      const ids = idsKey ? idsKey.split(',').map(Number) : EMPTY_LIST;
      const regex = patternSource ? new RegExp(patternSource, patternFlags) : null;

      const filtered = primarySlug
        ? list
        : list.filter((p) => {
            if (slugs.includes(p.categorySlug)) return true;
            if (ids.includes(p.categoryId)) return true;
            return regex ? regex.test(p.category || p.name || '') : false;
          });
      setProducts(filtered);
    } catch (err) {
      setError(err?.message || 'Unable to load products right now.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [primarySlug, limit, slugsKey, idsKey, patternSource, patternFlags]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <section id={id} className={`py-16 ${bgClass} border-b border-slate-100 `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {ctaTo && (
            <Link
              to={ctaTo}
              className="mt-2 md:mt-0 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1A175A] hover:text-blue-700 transition-colors group shrink-0"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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
