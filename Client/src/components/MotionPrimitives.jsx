import React, { useEffect, useRef } from 'react';
import {
  animateSplitElement,
  animateStaggerElements,
  prefersReducedMotion,
} from '../utils/motion';

/**
 * Masked Split-Text Reveal (`translate3d(0, 85%, 0) -> 0`)
 * Uses lightweight word chunks or compact character stagger for smooth 60fps playback.
 */
export const AnimatedText = ({
  as: Tag = 'span',
  children,
  text,
  className = '',
  mode = 'chars',
  delay = 0,
  stagger,
  duration = 440,
  immediate = false,
  triggerKey,
  ...rest
}) => {
  const containerRef = useRef(null);
  const rawText = typeof text === 'string' ? text : typeof children === 'string' ? children : '';
  const words = rawText ? rawText.trim().split(/\s+/) : [];
  const effectiveMode = mode === 'words' || rawText.length > 26 ? 'words' : 'chars';

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !rawText) return;

    if (prefersReducedMotion()) {
      el.classList.remove('brisko-text-pending');
      return;
    }

    el.classList.add('brisko-text-pending');

    const defaultStagger =
      effectiveMode === 'words'
        ? Math.max(16, Math.min(28, Math.round(140 / Math.max(1, words.length))))
        : Math.max(8, Math.min(14, Math.round(180 / Math.max(1, rawText.length))));
    const actualStagger = stagger ?? defaultStagger;

    const run = () => {
      if (!el.classList.contains('brisko-text-pending')) return;
      el.classList.remove('brisko-text-pending');
      animateSplitElement(el, { delay, stagger: actualStagger, duration });
    };

    if (immediate) {
      const id = requestAnimationFrame(run);
      return () => cancelAnimationFrame(id);
    }

    if (typeof IntersectionObserver === 'undefined') {
      run();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: '80px 0px 40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rawText, effectiveMode, words.length, delay, stagger, duration, immediate, triggerKey]);

  if (!rawText) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      ref={containerRef}
      className={`${prefersReducedMotion() ? '' : 'brisko-text-pending'} ${className}`.trim()}
      aria-label={rawText}
      {...rest}
    >
      {words.map((word, wIdx) => (
        <React.Fragment key={`${wIdx}-${word}`}>
          <span className="brisko-word" aria-hidden="true">
            {effectiveMode === 'words' ? (
              <span className="brisko-ch">{word}</span>
            ) : (
              Array.from(word).map((ch, cIdx) => (
                <span key={cIdx} className="brisko-ch">
                  {ch}
                </span>
              ))
            )}
          </span>
          {wIdx < words.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </Tag>
  );
};

/**
 * Scroll Reveal Wrapper (supports single block or staggered child grid/list).
 */
export const ScrollReveal = ({
  as: Tag = 'div',
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 440,
  staggerChildren = false,
  staggerSelector,
  staggerMs = 40,
  immediate = false,
  triggerKey,
  ...rest
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.classList.remove('brisko-reveal-pending');
      return;
    }

    el.classList.add('brisko-reveal-pending');

    const play = () => {
      if (!el.classList.contains('brisko-reveal-pending')) return;
      el.classList.remove('brisko-reveal-pending');

      if (staggerChildren || staggerSelector) {
        const targets = staggerSelector
          ? el.querySelectorAll(staggerSelector)
          : el.children;

        animateStaggerElements(targets, {
          y: direction === 'down' ? -14 : direction === 'none' ? 0 : 14,
          scale: direction === 'pop' ? 0.92 : 0.99,
          delay,
          stagger: staggerMs,
          duration,
        });
        return;
      }

      const initialTransform =
        direction === 'down'
          ? 'translate3d(0, -14px, 0) scale(0.99)'
          : direction === 'left'
          ? 'translate3d(18px, 0, 0) scale(0.99)'
          : direction === 'right'
          ? 'translate3d(-18px, 0, 0) scale(0.99)'
          : direction === 'pop'
          ? 'scale(0.92)'
          : direction === 'scale'
          ? 'scale(0.96)'
          : 'translate3d(0, 14px, 0) scale(0.99)';

      const easing =
        direction === 'pop'
          ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
          : 'cubic-bezier(0.22, 1, 0.36, 1)';

      try {
        el.style.willChange = 'transform, opacity';
        const anim = el.animate(
          [
            { opacity: 0, transform: initialTransform },
            { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' },
          ],
          {
            duration,
            delay,
            easing,
            fill: 'forwards',
          }
        );
        anim.onfinish = () => {
          el.style.willChange = '';
          el.style.opacity = '';
          el.style.transform = '';
          anim.cancel();
        };
      } catch {
        el.style.willChange = '';
        el.style.opacity = '1';
      }
    };

    if (immediate) {
      const id = requestAnimationFrame(play);
      return () => cancelAnimationFrame(id);
    }

    if (typeof IntersectionObserver === 'undefined') {
      play();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          play();
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: '80px 0px 40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [direction, delay, duration, staggerChildren, staggerSelector, staggerMs, immediate, triggerKey]);

  return (
    <Tag
      ref={ref}
      className={`${prefersReducedMotion() ? '' : 'brisko-reveal-pending'} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
};
