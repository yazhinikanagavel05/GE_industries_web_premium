import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types/product';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { products, categories } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setResults([]);
      return;
    }

    const filtered = products.filter((p) => {
      const cat = categories.find((c) => c.id === p.category_id)?.name.toLowerCase() || '';
      return (
        p.name.toLowerCase().includes(trimmed) ||
        p.model.toLowerCase().includes(trimmed) ||
        p.sku.toLowerCase().includes(trimmed) ||
        cat.includes(trimmed) ||
        p.short_description.toLowerCase().includes(trimmed)
      );
    });
    setResults(filtered);
  }, [query, products, categories]);

  const handleSelect = (slug: string) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  const handleCategoryClick = (categorySlug: string) => {
    onClose();
    navigate(`/shop?category=${categorySlug}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex items-start justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-dark/80 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-steel-200 overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="relative border-b border-steel-200 p-4 flex items-center gap-3">
              <Search className="w-6 h-6 text-brand-royal flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search manual treadmills, stair steppers, model MT-01, SC-02..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full text-lg font-medium text-brand-charcoal placeholder-steel-400 bg-transparent outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-full text-steel-400 hover:text-brand-charcoal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="px-2 py-1 text-xs uppercase font-mono tracking-wider bg-steel-100 text-steel-600 rounded hover:bg-steel-200"
              >
                ESC
              </button>
            </div>

            {/* Results or Quick Categories */}
            <div className="max-h-[60vh] overflow-y-auto p-4">
              {query.trim() === '' ? (
                <div>
                  <p className="text-xs font-semibold tracking-wider uppercase text-steel-500 mb-3">
                    Popular Equipment Categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.slug)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-light hover:bg-brand-royal/10 text-brand-navy rounded-lg text-sm font-medium transition-colors border border-steel-200"
                      >
                        <Tag className="w-3.5 h-3.5 text-brand-accent" />
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-steel-100">
                    <p className="text-xs font-semibold tracking-wider uppercase text-steel-500 mb-2">
                      Quick Products
                    </p>
                    <div className="space-y-2">
                      {products.slice(0, 4).map((p) => (
                        <div
                          key={p.id}
                          onClick={() => handleSelect(p.slug)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-brand-light cursor-pointer group transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-steel-100"
                            />
                            <div>
                              <p className="font-semibold text-brand-navy group-hover:text-brand-accent transition-colors">
                                {p.name}
                              </p>
                              <p className="text-xs text-steel-500">Model: {p.model} • ₹{p.price.toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-steel-400 group-hover:text-brand-accent transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold tracking-wider uppercase text-steel-500 mb-2">
                    Found {results.length} Matching Equipment
                  </p>
                  {results.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelect(p.slug)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-light cursor-pointer group transition-colors border border-transparent hover:border-steel-200"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-14 h-14 object-contain bg-white rounded-lg p-1 border border-steel-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-brand-navy group-hover:text-brand-accent transition-colors">
                              {p.name}
                            </h4>
                            <span className="text-xs px-2 py-0.5 rounded font-mono bg-steel-100 text-steel-700">
                              {p.model}
                            </span>
                          </div>
                          <p className="text-xs text-steel-600 line-clamp-1">{p.short_description}</p>
                          <p className="text-xs font-bold text-brand-royal mt-0.5">
                            ₹{p.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-steel-400 group-hover:text-brand-accent transition-transform group-hover:translate-x-1" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-steel-600 font-medium">No gym equipment found for "{query}".</p>
                  <p className="text-xs text-steel-400 mt-1">Try searching for "manual treadmill", "stair stepper", "cardio", or "MT-01".</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
