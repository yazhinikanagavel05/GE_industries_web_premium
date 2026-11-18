import React from 'react';
import { useStore } from '../context/StoreContext';

export const TermsPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="min-h-screen bg-brand-light pb-24">
      <div className="bg-brand-navy text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-brand-royal/40">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-accent">
            Legal Terms
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-white mt-1">
            Terms and Conditions
          </h1>
          <p className="text-xs sm:text-sm text-steel-200 mt-2 font-normal">
            GE Industries • Karur, Tamil Nadu, India
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white rounded-3xl border border-steel-200 p-8 sm:p-12 shadow-sm space-y-6 text-xs sm:text-sm text-steel-700 leading-relaxed font-normal">
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-950 font-medium">
            <strong>Demonstration Notice:</strong> The current website is published for demonstration and evaluation of GE Industries' gym equipment manufacturing concepts. Commercial terms apply upon final formal purchase contract.
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-navy uppercase tracking-wider">
              1. Commercial Representation
            </h2>
            <p>
              By accessing this website, you acknowledge that GE Industries is a gym equipment manufacturing enterprise located in Karur, Tamil Nadu. All product descriptions, photography, dimensional specs, and engineering estimates are subject to technical refinements during production cycles.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-navy uppercase tracking-wider">
              2. Equipment Usage & Structural Safety
            </h2>
            <p>
              Strength training equipment involves handling heavy iron weights and dynamic bodily loads. Users must adhere strictly to stated maximum load capacities, inspect bolts and locking pins periodically, and ensure equipment is positioned on level, load-bearing flooring.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-navy uppercase tracking-wider">
              3. Pricing and GST
            </h2>
            <p>
              Unless otherwise specified, all prices are stated in Indian National Rupees (INR) and are subject to applicable Goods and Services Tax (GST: 18%) as per prevailing government statutory regulations.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-navy uppercase tracking-wider">
              4. Jurisdiction
            </h2>
            <p>
              Any disputes arising from transactions or manufacturing engagements with GE Industries shall be subject exclusively to the judicial jurisdiction of the competent courts in Karur, Tamil Nadu, India.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
