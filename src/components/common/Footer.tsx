import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ArrowUpRight, 
  FileText, 
  ExternalLink,
  Dumbbell
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings, categories } = useStore();

  return (
    <footer className="bg-brand-dark text-white border-t border-brand-royal/30 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Address Column (2 spans on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src="/brand/logo.png"
                alt="GE Industries"
                className="h-11 w-auto object-contain"
              />
              <div>
                <span className="font-display font-black text-xl tracking-wider uppercase text-white block">
                  GE INDUSTRIES
                </span>
                <span className="text-[10px] tracking-widest text-brand-accent uppercase font-bold block">
                  Gym Equipment Manufacturing
                </span>
              </div>
            </Link>

            <p className="text-sm text-steel-300 leading-relaxed max-w-sm">
              {settings.tagline} {settings.supporting_headline}
            </p>

            <div className="space-y-2 text-xs text-steel-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {settings.address}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  <a href={`tel:${settings.phone_primary}`} className="hover:text-white transition-colors">
                    {settings.phone_primary}
                  </a>{' '}
                  /{' '}
                  <a href={`tel:${settings.phone_secondary}`} className="hover:text-white transition-colors">
                    {settings.phone_secondary}
                  </a>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </div>

              <div className="pt-2 text-[11px] text-steel-400 font-mono">
                <span>GSTIN: </span>
                <span className="text-white font-semibold">{settings.gstin}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest uppercase text-brand-accent">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-steel-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Shop Catalogue</span>
                </Link>
              </li>
              <li>
                <Link to="/home-gym" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Home Gym Solutions</span>
                </Link>
              </li>
              <li>
                <Link to="/commercial" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Commercial & Wholesale</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>About GE Industries</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Contact Factory</span>
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Help & FAQs</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest uppercase text-brand-accent">
              Equipment Range
            </h4>
            <ul className="space-y-2 text-sm text-steel-300">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/shop?category=${cat.slug}`}
                    className="hover:text-white transition-colors block text-xs leading-normal"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  to="/commercial"
                  className="text-xs font-semibold text-brand-accent hover:underline flex items-center gap-1"
                >
                  <span>Request Custom Steel Fabrication</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest uppercase text-brand-accent">
              Policies & Support
            </h4>
            <ul className="space-y-2 text-xs text-steel-300">
              <li>
                <Link to="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping & Freight Policy
                </Link>
              </li>
              <li>
                <Link to="/returns-policy" className="hover:text-white transition-colors">
                  Returns & Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-steel-400">
          <p>
            © {new Date().getFullYear()} GE Industries. All rights reserved. Gym Equipment Manufacturing, Karur, Tamil Nadu.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span>
              Developed by{' '}
              <a
                href="https://pizodesigns.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-accent hover:text-white font-bold transition-colors underline-offset-4 hover:underline"
              >
                Pizo Designs
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
