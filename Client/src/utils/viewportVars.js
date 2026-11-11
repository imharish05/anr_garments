/**
 * Keeps a CSS custom property on `document.documentElement` synced with an element's
 * rendered height so below-header hero sections can fill the exact remaining 100vh.
 */
export function observeElementHeightVar(element, cssVarName, resetPx = null) {
  if (typeof document === 'undefined') return () => {};

  const root = document.documentElement;
  const setVar = (px) => root.style.setProperty(cssVarName, `${px}px`);

  if (!element) {
    if (resetPx !== null) setVar(resetPx);
    return () => {};
  }

  const sync = () => {
    setVar(Math.round(element.getBoundingClientRect().height));
  };

  sync();

  let observer;
  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(sync);
    observer.observe(element);
  } else if (typeof window !== 'undefined') {
    window.addEventListener('resize', sync);
  }

  return () => {
    if (observer) observer.disconnect();
    else if (typeof window !== 'undefined') window.removeEventListener('resize', sync);
    if (resetPx !== null) setVar(resetPx);
  };
}
