import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
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
  ChevronDown,
  ChevronRight,
  PackageOpen,
  RefreshCw,
  LayoutGrid,
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

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const HEADING = 'text-sm font-bold uppercase tracking-[0.15em] text-slate-600';

/* ------------------------------------------------------------------ */
/* Category rail: category pills (with photo) + subcategory pills      */
/* ------------------------------------------------------------------ */
const CategoryRail = ({ tree, counts, activeCategory, activeSubSlug, loading }) => {
  const activeRef = useRef(null);

  // keep the active pill visible on small screens
  useEffect(() => {
    if (!activeCategory) return;
    activeRef.current?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [activeCategory?.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const pill = (active) =>
    `flex min-h-12 shrink-0 snap-start items-center gap-2.5 rounded-full border py-1.5 pr-4 pl-1.5 text-[15px] font-medium whitespace-nowrap transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A175A] focus-visible:ring-offset-2 ${
      active
        ? 'border-[#1A175A] bg-[#1A175A] text-white'
        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
    }`;

  const subs = activeCategory?.subcategories || [];
  const subItems = activeCategory
    ? [
        { slug: '', name: `All ${activeCategory.name}`, count: counts.cat[activeCategory.slug] ?? 0 },
        ...subs.map((s) => ({ ...s, count: counts.sub[`${activeCategory.slug}/${s.slug}`] ?? 0 })),
      ]
    : [];

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 xl:px-8">
        <nav
          aria-label="Categories"
          className="-mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 py-4 scrollbar-none sm:mx-0 sm:scroll-px-0 sm:px-0"
        >
          <Link
            to="/products"
            ref={!activeCategory ? activeRef : undefined}
            aria-current={!activeCategory ? 'page' : undefined}
            className={pill(!activeCategory)}
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                !activeCategory ? 'bg-white/15' : 'bg-slate-100'
              }`}
            >
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
            </span>
            All
          </Link>

          {loading && tree.length === 0 &&
            [0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="h-12 w-36 shrink-0 animate-pulse rounded-full bg-slate-100" />
            ))}

          {tree.map((cat) => {
            const active = activeCategory && normalizeSlug(activeCategory.slug) === normalizeSlug(cat.slug);
            return (
              <Link
                key={cat.id || cat.slug}
                to={getCategoryPageLink(cat.slug)}
                ref={active ? activeRef : undefined}
                aria-current={active ? 'page' : undefined}
                className={pill(active)}
              >
                <ProductImage
                  src={cat.image}
                  alt=""
                  containerClassName="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-slate-100"
                  className="h-9 w-9 rounded-full object-cover"
                  iconClassName="h-4 w-4 text-slate-400"
                />
                {cat.name}
              </Link>
            );
          })}
        </nav>

        {subItems.length > 1 && (
          <nav
            aria-label={`${activeCategory.name} types`}
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-4 scrollbar-none sm:mx-0 sm:px-0"
          >
            {subItems.map((s) => {
              const active = activeSubSlug ? normalizeSlug(activeSubSlug) === normalizeSlug(s.slug) : !s.slug;
              return (
                <Link
                  key={s.slug || 'all'}
                  to={s.slug ? getSubcategoryPageLink(activeCategory.slug, s.slug) : getCategoryPageLink(activeCategory.slug)}
                  aria-current={active ? 'page' : undefined}
                  className={`min-h-10 shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A175A] ${
                    active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {s.name}
                  <span className={`tabular-nums ${active ? 'text-white/70' : 'text-slate-400'}`}>{s.count}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Filter building blocks (same look as the reference)                 */
/* ------------------------------------------------------------------ */
const Option = ({ active, onClick, children, count, swatch }) => {
  const light = swatch && ['#ffffff', '#fff'].includes(String(swatch).toLowerCase());
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className="group flex min-h-10 w-full items-center gap-3 rounded-lg text-left text-[15px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A175A]"
    >
      <span
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
          active ? 'border-[#1A175A] bg-[#1A175A]' : 'border-slate-300 bg-white group-hover:border-slate-500'
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full bg-white transition-transform duration-200 ${active ? 'scale-100' : 'scale-0'}`} />
      </span>
      {swatch && (
        <span
          className="h-4 w-4 shrink-0 rounded-full"
          style={{
            backgroundColor: swatch,
            boxShadow: light ? 'inset 0 0 0 1px #cbd5e1' : 'inset 0 0 0 1px rgba(0,0,0,0.1)',
          }}
        />
      )}
      <span
        className={`flex-1 truncate transition-colors ${
          active ? 'font-semibold text-slate-900' : 'text-slate-700 group-hover:text-slate-900'
        }`}
      >
        {children}
      </span>
      {count !== undefined && <span className="text-xs tabular-nums text-slate-400">{count}</span>}
    </button>
  );
};

const FilterGroup = ({ title, onReset, children }) => (
  <section className="border-b border-slate-200 py-5 first:pt-0 last:border-b-0 last:pb-0">
    <div className="mb-2 flex items-center justify-between">
      <h3 className={HEADING}>{title}</h3>
      {onReset && (
        <button type="button" onClick={onReset} className="text-sm font-semibold text-[#1A175A] hover:underline cursor-pointer">
          Reset
        </button>
      )}
    </div>
    {children}
  </section>
);

/* ------------------------------------------------------------------ */
/* Price: radio bands + dual-handle slider + custom min / max          */
/* ------------------------------------------------------------------ */
const THUMB = 28; // px, must match the CSS below

const PriceFilter = ({ minBound, maxBound, step = PRICE_STEP, minVal, maxVal, onLive, onCommit, onReset }) => {
  const hasFilter = minVal > minBound || maxVal < maxBound;
  const span = Math.max(1, maxBound - minBound);
  const pctMin = ((minVal - minBound) / span) * 100;
  const pctMax = ((maxVal - minBound) / span) * 100;
  const pos = (p) => `calc(${p}% + ${THUMB / 2 - (p / 100) * THUMB}px)`;
  const minOnTop = pctMin > 90;

  const [minText, setMinText] = useState(String(minVal));
  const [maxText, setMaxText] = useState(String(maxVal));
  useEffect(() => {
    setMinText(String(minVal));
    setMaxText(String(maxVal));
  }, [minVal, maxVal]);

  const bands = useMemo(() => {
    const round = (v) => Math.round(v / 100) * 100;
    const q = (maxBound - minBound) / 4;
    const edges = [minBound, round(minBound + q), round(minBound + 2 * q), round(minBound + 3 * q), maxBound].filter(
      (v, i, arr) => i === 0 || v > arr[i - 1]
    );
    const out = [];
    for (let i = 0; i < edges.length - 1; i += 1) {
      const lo = edges[i];
      const hi = edges[i + 1];
      let label = `${inr(lo)} – ${inr(hi)}`;
      if (i === 0) label = `Under ${inr(hi)}`;
      else if (i === edges.length - 2) label = `${inr(lo)} & above`;
      out.push({ lo, hi, label });
    }
    return edges.length >= 3 ? out : [];
  }, [minBound, maxBound]);

  const commit = () => onCommit(minVal, maxVal);

  const applyText = (e) => {
    e.preventDefault();
    let lo = Number(minText);
    let hi = Number(maxText);
    if (!Number.isFinite(lo)) lo = minBound;
    if (!Number.isFinite(hi)) hi = maxBound;
    lo = Math.max(minBound, Math.min(lo, maxBound - step));
    hi = Math.min(maxBound, Math.max(hi, lo + step));
    onCommit(lo, hi);
  };

  const numInput =
    'h-10 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 text-sm tabular-nums text-slate-900 placeholder-slate-400 hover:border-slate-400 focus:border-[#1A175A] focus:outline-none focus:ring-2 focus:ring-[#1A175A]/20 transition-colors';

  return (
    <FilterGroup title="Price" onReset={hasFilter ? onReset : null}>
      <style>{`
        .anr-range{position:absolute;inset:0;width:100%;height:100%;margin:0;background:transparent;pointer-events:none;-webkit-appearance:none;appearance:none;outline:none}
        .anr-range::-webkit-slider-runnable-track{background:transparent;height:${THUMB}px}
        .anr-range::-moz-range-track{background:transparent;height:${THUMB}px}
        .anr-range::-webkit-slider-thumb{pointer-events:auto;-webkit-appearance:none;appearance:none;width:${THUMB}px;height:${THUMB}px;border-radius:9999px;background:#fff;border:4px solid #1A175A;box-shadow:0 2px 8px rgba(26,23,90,.35);cursor:grab;transition:transform .15s}
        .anr-range::-moz-range-thumb{pointer-events:auto;width:${THUMB - 8}px;height:${THUMB - 8}px;border-radius:9999px;background:#fff;border:4px solid #1A175A;box-shadow:0 2px 8px rgba(26,23,90,.35);cursor:grab}
        .anr-range:active::-webkit-slider-thumb{cursor:grabbing;transform:scale(1.1)}
        .anr-range:focus-visible::-webkit-slider-thumb{box-shadow:0 0 0 5px rgba(26,23,90,.25)}
        .anr-range:focus-visible::-moz-range-thumb{box-shadow:0 0 0 5px rgba(26,23,90,.25)}
      `}</style>

      <div role="radiogroup" aria-label="Price range">
        <Option active={!hasFilter} onClick={onReset}>Any price</Option>
        {bands.map((b) => (
          <Option key={b.label} active={minVal === b.lo && maxVal === b.hi} onClick={() => onCommit(b.lo, b.hi)}>
            {b.label}
          </Option>
        ))}
      </div>

      <p className="mt-4 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Custom range</p>

      <div className="relative mx-0.5" style={{ height: THUMB }}>
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-slate-200" />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full bg-[#1A175A]"
          style={{ left: pos(pctMin), width: `calc(${pos(pctMax)} - ${pos(pctMin)})` }}
        />
        <input
          type="range"
          className="anr-range"
          style={{ zIndex: minOnTop ? 4 : 3 }}
          min={minBound}
          max={maxBound}
          step={step}
          value={minVal}
          aria-label="Minimum price"
          onChange={(e) => onLive(Math.min(Number(e.target.value), maxVal - step), maxVal)}
          onPointerUp={commit}
          onKeyUp={commit}
          onBlur={commit}
        />
        <input
          type="range"
          className="anr-range"
          style={{ zIndex: 3 }}
          min={minBound}
          max={maxBound}
          step={step}
          value={maxVal}
          aria-label="Maximum price"
          onChange={(e) => onLive(minVal, Math.max(Number(e.target.value), minVal + step))}
          onPointerUp={commit}
          onKeyUp={commit}
          onBlur={commit}
        />
      </div>

      <form onSubmit={applyText} className="mt-4 flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          min={minBound}
          max={maxBound}
          value={minText}
          onChange={(e) => setMinText(e.target.value)}
          aria-label="Minimum price in rupees"
          placeholder={`₹${minBound}`}
          className={numInput}
        />
        <span className="text-slate-300" aria-hidden="true">–</span>
        <input
          type="number"
          inputMode="numeric"
          min={minBound}
          max={maxBound}
          value={maxText}
          onChange={(e) => setMaxText(e.target.value)}
          aria-label="Maximum price in rupees"
          placeholder={`₹${maxBound}`}
          className={numInput}
        />
        <button
          type="submit"
          className="h-10 shrink-0 rounded-lg border border-slate-300 px-3.5 text-sm font-semibold text-slate-800 hover:border-[#1A175A] cursor-pointer transition-colors"
        >
          Go
        </button>
      </form>
    </FilterGroup>
  );
};

const ColourFilter = ({ colours, selected, onSelect }) => (
  <FilterGroup title="Colour" onReset={selected ? () => onSelect('') : null}>
    <div role="radiogroup" aria-label="Colour" className="max-h-72 overflow-y-auto pr-1">
      <Option active={!selected} onClick={() => onSelect('')}>All colours</Option>
      {colours.map((col) => (
        <Option
          key={`${col.name}-${col.hex}`}
          active={selected.toLowerCase() === col.name.toLowerCase()}
          onClick={() => onSelect(col.name)}
          swatch={col.hex}
        >
          {col.name}
        </Option>
      ))}
    </div>
  </FilterGroup>
);

const SizeFilter = ({ selected, onSelect }) => (
  <FilterGroup title="Size" onReset={selected ? () => onSelect('') : null}>
    <div className="grid grid-cols-4 gap-2 pt-1">
      {SIZES.map((sz) => {
        const active = selected.toUpperCase() === sz;
        return (
          <button
            key={sz}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(active ? '' : sz)}
            className={`py-3 rounded-lg text-sm font-semibold border cursor-pointer transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A175A] ${
              active ? 'bg-[#1A175A] border-[#1A175A] text-white' : 'bg-white border-slate-200 text-slate-700 hover:border-[#1A175A]'
            }`}
          >
            {sz}
          </button>
        );
      })}
    </div>
  </FilterGroup>
);

/* ------------------------------------------------------------------ */
/* Search with live, informative suggestions                           */
/* ------------------------------------------------------------------ */
const highlight = (text, q) => {
  const str = String(text || '');
  if (!q) return str;
  const i = str.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return str;
  return (
    <>
      {str.slice(0, i)}
      <mark className="bg-amber-100 text-inherit rounded-sm px-0.5">{str.slice(i, i + q.length)}</mark>
      {str.slice(i + q.length)}
    </>
  );
};

const SearchBox = ({ value, onChange, products, ideas }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const q = value.trim();

  const allMatches = useMemo(() => {
    if (!q) return [];
    const lq = q.toLowerCase();
    return products.filter((p) =>
      [p.name, p.category, p.subCategory, p.sku].filter(Boolean).join(' ').toLowerCase().includes(lq)
    );
  }, [products, q]);
  const matches = allMatches.slice(0, 5);

  useEffect(() => {
    setCursor(-1);
  }, [q]);

  // Close on outside click
  useEffect(() => {
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  // Press "/" anywhere to jump to search
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target?.tagName || '').toLowerCase();
      if (e.key === '/' && tag !== 'input' && tag !== 'textarea' && tag !== 'select') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const goTo = (p) => {
    setOpen(false);
    navigate(`/product/${p.slug || p.id}`);
  };

  const onKeyDown = (e) => {
    if (e.nativeEvent && e.nativeEvent.isComposing) return;
    if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'ArrowDown' && matches.length) {
      e.preventDefault();
      setOpen(true);
      setCursor((c) => (c + 1) % matches.length);
    } else if (e.key === 'ArrowUp' && matches.length) {
      e.preventDefault();
      setCursor((c) => (c <= 0 ? matches.length - 1 : c - 1));
    } else if (e.key === 'Enter') {
      if (cursor >= 0 && matches[cursor]) {
        e.preventDefault();
        goTo(matches[cursor]);
      } else {
        setOpen(false);
      }
    }
  };

  return (
    <div ref={wrapRef} className="relative w-full">
      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls="anr-search-list"
        aria-label="Search garments"
        autoComplete="off"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Search scrubs, lab coats, colours…"
        className="w-full h-11 pl-10 pr-14 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 hover:border-slate-400 focus:border-[#1A175A] focus:outline-none focus:ring-2 focus:ring-[#1A175A]/20 transition-colors"
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            onChange('');
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      ) : (
        <kbd className="hidden sm:block absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-400">
          /
        </kbd>
      )}

      {open && (
        <div
          id="anr-search-list"
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 z-30 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-900/5 overflow-hidden"
        >
          {!q ? (
            <div className="p-4">
              <p className={HEADING}>Popular searches</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ideas.map((idea) => (
                  <button
                    key={idea}
                    type="button"
                    onClick={() => {
                      onChange(idea);
                      inputRef.current?.focus();
                    }}
                    className="px-3 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-700 hover:border-[#1A175A] hover:text-[#1A175A] cursor-pointer transition-colors"
                  >
                    {idea}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-400">
                Search by name, fabric, colour or SKU. Press <kbd className="px-1 rounded border border-slate-200 bg-slate-50 font-semibold">/</kbd> anytime to search.
              </p>
            </div>
          ) : matches.length === 0 ? (
            <div className="p-4">
              <p className="text-sm font-semibold text-slate-800">No garments found for “{q}”</p>
              <p className="mt-1 text-xs text-slate-500">Check the spelling, or try one of these:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ideas.map((idea) => (
                  <button
                    key={idea}
                    type="button"
                    onClick={() => onChange(idea)}
                    className="px-3 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-700 hover:border-[#1A175A] hover:text-[#1A175A] cursor-pointer transition-colors"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <p className="px-4 pt-3 pb-2 text-xs text-slate-500">
                <span className="font-bold text-[#1A175A]">{allMatches.length}</span>{' '}
                {allMatches.length === 1 ? 'garment matches' : 'garments match'} “{q}”
              </p>
              <ul>
                {matches.map((p, i) => (
                  <li key={p.id} role="option" aria-selected={cursor === i}>
                    <button
                      type="button"
                      onClick={() => goTo(p)}
                      onMouseEnter={() => setCursor(i)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left cursor-pointer transition-colors ${
                        cursor === i ? 'bg-slate-100' : 'hover:bg-slate-50'
                      }`}
                    >
                      <ProductImage
                        src={p.image}
                        alt=""
                        containerClassName="w-11 h-11 rounded-md flex-shrink-0 overflow-hidden"
                        className="w-11 h-11 rounded-md object-cover bg-slate-100"
                        iconClassName="w-4 h-4 text-slate-400"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-slate-900 truncate">{highlight(p.name, q)}</span>
                        <span className="block text-xs text-slate-500 truncate">
                          {[p.category, p.subCategory].filter(Boolean).join(' · ')}
                        </span>
                      </span>
                      <span className="text-sm font-bold text-[#1A175A] flex-shrink-0">{inr(p.price)}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 text-xs text-slate-500">
                <span>
                  {allMatches.length > matches.length
                    ? `+${allMatches.length - matches.length} more shown in the grid below`
                    : 'All matches shown in the grid below'}
                </span>
                <span className="hidden sm:inline">
                  <kbd className="px-1 rounded border border-slate-200 bg-slate-50 font-semibold">↑</kbd>{' '}
                  <kbd className="px-1 rounded border border-slate-200 bg-slate-50 font-semibold">↓</kbd> to browse
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Slide-over side filter drawer (all viewports: mobile through HD)   */
/* ------------------------------------------------------------------ */
const FilterDrawer = ({
  open,
  onClose,
  onReset,
  hasActiveFilters,
  activeCount,
  resultCount,
  returnFocusRef,
  children,
}) => {
  const [rendered, setRendered] = useState(open);
  const [visible, setVisible] = useState(false);
  const closeBtnRef = useRef(null);
  const wasOpenRef = useRef(false);

  if (open && !rendered) {
    setRendered(true);
  }

  useEffect(() => {
    let raf1 = 0;
    let raf2 = 0;
    let closeRaf = 0;
    let unmountTimer = 0;

    if (open) {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setVisible(true));
      });
    } else {
      closeRaf = requestAnimationFrame(() => setVisible(false));
      unmountTimer = window.setTimeout(() => setRendered(false), 300);
    }

    return () => {
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      if (closeRaf) cancelAnimationFrame(closeRaf);
      if (unmountTimer) clearTimeout(unmountTimer);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const focusTimer = window.setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 60);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(focusTimer);
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = prevOverflow;
      };
    }

    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      returnFocusRef?.current?.focus({ preventScroll: true });
    }
    return undefined;
  }, [open, onClose, returnFocusRef]);

  if (!rendered) return null;

  return (
    <div
      className="fixed inset-0 z-[60] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Filter products"
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 bg-slate-950/50 backdrop-blur-[2px] transition-opacity duration-300 ease-out motion-reduce:transition-none ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <aside
        aria-label="Filters"
        className={`fixed inset-y-0 left-0 w-full max-w-[400px] bg-white shadow-2xl border-r border-slate-200 flex flex-col transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none ${
          visible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sticky Drawer Header */}
        <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1A175A]/8 text-[#1A175A]">
              <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-[#1A175A]">Filters</h2>
                {activeCount > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1A175A] px-1.5 text-[11px] font-bold text-white tabular-nums">
                    {activeCount}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">Price, colour, size & availability</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onReset}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#1A175A] hover:bg-[#1A175A]/8 cursor-pointer transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A175A]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Filters Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 py-5">
          {children}
        </div>

        {/* Sticky Action Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-slate-200 bg-slate-50/95 backdrop-blur-xs flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            disabled={!hasActiveFilters}
            className="h-11 px-5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:border-[#1A175A] hover:text-[#1A175A] disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 px-5 rounded-xl bg-[#1A175A] text-white text-sm font-semibold hover:bg-[#282479] shadow-xs cursor-pointer transition-colors"
          >
            Show {resultCount} {resultCount === 1 ? 'Product' : 'Products'}
          </button>
        </div>
      </aside>
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterTriggerRef = useRef(null);
  const closeFilters = useCallback(() => setFiltersOpen(false), []);
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
  const stockParam = searchParams.get('stock') || ''; // '' | '1' (in stock) | 'out'
  const inStockOnly = stockParam === '1';
  const outOfStockOnly = stockParam === 'out';
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

  // Live product counts for the category rail
  const catalogCounts = useMemo(() => {
    const catMatch = (p, c) =>
      (c.id != null && Number(p.categoryId) === Number(c.id)) ||
      normalizeSlug(p.categorySlug || p.category) === normalizeSlug(c.slug) ||
      normalizeSlug(p.category) === normalizeSlug(c.name);
    const subMatch = (p, s) =>
      (s.id != null && Number(p.subCategoryId) === Number(s.id)) ||
      normalizeSlug(p.subCategorySlug || p.subCategory) === normalizeSlug(s.slug) ||
      normalizeSlug(p.subCategory) === normalizeSlug(s.name);

    const cat = {};
    const sub = {};
    categoriesTree.forEach((c) => {
      cat[c.slug] = allProducts.filter((p) => catMatch(p, c)).length;
      (c.subcategories || []).forEach((s) => {
        sub[`${c.slug}/${s.slug}`] = allProducts.filter((p) => catMatch(p, c) && subMatch(p, s)).length;
      });
    });
    return { all: allProducts.length, cat, sub };
  }, [allProducts, categoriesTree]);

  // Availability counts for the current category scope
  const stockCounts = useMemo(() => {
    const inStock = scopedProducts.filter((p) => Number(p.stock) > 0).length;
    return { all: scopedProducts.length, in: inStock, out: scopedProducts.length - inStock };
  }, [scopedProducts]);

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

      if (inStockOnly && Number(p.stock) <= 0) return false;
      if (outOfStockOnly && Number(p.stock) > 0) return false;

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
    outOfStockOnly,
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

  const activeDrawerCount = [hasPriceFilter, selectedColor, selectedSize, stockParam].filter(Boolean).length;
  const hasFacetFilters = Boolean(searchQ || activeDrawerCount > 0);

  const crumbs = [{ label: 'Products', to: categorySlug && categorySlug !== 'all' ? '/products' : null }];
  if (categorySlug && categorySlug !== 'all') {
    crumbs.push({
      label: activeCategoryName,
      to: subCategorySlug ? getCategoryPageLink(activeCategoryObj?.slug || categorySlug) : null,
    });
  }
  if (subCategorySlug) crumbs.push({ label: activeSubcategoryName, to: null });

  // Search ideas come straight from the real catalogue structure
  const searchIdeas = useMemo(() => {
    const names = categoriesTree.flatMap((c) => [c.name, ...(c.subcategories || []).map((s) => s.name)]);
    return Array.from(new Set(names.filter(Boolean))).slice(0, 7);
  }, [categoriesTree]);

  const priceSummary = hasPriceFilter
    ? sliderMinPrice > priceBounds.min
      ? `${inr(sliderMinPrice)} – ${inr(sliderMaxPrice)}`
      : `Up to ${inr(sliderMaxPrice)}`
    : '';

  // Sidebar: price, colour, size, availability (categories live in the rail above)
  const filterPanels = (
    <div>
      <PriceFilter
        minBound={priceBounds.min}
        maxBound={priceBounds.max}
        step={PRICE_STEP}
        minVal={sliderMinPrice}
        maxVal={sliderMaxPrice}
        onLive={handlePriceRangeChange}
        onCommit={commitPriceParams}
        onReset={resetPriceFilter}
      />

      {availableColors.length > 0 && (
        <ColourFilter colours={availableColors} selected={selectedColor} onSelect={(v) => updateParam('color', v)} />
      )}

      <SizeFilter selected={selectedSize} onSelect={(v) => updateParam('size', v)} />

      <FilterGroup title="Availability" onReset={stockParam ? () => updateParam('stock', '') : null}>
        <div role="radiogroup" aria-label="Availability">
          <Option active={!stockParam} onClick={() => updateParam('stock', '')} count={stockCounts.all}>
            All products
          </Option>
          <Option active={inStockOnly} onClick={() => updateParam('stock', '1')} count={stockCounts.in}>
            In stock
          </Option>
          <Option active={outOfStockOnly} onClick={() => updateParam('stock', 'out')} count={stockCounts.out}>
            Out of stock
          </Option>
        </div>
      </FilterGroup>
    </div>
  );

  const chipBase =
    'inline-flex items-center gap-1.5 pl-3.5 pr-2.5 py-2 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-[#1A175A] cursor-pointer transition-colors duration-150';

  // Same horizontal rhythm as the navbar so everything lines up cleanly across full HD width
  const wrap = 'w-full max-w-[1640px] mx-auto px-4 sm:px-6 xl:px-8';
  const gridCols = 'grid-cols-1 min-[520px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';

  return (
    <Layout>
      {/* Page header */}
      <section className="bg-slate-50">
        <div className={`${wrap} pt-6 sm:pt-8 pb-6 sm:pb-8`}>
          <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-sm text-slate-500">
            <Link to="/" className="hover:text-[#1A175A] transition-colors">Home</Link>
            {crumbs.map((c, i) => (
              <React.Fragment key={`${c.label}-${i}`}>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                {c.to ? (
                  <Link to={c.to} className="hover:text-[#1A175A] transition-colors">{c.label}</Link>
                ) : (
                  <span className="font-semibold text-[#1A175A]">{c.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">ANR Hospital Garments</p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-[#1A175A]">{pageTitle}</h1>
            </div>
            <p role="status" aria-live="polite" className="text-base text-slate-500 pb-1">
              {loading ? (
                'Loading products…'
              ) : (
                <>
                  <span className="font-semibold text-[#1A175A]">{filteredProducts.length}</span>{' '}
                  {filteredProducts.length === 1 ? 'product' : 'products'}
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Category + subcategory rail */}
      <CategoryRail
        tree={categoriesTree}
        counts={catalogCounts}
        activeCategory={activeCategoryObj}
        activeSubSlug={subCategorySlug}
        loading={loading}
      />

      {/* Catalogue */}
      <section className="bg-white pb-14 sm:pb-20 min-h-[60vh]">
        <div className={`${wrap} pt-6 sm:pt-8`}>
          <div className="min-w-0">
            {/* Filters button + Search + Sort toolbar */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              <button
                ref={filterTriggerRef}
                type="button"
                onClick={() => setFiltersOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={filtersOpen}
                className={`order-2 sm:order-1 flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 h-11 px-4 sm:px-5 rounded-xl border text-sm font-semibold cursor-pointer transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A175A] focus-visible:ring-offset-2 ${
                  activeDrawerCount > 0
                    ? 'border-[#1A175A] bg-[#1A175A]/5 text-[#1A175A] hover:bg-[#1A175A]/10'
                    : 'border-slate-300 bg-white text-slate-800 hover:border-[#1A175A] hover:text-[#1A175A]'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 text-[#1A175A]" aria-hidden="true" />
                <span>Filters</span>
                {activeDrawerCount > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1A175A] px-1.5 text-[11px] font-bold text-white tabular-nums">
                    {activeDrawerCount}
                  </span>
                )}
              </button>

              <div className="order-1 sm:order-2 w-full sm:w-auto sm:flex-1 sm:max-w-xl">
                <SearchBox
                  value={searchQ}
                  onChange={(v) => updateParam('q', v)}
                  products={scopedProducts}
                  ideas={searchIdeas}
                />
              </div>

              <div className="relative order-3 flex-1 sm:flex-initial sm:ml-auto">
                <select
                  value={selectedSort}
                  onChange={(e) => updateParam('sort', e.target.value === 'featured' ? '' : e.target.value)}
                  aria-label="Sort products"
                  className="w-full sm:w-auto appearance-none h-11 pl-4 pr-9 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 hover:border-[#1A175A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A175A] cursor-pointer transition-colors"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Active filters (wrap, never clipped) */}
            {hasFacetFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-4">
                {searchQ && (
                  <button type="button" onClick={() => updateParam('q', '')} className={chipBase} aria-label={`Remove search ${searchQ}`}>
                    Search: {searchQ}
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                )}
                {hasPriceFilter && (
                  <button type="button" onClick={resetPriceFilter} className={chipBase} aria-label="Remove price filter">
                    {priceSummary}
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                )}
                {selectedColor && (
                  <button type="button" onClick={() => updateParam('color', '')} className={chipBase} aria-label={`Remove colour ${selectedColor}`}>
                    {selectedColor}
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                )}
                {selectedSize && (
                  <button type="button" onClick={() => updateParam('size', '')} className={chipBase} aria-label={`Remove size ${selectedSize}`}>
                    Size {selectedSize}
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                )}
                {stockParam && (
                  <button type="button" onClick={() => updateParam('stock', '')} className={chipBase} aria-label="Remove availability filter">
                    {outOfStockOnly ? 'Out of stock' : 'In stock'}
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetFacetFilters}
                  className="ml-1 text-sm font-semibold text-[#1A175A] hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Grid / states */}
            <div className="pt-6">
              {loading ? (
                <div className={`grid ${gridCols} gap-x-4 sm:gap-x-5 gap-y-7`}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : error ? (
                <div className="py-20 text-center space-y-4">
                  <p className="text-sm font-semibold text-slate-800">{error}</p>
                  <button
                    type="button"
                    onClick={() => loadData(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#1A175A] text-white text-sm font-semibold hover:bg-[#282479] cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try again
                  </button>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-16 text-center space-y-5">
                  <PackageOpen className="w-10 h-10 text-slate-300 mx-auto" strokeWidth={1.5} />
                  <div className="space-y-1.5">
                    <h2 className="text-lg font-bold text-slate-900">No garments match these filters</h2>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto">
                      Try a wider price range, another colour or size, or start from one of these:
                    </p>
                  </div>
                  {searchIdeas.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {searchIdeas.slice(0, 5).map((idea) => (
                        <button
                          key={idea}
                          type="button"
                          onClick={() => {
                            resetFacetFilters();
                            updateParam('q', idea);
                          }}
                          className="px-3.5 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:border-[#1A175A] hover:text-[#1A175A] cursor-pointer transition-colors"
                        >
                          {idea}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {hasFacetFilters && (
                      <button
                        type="button"
                        onClick={resetFacetFilters}
                        className="px-5 py-2.5 rounded-md border border-slate-300 text-sm font-semibold text-slate-800 hover:border-[#1A175A] cursor-pointer transition-colors"
                      >
                        Reset filters
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="px-5 py-2.5 rounded-md bg-[#1A175A] text-white text-sm font-semibold hover:bg-[#282479] cursor-pointer transition-colors"
                    >
                      View all apparel
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`grid ${gridCols} gap-x-4 sm:gap-x-5 gap-y-7`}>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Slide-out Filters Drawer (all viewports) */}
      <FilterDrawer
        open={filtersOpen}
        onClose={closeFilters}
        onReset={resetFacetFilters}
        hasActiveFilters={hasFacetFilters}
        activeCount={activeDrawerCount}
        resultCount={filteredProducts.length}
        returnFocusRef={filterTriggerRef}
      >
        {filterPanels}
      </FilterDrawer>
    </Layout>
  );
};

export default ProductsPage;