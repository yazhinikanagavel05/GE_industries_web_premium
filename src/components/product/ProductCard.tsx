import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, Check, Eye } from 'lucide-react';
import { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';
import { burstFromElement } from '../motion/cartBurst';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    burstFromElement(e.currentTarget);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const materialSpec = product.specifications['Material'] || product.specifications['Frame Material'] || 'Structural Mild Steel';
  const loadCapacity = product.specifications['Tested Load Rating'] || product.specifications['Load Capacity'] || '120 KG Tested';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group spotlight bg-white rounded-2xl border border-slate-200/80 hover:border-brand-accent/50 shadow-sm hover:shadow-xl hover:shadow-brand-navy/10 transition-all duration-300 flex flex-col overflow-hidden relative"
    >
      {/* Top Subtle Status Tag */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <span className="font-mono text-[10px] tracking-wider uppercase text-slate-500 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-slate-200 font-bold">
          Model: {product.model}
        </span>
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide rounded-full bg-white/90 backdrop-blur-md text-emerald-700 border border-emerald-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{product.availability === 'in_stock' ? 'In Stock' : 'Made to Order'}</span>
        </span>
      </div>

      {/* Product Image Area with Clean Studio Light Backdrop */}
      <Link
        to={`/product/${product.slug}`}
        className="block relative bg-[#F8FAFC] p-6 aspect-[4/3] overflow-hidden flex items-center justify-center border-b border-slate-100 group-hover:bg-slate-50/80 transition-colors"
      >
        <img
          src={product.images[0] || '/brand/logo.png'}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-1 drop-shadow-sm group-hover:drop-shadow-xl"
          loading="lazy"
        />

        {/* View Details Subtle Overlay */}
        <div className="absolute inset-0 bg-brand-navy/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span className="px-3.5 py-1.5 bg-white/95 text-brand-navy text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <Eye className="w-3.5 h-3.5 text-brand-accent" />
            <span>View Specifications</span>
          </span>
        </div>
      </Link>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          {/* Engineering Spec Line */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
            <span className="truncate">{materialSpec}</span>
            <span className="text-slate-400">•</span>
            <span className="font-semibold text-slate-600">{loadCapacity}</span>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-base sm:text-lg font-bold text-brand-navy group-hover:text-brand-accent transition-colors line-clamp-1 leading-snug font-display">
              {product.name}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed font-normal">
            {product.short_description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-display font-black text-brand-navy tracking-tight">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.sale_price && product.sale_price > product.price && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  ₹{product.sale_price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 block font-medium">Excl. Freight & GST</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleQuickAdd}
              disabled={isAdded}
              className={`p-2.5 rounded-xl font-semibold transition-all ${
                isAdded
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-brand-navy hover:bg-brand-royal text-white active:scale-95 shadow-md shadow-brand-navy/15'
              }`}
              title="Add to cart"
              aria-label={`Add ${product.name} to cart`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isAdded ? 'added' : 'idle'}
                  initial={{ scale: 0.3, rotate: -90, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0.3, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex"
                >
                  {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                </motion.span>
              </AnimatePresence>
            </button>
            <Link
              to={`/product/${product.slug}`}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-brand-navy transition-colors border border-slate-200/60"
              title="View product specifications"
              aria-label={`View details for ${product.name}`}
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
