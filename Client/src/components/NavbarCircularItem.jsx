import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { getElementCircleMetrics, prefersReducedMotion } from '../utils/motion';

/**
 * Navbar-only Dark-to-Light Circular Reveal Surface.
 * Renders a base Dark layer (matching the #1A175A navbar) and an identically aligned
 * Light layer (`bg-white text-[#1A175A]`) revealed cleanly via Brisko's circular
 * clip-path wipe (`circle(0px at x y)` <-> `circle(maxRadius at x y)`).
 */
const NavbarCircularItem = ({
  as: Tag = 'a',
  active = false,
  className = '',
  contentClassName = '',
  darkClassName = 'text-white/95',
  lightClassName = 'bg-white text-[#1A175A] shadow-sm',
  renderContent,
  children,
  onMouseEnter,
  onMouseLeave,
  onClick,
  ...rest
}) => {
  const rootRef = useRef(null);
  const overlayRef = useRef(null);
  const animRef = useRef(null);
  const hoveredRef = useRef(false);
  const expandedRef = useRef(Boolean(active));
  const lastPointRef = useRef(null);

  const runCircleReveal = (expand, event) => {
    const root = rootRef.current;
    const overlay = overlayRef.current;
    if (!root || !overlay) return;

    const { x, y, maxRadius } = event
      ? getElementCircleMetrics(root, event)
      : lastPointRef.current || getElementCircleMetrics(root);

    lastPointRef.current = { x, y, maxRadius };
    const endClip = expand
      ? `circle(${maxRadius}px at ${x}px ${y}px)`
      : `circle(0px at ${x}px ${y}px)`;

    if (prefersReducedMotion() || typeof overlay.animate !== 'function') {
      overlay.style.clipPath = endClip;
      expandedRef.current = expand;
      return;
    }

    let startClip = expand
      ? `circle(0px at ${x}px ${y}px)`
      : `circle(${maxRadius}px at ${x}px ${y}px)`;

    if (animRef.current) {
      try {
        const computed = window.getComputedStyle(overlay).clipPath;
        if (computed && computed.startsWith('circle(')) {
          startClip = computed;
        }
      } catch {
        // Ignore computed style lookup errors
      }
      animRef.current.cancel();
      animRef.current = null;
    } else if (expandedRef.current === expand) {
      overlay.style.clipPath = endClip;
      return;
    } else {
      const currentInline = overlay.style.clipPath;
      if (currentInline && currentInline.startsWith('circle(')) {
        startClip = currentInline;
      }
    }

    expandedRef.current = expand;
    overlay.style.willChange = 'clip-path';
    overlay.style.clipPath = startClip;

    try {
      const anim = overlay.animate(
        [{ clipPath: startClip }, { clipPath: endClip }],
        {
          duration: expand ? 280 : 220,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards',
        }
      );

      animRef.current = anim;
      anim.onfinish = () => {
        if (animRef.current === anim) {
          overlay.style.clipPath = endClip;
          overlay.style.willChange = '';
          anim.cancel();
          animRef.current = null;
        }
      };
    } catch {
      overlay.style.clipPath = endClip;
      overlay.style.willChange = '';
    }
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    if (active && !expandedRef.current) {
      runCircleReveal(true, null);
    } else if (!active && !hoveredRef.current && expandedRef.current) {
      runCircleReveal(false, null);
    }
  }, [active]);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (overlay && !overlay.style.clipPath) {
      overlay.style.clipPath = expandedRef.current
        ? 'circle(150% at 50% 50%)'
        : 'circle(0px at 50% 50%)';
    }

    return () => {
      if (animRef.current) {
        animRef.current.cancel();
        animRef.current = null;
      }
    };
  }, []);

  const handleMouseEnter = (e) => {
    hoveredRef.current = true;
    runCircleReveal(true, e);
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e) => {
    hoveredRef.current = false;
    if (!active) {
      runCircleReveal(false, e);
    }
    onMouseLeave?.(e);
  };

  const handleClick = (e) => {
    if (!expandedRef.current) {
      runCircleReveal(true, e);
    } else {
      // Refresh origin coordinates for active state continuity
      const { x, y, maxRadius } = getElementCircleMetrics(rootRef.current, e);
      lastPointRef.current = { x, y, maxRadius };
    }
    onClick?.(e);
  };

  const darkBody =
    typeof renderContent === 'function' ? renderContent({ isLight: false }) : children;
  const lightBody =
    typeof renderContent === 'function' ? renderContent({ isLight: true }) : children;

  return (
    <Tag
      ref={rootRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative inline-flex items-center overflow-hidden select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${className}`}
      {...rest}
    >
      {/* Dark Base Layer */}
      <span className={`relative z-0 ${contentClassName} ${darkClassName}`}>
        {darkBody}
      </span>

      {/* Light Reveal Overlay clipped cleanly inside circle() */}
      <span
        ref={overlayRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-10 ${contentClassName} ${lightClassName}`}
      >
        {lightBody}
      </span>
    </Tag>
  );
};

export default NavbarCircularItem;
