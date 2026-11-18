import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, productName }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });

  const activeImage = images[selectedIdx] || '/brand/logo.png';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle((prev) => ({ ...prev, display: 'none' }));
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[500px] scrollbar-thin py-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 p-1 bg-white flex-shrink-0 transition-all ${
                selectedIdx === idx
                  ? 'border-brand-accent shadow-md scale-105'
                  : 'border-steel-200 hover:border-steel-400 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Viewer */}
      <div className="flex-1 bg-white rounded-2xl border border-steel-200 p-6 flex items-center justify-center relative overflow-hidden group shadow-sm min-h-[360px] sm:min-h-[460px]">
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full flex items-center justify-center cursor-crosshair relative"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              src={activeImage}
              alt={productName}
              className="max-h-[420px] max-w-full object-contain"
            />
          </AnimatePresence>

          {/* High-def zoom lens overlay on hover */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-200 bg-no-repeat rounded-xl hidden md:block"
            style={{
              display: zoomStyle.display,
              backgroundImage: `url(${activeImage})`,
              backgroundSize: '220%',
              backgroundPosition: zoomStyle.backgroundPosition,
            }}
          />
        </div>

        <div className="absolute bottom-3 right-3 text-[11px] text-steel-400 bg-white/80 px-2 py-0.5 rounded backdrop-blur-sm pointer-events-none hidden md:block">
          Hover to zoom into engineering details
        </div>
      </div>
    </div>
  );
};
