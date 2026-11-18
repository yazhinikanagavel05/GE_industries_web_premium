import React, { useState } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const DemoNoticeBanner: React.FC = () => {
  const { settings } = useStore();
  const [dismissed, setDismissed] = useState(false);

  if (!settings?.ecommerce?.demo_mode_enabled || dismissed) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-900 font-medium">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong className="font-semibold text-amber-950 uppercase tracking-wider">Factory Preview Store:</strong>{' '}
            Featuring GE Industries manual treadmills & stair steppers manufactured in Karur, Tamil Nadu. Test payments enabled for checkout verification.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-800 hover:text-amber-950 p-1 rounded hover:bg-amber-500/20 transition-colors"
          title="Dismiss notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
