import React from 'react';
import { ProductSpecification } from '../../types/product';
import { Shield, Check, Info } from 'lucide-react';

interface SpecTableProps {
  specifications: ProductSpecification;
  isDemo?: boolean;
}

export const SpecTable: React.FC<SpecTableProps> = ({ specifications, isDemo }) => {
  // Filter out any empty keys or values
  const entries = Object.entries(specifications).filter(
    ([key, value]) => key && value && value.trim() !== ''
  );

  if (entries.length === 0) {
    return (
      <div className="p-4 bg-brand-light rounded-xl text-xs text-steel-500 italic">
        Specifications for this product are being documented by GE Industries engineering team.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isDemo && (
        <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Engineering Notice:</strong> These dimensional and load specifications represent demo design targets. Final certified tolerances will be confirmed upon factory tooling approval.
          </span>
        </div>
      )}

      <div className="border border-steel-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <div className="bg-brand-navy px-4 py-3 text-white flex items-center justify-between">
          <span className="font-display font-bold text-sm tracking-wider uppercase">
            Technical Specifications
          </span>
          <span className="text-[10px] font-mono text-brand-accent uppercase font-semibold">
            Mild Steel Fabrication
          </span>
        </div>
        <div className="divide-y divide-steel-100">
          {entries.map(([key, val], idx) => (
            <div
              key={key}
              className={`grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs ${
                idx % 2 === 0 ? 'bg-white' : 'bg-brand-light/40'
              }`}
            >
              <span className="font-semibold text-brand-navy sm:col-span-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent flex-shrink-0" />
                {key}
              </span>
              <span className="text-steel-700 sm:col-span-2 font-mono sm:font-sans font-medium mt-0.5 sm:mt-0">
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
