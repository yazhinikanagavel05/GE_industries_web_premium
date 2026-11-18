import { useEffect } from 'react';
import { prefersReducedMotion } from './prefersReducedMotion';

/**
 * Site-wide, content-agnostic scroll reveal.
 *
 * Headings, grid cards, forms, tables, FAQ items etc. inside <main> softly rise
 * and fade in as they enter the viewport. It only toggles data attributes, so no
 * page markup or copy is touched, and it skips anything that already animates
 * itself (Framer Motion elements carry an inline style) or lives in a modal.
 */
const SELECTOR = [
  'main h1:not([style])',
  'main h2:not([style])',
  'main .grid > *:not([style])',
  'main form:not([style])',
  'main table:not([style])',
  'main details:not([style])',
  'main blockquote:not([style])',
  'footer .grid > *:not([style])',
].join(',');

const SKIP_ANCESTORS = '[data-no-reveal], .fixed, [role="dialog"]';
const MAX_STAGGER = 6;
const STAGGER_MS = 80;
const CLEANUP_MS = 1100;

export const AutoReveal: React.FC = () => {
  useEffect(() => {
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;

    const timers = new Set<number>();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          el.setAttribute('data-rv', 'shown');
          const delay = parseInt(el.style.getPropertyValue('--rv-delay') || '0', 10) || 0;
          const t = window.setTimeout(() => {
            // Hand the element back to its own classes (hover transforms etc.)
            el.removeAttribute('data-rv');
            el.style.removeProperty('--rv-delay');
            if (!el.getAttribute('style')) el.removeAttribute('style');
            timers.delete(t);
          }, CLEANUP_MS + delay);
          timers.add(t);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    const scan = () => {
      const nodes = document.querySelectorAll<HTMLElement>(SELECTOR);
      const siblingCount = new Map<Element, number>();

      nodes.forEach((el) => {
        if (el.dataset.rvDone) return;
        if (el.closest(SKIP_ANCESTORS)) return;
        // Don't double-animate children of an element that is already revealing.
        if (el.parentElement?.closest('[data-rv]')) return;

        el.dataset.rvDone = '1';

        const parent = el.parentElement;
        const idx = parent ? siblingCount.get(parent) ?? 0 : 0;
        if (parent) siblingCount.set(parent, idx + 1);

        el.style.setProperty('--rv-delay', `${Math.min(idx, MAX_STAGGER) * STAGGER_MS}ms`);
        el.setAttribute('data-rv', 'hidden');
        io.observe(el);
      });
    };

    scan();

    // Pick up content that mounts later (async products, route changes, filters).
    let frame = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      io.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      // Never leave anything stuck invisible.
      document.querySelectorAll<HTMLElement>('[data-rv]').forEach((n) => {
        n.removeAttribute('data-rv');
        n.style.removeProperty('--rv-delay');
      });
      document.querySelectorAll<HTMLElement>('[data-rv-done]').forEach((n) => {
        delete n.dataset.rvDone;
      });
    };
  }, []);

  return null;
};
