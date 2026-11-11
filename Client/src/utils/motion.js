/**
 * Brisko-inspired Motion Engine (Zero-dependency, GPU-accelerated)
 * - Scoped circular clip-path Dark -> Light reveal for Navbar items
 * - Split-text masked character/word reveals
 * - Scroll reveal & child stagger choreography
 */

export const prefersReducedMotion = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Computes pointer coordinates (x, y) local to `element` along with the exact
 * distance from (x, y) to the farthest corner of `element` (Pythagorean radius).
 */
export function getElementCircleMetrics(element, event) {
  if (!element || typeof element.getBoundingClientRect !== 'function') {
    return { x: 24, y: 18, maxRadius: 160 };
  }

  const rect = element.getBoundingClientRect();
  const w = Math.max(rect.width, 1);
  const h = Math.max(rect.height, 1);

  let x = w / 2;
  let y = h / 2;

  if (
    event &&
    typeof event.clientX === 'number' &&
    typeof event.clientY === 'number' &&
    (event.clientX !== 0 || event.clientY !== 0)
  ) {
    x = Math.min(Math.max(0, event.clientX - rect.left), w);
    y = Math.min(Math.max(0, event.clientY - rect.top), h);
  }

  const maxRadius = Math.ceil(
    Math.hypot(Math.max(x, w - x), Math.max(y, h - y))
  ) + 2;

  return {
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
    maxRadius,
  };
}

/**
 * Splits text nodes / elements cleanly and animates each character or word
 * rising out of a masked container (`translate3d(0, 85%, 0) -> 0`).
 */
export function animateSplitElement(container, { delay = 0, stagger = 14, duration = 440 } = {}) {
  if (!container || prefersReducedMotion()) return;

  const chars = container.querySelectorAll('.brisko-ch');
  if (!chars.length) return;

  chars.forEach((ch, idx) => {
    ch.style.willChange = 'transform, opacity';
    ch.style.transform = 'translate3d(0, 85%, 0)';
    ch.style.opacity = '0';

    const anim = ch.animate(
      [
        { transform: 'translate3d(0, 85%, 0)', opacity: 0 },
        { transform: 'translate3d(0, 0, 0)', opacity: 1 },
      ],
      {
        duration,
        delay: delay + idx * stagger,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards',
      }
    );

    anim.onfinish = () => {
      ch.style.willChange = '';
      ch.style.transform = '';
      ch.style.opacity = '';
      anim.cancel();
    };
  });
}

/**
 * Staggers a list of DOM elements into view (smooth GPU-composited reveal).
 */
export function animateStaggerElements(
  elements,
  { y = 14, scale = 0.99, delay = 0, stagger = 40, duration = 420 } = {}
) {
  const list = Array.from(elements || []);
  if (!list.length) return;

  if (prefersReducedMotion()) {
    list.forEach((el) => {
      el.style.opacity = '';
      el.style.transform = '';
    });
    return;
  }

  list.forEach((el, idx) => {
    el.style.willChange = 'transform, opacity';
    el.style.opacity = '0';
    el.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;

    const anim = el.animate(
      [
        { opacity: 0, transform: `translate3d(0, ${y}px, 0) scale(${scale})` },
        { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' },
      ],
      {
        duration,
        delay: delay + idx * stagger,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards',
      }
    );

    anim.onfinish = () => {
      el.style.willChange = '';
      el.style.opacity = '';
      el.style.transform = '';
      anim.cancel();
    };
  });
}
