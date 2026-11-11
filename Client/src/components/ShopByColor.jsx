import React, { useState, useEffect, useRef, useId, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchColorCollections } from '../services/api';
import { ArrowRight, ChevronLeft, ChevronRight, Star, RefreshCw, Palette } from 'lucide-react';
import { AnimatedText, ScrollReveal } from './MotionPrimitives';

const isWhite = (hex) => (hex || '').toLowerCase() === '#ffffff';

const shortName = (name = '') => name.split('/')[0].trim();

/* ------------------------------------------------------------------ */
/* Scrub top: one silhouette, tinted by any hex. Shading is overlaid   */
/* with black/white alpha so every colour (even white) looks like cloth */
/* ------------------------------------------------------------------ */
const ScrubTop = ({ hex = '#1A175A' }) => {
  const uid = useId().replace(/:/g, '');
  const white = isWhite(hex);
  const body =
    'M160 30 L80 60 L10 150 L60 190 L95 150 L95 388 Q95 400 107 400 L293 400 Q305 400 305 388 L305 150 L340 190 L390 150 L320 60 L240 30 L200 112 Z';

  return (
    <svg viewBox="0 0 400 430" className="w-full h-full overflow-visible" role="img" aria-hidden="true">
      <defs>
        <clipPath id={`clip-${uid}`}>
          <path d={body} />
        </clipPath>
        <linearGradient id={`shade-${uid}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.16" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="0.65" stopColor="#fff" stopOpacity="0.04" />
          <stop offset="1" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={`fold-${uid}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.14" />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="200" cy="415" rx="130" ry="9" fill="#0f172a" opacity="0.12" />

      {/* cloth */}
      <path
        d={body}
        style={{ fill: hex, transition: 'fill 600ms ease' }}
        stroke={white ? '#cbd5e1' : 'rgba(0,0,0,0.25)'}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <g clipPath={`url(#clip-${uid})`}>
        <rect width="400" height="430" fill={`url(#shade-${uid})`} />
        <rect width="400" height="430" fill={`url(#fold-${uid})`} />
        {/* fabric weave */}
        <g stroke="#000" strokeOpacity="0.035" strokeWidth="1">
          {Array.from({ length: 46 }).map((_, i) => (
            <line key={i} x1="0" x2="400" y1={i * 9} y2={i * 9} />
          ))}
        </g>
        {/* sleeve seams */}
        <g fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="2" strokeDasharray="5 4">
          <path d="M95 150 L84 62" />
          <path d="M305 150 L316 62" />
          <path d="M95 150 Q60 165 60 190" opacity="0" />
        </g>
        {/* pockets */}
        <g fill="rgba(0,0,0,0.06)" stroke="rgba(0,0,0,0.25)" strokeWidth="2" strokeDasharray="5 4">
          <path d="M120 175 h46 v46 q0 6 -6 6 h-34 q-6 0 -6 -6 z" />
          <path d="M118 290 h72 v62 q0 6 -6 6 h-60 q-6 0 -6 -6 z" />
          <path d="M210 290 h72 v62 q0 6 -6 6 h-60 q-6 0 -6 -6 z" />
        </g>
      </g>

      {/* V-neck trim */}
      <path
        d="M160 30 L200 112 L240 30"
        fill="none"
        stroke="rgba(0,0,0,0.28)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M160 30 L200 112 L240 30"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(0 -2)"
      />
      <path d="M160 30 Q200 10 240 30" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
};

const ShopByColor = () => {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [failedImages, setFailedImages] = useState({});
  const [selectedIdx, setSelectedIdx] = useState(0);
  const chipRefs = useRef([]);

  const loadColors = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const items = await fetchColorCollections();
      setColors(Array.isArray(items) ? items : []);
      setSelectedIdx(0);
    } catch (err) {
      setError(err?.message || 'Unable to load color palette.');
      setColors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadColors();
  }, [loadColors]);

  const total = colors.length;
  const safeIdx = Math.min(Math.max(0, selectedIdx), Math.max(0, total - 1));
  const selected = colors[safeIdx] || null;
  const glow = selected ? (isWhite(selected.hex) ? '#94a3b8' : selected.hex) : '#1A175A';

  const pick = useCallback(
    (idx) => {
      if (total === 0) return;
      setSelectedIdx((idx + total) % total);
    },
    [total]
  );

  const canHover = () =>
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: hover)').matches;

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      pick(selectedIdx + 1);
      chipRefs.current[(selectedIdx + 1) % total]?.focus();
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      pick(selectedIdx - 1);
      chipRefs.current[(selectedIdx - 1 + total) % total]?.focus();
    }
  };

  return (
    <section id="shop-colors" className="relative overflow-hidden py-16 sm:py-24 bg-white">
      {/* colour-reactive ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[38%] h-[34rem] w-[34rem] sm:h-[48rem] sm:w-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-[0.16] transition-[background-color] duration-700"
        style={{ backgroundColor: glow }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* ---------- Heading ---------- */}
        <div className="text-center">
          <ScrollReveal direction="pop" className="inline-block">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-700 mb-3">
              Hospital Department Color Palette
            </p>
          </ScrollReveal>
          <AnimatedText
            as="h2"
            className="text-3xl sm:text-4xl font-bold text-[#1A175A] tracking-tight block"
          >
            All Colours. Same Quality. Same Care.
          </AnimatedText>
          <ScrollReveal direction="scale" delay={180}>
            <div className="mx-auto mt-4 h-[3px] w-12 rounded-full bg-[#1A175A]" />
          </ScrollReveal>
        </div>

        {/* ---------- Stage ---------- */}
        {loading ? (
          <div className="mt-12 sm:mt-16 grid lg:grid-cols-[1.05fr_1fr] items-center gap-8 lg:gap-14">
            <div className="mx-auto w-full max-w-md h-[20rem] sm:h-[26rem] rounded-3xl skeleton-bone" />
            <div className="space-y-4">
              <div className="h-4 w-32 skeleton-bone rounded" />
              <div className="h-12 w-64 skeleton-bone rounded" />
              <div className="h-4 w-80 max-w-full skeleton-bone-soft rounded" />
              <div className="flex gap-2.5 pt-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-7 w-7 rounded-full skeleton-bone" />
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="mt-12 rounded-2xl border border-blue-200 bg-blue-50/80 p-8 text-center max-w-xl mx-auto">
            <p className="text-sm font-semibold text-[#1A175A] mb-3">{error}</p>
            <button
              type="button"
              onClick={loadColors}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A175A] text-white text-xs font-bold hover:bg-blue-900 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Colors
            </button>
          </div>
        ) : !selected ? (
          <div className="mt-12 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-10 text-center max-w-xl mx-auto">
            <Palette className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No color collections configured yet.</p>
          </div>
        ) : (
        <ScrollReveal
          direction="up"
          triggerKey={colors.length}
          className="mt-12 sm:mt-16 grid lg:grid-cols-[1.05fr_1fr] items-center gap-8 lg:gap-14"
        >
          {/* Image stage: no circles, image keeps its own shape */}
          <div className="relative mx-auto w-full max-w-md h-[20rem] sm:h-[26rem] flex items-center justify-center">
            {selected.image && !failedImages[selected.id || selected.image] ? (
              <img
                key={selected.image}
                src={selected.image}
                alt={selected.name}
                loading="lazy"
                decoding="async"
                onError={() =>
                  setFailedImages((prev) => ({ ...prev, [selected.id || selected.image]: true }))
                }
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-3xl shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)] animate-[colorFade_0.45s_ease-out]"
              />
            ) : (
              <div className="w-64 sm:w-72">
                <ScrubTop hex={selected.hex} />
              </div>
            )}
          </div>

          {/* Info card */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">
              <span className="font-mono text-[#1A175A]">
                {String(safeIdx + 1).padStart(2, '0')}
                <span className="text-slate-300"> / {String(total).padStart(2, '0')}</span>
              </span>
              <span className="h-px w-10 bg-slate-300" />
              <span>Department code</span>
            </div>

            <div key={selected.name} className="animate-[colorFade_0.45s_ease-out]">
              <h3 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1A175A] leading-[1.02]">
                {selected.name}
              </h3>

              {(selected.description || selected.count) && (
                <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-md mx-auto lg:mx-0">
                  {selected.description || selected.count}
                </p>
              )}

              <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-2">
                {selected.badge ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#1A175A] ring-1 ring-blue-200">
                    <Star className="h-3.5 w-3.5 fill-[#1A175A] text-[#1A175A]" />
                    {selected.badge}
                  </span>
                ) : selected.popular ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#1A175A] ring-1 ring-blue-200">
                    <Star className="h-3.5 w-3.5 fill-[#1A175A] text-[#1A175A]" />
                    Most ordered
                  </span>
                ) : null}
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Scrubs • Lab coats • Underscrubs
                </span>
              </div>
            </div>

            {/* Small colour swatches */}
            <div
              role="listbox"
              aria-label="Choose a colour"
              onKeyDown={onKeyDown}
              className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-2.5"
            >
              {colors.map((color, i) => {
                const active = i === safeIdx;
                return (
                  <button
                    key={`${color.id || color.name}-${i}`}
                    ref={(el) => (chipRefs.current[i] = el)}
                    type="button"
                    role="option"
                    aria-selected={active}
                    aria-label={color.name}
                    title={color.name}
                    tabIndex={active ? 0 : -1}
                    onClick={() => pick(i)}
                    onMouseEnter={() => canHover() && pick(i)}
                    className={`h-7 w-7 rounded-full outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#1A175A] focus-visible:ring-offset-2 ${
                      active
                        ? 'scale-110 ring-2 ring-[#1A175A] ring-offset-2'
                        : 'hover:scale-110'
                    }`}
                    style={{
                      backgroundColor: color.hex,
                      boxShadow: active ? undefined : 'inset 0 0 0 1px rgba(15,23,42,0.15)',
                    }}
                  />
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-center lg:justify-start gap-3">
              <Link
                to={selected.link && selected.link.startsWith('/') ? selected.link : `/products?color=${encodeURIComponent(selected.name || '')}`}
                className="group inline-flex items-center gap-2 bg-[#1A175A] hover:bg-[#282479] text-white text-sm font-semibold pl-6 pr-5 py-3.5 rounded-full transition-colors shadow-lg shadow-[#1A175A]/20"
              >
                Order in {shortName(selected.name)}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                type="button"
                onClick={() => pick(safeIdx - 1)}
                aria-label="Previous colour"
                className="h-12 w-12 grid place-items-center rounded-full border border-slate-200 bg-white text-[#1A175A] hover:border-[#1A175A] transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => pick(safeIdx + 1)}
                aria-label="Next colour"
                className="h-12 w-12 grid place-items-center rounded-full border border-slate-200 bg-white text-[#1A175A] hover:border-[#1A175A] transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </ScrollReveal>
        )}
      </div>

      <style>{`
        @keyframes colorFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) {
          [class*="animate-[color"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
};

export default ShopByColor;