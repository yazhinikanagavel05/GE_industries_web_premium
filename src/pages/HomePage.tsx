import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Dumbbell, 
  ShieldCheck, 
  Wrench, 
  Layers, 
  Truck, 
  Building2, 
  Home, 
  CheckCircle2, 
  FileText,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { BulkEnquiryModal } from '../components/enquiry/BulkEnquiryModal';
import { TechnicalCornerMarks, SteelMeasurementTicks, SteelPlateRings } from '../components/common/EngineeringAccents';
import { TiltCard } from '../components/motion/TiltCard';
import { HeroParticles } from '../components/motion/HeroParticles';
import { ParallaxLayer } from '../components/motion/ParallaxLayer';
import { RotatingPlate, BarbellDivider } from '../components/motion/GraphicAccents';

export const HomePage: React.FC = () => {
  const { products, categories } = useStore();
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // 5 High-Definition Studio Products for Hero Dynamic Showcase Card
  const showcaseProducts = [
    {
      src: '/images/products/manual-treadmill-white.jpg',
      alt: 'GE Heavy-Duty Manual Walking Treadmill MT-01 (Polar White)',
      model: 'MT-01',
      badge: 'Flagship Self-Powered Treadmill',
      title: 'GE Manual Treadmill MT-01',
      subtitle: 'Zero-Electricity Incline Walking Treadmill',
      categoryTag: 'Self-Powered • Fixed Incline Deck',
      price: '₹12,999',
      priceLabel: 'Direct Factory Price',
      highlight1: '100% Non-Motorized Self-Paced Drive',
      highlight2: 'Continuous Steel Wrap-Around Safety Rail',
      linkUrl: '/product/ge-manual-walking-treadmill-mt-01-white',
    },
    {
      src: '/images/products/manual-treadmill-black.jpg',
      alt: 'GE Heavy-Duty Manual Walking Treadmill MT-01 (Matte Black)',
      model: 'MT-01-BLK',
      badge: 'Stealth Black Industrial Edition',
      title: 'GE Manual Treadmill (Black)',
      subtitle: 'Heavy Mild Steel Incline Walking Machine',
      categoryTag: 'Treadmill • Electrostatic Powder Coat',
      price: '₹12,999',
      priceLabel: 'Direct Factory Price',
      highlight1: 'Diamond Anti-Slip Walking Belt',
      highlight2: 'Dual Sealed Bearings & Steel Rollers',
      linkUrl: '/product/ge-manual-walking-treadmill-mt-01-black',
    },
    {
      src: '/images/products/stair-stepper-white-studio.jpg',
      alt: 'GE Adjustable Dual-Handlebar Stair Stepper SC-02',
      model: 'SC-02',
      badge: 'Ergonomic Vertical Step Climber',
      title: 'GE Stair Stepper SC-02',
      subtitle: 'Dual-Handlebar Step Climber Machine',
      categoryTag: 'Cardio Stepper • 5-Hole Linkage',
      price: '₹6,499',
      priceLabel: 'Direct Factory Price',
      highlight1: 'Height-Adjustable Dual Handrails',
      highlight2: '5-Level Pedal Angle & Resistance',
      linkUrl: '/product/ge-adjustable-stair-stepper-sc-02-white',
    },
    {
      src: '/images/products/stair-stepper-black-gym.jpg',
      alt: 'GE Adjustable Stair Stepper Climber SC-02 Matte Black',
      model: 'SC-02-BLK',
      badge: 'Heavy-Duty Steel Construction',
      title: 'GE Stair Stepper (Matte Black)',
      subtitle: 'Full-Body Cardio & Glute Toning',
      categoryTag: 'Stair Stepper • Folding A-Frame',
      price: '₹6,499',
      priceLabel: 'Direct Factory Price',
      highlight1: 'Triangular Folding Scissor Frame',
      highlight2: 'Anti-Slip Oversized Foot Pedals',
      linkUrl: '/product/ge-adjustable-stair-stepper-sc-02-black',
    },
    {
      src: '/images/products/stair-stepper-white-gym.jpg',
      alt: 'GE Stair Stepper in Home Workout Setup',
      model: 'SC-02-HOM',
      badge: 'Apartment Space Saver',
      title: 'GE Stair Climber (Home Gym)',
      subtitle: 'Whisper-Quiet Low-Impact Cardio',
      categoryTag: 'Compact Fitness • Floor Protective Pads',
      price: '₹6,499',
      priceLabel: 'Direct Factory Price',
      highlight1: 'Zero Motor Noise & Zero Power',
      highlight2: 'Compact Foldable Storage',
      linkUrl: '/product/ge-adjustable-stair-stepper-sc-02-white',
    },
  ];

  const [currentShowcaseIdx, setCurrentShowcaseIdx] = useState(0);

  // Automatically cycle through products every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentShowcaseIdx((prev) => (prev + 1) % showcaseProducts.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [showcaseProducts.length]);

  const activeProduct = showcaseProducts[currentShowcaseIdx];

  // Marquee ticker items
  const tickerItems = [
    '100% Heavy-Duty Mild Steel',
    'Manufactured in Karur, Tamil Nadu',
    'Laser-Cut Hole Pitch Engineering',
    '250 KG Tested Load Capacity',
    'Pan-India Heavy Freight Logistics',
    'Direct Factory Invoicing & Support',
    'Space-Conscious Home Gym Solutions',
    'Institutional & Commercial Facility Bundles',
  ];

  return (
    <div className="min-h-screen bg-brand-light text-brand-charcoal overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION — CINEMATIC, ASYMMETRICAL & PRODUCT-FOCUSED               */}
      {/* ========================================================================= */}
      <section className="relative noise-overlay bg-[#071328] text-white overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-12 border-b border-brand-accent/20">
        {/* Real Gym Equipment Atmospheric Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/products/manual-treadmill-white.jpg"
            alt="GE Industries manual fitness equipment engineering"
            className="w-full h-full object-cover object-center opacity-30 filter contrast-125 saturate-125 animate-kenburns will-change-transform"
          />
          {/* Deep Navy Gradient Masks */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#071328] via-[#071328]/95 to-[#071328]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071328] via-transparent to-[#071328]/80" />
          <div className="absolute inset-0 bg-subtle-grid-dark opacity-35" />
        </div>

        {/* Ambient Glowing Lighting */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-accent/20 blur-[130px] pointer-events-none animate-orb" />
        <div className="absolute bottom-10 left-1/4 w-80 h-80 rounded-full bg-brand-royal/25 blur-[110px] pointer-events-none animate-orb-alt" />

        {/* Drifting steel-dust particles */}
        <div className="absolute inset-0 z-[1] pointer-events-none hidden sm:block">
          <HeroParticles />
        </div>

        {/* Slow-turning weight plates (decorative) */}
        <ParallaxLayer className="absolute -right-40 top-10 z-[1] pointer-events-none hidden lg:block" distance={90}>
          <RotatingPlate className="w-[34rem] h-[34rem] text-brand-accent/[0.14]" />
        </ParallaxLayer>
        <ParallaxLayer className="absolute -left-32 bottom-0 z-[1] pointer-events-none hidden md:block" distance={-60}>
          <RotatingPlate reverse className="w-80 h-80 text-sky-300/[0.10]" />
        </ParallaxLayer>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Bold Typography & Actions (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge with pulse */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-brand-accent/40 backdrop-blur-md text-white text-xs font-semibold shadow-md"
              >
                <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                <span className="tracking-wide font-mono text-[11px] uppercase">
                  Gym Equipment Manufacturing • Karur, Tamil Nadu
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-white leading-[1.05]"
              >
                YOUR STRENGTH. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-brand-accent to-sky-300 bg-[length:200%_auto] animate-gradient-x">
                  OUR ENGINEERING.
                </span>
              </motion.h1>

              {/* Supporting Headline */}
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg sm:text-2xl font-display font-bold text-sky-200 tracking-normal"
              >
                Built for Home Gyms. Made for Commercial Fitness.
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal"
              >
                Explore practical gym equipment solutions for your personal workout space or commercial fitness facility. Heavy-duty mild steel engineering fabricated in Karur for lasting strength across India.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
              >
                <Link
                  to="/shop"
                  className="px-8 py-4 bg-brand-accent hover:bg-blue-500 text-white font-bold rounded-2xl text-center shadow-lg shadow-brand-accent/30 hover:shadow-brand-accent/50 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider group transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Explore Equipment</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>

                <button
                  onClick={() => setIsBulkModalOpen(true)}
                  className="px-7 py-4 bg-white/10 hover:bg-white/15 text-white font-bold rounded-2xl text-center border border-white/20 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider backdrop-blur-md transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Building2 className="w-4 h-4 text-brand-accent" />
                  <span>Bulk Order Enquiry</span>
                </button>
              </motion.div>

              {/* Engineering Highlights Line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.55 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10"
              >
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 spotlight spotlight-dark transition-colors duration-300 hover:border-brand-accent/40 hover:bg-white/[0.08]">
                  <p className="text-brand-accent font-black text-lg font-display">MILD STEEL</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Heavy-Gauge Tube</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 spotlight spotlight-dark transition-colors duration-300 hover:border-brand-accent/40 hover:bg-white/[0.08]">
                  <p className="text-white font-black text-lg font-display">250 KG</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Tested Load Rating</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 spotlight spotlight-dark transition-colors duration-300 hover:border-brand-accent/40 hover:bg-white/[0.08]">
                  <p className="text-white font-black text-lg font-display">KARUR, TN</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Direct Fabrication</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 spotlight spotlight-dark transition-colors duration-300 hover:border-brand-accent/40 hover:bg-white/[0.08]">
                  <p className="text-emerald-400 font-black text-lg font-display">PAN-INDIA</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Freight Delivery</p>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Floating Flagship Showcase Card (5 cols) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="lg:col-span-5 relative"
            >
              <TiltCard>
              <div className="relative rounded-3xl bg-gradient-to-b from-white/15 via-white/5 to-white/10 p-6 sm:p-7 backdrop-blur-xl border border-white/20 shadow-2xl animate-float">
                <TechnicalCornerMarks />
                
                {/* Header Tag - Dynamically changes with active showcase product */}
                <div className="flex items-center justify-between mb-4 h-7">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`badge-${activeProduct.model}`}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.3 }}
                      className="px-3 py-1 rounded-full bg-brand-accent text-white text-[10px] font-bold uppercase tracking-wider shadow"
                    >
                      {activeProduct.badge}
                    </motion.span>
                  </AnimatePresence>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`model-${activeProduct.model}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="text-xs font-mono font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded border border-amber-500/30"
                    >
                      Model: {activeProduct.model}
                    </motion.span>
                  </AnimatePresence>
                </div>

                {/* Clean Product Studio Render Container with Synchronized Auto-Changing Images */}
                <div className="relative rounded-2xl bg-gradient-to-b from-slate-100 to-white p-6 aspect-[4/3] flex items-center justify-center overflow-hidden shadow-inner border border-white/60">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeProduct.src}
                      src={activeProduct.src}
                      alt={activeProduct.alt}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.04 }}
                      transition={{ duration: 0.45, ease: 'easeInOut' }}
                      className="max-h-full max-w-full object-contain filter drop-shadow-xl"
                    />
                  </AnimatePresence>

                  {/* Slide Progress Dots */}
                  <div className="absolute bottom-2.5 right-3 flex items-center gap-1.5 z-10 bg-black/45 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
                    {showcaseProducts.map((p, dotIdx) => (
                      <button
                        key={p.model}
                        onClick={() => setCurrentShowcaseIdx(dotIdx)}
                        className={`h-1.5 rounded-full transition-all ${
                          currentShowcaseIdx === dotIdx
                            ? 'w-4 bg-brand-accent shadow-sm'
                            : 'w-1.5 bg-white/50 hover:bg-white'
                        }`}
                        aria-label={`Go to ${p.title}`}
                      />
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`cat-${activeProduct.model}`}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 6 }}
                      transition={{ duration: 0.3 }}
                      className="absolute bottom-2.5 left-3 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-navy/90 text-white z-10 shadow"
                    >
                      {activeProduct.categoryTag}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Card Specs Summary - Dynamically changes with active product */}
                <div className="mt-4 min-h-[148px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`info-${activeProduct.model}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-bold text-white font-display">
                            {activeProduct.title}
                          </h4>
                          <p className="text-xs text-slate-300">{activeProduct.subtitle}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold font-display text-brand-accent">{activeProduct.price}</span>
                          <span className="block text-[10px] text-slate-400">{activeProduct.priceLabel}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-2 border-t border-white/10">
                        <span className="flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{activeProduct.highlight1}</span>
                        </span>
                        <span className="flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{activeProduct.highlight2}</span>
                        </span>
                      </div>

                      <Link
                        to={activeProduct.linkUrl}
                        className="w-full mt-2 py-3 bg-white hover:bg-slate-100 text-brand-navy font-bold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow"
                      >
                        <span>View Specifications</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DYNAMIC LIVE MANUFACTURING MARQUEE TICKER                             */}
      {/* ========================================================================= */}
      <div className="bg-brand-navy border-b border-brand-accent/25 py-3 overflow-hidden text-white relative shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-brand-navy to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-brand-navy to-transparent z-10" />
        <div className="flex whitespace-nowrap animate-marquee">
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-3 mx-6 text-xs sm:text-[13px] font-bold tracking-wide uppercase text-slate-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FEATURED PRODUCTS CATALOGUE (High-End Studio Presentation)             */}
      {/* ========================================================================= */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold font-mono tracking-wider uppercase text-brand-royal mb-1.5">
                <Dumbbell className="w-4 h-4 text-brand-accent" />
                <span>Manufactured Lineup</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-brand-navy tracking-tight">
                Featured Equipment Models
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-xl">
                Heavy-duty mild steel concepts fabricated for barbell squats, bench presses, and organized strength training spaces.
              </p>
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-navy hover:bg-brand-royal text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm self-start md:self-auto"
            >
              <span>View All Products</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 4-Column Balanced Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SHOP BY CATEGORY (Editorial Tiles with Depth)                         */}
      {/* ========================================================================= */}
      <section className="relative noise-overlay py-20 bg-[#0A162D] text-white border-b border-brand-accent/20 overflow-hidden">
        {/* Real Equipment Background Photo with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/products/manual-treadmill-black.jpg"
            alt="Cardio fitness equipment"
            className="w-full h-full object-cover object-center opacity-20 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A162D] via-[#0A162D]/95 to-[#0A162D]" />
          <div className="absolute inset-0 bg-subtle-grid-dark opacity-30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-accent">
              Practical Equipment Solutions
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight mt-1">
              Shop by Category
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2 font-normal">
              Explore equipment designed around space, training goals, and manufacturing durability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="group spotlight spotlight-dark relative rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/15 hover:border-brand-accent/80 shadow-xl hover:shadow-2xl hover:shadow-brand-accent/10 transition-shadow duration-300 flex flex-col justify-between"
              >
                <div className="h-48 overflow-hidden bg-slate-900 relative">
                  <img
                    src={cat.image || '/images/products/manual-treadmill-white.jpg'}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A162D] via-[#0A162D]/40 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-accent transition-colors font-display">
                      {cat.name}
                    </h3>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed font-normal line-clamp-2">
                    {cat.description}
                  </p>
                  <Link
                    to={`/shop?category=${cat.slug}`}
                    className="inline-flex items-center justify-between text-xs font-bold text-white group-hover:text-brand-accent pt-2.5 border-t border-white/15 w-full uppercase tracking-wider"
                  >
                    <span>Browse Equipment</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HOME GYM SECTION (Editorial Split Layout)                             */}
      {/* ========================================================================= */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-slate-100/80 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="bg-[#0B1832] rounded-3xl overflow-hidden text-white shadow-2xl border border-brand-royal/40">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
              {/* Left Content */}
              <div className="p-8 sm:p-12 lg:p-14 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-royal/50 text-sky-300 text-xs font-mono font-bold uppercase tracking-wider border border-sky-400/30">
                  <Home className="w-3.5 h-3.5 text-brand-accent" />
                  <span>Space-Saving Fitness Solutions</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight leading-tight text-white">
                  YOUR SPACE. YOUR PACE. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-brand-accent to-sky-300 bg-[length:200%_auto] animate-gradient-x">
                    YOUR STRENGTH.
                  </span>
                </h2>

                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                  Not everyone has room for a full-sized commercial gym. With the right equipment, an apartment corner, terrace, or spare room can become a practical workout space. Explore equipment options designed around your available space, training goals and budget.
                </p>

                <div className="space-y-2.5 text-xs sm:text-sm text-slate-200">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-accent flex-shrink-0" />
                    <span>Self-powered manual treadmills with fixed incline decks and wrap-around safety rails</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-accent flex-shrink-0" />
                    <span>Dual-handlebar stair steppers with 5-hole adjustable resistance and folding steel frames</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-accent flex-shrink-0" />
                    <span>Zero-electricity, whisper-quiet cardio solutions designed for compact apartment floors</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/home-gym"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-accent hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-accent/30"
                  >
                    <span>Build Your Home Gym</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right Visual Image */}
              <div className="group h-80 sm:h-96 lg:h-full relative overflow-hidden bg-slate-900 min-h-[360px]">
                <img
                  src="/images/products/stair-stepper-white-gym.jpg"
                  alt="Home Gym Setup GE Industries"
                  className="w-full h-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0B1832] via-transparent to-transparent" />
                <div className="absolute bottom-6 right-6 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-xs text-white max-w-xs hidden sm:block">
                  <p className="font-bold text-sky-300">Apartment Friendly Footprint</p>
                  <p className="text-[11px] text-slate-300 mt-1">Zero electricity required. Requires minimal floor space and folds flat for convenient storage.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. COMMERCIAL AND WHOLESALE SECTION (Clean Industrial Treatment)          */}
      {/* ========================================================================= */}
      <section className="relative py-20 bg-white border-y border-slate-200 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Card (5 cols) */}
            <div className="group lg:col-span-5 relative rounded-2xl overflow-hidden shadow-xl border border-slate-200">
              <img
                src="/images/products/manual-treadmill-black.jpg"
                alt="Commercial Gym Equipment GE Industries"
                className="w-full h-80 sm:h-[400px] object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-accent font-bold">
                    Karur Manufacturing
                  </span>
                  <h4 className="text-lg font-bold">Wholesale & Institutional Fitness Orders</h4>
                </div>
              </div>
            </div>

            {/* Content (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-brand-royal">
                <Building2 className="w-4 h-4 text-brand-accent" />
                <span>Commercial & Wholesale Partnerships</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-brand-navy tracking-tight leading-tight">
                BUILDING GYMS STARTS WITH THE RIGHT PARTNER.
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Planning a new gym, expanding a fitness centre or sourcing equipment in bulk? GE Industries welcomes enquiries from gym owners, dealers and wholesale buyers. Tell us about your requirements and let us help you explore suitable options.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                <div className="spotlight p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-brand-accent/40">
                  <h5 className="font-bold text-brand-navy text-sm uppercase">Gym Owners</h5>
                  <p className="text-xs text-slate-600 mt-1">Complete floor equipment bundles with custom color coatings to match your brand.</p>
                </div>
                <div className="spotlight p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-brand-accent/40">
                  <h5 className="font-bold text-brand-navy text-sm uppercase">Dealers & Resellers</h5>
                  <p className="text-xs text-slate-600 mt-1">Competitive manufacturer margin structures for fitness distributors across India.</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsBulkModalOpen(true)}
                  className="px-8 py-3.5 bg-brand-navy hover:bg-brand-royal text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-navy/20 flex items-center gap-2 active:scale-95"
                >
                  <Building2 className="w-4 h-4 text-brand-accent" />
                  <span>Request a Bulk Quote</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. WHY CHOOSE GE INDUSTRIES (Pillars with Clean Minimalist Icons)          */}
      {/* ========================================================================= */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 overflow-hidden">
        <div className="absolute inset-0 bg-subtle-grid opacity-50 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-royal">
              Manufacturing Principles
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-brand-navy tracking-tight mt-1">
              Why Choose GE Industries
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 font-normal">
              Bringing together steel fabrication, practical design, and direct manufacturer support across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            <motion.div
              whileHover={{ y: -5 }}
              className="group spotlight p-6 sm:p-7 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-brand-accent/40 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-royal/10 text-brand-royal flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-brand-accent group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-lg group-hover:shadow-brand-accent/30">
                <Wrench className="w-6 h-6 text-brand-accent transition-colors duration-300 group-hover:text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-brand-navy font-display">
                Practical Engineering
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                Creating functional gym equipment built around real workout movements and space constraints, avoiding unnecessary complexity.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="group spotlight p-6 sm:p-7 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-brand-accent/40 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-royal/10 text-brand-royal flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-brand-accent group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-lg group-hover:shadow-brand-accent/30">
                <ShieldCheck className="w-6 h-6 text-brand-accent transition-colors duration-300 group-hover:text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-brand-navy font-display">
                Quality-Focused Manufacturing
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                Careful attention to mild steel selection, tube gauge thickness, structural welding, and electrostatic powder coat finishing.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="group spotlight p-6 sm:p-7 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-brand-accent/40 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-royal/10 text-brand-royal flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-brand-accent group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-lg group-hover:shadow-brand-accent/30">
                <Layers className="w-6 h-6 text-brand-accent transition-colors duration-300 group-hover:text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-brand-navy font-display">
                Solutions for Different Spaces
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                Equipment tailored for compact apartment training zones, boutique personal training studios, and commercial facilities.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="group spotlight p-6 sm:p-7 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-brand-accent/40 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-royal/10 text-brand-royal flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-brand-accent group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-lg group-hover:shadow-brand-accent/30">
                <Truck className="w-6 h-6 text-brand-accent transition-colors duration-300 group-hover:text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-brand-navy font-display">
                Individual & Bulk Support
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                Direct factory responsiveness whether you are ordering a single adjustable bench or outfitting an entire commercial facility.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. BRAND STORY SECTION (Authentic Brochure Content & Split Layout)        */}
      {/* ========================================================================= */}
      <section className="relative noise-overlay py-20 bg-[#09152B] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <img
            src="/images/products/stair-stepper-white-stairs.jpg"
            alt="GE Industries fitness equipment"
            className="w-full h-full object-cover filter contrast-125"
          />
          <div className="absolute inset-0 bg-[#09152B]/90" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story Text (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-brand-accent">
                <span>About GE Industries</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white leading-tight">
                Strength Begins with the Right Foundation
              </h2>

              <div className="space-y-3.5 text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                <p>
                  Every fitness journey starts somewhere. For some, it begins with a pair of dumbbells in an apartment. For others, it begins with a dream of building a gym that inspires people to become stronger.
                </p>
                <p>
                  At GE Industries, we believe the equipment behind that journey matters. Based in Karur, Tamil Nadu, GE Industries focuses on gym equipment manufacturing, bringing together steel, engineering and practical design to serve different workout spaces and training needs.
                </p>
                <p>
                  From space-conscious home gym solutions to equipment for commercial fitness centres, our goal is to help individuals and businesses find equipment that fits their requirements.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-3.5">
                <Link
                  to="/about"
                  className="px-6 py-3 bg-brand-accent hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-md shadow-brand-accent/30"
                >
                  <span>Read Full Brand Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="/brand/ge-industries-brochure.pdf"
                  download="GE-Industries-Brochure.pdf"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2 border border-white/20"
                >
                  <FileText className="w-4 h-4 text-brand-accent" />
                  <span>Download Company Brochure (PDF)</span>
                </a>
              </div>
            </div>

            {/* Vision and Mission Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="spotlight spotlight-dark p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md shadow-lg transition-all duration-300 hover:border-brand-accent/40 hover:-translate-y-0.5">
                <h4 className="text-xs font-mono font-bold tracking-widest text-brand-accent uppercase mb-1.5">
                  OUR VISION
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  To become a trusted name in gym equipment manufacturing across India by making quality-focused fitness solutions accessible to homes, gyms and growing fitness businesses.
                </p>
              </div>

              <div className="spotlight spotlight-dark p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md shadow-lg transition-all duration-300 hover:border-brand-accent/40 hover:-translate-y-0.5">
                <h4 className="text-xs font-mono font-bold tracking-widest text-sky-300 uppercase mb-1.5">
                  OUR MISSION
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  To manufacture gym equipment with a focus on construction quality, functionality and durability; create practical solutions for home and commercial fitness spaces; and make product discovery convenient for individual customers, gym owners and wholesale buyers across India.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FINAL CLOSING CTA SECTION (High-Impact Luxury Navy & Electric Blue)     */}
      {/* ========================================================================= */}
      <section className="relative noise-overlay py-20 bg-gradient-to-b from-[#102650] to-[#081225] text-white text-center overflow-hidden border-t border-brand-accent/20">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[38rem] h-72 rounded-full bg-brand-accent/20 blur-[120px] pointer-events-none animate-orb" />
        <RotatingPlate className="absolute -left-28 top-1/2 -translate-y-1/2 w-80 h-80 text-brand-accent/[0.14] hidden md:block" />
        <RotatingPlate reverse className="absolute -right-28 top-1/2 -translate-y-1/2 w-80 h-80 text-sky-300/[0.12] hidden md:block" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5">
          <BarbellDivider className="w-56 sm:w-72 h-auto mx-auto text-brand-accent/70" />
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-brand-accent">
            <span>Direct Manufacturer • Karur, Tamil Nadu</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-white leading-tight">
            Ready to Engineer Your Strength?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-normal">
            Whether you are outfitting your personal workout sanctuary or commissioning bulk commercial rigs, GE Industries delivers quality steel craftsmanship across India.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-3.5 bg-brand-accent hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-accent/30 active:scale-95"
            >
              Explore Equipment
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all border border-white/25 active:scale-95"
            >
              Contact GE Industries
            </Link>
          </div>
        </div>
      </section>

      {/* Global Bulk Enquiry Modal */}
      <BulkEnquiryModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
      />
    </div>
  );
};
