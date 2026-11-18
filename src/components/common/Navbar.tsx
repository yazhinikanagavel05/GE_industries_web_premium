import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Phone, 
  ChevronRight
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { SearchModal } from './SearchModal';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const { cart, setIsCartOpen } = useCart();
  const { settings } = useStore();
  const location = useLocation();

  // Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Home Gym', path: '/home-gym' },
    { label: 'Commercial Gym', path: '/commercial' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#081225]/95 backdrop-blur-md shadow-xl shadow-black/30 border-b border-brand-accent/25 py-2.5'
            : 'bg-[#0B172E] border-b border-white/10 py-3 sm:py-3.5'
        }`}
      >
        {/* Subtle Scroll Progress Indicator */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-royal via-brand-accent to-sky-300 origin-left z-50 pointer-events-none"
          style={{ scaleX }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            {/* Logo and Brand Title - Ultra High Contrast & Vertically Centered */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="h-10 sm:h-11 w-10 sm:w-11 flex items-center justify-center bg-white rounded-xl p-1 shadow-md border border-white/20 group-hover:scale-105 group-hover:-rotate-6 transition-transform duration-300 flex-shrink-0">
                <img
                  src="/brand/logo.png"
                  alt="GE Industries Gym Equipment Manufacturing"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="hidden min-[420px]:flex flex-col justify-center">
                <span className="block text-base sm:text-lg font-display font-black tracking-wide text-white uppercase leading-none group-hover:text-brand-accent transition-colors whitespace-nowrap">
                  GE INDUSTRIES
                </span>
                <span className="block text-[9px] sm:text-[10px] tracking-widest text-brand-accent uppercase font-bold mt-1 leading-none whitespace-nowrap">
                  Gym Equipment Manufacturing
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links - Single-Line, No-Wrap Capsule */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 bg-white/[0.08] p-1.5 rounded-2xl border border-white/10 shadow-inner flex-shrink-0">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative whitespace-nowrap px-3 xl:px-4 py-2 text-xs xl:text-sm font-bold tracking-wide transition-colors rounded-xl leading-none flex items-center justify-center ${
                      active
                        ? 'text-white font-extrabold'
                        : 'text-white/85 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-xl bg-brand-accent shadow-md shadow-brand-accent/40"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Buttons - Matching Height and Central Horizontal Alignment */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Search Button */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="h-10 px-3 sm:px-3.5 text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-xs font-semibold whitespace-nowrap active:scale-95"
                aria-label="Search gym equipment"
                title="Search products"
              >
                <Search className="w-4 h-4 text-brand-accent flex-shrink-0" />
                <span className="hidden xl:inline text-white">Search</span>
              </button>

              {/* Cart Button with Pulse on Item */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="h-10 px-3.5 sm:px-4 text-white bg-brand-accent hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-brand-accent/30 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider group active:scale-95 whitespace-nowrap"
                aria-label="View shopping cart"
              >
                <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                <span className="hidden sm:inline">Cart</span>
                {cart.total_items > 0 ? (
                  <motion.span
                    key={cart.total_items}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: [1.25, 1] }}
                    transition={{ duration: 0.3 }}
                    className="bg-amber-400 text-brand-dark text-[11px] font-black px-1.5 py-0.5 rounded-full flex items-center justify-center border-2 border-brand-navy shadow min-w-[20px]"
                  >
                    {cart.total_items}
                  </motion.span>
                ) : (
                  <span className="text-[11px] opacity-80">(0)</span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden h-10 w-10 flex items-center justify-center text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors flex-shrink-0 active:scale-95"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-brand-dark/90 backdrop-blur-md"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-[#0B172E] shadow-2xl flex flex-col border-r border-white/20 text-white z-10"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-white/15 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="bg-white rounded-lg p-1 w-9 h-9 flex items-center justify-center">
                    <img src="/brand/logo.png" alt="GE Industries" className="h-full w-full object-contain" />
                  </div>
                  <div>
                    <span className="font-display font-black text-base text-white uppercase block leading-tight">
                      GE INDUSTRIES
                    </span>
                    <span className="text-[10px] text-brand-accent uppercase font-bold tracking-widest block">
                      Karur, Tamil Nadu
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-white hover:bg-white/10 rounded-lg active:scale-95 transition-transform"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {navLinks.map((link) => {
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-bold tracking-wide transition-all ${
                        active
                          ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/30'
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="w-5 h-5 text-white/70" />
                    </Link>
                  );
                })}

                <div className="pt-4 mt-4 border-t border-white/15 space-y-2.5">
                  <a
                    href={`tel:${settings.phone_primary}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-white bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>Call Factory: {settings.phone_primary}</span>
                  </a>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-white/15 bg-black/30 text-xs text-steel-300">
                <p className="font-bold text-white">GE Industries</p>
                <p className="text-[11px] text-brand-accent mt-0.5">Your Strength. Our Engineering.</p>
                <p className="text-[10px] text-steel-400 mt-1">Karuppampalayam, Karur – 639003</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
};
