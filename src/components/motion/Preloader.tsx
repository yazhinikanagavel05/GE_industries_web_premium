import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { prefersReducedMotion } from './prefersReducedMotion';

const SESSION_KEY = 'ge_splash_seen';
const DURATION_MS = 1300;

const shouldShow = (): boolean => {
  if (prefersReducedMotion()) return false;
  try {
    return !sessionStorage.getItem(SESSION_KEY);
  } catch {
    return false;
  }
};

/**
 * Brief branded intro — once per browser session, click anywhere to skip.
 */
export const Preloader: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(shouldShow);

  useEffect(() => {
    if (!visible) return;
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* storage unavailable — fine */
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => setVisible(false), DURATION_MS);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="ge-preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#071328] noise-overlay cursor-pointer"
          onClick={() => setVisible(false)}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-subtle-grid-dark opacity-40" />
          <div className="absolute w-80 h-80 rounded-full bg-brand-accent/20 blur-[110px]" />

          <div className="relative flex items-center justify-center">
            <motion.span
              className="absolute w-28 h-28 rounded-full border border-brand-accent/50"
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 1.7, opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -12 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 160, damping: 14 }}
              className="relative w-24 h-24 rounded-3xl bg-white p-2.5 shadow-2xl shadow-brand-accent/30"
            >
              <img src="/brand/logo.png" alt="" className="w-full h-full object-contain" />
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="relative mt-7 font-display font-black tracking-[0.3em] text-white text-sm uppercase"
          >
            GE Industries
          </motion.p>

          <div className="relative mt-5 h-[3px] w-44 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-brand-royal via-brand-accent to-sky-300"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: DURATION_MS / 1000 - 0.15, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
