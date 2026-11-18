import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';

/** Floating back-to-top button with a circular scroll-progress ring. */
export const BackToTop: React.FC = () => {
  const [show, setShow] = useState(false);
  const { pathname } = useLocation();
  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Product pages have a sticky purchase bar on desktop — sit above it.
  const bottom = pathname.startsWith('/product/') ? 'bottom-6 md:bottom-24' : 'bottom-6';

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, scale: 0.7, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 16 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className={`fixed right-4 sm:right-6 ${bottom} z-30 w-12 h-12 rounded-full bg-brand-navy text-white shadow-xl shadow-brand-navy/40 border border-white/15 flex items-center justify-center group`}
          aria-label="Back to top"
          title="Back to top"
        >
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
            <circle cx="24" cy="24" r="21" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
            <motion.circle
              cx="24"
              cy="24"
              r="21"
              fill="none"
              stroke="#1685F8"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ pathLength }}
            />
          </svg>
          <ArrowUp className="w-4 h-4 relative transition-transform group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
