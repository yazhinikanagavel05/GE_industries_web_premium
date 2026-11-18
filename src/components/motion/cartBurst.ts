import confetti from 'canvas-confetti';
import { prefersReducedMotion } from './prefersReducedMotion';

/**
 * Small brand-coloured spark burst from the element that was clicked —
 * instant "added to cart" feedback. Safe to call anywhere; never throws.
 */
export const burstFromElement = (el: Element | null | undefined): void => {
  if (!el || prefersReducedMotion()) return;
  try {
    const r = el.getBoundingClientRect();
    confetti({
      particleCount: 22,
      spread: 62,
      startVelocity: 22,
      gravity: 1.1,
      ticks: 90,
      scalar: 0.7,
      origin: {
        x: (r.left + r.width / 2) / window.innerWidth,
        y: (r.top + r.height / 2) / window.innerHeight,
      },
      colors: ['#1685F8', '#38BDF8', '#FFFFFF', '#1D4F91'],
      disableForReducedMotion: true,
      zIndex: 90,
    });
  } catch {
    /* decorative only */
  }
};
