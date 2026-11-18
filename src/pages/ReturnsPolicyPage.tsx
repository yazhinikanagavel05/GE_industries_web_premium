import React from 'react';
import { RotateCcw, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ReturnsPolicyPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="min-h-screen bg-brand-light pb-24">
      <div className="bg-brand-navy text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-brand-royal/40">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-accent">
            Customer Confidence
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-white mt-1">
            Returns and Refund Policy
          </h1>
          <p className="text-xs sm:text-sm text-steel-200 mt-2 font-normal">
            GE Industries • Karur, Tamil Nadu, India
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white rounded-3xl border border-steel-200 p-8 sm:p-12 shadow-sm space-y-8 text-xs sm:text-sm text-steel-700 leading-relaxed font-normal">
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-950 font-medium">
            <strong>Demonstration Policy Notice:</strong> This store is currently operating in factory demonstration mode. Real refund workflows will become active upon commercial launch.
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-navy uppercase tracking-wider">
              1. 7-Day Transit Damage & Defect Reporting
            </h2>
            <p>
              We inspect all steel weldments, powder-coated finishes, and hardware packs prior to packaging. If your equipment arrives with structural defects or transit-incurred damage, please document the outer packaging and damaged parts with photographs and notify our Karur team within 7 calendar days of delivery.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-navy uppercase tracking-wider">
              2. Replacement of Parts vs. Full Return
            </h2>
            <p>
              Because modular gym equipment consists of separate structural members, minor transit scuffs or missing bolts can typically be resolved swiftly via express courier replacement of the specific part rather than returning a heavy palletized unit.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-navy uppercase tracking-wider">
              3. Refund Eligibility & Method
            </h2>
            <p>
              In the event that an item is verified structurally defective and cannot be resolved through replacement parts, GE Industries will arrange freight return pickup and issue a full refund to the original bank account or payment method within 5 to 7 business days following receipt and inspection at our factory.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-navy uppercase tracking-wider">
              4. Non-Returnable Scenarios
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Custom fabricated equipment tailored with custom laser-cut logos or non-standard frame dimensions.</li>
              <li>Equipment damaged due to improper assembly, exceeding stated load ratings, or exposure to outdoor rain/moisture.</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-steel-200 text-xs text-steel-500">
            <p>For return or replacement requests, contact: {settings.phone_primary} / {settings.phone_secondary} or email {settings.email}.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
