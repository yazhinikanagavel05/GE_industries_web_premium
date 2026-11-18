import { useEffect } from 'react';
import { hasFinePointer, prefersReducedMotion } from './prefersReducedMotion';

/**
 * Powers the `.spotlight` hover glow: tracks the cursor over any element with
 * that class and exposes its position as --mx / --my CSS variables.
 */
export const SpotlightProvider: React.FC = () => {
  useEffect(() => {
    if (prefersReducedMotion() || !hasFinePointer()) return;

    const onMove = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const el = target?.closest?.('.spotlight') as HTMLElement | null;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      el.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    return () => document.removeEventListener('pointermove', onMove);
  }, []);

  return null;
};
