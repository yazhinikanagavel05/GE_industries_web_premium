import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search, RotateCcw, Dumbbell } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';

export const ShopPage: React.FC = () => {
  const { products, categories } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategorySlug = searchParams.get('category') || 'all';
  const searchQueryParam = searchParams.get('search') || '';

  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'>('price-asc');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchQueryParam);

  const activeCategory = useMemo(() => {
    if (selectedCategorySlug === 'all') return null;
    return categories.find((c) => c.slug === selectedCategorySlug);
  }, [selectedCategorySlug, categories]);

  const handleCategorySelect = (slug: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', slug);
    }
    setSearchParams(nextParams);
  };

  const handleClearFilters = () => {
    setSearchParams({});
    setSearchQuery('');
    setInStockOnly(false);
    setSortBy('price-asc');
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategorySlug !== 'all') {
          const categoryObj = categories.find((c) => c.slug === selectedCategorySlug);
          if (categoryObj && p.category_id !== categoryObj.id) {
            return false;
          }
        }

        // In Stock filter
        if (inStockOnly && p.availability !== 'in_stock') {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.model.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.short_description.toLowerCase().includes(q);
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        return 0;
      });
  }, [products, categories, selectedCategorySlug, inStockOnly, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 relative overflow-hidden">
      {/* Subtle Blueprint Pattern across shop */}
      <div className="absolute inset-0 bg-subtle-grid opacity-60 pointer-events-none" />

      {/* Header Banner with Real Gym Visual Background */}
      <div className="relative bg-[#071328] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-brand-accent/20 overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/products/manual-treadmill-white.jpg"
            alt="Gym equipment catalogue"
            className="w-full h-full object-cover object-center opacity-30 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071328] via-[#071328]/95 to-[#071328]/80" />
          <div className="absolute inset-0 bg-subtle-grid-dark opacity-30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-mono font-bold uppercase tracking-wider mb-3 border border-white/15">
            <Dumbbell className="w-3.5 h-3.5 text-brand-accent" />
            <span>Commercial & Home Fitness Cardio Equipment</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white">
            {activeCategory ? activeCategory.name : 'Gym Equipment Catalogue'}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl font-normal leading-relaxed">
            {activeCategory
              ? activeCategory.description
              : 'Precision manufactured fitness equipment built in Karur, Tamil Nadu. Browse self-powered manual walking treadmills and dual-handlebar stair climbers.'}
          </p>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Filter & Sort Bar */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-5 mb-8 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search equipment by name or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-slate-300 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-slate-50/50"
              />
            </div>

            {/* Sort Dropdown & Quick Toggles */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none bg-slate-100/70 hover:bg-slate-200 px-3.5 py-2.5 rounded-2xl border border-slate-200 transition-colors">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-brand-royal focus:ring-brand-accent"
                />
                <span>In Stock Only</span>
              </label>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                <span>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3.5 py-2.5 rounded-2xl border border-slate-300 bg-white text-xs font-semibold focus:outline-none focus:border-brand-accent shadow-sm"
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>

              {(selectedCategorySlug !== 'all' || inStockOnly || searchQuery) && (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:text-red-600 rounded-2xl hover:bg-red-50 border border-slate-200 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-100 scrollbar-none">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide whitespace-nowrap transition-all ${
                selectedCategorySlug === 'all'
                  ? 'bg-brand-navy text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              All Equipment ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter((p) => p.category_id === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedCategorySlug === cat.slug
                      ? 'bg-brand-navy text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Count Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
          </p>
          <span className="text-xs text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 font-medium">
            Demo Catalogue: Specifications illustrative until factory approval
          </span>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Dumbbell className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-brand-navy">No Equipment Found</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No products match your selected filters. Try clearing your search query or selecting a different equipment category.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 bg-brand-navy text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-royal transition-colors shadow"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
