import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useStore();
  const [dismissed, setDismissed] = useState(false);

  const announcement = settings?.announcement_bar;
  if (!announcement || !announcement.enabled || dismissed) return null;

  return (
    <div className="bg-[#060D1A] text-white text-xs sm:text-sm font-medium py-2 px-4 border-b border-white/15 relative z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-center relative">
        <div className="flex items-center gap-2 text-center pr-8 sm:pr-0">
          <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse hidden sm:inline-block" />
          <span className="text-white font-medium">{announcement.text}</span>
          {announcement.link_url && (
            <Link
              to={announcement.link_url}
              className="inline-flex items-center gap-1 font-bold text-sky-400 hover:text-white underline underline-offset-2 transition-colors ml-1.5"
            >
              <span>{announcement.link_text || 'Explore Equipment'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-0 text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Dismiss Announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
