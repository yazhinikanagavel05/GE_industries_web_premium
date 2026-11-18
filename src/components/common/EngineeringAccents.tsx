import React from 'react';

/**
 * Precision Engineering Corner Crosshairs
 */
export const TechnicalCornerMarks: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`pointer-events-none select-none ${className}`}>
    <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-brand-accent/40" />
    <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-brand-accent/40" />
    <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-brand-accent/40" />
    <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-brand-accent/40" />
  </div>
);

/**
 * Engineering Calibration Measurement Ticks
 */
export const SteelMeasurementTicks: React.FC<{ label?: string; className?: string }> = ({
  label = 'GE-SPEC // 60×60mm MILD STEEL',
  className = '',
}) => (
  <div className={`flex items-center gap-2 font-mono text-[10px] tracking-widest text-brand-steel uppercase pointer-events-none select-none ${className}`}>
    <span className="text-brand-accent font-bold">|</span>
    <span className="w-8 h-px bg-brand-accent/30 inline-block" />
    <span className="opacity-80">{label}</span>
    <span className="w-8 h-px bg-brand-accent/30 inline-block" />
    <span className="text-brand-accent font-bold">|</span>
  </div>
);

/**
 * Concentric Plate Circles (Olympic Weight Inspired)
 */
export const SteelPlateRings: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 200 200"
    className={`w-48 h-48 opacity-10 pointer-events-none select-none stroke-brand-accent fill-none ${className}`}
  >
    <circle cx="100" cy="100" r="90" strokeWidth="1" strokeDasharray="4 4" />
    <circle cx="100" cy="100" r="70" strokeWidth="1.5" />
    <circle cx="100" cy="100" r="45" strokeWidth="1" strokeDasharray="2 3" />
    <circle cx="100" cy="100" r="25" strokeWidth="2" />
    <circle cx="100" cy="100" r="10" strokeWidth="1" />
  </svg>
);
