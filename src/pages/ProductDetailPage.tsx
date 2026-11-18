import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Zap, 
  Building2, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Info, 
  ChevronRight, 
  Plus, 
  Minus, 
  Check, 
  Share2,
  FileText
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { ImageGallery } from '../components/product/ImageGallery';
import { SpecTable } from '../components/product/SpecTable';
import { ProductCard } from '../components/product/ProductCard';
import { BulkEnquiryModal } from '../components/enquiry/BulkEnquiryModal';
import { burstFromElement } from '../components/motion/cartBurst';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, categories, settings } = useStore();
  const { addToCart } = useCart();

  const product = products.find((p) => p.slug === slug);
  const category = categories.find((c) => c.id === product?.category_id);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariantOption, setSelectedVariantOption] = useState<string>('');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'shipping' | 'warranty'>('specs');

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
    setIsAdded(false);
    if (product?.variants && product.variants.length > 0 && product.variants[0].options.length > 0) {
      setSelectedVariantOption(product.variants[0].options[0].value);
    }
  }, [slug, product]);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 550);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-brand-navy">Product Not Found</h2>
        <p className="text-sm text-steel-500 mt-2">The equipment model you are searching for might have been moved or removed.</p>
        <Link
          to="/shop"
          className="mt-6 px-6 py-2.5 bg-brand-navy text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-royal transition-colors"
        >
          Back to Catalogue
        </Link>
      </div>
    );
  }

  const selectedVariantObj = product.variants?.[0]?.options.find(
    (opt) => opt.value === selectedVariantOption
  );

  const finalUnitPrice = product.price + (selectedVariantObj?.price_adjustment || 0);

  const handleAddToCart = (e?: React.MouseEvent<HTMLElement>) => {
    burstFromElement(e?.currentTarget);
    addToCart(
      product,
      quantity,
      product.variants && product.variants.length > 0 && selectedVariantObj
        ? {
            variant_name: product.variants[0].name,
            option_label: selectedVariantObj.label,
            price_adjustment: selectedVariantObj.price_adjustment || 0,
          }
        : undefined
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  // Related products (exclude current)
  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 relative overflow-hidden">
      {/* Subtle Blueprint Pattern Background */}
      <div className="absolute inset-0 bg-subtle-grid opacity-60 pointer-events-none" />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-brand-navy transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <Link to="/shop" className="hover:text-brand-navy transition-colors">
            Shop
          </Link>
          {category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <Link to={`/shop?category=${category.slug}`} className="hover:text-brand-navy transition-colors">
                {category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-brand-navy font-bold truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Image Gallery (7 cols) */}
          <div className="lg:col-span-7">
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Purchasing & Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-royal">
                  {category ? category.name : 'Strength Equipment'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-1.5 text-slate-400 hover:text-brand-navy rounded-lg hover:bg-slate-100 transition-colors"
                    title="Share equipment link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  {showCopied && (
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Link copied!
                    </span>
                  )}
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-black text-brand-navy uppercase tracking-tight leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 text-xs font-mono text-slate-500 mt-2">
                <span>Model: <strong className="text-brand-navy">{product.model}</strong></span>
                <span>•</span>
                <span>SKU: {product.sku}</span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold uppercase">
                  {product.availability === 'in_stock' ? 'In Stock' : 'Made to Order'}
                </span>
              </div>
            </div>

            {/* Price block */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-display font-black text-brand-navy tracking-tight">
                    ₹{finalUnitPrice.toLocaleString('en-IN')}
                  </span>
                  {product.sale_price && product.sale_price > finalUnitPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      ₹{product.sale_price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Excl. GST & heavy freight delivery from Karur factory
                </p>
              </div>

              <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2.5 py-1 bg-brand-royal/10 text-brand-royal rounded-lg">
                Direct Factory Rate
              </span>
            </div>

            {/* Short summary */}
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              {product.short_description}
            </p>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                  {product.variants[0].name}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants[0].options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedVariantOption(opt.value)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                        selectedVariantOption === opt.value
                          ? 'bg-brand-navy text-white border-brand-navy shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-brand-royal/40'
                      }`}
                    >
                      {opt.label}
                      {opt.price_adjustment ? ` (+₹${opt.price_adjustment})` : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm h-12">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 h-full text-slate-600 hover:bg-slate-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-brand-navy font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 h-full text-slate-600 hover:bg-slate-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 h-12 px-6 font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-brand-navy hover:bg-brand-royal text-white active:scale-95 shadow-brand-navy/20'
                  }`}
                >
                  {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  <span>{isAdded ? 'Added to Cart ✓' : 'Add to Cart'}</span>
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 bg-brand-accent hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-accent/30 flex items-center justify-center gap-2 active:scale-95"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Simulate Instant Checkout</span>
              </button>

              <button
                onClick={() => setIsBulkModalOpen(true)}
                className="w-full py-3 px-6 bg-white hover:bg-slate-50 text-brand-navy font-bold rounded-xl text-xs uppercase tracking-wider border border-slate-300 transition-colors flex items-center justify-center gap-2"
              >
                <Building2 className="w-4 h-4 text-brand-royal" />
                <span>Request Commercial / Bulk Quote for this Model</span>
              </button>
            </div>

            {/* Assurance Badges */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-600 font-medium">
              <div className="p-2.5 bg-white rounded-xl border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-brand-royal mx-auto mb-1" />
                <span>Structural Mild Steel</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-100">
                <Truck className="w-4 h-4 text-brand-royal mx-auto mb-1" />
                <span>Pan-India Heavy Freight</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-100">
                <RotateCcw className="w-4 h-4 text-brand-royal mx-auto mb-1" />
                <span>Direct Factory Warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Detailed Specifications & Policy Sections */}
        <div className="mt-16 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Tabs header */}
          <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'border-brand-accent bg-white text-brand-navy'
                  : 'border-transparent text-slate-600 hover:text-brand-navy'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Full Specifications & Engineering</span>
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'shipping'
                  ? 'border-brand-accent bg-white text-brand-navy'
                  : 'border-transparent text-slate-600 hover:text-brand-navy'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Shipping & Delivery Policy</span>
            </button>
            <button
              onClick={() => setActiveTab('warranty')}
              className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'warranty'
                  ? 'border-brand-accent bg-white text-brand-navy'
                  : 'border-transparent text-slate-600 hover:text-brand-navy'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Warranty & Quality Guarantee</span>
            </button>
          </div>

          {/* Tab content */}
          <div className="p-6 sm:p-8">
            {activeTab === 'specs' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-brand-navy uppercase mb-2 font-display">
                    Product Description
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
                <SpecTable specifications={product.specifications} isDemo={product.is_demo} />
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 text-sm text-slate-700 leading-relaxed max-w-3xl">
                <h3 className="text-base sm:text-lg font-bold text-brand-navy uppercase font-display">
                  Heavy Equipment Freight & Delivery
                </h3>
                <p>
                  Because GE Industries gym equipment is constructed with heavy-gauge mild steel tubing and solid iron components, orders are shipped via specialized logistics freight partners equipped for palletized heavy cargo.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-bold text-brand-navy text-xs uppercase">Dispatch Location</p>
                    <p className="text-xs text-slate-600 mt-1">Dispatched directly from factory warehouse in Karur, Tamil Nadu (PIN: 639003).</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-bold text-brand-navy text-xs uppercase">Estimated Transit Timeline</p>
                    <p className="text-xs text-slate-600 mt-1">Tamil Nadu & South India: 3–5 business days. Rest of India: 6–9 business days.</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 pt-2">
                  Free freight delivery applies to qualifying orders over ₹{settings.ecommerce.free_shipping_threshold.toLocaleString('en-IN')}. For commercial orders requiring hydraulic tail-lift delivery or on-site installation, please submit a bulk enquiry.
                </p>
              </div>
            )}

            {activeTab === 'warranty' && (
              <div className="space-y-4 text-sm text-slate-700 leading-relaxed max-w-3xl">
                <h3 className="text-base sm:text-lg font-bold text-brand-navy uppercase font-display">
                  Manufacturing Frame Warranty
                </h3>
                <p>
                  GE Industries stands behind the structural integrity of its welding and steel fabrication.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                  <li><strong>Steel Structural Welds:</strong> 1 Year Warranty against structural weld separation under normal rated exercise usage.</li>
                  <li><strong>Powder Coating & Finish:</strong> 6 Months against factory blistering or peeling.</li>
                  <li><strong>Wear Parts & Grip Materials:</strong> 6 Months on walking belts, steel roller bearings, pedal linkage brackets, and ergonomic foam grips.</li>
                  <li><strong>Quality Notice:</strong> Official factory warranty certificate will accompany production equipment deliveries.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-royal">
                  Recommended Additions
                </span>
                <h3 className="text-2xl font-display font-black text-brand-navy uppercase tracking-tight mt-1">
                  Related Gym Equipment
                </h3>
              </div>
              <Link
                to="/shop"
                className="text-xs font-bold text-brand-royal hover:text-brand-accent uppercase tracking-wider flex items-center gap-1"
              >
                <span>View Full Lineup</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Sticky Quick Buy Bar on Desktop */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3 px-4 sm:px-8 shadow-2xl hidden md:block"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-11 h-11 object-contain rounded-lg border border-slate-200 bg-slate-50 p-1"
                />
                <div>
                  <h4 className="text-sm font-bold text-brand-navy line-clamp-1">{product.name}</h4>
                  <span className="text-xs font-mono text-slate-500">Model: {product.model}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xl font-display font-black text-brand-navy">
                    ₹{finalUnitPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">Excl. GST & Freight</span>
                </div>
                <button
                  onClick={handleAddToCart}
                  className={`py-2.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                    isAdded
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-brand-navy hover:bg-brand-royal text-white shadow-md shadow-brand-navy/20 active:scale-95'
                  }`}
                >
                  {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  <span>{isAdded ? 'Added ✓' : 'Add to Cart'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Enquiry Modal */}
      <BulkEnquiryModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        defaultProduct={product.name}
      />
    </div>
  );
};
