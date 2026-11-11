import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/SkeletonLoaders';
import {
  fetchCategoriesTree,
  fetchProducts,
  getCategoryPageLink,
  getSubcategoryPageLink,
  normalizeColorOption,
} from '../services/api';
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  PackageOpen,
  RefreshCw,
  Check,
} from 'lucide-react';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const PRICE_STEP = 50;

const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'discount', label: 'Best Discount' },
  { id: 'newest', label: 'Newest Arrivals' },
];

const normalizeSlug = (val = '') =>
  String(val || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const PriceRangeFilter = ({
  minBound,
  maxBound,
  step = PRICE_STEP,
  minVal,
  maxVal,
  hasFilter,
  onLiveChange,
  onCommit,
  onReset,
}) => {
  const trackRef = useRef(null);
  const [draggingThumb, setDraggingThumb] = useState(null);
  const [minText, setMinText] = useState(null);
  const [maxText, setMaxText] = useState(null);
  const latestRef = useRef({ minVal, maxVal });
  useEffect(() => {
    latestRef.current = { minVal, maxVal };
  }, [minVal, maxVal]);

  const span = Math.max(1, maxBound - minBound);
  const minPct = Math.max(0, Math.min(100, ((minVal - minBound) / span) * 100));
  const maxPct = Math.max(minPct, Math.min(100, ((maxVal - minBound) / span) * 100));

  const clientXToSnappedValue = useCallback(
    (clientX) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect || rect.width <= 0) return minVal;
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const raw = minBound + ratio * span;
      return Math.max(minBound, Math.min(maxBound, Math.round(raw / step) * step));
    },
    [minBound, maxBound, span, step, minVal]
  );

  useEffect(() => {
    if (!draggingThumb) return undefined;

    const handlePointerMove = (e) => {
      const val = clientXToSnappedValue(e.clientX);
      const { minVal: curMin, maxVal: curMax } = latestRef.current;
      if (draggingThumb === 'min') {
        const nextMin = Math.min(val, curMax - step);
        onLiveChange(nextMin, curMax);
      } else {
        const nextMax = Math.max(val, curMin + step);
        onLiveChange(curMin, nextMax);
      }
    };

    const handlePointerUp = () => {
      setDraggingThumb(null);
      const { minVal: curMin, maxVal: curMax } = latestRef.current;
      onCommit(curMin, curMax);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [draggingThumb, clientXToSnappedValue, step, onLiveChange, onCommit]);

  const handleTrackPointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const val = clientXToSnappedValue(e.clientX);
    const distMin = Math.abs(val - minVal);
    const distMax = Math.abs(val - maxVal);
    const target = distMin < distMax || (distMin === distMax && val < minVal) ? 'min' : 'max';

    if (target === 'min') {
      const nextMin = Math.min(val, maxVal - step);
      onLiveChange(nextMin, maxVal);
    } else {
      const nextMax = Math.max(val, minVal + step);
      onLiveChange(minVal, nextMax);
    }
    setDraggingThumb(target);
  };

  const handleThumbKeyDown = (thumb) => (e) => {
    let delta = 0;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = step;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -step;
    else if (e.key === 'PageUp') delta = step * 4;
    else if (e.key === 'PageDown') delta = -step * 4;
    else if (e.key === 'Home') {
      e.preventDefault();
      if (thumb === 'min') onCommit(minBound, maxVal);
      else onCommit(minVal, minVal + step);
      return;
    } else if (e.key === 'End') {
      e.preventDefault();
      if (thumb === 'max') onCommit(minVal, maxBound);
      else onCommit(maxVal - step, maxVal);
      return;
    } else {
      return;
    }

    e.preventDefault();
    if (thumb === 'min') {
      const nextMin = Math.max(minBound, Math.min(maxVal - step, minVal + delta));
      onCommit(nextMin, maxVal);
    } else {
      const nextMax = Math.min(maxBound, Math.max(minVal + step, maxVal + delta));
      onCommit(minVal, nextMax);
    }
  };

  const commitMinInput = () => {
    if (minText === null) return;
    const parsed = Number(minText);
    setMinText(null);
    if (!Number.isFinite(parsed)) return;
    const nextMin = Math.max(minBound, Math.min(maxVal - step, Math.round(parsed / step) * step));
    onCommit(nextMin, maxVal);
  };

  const commitMaxInput = () => {
    if (maxText === null) return;
    const parsed = Number(maxText);
    setMaxText(null);
    if (!Number.isFinite(parsed)) return;
    const nextMax = Math.min(maxBound, Math.max(minVal + step, Math.round(parsed / step) * step));
    onCommit(minVal, nextMax);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
          Price Range
        </h3>
        {hasFilter && (
          <button
            type="button"
            onClick={() => {
              setMinText(null);
              setMaxText(null);
              onReset();
            }}
            className="text-xs font-bold text-[#1A175A] hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-1.5 text-xs sm:text-[13px] font-bold text-[#1A175A]">
          <span>₹{minVal.toLocaleString()}</span>
          <span className="text-slate-400 font-medium">to</span>
          <span>₹{maxVal.toLocaleString()}</span>
        </div>

        {/* Custom Track & Dual Thumbs (pixel-exact alignment) */}
        <div className="px-2.5">
          <div
            ref={trackRef}
            onPointerDown={handleTrackPointerDown}
            className="relative h-7 flex items-center select-none touch-none cursor-pointer"
          >
            <div className="w-full h-1.5 rounded-full bg-slate-200" />
            <div
              className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-[#1A175A]"
              style={{
                left: `${minPct}%`,
                width: `${Math.max(0, maxPct - minPct)}%`,
              }}
            />

            {/* Min Thumb */}
            <button
              type="button"
              role="slider"
              aria-label="Minimum price"
              aria-valuemin={minBound}
              aria-valuemax={maxVal - step}
              aria-valuenow={minVal}
              onPointerDown={(e) => {
                e.stopPropagation();
                setDraggingThumb('min');
              }}
              onKeyDown={handleThumbKeyDown('min')}
              style={{ left: `${minPct}%` }}
              className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-white border-[3px] border-[#1A175A] shadow transition-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1A175A]/25 ${
                draggingThumb === 'min'
                  ? 'z-30 scale-[1.15] ring-4 ring-[#1A175A]/20'
                  : minPct > 85
                  ? 'z-30 hover:scale-110'
                  : 'z-10 hover:scale-110'
              }`}
            />

            {/* Max Thumb */}
            <button
              type="button"
              role="slider"
              aria-label="Maximum price"
              aria-valuemin={minVal + step}
              aria-valuemax={maxBound}
              aria-valuenow={maxVal}
              onPointerDown={(e) => {
                e.stopPropagation();
                setDraggingThumb('max');
              }}
              onKeyDown={handleThumbKeyDown('max')}
              style={{ left: `${maxPct}%` }}
              className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-white border-[3px] border-[#1A175A] shadow transition-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1A175A]/25 ${
                draggingThumb === 'max'
                  ? 'z-30 scale-[1.15] ring-4 ring-[#1A175A]/20'
                  : 'z-20 hover:scale-110'
              }`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
            <span>₹{minBound.toLocaleString()}</span>
            <span>₹{maxBound.toLocaleString()}</span>
          </div>
        </div>

        {/* Editable Min/Max Inputs */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="anr-price-min" className="block text-[11px] font-semibold text-slate-500 mb-1">
              Min (₹)
            </label>
            <input
              id="anr-price-min"
              type="text"
              inputMode="numeric"
              value={minText !== null ? minText : String(minVal)}
              onFocus={(e) => {
                setMinText(String(minVal));
                e.target.select();
              }}
              onChange={(e) => setMinText(e.target.value.replace(/[^0-9]/g, ''))}
              onBlur={commitMinInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  commitMinInput();
                  e.currentTarget.blur();
                }
              }}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-[#1A175A] focus:outline-none focus:ring-2 focus:ring-[#1A175A] focus:bg-white"
            />
          </div>
          <div>
            <label htmlFor="anr-price-max" className="block text-[11px] font-semibold text-slate-500 mb-1">
              Max (₹)
            </label>
            <input
              id="anr-price-max"
              type="text"
              inputMode="numeric"
              value={maxText !== null ? maxText : String(maxVal)}
              onFocus={(e) => {
                setMaxText(String(maxVal));
                e.target.select();
              }}
              onChange={(e) => setMaxText(e.target.value.replace(/[^0-9]/g, ''))}
              onBlur={commitMaxInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  commitMaxInput();
                  e.currentTarget.blur();
                }
              }}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-[#1A175A] focus:outline-none focus:ring-2 focus:ring-[#1A175A] focus:bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductsPage = () => {
  const { categorySlug, subCategorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [categoriesTree, setCategoriesTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [priceDraft, setPriceDraft] = useState(null);
  const priceCommitTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (priceCommitTimerRef.current) {
        clearTimeout(priceCommitTimerRef.current);
      }
    };
  }, []);

  const searchQ = searchParams.get('q') || '';
  const selectedColor = searchParams.get('color') || '';
  const selectedSize = searchParams.get('size') || '';
  const selectedSort = searchParams.get('sort') || 'featured';
  const inStockOnly = searchParams.get('stock') === '1';
  const rawMinPriceParam = searchParams.get('minPrice');
  const rawMaxPriceParam = searchParams.get('maxPrice');

  const loadData = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError('');
    try {
      const [prods, tree] = await Promise.all([
        fetchProducts({ limit: 200, forceRefresh }),
        fetchCategoriesTree(forceRefresh).catch(() => []),
      ]);
      setAllProducts(Array.isArray(prods) ? prods : []);
      setCategoriesTree(Array.isArray(tree) ? tree : []);
    } catch (err) {
      setError(err?.message || 'Unable to load product catalog right now.');
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const activeCategoryObj = useMemo(() => {
    if (!categorySlug || categorySlug === 'all') return null;
    const target = normalizeSlug(categorySlug);
    return (
      categoriesTree.find(
        (c) => normalizeSlug(c.slug) === target || normalizeSlug(c.name) === target
      ) || null
    );
  }, [categoriesTree, categorySlug]);

  const activeSubcategoryObj = useMemo(() => {
    if (!subCategorySlug) return null;
    const target = normalizeSlug(subCategorySlug);
    const pool = activeCategoryObj
      ? activeCategoryObj.subcategories || []
      : categoriesTree.flatMap((c) => c.subcategories || []);
    return (
      pool.find(
        (s) => normalizeSlug(s.slug) === target || normalizeSlug(s.name) === target
      ) || null
    );
  }, [activeCategoryObj, categoriesTree, subCategorySlug]);

  // Products scoped to active category & subcategory (for building relevant colour/size facets)
  const scopedProducts = useMemo(() => {
    return allProducts.filter((p) => {
      if (categorySlug && categorySlug !== 'all') {
        const targetCat = normalizeSlug(categorySlug);
        const prodCatSlug = normalizeSlug(p.categorySlug || p.category);
        const matchesCatId =
          activeCategoryObj?.id != null &&
          Number(p.categoryId) === Number(activeCategoryObj.id);
        const matchesSlug =
          prodCatSlug === targetCat ||
          (activeCategoryObj &&
            (prodCatSlug === normalizeSlug(activeCategoryObj.slug) ||
              normalizeSlug(p.category) === normalizeSlug(activeCategoryObj.name)));
        if (!matchesCatId && !matchesSlug) return false;
      }

      if (subCategorySlug) {
        const targetSub = normalizeSlug(subCategorySlug);
        const prodSubSlug = normalizeSlug(p.subCategorySlug || p.subCategory);
        const matchesSubId =
          activeSubcategoryObj?.id != null &&
          Number(p.subCategoryId) === Number(activeSubcategoryObj.id);
        const matchesSubSlug =
          prodSubSlug === targetSub ||
          (activeSubcategoryObj &&
            (prodSubSlug === normalizeSlug(activeSubcategoryObj.slug) ||
              normalizeSlug(p.subCategory) === normalizeSlug(activeSubcategoryObj.name)));
        if (!matchesSubId && !matchesSubSlug) return false;
      }

      return true;
    });
  }, [allProducts, categorySlug, subCategorySlug, activeCategoryObj, activeSubcategoryObj]);

  // Aggregate unique Admin color swatches present across scoped products (or full catalog)
  const availableColors = useMemo(() => {
    const source = scopedProducts.length > 0 ? scopedProducts : allProducts;
    const map = new Map();
    source.forEach((p) => {
      (p.colors || []).forEach((raw) => {
        const opt = normalizeColorOption(raw);
        if (!opt || !opt.name) return;
        const key = opt.name.toLowerCase();
        if (!map.has(key)) {
          map.set(key, opt);
        }
      });
    });
    return Array.from(map.values());
  }, [scopedProducts, allProducts]);

  // Dynamic catalog price boundaries rounded to ₹50 steps
  const priceBounds = useMemo(() => {
    const prices = allProducts
      .map((p) => Number(p?.price))
      .filter((n) => Number.isFinite(n) && n >= 0);
    if (prices.length === 0) {
      return { min: 0, max: 5000 };
    }
    const rawMin = Math.min(...prices);
    const rawMax = Math.max(...prices);
    const min = Math.max(0, Math.floor(rawMin / PRICE_STEP) * PRICE_STEP);
    const max = Math.max(min + 200, Math.ceil(rawMax / PRICE_STEP) * PRICE_STEP);
    return { min, max };
  }, [allProducts]);

  const parsedMinPrice =
    rawMinPriceParam !== null && rawMinPriceParam !== '' && Number.isFinite(Number(rawMinPriceParam))
      ? Math.max(priceBounds.min, Math.min(Number(rawMinPriceParam), priceBounds.max - PRICE_STEP))
      : priceBounds.min;
  const parsedMaxPrice =
    rawMaxPriceParam !== null && rawMaxPriceParam !== '' && Number.isFinite(Number(rawMaxPriceParam))
      ? Math.min(priceBounds.max, Math.max(Number(rawMaxPriceParam), priceBounds.min + PRICE_STEP))
      : priceBounds.max;

  const urlMinPrice = Math.min(parsedMinPrice, parsedMaxPrice - PRICE_STEP);
  const urlMaxPrice = Math.max(parsedMaxPrice, urlMinPrice + PRICE_STEP);

  const sliderMinPrice = priceDraft ? priceDraft[0] : urlMinPrice;
  const sliderMaxPrice = priceDraft ? priceDraft[1] : urlMaxPrice;
  const hasPriceFilter = sliderMinPrice > priceBounds.min || sliderMaxPrice < priceBounds.max;

  // Apply search, colour, size, price, stock filters & sorting
  const filteredProducts = useMemo(() => {
    const q = searchQ.trim().toLowerCase();
    const colorQ = selectedColor.trim().toLowerCase();
    const sizeQ = selectedSize.trim().toUpperCase();

    const list = scopedProducts.filter((p) => {
      if (q) {
        const haystack = [
          p.name,
          p.category,
          p.subCategory,
          p.sku,
          p.shortDescription,
          p.description,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      if (colorQ) {
        const hasColor = (p.colors || []).some((raw) => {
          const opt = normalizeColorOption(raw);
          return (
            opt?.name?.toLowerCase() === colorQ ||
            opt?.name?.toLowerCase().includes(colorQ) ||
            opt?.hex?.toLowerCase() === colorQ
          );
        });
        if (!hasColor) return false;
      }

      if (sizeQ) {
        const hasSize =
          (p.sizes || []).some((s) => String(s).toUpperCase() === sizeQ) ||
          (p.variants || []).some(
            (v) =>
              String(v?.attributes?.Size || v?.attributes?.size || '').toUpperCase() === sizeQ
          );
        if (!hasSize) return false;
      }

      if (hasPriceFilter) {
        const itemPrice = Number(p.price || 0);
        if (itemPrice < sliderMinPrice || itemPrice > sliderMaxPrice) {
          return false;
        }
      }

      if (inStockOnly && Number(p.stock) <= 0) {
        return false;
      }

      return true;
    });

    const sorted = [...list];
    switch (selectedSort) {
      case 'price-asc':
        sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        break;
      case 'price-desc':
        sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        break;
      case 'rating':
        sorted.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
        break;
      case 'discount':
        sorted.sort((a, b) => Number(b.discountPercent || 0) - Number(a.discountPercent || 0));
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        break;
    }

    return sorted;
  }, [
    scopedProducts,
    searchQ,
    selectedColor,
    selectedSize,
    inStockOnly,
    selectedSort,
    hasPriceFilter,
    sliderMinPrice,
    sliderMaxPrice,
  ]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next, { replace: true });
  };

  const commitPriceParams = useCallback(
    (nextMin, nextMax) => {
      if (priceCommitTimerRef.current) {
        clearTimeout(priceCommitTimerRef.current);
        priceCommitTimerRef.current = null;
      }
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (nextMin > priceBounds.min) {
            next.set('minPrice', String(nextMin));
          } else {
            next.delete('minPrice');
          }
          if (nextMax < priceBounds.max) {
            next.set('maxPrice', String(nextMax));
          } else {
            next.delete('maxPrice');
          }
          return next;
        },
        { replace: true }
      );
      setPriceDraft(null);
    },
    [priceBounds.min, priceBounds.max, setSearchParams]
  );

  const handlePriceRangeChange = useCallback(
    (nextMin, nextMax) => {
      const clampedMin = Math.max(priceBounds.min, Math.min(nextMin, priceBounds.max - PRICE_STEP));
      const clampedMax = Math.min(priceBounds.max, Math.max(nextMax, clampedMin + PRICE_STEP));
      setPriceDraft([clampedMin, clampedMax]);
    },
    [priceBounds.min, priceBounds.max]
  );

  const resetPriceFilter = () => {
    if (priceCommitTimerRef.current) {
      clearTimeout(priceCommitTimerRef.current);
      priceCommitTimerRef.current = null;
    }
    setPriceDraft(null);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('minPrice');
        next.delete('maxPrice');
        return next;
      },
      { replace: true }
    );
  };

  const clearAllFilters = () => {
    if (priceCommitTimerRef.current) {
      clearTimeout(priceCommitTimerRef.current);
      priceCommitTimerRef.current = null;
    }
    setPriceDraft(null);
    setSearchParams({}, { replace: true });
    if (categorySlug || subCategorySlug) {
      navigate('/products');
    }
  };

  const resetFacetFilters = () => {
    if (priceCommitTimerRef.current) {
      clearTimeout(priceCommitTimerRef.current);
      priceCommitTimerRef.current = null;
    }
    setPriceDraft(null);
    setSearchParams({}, { replace: true });
  };

  const activeCategoryName =
    activeCategoryObj?.name ||
    (categorySlug && categorySlug !== 'all'
      ? categorySlug
          .split('-')
          .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ''))
          .join(' ')
      : 'All Medical Apparel');

  const activeSubcategoryName =
    activeSubcategoryObj?.name ||
    (subCategorySlug
      ? subCategorySlug
          .split('-')
          .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ''))
          .join(' ')
      : '');

  const pageTitle = activeSubcategoryName || activeCategoryName;

  const hasFacetFilters = Boolean(searchQ || selectedColor || selectedSize || inStockOnly || hasPriceFilter);

  const filterSidebarContent = (
    <div className="space-y-4">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-2.5">
          Categories
        </h3>
        <div className="space-y-1">
          <Link
            to="/products"
            onClick={() => setMobileFiltersOpen(false)}
            className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-[15px] font-semibold leading-snug transition-colors ${
              !categorySlug || categorySlug === 'all'
                ? 'bg-[#1A175A] text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>All Medical Apparel</span>
            <span className="text-xs font-bold opacity-80">{allProducts.length}</span>
          </Link>
          {categoriesTree.map((cat) => {
            const isCatActive =
              categorySlug && normalizeSlug(categorySlug) === normalizeSlug(cat.slug);
            return (
              <div key={cat.id || cat.slug} className="space-y-1">
                <Link
                  to={getCategoryPageLink(cat.slug)}
                  onClick={() => setMobileFiltersOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-[15px] font-semibold leading-snug transition-colors ${
                    isCatActive && !subCategorySlug
                      ? 'bg-[#1A175A] text-white'
                      : isCatActive
                      ? 'bg-blue-50 text-[#1A175A]'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                </Link>

                {isCatActive && Array.isArray(cat.subcategories) && cat.subcategories.length > 0 && (
                  <div className="pl-3 ml-3 border-l-2 border-slate-200 space-y-1 py-0.5">
                    {cat.subcategories.map((sub) => {
                      const isSubActive =
                        subCategorySlug &&
                        normalizeSlug(subCategorySlug) === normalizeSlug(sub.slug);
                      return (
                        <Link
                          key={sub.id || sub.slug}
                          to={getSubcategoryPageLink(cat.slug, sub.slug)}
                          onClick={() => setMobileFiltersOpen(false)}
                          className={`block px-3 py-1.5 rounded-lg text-sm font-medium leading-snug transition-colors ${
                            isSubActive
                              ? 'bg-[#1A175A] text-white'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-[#1A175A]'
                          }`}
                        >
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="pt-4 border-t border-slate-200">
        <PriceRangeFilter
          minBound={priceBounds.min}
          maxBound={priceBounds.max}
          step={PRICE_STEP}
          minVal={sliderMinPrice}
          maxVal={sliderMaxPrice}
          hasFilter={hasPriceFilter}
          onLiveChange={(nextMin, nextMax) => handlePriceRangeChange(nextMin, nextMax, false)}
          onCommit={(nextMin, nextMax) => commitPriceParams(nextMin, nextMax)}
          onReset={resetPriceFilter}
        />
      </div>

      {/* Colour Filter */}
      {availableColors.length > 0 && (
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
              Colour
            </h3>
            {selectedColor && (
              <button
                type="button"
                onClick={() => updateParam('color', '')}
                className="text-xs font-bold text-[#1A175A] hover:underline"
              >
                Reset
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((col) => {
              const active = selectedColor.toLowerCase() === col.name.toLowerCase();
              return (
                <button
                  key={`${col.name}-${col.hex}`}
                  type="button"
                  onClick={() => updateParam('color', active ? '' : col.name)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    active
                      ? 'border-[#1A175A] bg-[#1A175A] text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-[#1A175A]'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-slate-300 flex-shrink-0"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span>{col.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Filter */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
            Size
          </h3>
          {selectedSize && (
            <button
              type="button"
              onClick={() => updateParam('size', '')}
              className="text-xs font-bold text-[#1A175A] hover:underline"
            >
              Reset
            </button>
          )}
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {SIZES.map((sz) => {
            const active = selectedSize.toUpperCase() === sz;
            return (
              <button
                key={sz}
                type="button"
                onClick={() => updateParam('size', active ? '' : sz)}
                className={`py-2 rounded-lg text-xs sm:text-[13px] font-bold border transition-colors ${
                  active
                    ? 'bg-[#1A175A] border-[#1A175A] text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-[#1A175A]'
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div className="pt-4 border-t border-slate-200">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm font-bold text-slate-800">In Stock Only</span>
          <button
            type="button"
            role="switch"
            aria-checked={inStockOnly}
            onClick={() => updateParam('stock', inStockOnly ? '' : '1')}
            className={`w-10 h-5 rounded-full transition-colors p-0.5 flex items-center ${
              inStockOnly ? 'bg-[#1A175A] justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white shadow-sm block" />
          </button>
        </label>
      </div>
    </div>
  );

  return (
    <Layout>
      {/* Clean & Simple Catalog Header */}
      <section className="bg-white border-b border-slate-200 py-4 sm:py-5">
        <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 xl:px-8 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A175A]">
              {pageTitle}
            </h1>
            <span className="text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-full">
              Showing <strong className="text-[#1A175A]">{filteredProducts.length}</strong>{' '}
              {filteredProducts.length === 1 ? 'garment' : 'garments'}
            </span>
          </div>

          {categoriesTree.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
              <Link
                to="/products"
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                  !categorySlug || categorySlug === 'all'
                    ? 'bg-[#1A175A] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Collections
              </Link>
              {activeCategoryObj && Array.isArray(activeCategoryObj.subcategories) && activeCategoryObj.subcategories.length > 0
                ? activeCategoryObj.subcategories.map((sub) => {
                    const active =
                      subCategorySlug &&
                      normalizeSlug(subCategorySlug) === normalizeSlug(sub.slug);
                    return (
                      <Link
                        key={sub.id || sub.slug}
                        to={getSubcategoryPageLink(activeCategoryObj.slug, sub.slug)}
                        className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                          active
                            ? 'bg-[#1A175A] text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {sub.name}
                      </Link>
                    );
                  })
                : categoriesTree.map((cat) => {
                    const active =
                      categorySlug && normalizeSlug(categorySlug) === normalizeSlug(cat.slug);
                    return (
                      <Link
                        key={cat.id || cat.slug}
                        to={getCategoryPageLink(cat.slug)}
                        className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                          active
                            ? 'bg-[#1A175A] text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {cat.name}
                      </Link>
                    );
                  })}
            </div>
          )}
        </div>
      </section>

      {/* Main Catalog Body */}
      <section className="py-5 sm:py-6 bg-slate-50 min-h-[65vh]">
        <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 xl:px-8">
          <div className="flex flex-col lg:flex-row gap-5 xl:gap-6 items-start">
            {/* Desktop Filter Sidebar (sticky with internal scroll so it stays usable down to the last product) */}
            <aside className="hidden lg:block w-[252px] xl:w-[272px] flex-shrink-0 sticky top-[84px]">
              <div className="max-h-[calc(100vh-100px)] overflow-y-auto overscroll-contain bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
                {filterSidebarContent}
              </div>
            </aside>

            {/* Right Catalog Area */}
            <div className="flex-1 min-w-0 space-y-5">
              {/* Search + Sort + Mobile Filters Toolbar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQ}
                    onChange={(e) => updateParam('q', e.target.value)}
                    placeholder="Filter by product name, fabric, SKU..."
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1A175A] focus:bg-white"
                  />
                  {searchQ && (
                    <button
                      type="button"
                      onClick={() => updateParam('q', '')}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-bold text-slate-800 hover:border-[#1A175A]"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-[#1A175A]" />
                    <span>Filters</span>
                  </button>

                  <div className="relative flex items-center flex-1 sm:flex-initial">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                    <select
                      value={selectedSort}
                      onChange={(e) =>
                        updateParam('sort', e.target.value === 'featured' ? '' : e.target.value)
                      }
                      aria-label="Sort products"
                      className="w-full sm:w-auto pl-8 pr-7 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          Sort: {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Active Filters Strip */}
              {hasFacetFilters && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Active Filters:
                  </span>
                  {searchQ && (
                    <button
                      type="button"
                      onClick={() => updateParam('q', '')}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-rose-300"
                    >
                      <span>Search: "{searchQ}"</span>
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  {hasPriceFilter && (
                    <button
                      type="button"
                      onClick={resetPriceFilter}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-rose-300"
                    >
                      <span>Price: ₹{sliderMinPrice.toLocaleString()} – ₹{sliderMaxPrice.toLocaleString()}</span>
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  {selectedColor && (
                    <button
                      type="button"
                      onClick={() => updateParam('color', '')}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-rose-300"
                    >
                      <span>Colour: {selectedColor}</span>
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  {selectedSize && (
                    <button
                      type="button"
                      onClick={() => updateParam('size', '')}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-rose-300"
                    >
                      <span>Size: {selectedSize}</span>
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  {inStockOnly && (
                    <button
                      type="button"
                      onClick={() => updateParam('stock', '')}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700"
                    >
                      <Check className="w-3 h-3" />
                      <span>In Stock Only</span>
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={resetFacetFilters}
                    className="text-xs sm:text-[13px] font-bold text-[#1A175A] hover:underline ml-1"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Product Grid / States */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : error ? (
                <div className="bg-white rounded-3xl border border-rose-200 p-10 text-center space-y-4">
                  <p className="text-sm font-semibold text-slate-800">{error}</p>
                  <button
                    type="button"
                    onClick={() => loadData(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A175A] text-white text-xs font-bold hover:bg-[#141247]"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry Loading Catalog
                  </button>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-14 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <PackageOpen className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h2 className="text-lg font-black text-slate-900">
                      No matching medical garments found
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                      Try adjusting your active price range, colour, size, or search filters, or browse all collections.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    {hasFacetFilters && (
                      <button
                        type="button"
                        onClick={resetFacetFilters}
                        className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 hover:border-[#1A175A]"
                      >
                        Reset Filters
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="px-6 py-2.5 rounded-xl bg-[#1A175A] text-white text-xs font-bold hover:bg-[#141247] shadow-sm"
                    >
                      View All Apparel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl p-5 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                <h2 className="text-sm font-black uppercase tracking-wider text-[#1A175A]">
                  Filter Catalog
                </h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  aria-label="Close filters"
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterSidebarContent}
            </div>

            <div className="pt-5 mt-6 border-t border-slate-200 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  resetFacetFilters();
                  setMobileFiltersOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#1A175A] text-white text-xs font-bold"
              >
                Show ({filteredProducts.length})
              </button>
            </div>
          </aside>
        </div>
      )}
    </Layout>
  );
};

export default ProductsPage;
