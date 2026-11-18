import React from 'react';
import { motion } from 'framer-motion';

/**
 * Slowly rotating Olympic weight-plate line drawing — decorative only.
 * Colour comes from `currentColor`, so style it with text-* utilities.
 */
export const RotatingPlate: React.FC<{ className?: string; reverse?: boolean }> = ({
  className = '',
  reverse = false,
}) => {
  const ticks = Array.from({ length: 36 }, (_, i) => i * 10);
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      className={`pointer-events-none select-none ${reverse ? 'animate-spin-slow-reverse' : 'animate-spin-slow'} ${className}`}
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="96" strokeWidth="1.2" />
      <circle cx="100" cy="100" r="88" strokeWidth="0.6" strokeDasharray="3 5" />
      <circle cx="100" cy="100" r="64" strokeWidth="1.4" />
      <circle cx="100" cy="100" r="56" strokeWidth="0.6" />
      <circle cx="100" cy="100" r="22" strokeWidth="1.6" />
      <circle cx="100" cy="100" r="9" strokeWidth="1" />
      {ticks.map((deg) => (
        <line
          key={deg}
          x1="100"
          y1="6"
          x2="100"
          y2={deg % 30 === 0 ? '16' : '11'}
          strokeWidth={deg % 30 === 0 ? 1.4 : 0.7}
          transform={`rotate(${deg} 100 100)`}
        />
      ))}
      {[0, 90, 180, 270].map((deg) => (
        <circle key={deg} cx="100" cy="42" r="3.2" strokeWidth="1.2" transform={`rotate(${deg} 100 100)`} />
      ))}
    </svg>
  );
};

/**
 * Barbell silhouette that draws itself as it scrolls into view.
 */
export const BarbellDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: { pathLength: { delay: i * 0.12, duration: 0.9, ease: 'easeInOut' as const }, opacity: { delay: i * 0.12, duration: 0.2 } },
    }),
  };

  return (
    <motion.svg
      viewBox="0 0 320 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* bar */}
      <motion.path d="M70 22 H250" variants={draw} custom={0} />
      {/* left plates */}
      <motion.path d="M70 8 V36 M60 3 V41 M49 10 V34 M40 15 V29 M40 22 H4" variants={draw} custom={1} />
      {/* right plates */}
      <motion.path d="M250 8 V36 M260 3 V41 M271 10 V34 M280 15 V29 M280 22 H316" variants={draw} custom={1} />
      {/* centre knurl marks */}
      <motion.path d="M140 17 V27 M148 17 V27 M156 17 V27 M164 17 V27 M172 17 V27 M180 17 V27" variants={draw} custom={2} strokeWidth="1" />
    </motion.svg>
  );
};
