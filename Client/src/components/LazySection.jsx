import React, { Suspense, useEffect, useRef, useState } from 'react';

/**
 * Default light skeleton rendered before a lazy section enters viewport
 * and while its code chunk is resolving inside Suspense.
 */
export const SectionPlaceholder = ({ title = '', minHeight = 320 }) => (
  <div
    className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    style={{ minHeight }}
    aria-label={title ? `Loading ${title}` : 'Loading section'}
  >
    <div className="h-5 w-44 rounded-md skeleton-bone mb-3" />
    <div className="h-3 w-72 max-w-full rounded skeleton-bone-soft mb-8" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[0, 1, 2, 3].map((idx) => (
        <div
          key={idx}
          className="h-64 rounded-2xl skeleton-bone border border-slate-200/70"
        />
      ))}
    </div>
  </div>
);

export const RouteFallback = () => (
  <div className="min-h-screen bg-white flex flex-col">
    <div className="h-16 w-full skeleton-bone-soft border-b border-slate-200/80" />
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <div className="h-8 w-64 rounded-lg skeleton-bone" />
      <div className="h-4 w-96 max-w-full rounded skeleton-bone-soft" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-64 rounded-2xl skeleton-bone border border-slate-200/70"
          />
        ))}
      </div>
    </div>
  </div>
);

/**
 * Defers mounting and downloading below-the-fold sections until they approach
 * the viewport (or are targeted by an anchor hash). Preserves anchor `id`
 * on the outer wrapper so hash navigation still scrolls reliably.
 */
const LazySection = ({
  id,
  anchorId,
  children,
  fallback,
  minHeight = 320,
  rootMargin = '280px 0px',
  eager = false,
}) => {
  const effectiveAnchor = anchorId || id;
  const containerRef = useRef(null);
  const [activated, setActivated] = useState(() => {
    if (eager) return true;
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return true;
    }
    return Boolean(effectiveAnchor && window.location.hash === `#${effectiveAnchor}`);
  });

  useEffect(() => {
    if (activated) return;

    const handleHashChange = () => {
      if (effectiveAnchor && window.location.hash === `#${effectiveAnchor}`) {
        setActivated(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      return () => window.removeEventListener('hashchange', handleHashChange);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActivated(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(node);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      observer.disconnect();
    };
  }, [activated, effectiveAnchor, rootMargin]);

  const placeholder = fallback || <SectionPlaceholder minHeight={minHeight} />;

  return (
    <div
      id={anchorId && !activated ? anchorId : id}
      ref={containerRef}
      style={activated ? undefined : { minHeight }}
    >
      {activated ? <Suspense fallback={placeholder}>{children}</Suspense> : placeholder}
    </div>
  );
};

export default LazySection;
