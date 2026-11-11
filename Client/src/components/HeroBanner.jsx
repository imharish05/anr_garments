import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, RefreshCw, ImageOff } from 'lucide-react';
import { fetchBanners } from '../services/api';
import { AnimatedText, ScrollReveal } from './MotionPrimitives';

const AUTOPLAY_MS = 5000;

const HeroBanner = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [failedImages, setFailedImages] = useState({});
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);

  const loadDynamicBanners = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError('');
    try {
      const dynamicList = await fetchBanners('HERO', forceRefresh);
      const formatted = (Array.isArray(dynamicList) ? dynamicList : [])
        .filter((b) => Boolean(b.image))
        .map((b, idx) => ({
          id: b.id || `admin-hero-${idx}`,
          src: b.image,
          alt: b.title || 'ANR Hospital Garments',
          href: b.ctaLink && b.ctaLink !== '#' ? b.ctaLink : '/products',
          title: b.title || '',
          subtitle: b.subtitle || '',
          badge: b.badge || '',
          ctaText: b.ctaText || ''
        }));
      setSlides(formatted);
      setCurrent(0);
    } catch (err) {
      setError(err?.message || 'Unable to load storefront banners.');
      setSlides([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDynamicBanners();
  }, [loadDynamicBanners]);

  const count = slides.length;

  const goTo = (i) => {
    if (count === 0) return;
    setCurrent((i + count) % count);
  };
  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  // Autoplay
  useEffect(() => {
    if (paused || count < 2) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, count]);

  // Touch Swipe
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  const arrowBtn =
    'absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1A175A]/80 hover:bg-[#1A175A] text-white border border-white/20 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white shadow-md';

  if (loading) {
    return (
      <section className="relative w-full bg-slate-50 overflow-hidden" aria-label="Loading banners">
        <div className="w-full hero-viewport-height skeleton-bone" />
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="w-full hero-viewport-height bg-[#141247] text-white px-4 text-center flex flex-col items-center justify-center"
        aria-label="Banner error"
      >
        <p className="text-sm text-blue-200 font-medium mb-3">{error}</p>
        <button
          type="button"
          onClick={() => loadDynamicBanners(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[#1A175A] text-xs font-bold hover:bg-blue-50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Banners
        </button>
      </section>
    );
  }

  if (count === 0) {
    return null;
  }

  return (
    <section
      className="relative w-full bg-[#1A175A] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured banners"
    >
      <div
        className="relative w-full overflow-hidden hero-viewport-height"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Slides Track */}
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => {
            const hasTextOverlay = Boolean(slide.title || slide.subtitle);
            const imgFailed = Boolean(failedImages[slide.id]);

            const slideContent = (
              <div className="relative w-full h-full">
                {imgFailed ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#141247] text-slate-300">
                    <ImageOff className="w-10 h-10 mb-2 opacity-60" />
                    <span className="text-xs font-medium">{slide.alt || 'Banner image unavailable'}</span>
                  </div>
                ) : (
                  <img
                    src={slide.src}
                    alt={slide.alt || 'ANR Hospital Garments'}
                    className="w-full h-full object-cover object-[center_70%]"
                    loading={i === 0 ? 'eager' : 'lazy'}
                    fetchPriority={i === 0 ? 'high' : undefined}
                    decoding={i === 0 ? 'sync' : 'async'}
                    draggable={false}
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [slide.id]: true }))
                    }
                  />
                )}

                {/* Optional overlay when title / subtitle are set in Admin */}
                {hasTextOverlay && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#141247]/90 via-[#1A175A]/50 to-transparent flex items-center">
                    <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full">
                      <div className="max-w-xl text-white">
                        {slide.badge && (
                          <ScrollReveal
                            direction="pop"
                            immediate={i === current}
                            triggerKey={current === i ? `active-${current}` : 'idle'}
                            delay={60}
                            className="inline-block"
                          >
                            <span className="inline-block px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-white text-[#1A175A] mb-3 uppercase tracking-wider shadow">
                              {slide.badge}
                            </span>
                          </ScrollReveal>
                        )}
                        {slide.title && (
                          <AnimatedText
                            as="h2"
                            immediate={i === current}
                            triggerKey={current === i ? `title-${current}` : 'idle'}
                            className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-2 drop-shadow-md"
                          >
                            {slide.title}
                          </AnimatedText>
                        )}
                        {slide.subtitle && (
                          <AnimatedText
                            as="p"
                            mode="words"
                            immediate={i === current}
                            triggerKey={current === i ? `sub-${current}` : 'idle'}
                            delay={180}
                            className="text-xs sm:text-base lg:text-lg text-blue-100 font-medium mb-4 line-clamp-2 drop-shadow"
                          >
                            {slide.subtitle}
                          </AnimatedText>
                        )}
                        {slide.ctaText && (
                          <ScrollReveal
                            direction="up"
                            immediate={i === current}
                            triggerKey={current === i ? `cta-${current}` : 'idle'}
                            delay={280}
                            className="inline-block"
                          >
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-white hover:bg-blue-50 text-[#1A175A] font-bold text-xs sm:text-sm shadow-md transition-all">
                              {slide.ctaText}
                              <ChevronRight className="w-4 h-4" />
                            </span>
                          </ScrollReveal>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );

            return (
              <div
                key={slide.id || slide.src}
                className="w-full h-full flex-shrink-0"
                aria-hidden={i !== current}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
              >
                {slide.href ? (
                  slide.href.startsWith('/') ? (
                    <Link
                      to={slide.href}
                      tabIndex={i === current ? 0 : -1}
                      className="block w-full h-full focus:outline-none"
                    >
                      {slideContent}
                    </Link>
                  ) : (
                    <a
                      href={slide.href}
                      tabIndex={i === current ? 0 : -1}
                      className="block w-full h-full focus:outline-none"
                    >
                      {slideContent}
                    </a>
                  )
                ) : (
                  slideContent
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className={`${arrowBtn} left-3 sm:left-5`}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className={`${arrowBtn} right-3 sm:right-5`}
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Quick jump to Shop by Category */}
        {/* <a
          href="#shop-categories"
          className="absolute bottom-3 sm:bottom-4 right-4 sm:right-8 z-10 hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#1A175A] text-xs font-bold shadow-lg backdrop-blur-sm transition-all hover:scale-105"
        >
          <span>Shop by Category</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#1A175A] rotate-90" />
        </a> */}

        {/* Indicators Dots */}
        {count > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A175A]/70 backdrop-blur-sm border border-white/10">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === current}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
