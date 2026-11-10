import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchBanners } from '../services/api';

// Curated default ANR banners if Admin API has no records or during server boot
const DEFAULT_SLIDES = [
  {
    id: 'default-1',
    src: '/anr-hero-banner.jpg',
    alt: 'ANR Hospital Garments - Designed for Care. Made to Perform.',
    href: '#scrubs-collection',
    title: '',
    subtitle: '',
    badge: '',
    ctaText: ''
  },
  {
    id: 'default-2',
    src: '/anr-banner-2.jpg',
    alt: 'ANR Hospital Apparel Collections & Fabric Quality',
    href: '#aprons-collection',
    title: '',
    subtitle: '',
    badge: '',
    ctaText: ''
  },
  {
    id: 'default-3',
    src: '/anr-banner-3.jpg',
    alt: 'ANR All Colours. Same Quality. Same Care.',
    href: '#patient-wear-collection',
    title: '',
    subtitle: '',
    badge: '',
    ctaText: ''
  }
];

const AUTOPLAY_MS = 5000;

const HeroBanner = () => {
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);

  // Fetch dynamic HERO banners from Admin backend
  useEffect(() => {
    let isMounted = true;

    const loadDynamicBanners = async () => {
      try {
        const dynamicList = await fetchBanners('HERO');
        if (isMounted && dynamicList && dynamicList.length > 0) {
          const formatted = dynamicList
            .filter((b) => Boolean(b.image))
            .map((b) => ({
              id: b.id || `admin-hero-${b.position || Math.random()}`,
              src: b.image,
              alt: b.title || 'ANR Hospital Garments',
              href: b.primaryHref || '#scrubs-collection',
              title: b.title || '',
              subtitle: b.subtitle || '',
              badge: b.badge || '',
              ctaText: b.primaryCta || ''
            }));

          if (formatted.length > 0) {
            setSlides(formatted);
            setCurrent(0);
          }
        }
      } catch (err) {
        console.warn('[HeroBanner] Using default slides fallback:', err);
      }
    };

    loadDynamicBanners();
    return () => {
      isMounted = false;
    };
  }, []);

  const count = slides.length;

  const goTo = (i) => setCurrent((i + count) % count);
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
    'absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1A175A]/80 hover:bg-[#1A175A] text-white border border-white/20 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shadow-md';

  return (
    <section
      className="relative w-full bg-[#1A175A] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured banners"
    >
      <div
        className="relative w-full overflow-hidden aspect-[16/9]"
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

            const slideContent = (
              <div className="relative w-full h-full">
                <img
                  src={slide.src}
                  alt={slide.alt || 'ANR Hospital Garments'}
                  className="w-full h-full object-cover object-center"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  draggable={false}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/anr-hero-banner.jpg';
                  }}
                />

                {/* Optional overlay when title / subtitle are set in Admin */}
                {hasTextOverlay && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#141247]/90 via-[#1A175A]/50 to-transparent flex items-center">
                    <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full">
                      <div className="max-w-xl text-white">
                        {slide.badge && (
                          <span className="inline-block px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-amber-400 text-[#1A175A] mb-3 uppercase tracking-wider shadow">
                            {slide.badge}
                          </span>
                        )}
                        {slide.title && (
                          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-2 drop-shadow-md">
                            {slide.title}
                          </h2>
                        )}
                        {slide.subtitle && (
                          <p className="text-xs sm:text-base lg:text-lg text-blue-100 font-medium mb-4 line-clamp-2 drop-shadow">
                            {slide.subtitle}
                          </p>
                        )}
                        {slide.ctaText && (
                          <span className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#1A175A] font-bold text-xs sm:text-sm shadow-md transition-all">
                            {slide.ctaText}
                            <ChevronRight className="w-4 h-4" />
                          </span>
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
                  <a
                    href={slide.href}
                    tabIndex={i === current ? 0 : -1}
                    className="block w-full h-full focus:outline-none"
                  >
                    {slideContent}
                  </a>
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
          <ChevronRight className="w-3.5 h-3.5 text-amber-500 rotate-90" />
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
                  i === current ? 'w-6 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white/80'
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
