import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { fetchDynamicBanners } from '../services/api';

// Fallback high-fidelity ANR brand slides
const DEFAULT_SLIDES = [
  {
    src: '/anr-hero-banner.jpg',
    alt: 'ANR Hospital Garments - Designed for Care. Made to Perform.',
    title: 'DESIGNED FOR CARE. MADE TO PERFORM.',
    subtitle: 'Premium hospital garments for healthcare professionals who go above and beyond.',
    href: '#scrubs-collection',
    ctaText: 'Explore Scrubs'
  },
  {
    src: '/anr-banner-2.jpg',
    alt: 'ANR Doctor Lab Coats and Aprons',
    title: 'COMFORT THAT CARES. QUALITY THAT LASTS.',
    subtitle: 'Doctor Aprons, Lab Coats & Theatre Wear crafted with hospital-grade durability.',
    href: '#aprons-collection',
    ctaText: 'View Aprons'
  },
  {
    src: '/anr-banner-3.jpg',
    alt: 'ANR All Colours. Same Quality. Same Care.',
    title: 'ALL COLOURS. SAME QUALITY. SAME CARE.',
    subtitle: 'Full spectrum scrubs, underscrubs, and patient wear tailored for medical excellence.',
    href: '#patient-wear-collection',
    ctaText: 'Explore Collection'
  }
];

const AUTOPLAY_MS = 5000;

const HeroBanner = () => {
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);

  // Fetch dynamic banners from Admin / Backend
  useEffect(() => {
    let isMounted = true;
    const loadBanners = async () => {
      try {
        const dynamicBanners = await fetchDynamicBanners();
        if (isMounted && dynamicBanners && dynamicBanners.length > 0) {
          const mapped = dynamicBanners.map((b) => ({
            src: b.image,
            alt: b.alt || 'ANR Hospital Garments Banner',
            title: b.title && b.title !== 'ANR HOSPITAL GARMENTS' ? b.title : '',
            subtitle: b.subtitle || '',
            href: b.href || '#scrubs-collection',
            ctaText: b.ctaText || 'Explore Collections'
          }));
          setSlides(mapped);
          setCurrent(0);
        }
      } catch (err) {
        console.warn('Failed to load dynamic banners, using default slides:', err);
      }
    };

    loadBanners();
    return () => {
      isMounted = false;
    };
  }, []);

  const count = slides.length;
  const goTo = (i) => setCurrent((i + count) % count);
  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  useEffect(() => {
    if (paused || count < 2) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, count]);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) (diff < 0 ? next : prev)();
    touchStartX.current = null;
  };

  const arrowBtn =
    "absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1A175A]/80 hover:bg-[#1A175A] text-white border border-white/20 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400";

  return (
    <section
      className="relative bg-[#1A175A] border-b border-white/10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured banners"
    >
      <div
        className="relative w-full overflow-hidden aspect-[16/9] sm:aspect-[16/7] lg:aspect-[16/6]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Slides */}
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => {
            const hasOverlayText = Boolean(slide.title || slide.subtitle);

            return (
              <div
                key={`${slide.src}-${i}`}
                className="relative w-full h-full flex-shrink-0"
                aria-hidden={i !== current}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
              >
                {slide.href ? (
                  <a href={slide.href} tabIndex={i === current ? 0 : -1} className="block w-full h-full relative group">
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                      loading={i === 0 ? 'eager' : 'lazy'}
                      draggable={false}
                      onError={(e) => {
                        // Safe fallback if an uploaded backend image is not found
                        if (e.currentTarget.src !== window.location.origin + '/anr-hero-banner.jpg') {
                          e.currentTarget.src = '/anr-hero-banner.jpg';
                        }
                      }}
                    />
                    {hasOverlayText && (
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141247]/90 via-[#1A175A]/30 to-transparent flex items-end p-6 sm:p-10 lg:p-16">
                        <div className="max-w-2xl text-white space-y-2 sm:space-y-3">
                          {slide.title && (
                            <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight drop-shadow-md">
                              {slide.title}
                            </h2>
                          )}
                          {slide.subtitle && (
                            <p className="text-xs sm:text-sm lg:text-base text-blue-100 max-w-xl line-clamp-2">
                              {slide.subtitle}
                            </p>
                          )}
                          {slide.ctaText && (
                            <span className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-amber-400 text-[#1A175A] font-bold text-xs sm:text-sm hover:bg-amber-300 transition-colors shadow-lg">
                              {slide.ctaText}
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </a>
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      className="w-full h-full object-cover"
                      loading={i === 0 ? 'eager' : 'lazy'}
                      draggable={false}
                      onError={(e) => {
                        if (e.currentTarget.src !== window.location.origin + '/anr-hero-banner.jpg') {
                          e.currentTarget.src = '/anr-hero-banner.jpg';
                        }
                      }}
                    />
                    {hasOverlayText && (
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141247]/90 via-[#1A175A]/30 to-transparent flex items-end p-6 sm:p-10 lg:p-16">
                        <div className="max-w-2xl text-white space-y-2 sm:space-y-3">
                          {slide.title && (
                            <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight drop-shadow-md">
                              {slide.title}
                            </h2>
                          )}
                          {slide.subtitle && (
                            <p className="text-xs sm:text-sm lg:text-base text-blue-100 max-w-xl line-clamp-2">
                              {slide.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Arrows */}
        {count > 1 && (
          <>
            <button type="button" onClick={prev} className={`${arrowBtn} left-3 sm:left-5`} aria-label="Previous slide">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button type="button" onClick={next} className={`${arrowBtn} right-3 sm:right-5`} aria-label="Next slide">
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dots */}
        {count > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A175A]/70 backdrop-blur-sm">
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
