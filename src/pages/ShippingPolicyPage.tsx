import React from 'react';
import { Truck, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ShippingPolicyPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="min-h-screen bg-brand-light pb-24">
      <div className="bg-brand-navy text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-brand-royal/40">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-accent">
            Heavy Equipment Logistics
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-white mt-1">
            Shipping and Delivery Policy
          </h1>
          <p className="text-xs sm:text-sm text-steel-200 mt-2 font-normal">
            GE Industries • Karur, Tamil Nadu, India • Pan-India Freight Network
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white rounded-3xl border border-steel-200 p-8 sm:p-12 shadow-sm space-y-8 text-xs sm:text-sm text-steel-700 leading-relaxed font-normal">
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-950 font-medium">
            <strong>Demonstration Policy Notice:</strong> This store is currently operating in factory demonstration mode. Orders placed online are test simulations and do not initiate actual commercial road freight dispatches.
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-navy uppercase tracking-wider">
              1. Heavy Freight Logistics Operations
            </h2>
            <p>
              Due to the substantial weight and dimensions of mild-steel gym equipment (such as power racks, adjustable workout benches, and multi-tier dumbbell racks), GE Industries utilizes specialized palletized road transport freight partners experienced in heavy industrial machinery handling.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-navy uppercase tracking-wider">
              2. Dispatch Location & Processing
            </h2>
            <p>
              All shipments originate directly from our manufacturing and warehouse center in Karuppampalayam, Karur – 639003, Tamil Nadu, India.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>In-Stock Equipment:</strong> Dispatched within 2 to 4 business days following order verification and technical quality check.</li>
              <li><strong>Made-to-Order / Custom Commercial Racks:</strong> Standard fabrication timeline is 7 to 14 business days prior to dispatch.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-navy uppercase tracking-wider">
              3. Estimated Transit Timelines
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Tamil Nadu & Kerala:</strong> 2 to 4 business days.</li>
              <li><strong>Karnataka, Andhra Pradesh & Telangana:</strong> 3 to 5 business days.</li>
              <li><strong>Maharashtra, Gujarat & Central India:</strong> 5 to 7 business days.</li>
              <li><strong>Delhi NCR, Northern & Eastern States:</strong> 7 to 9 business days.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-navy uppercase tracking-wider">
              4. Freight Charges & Free Delivery Threshold
            </h2>
            <p>
              Standard flat freight delivery within India is ₹{settings.ecommerce.shipping_flat_rate.toLocaleString('en-IN')}. Orders meeting or exceeding our threshold of ₹{settings.ecommerce.free_shipping_threshold.toLocaleString('en-IN')} qualify for <strong>FREE Freight Delivery</strong>.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-navy uppercase tracking-wider">
              5. Unloading & Assembly Guidelines
            </h2>
            <p>
              Standard freight delivery is curbside / ground floor drop. Because individual packages may weigh over 30 kg, customers are advised to have adequate assistance available for indoor transit. Equipment is shipped in flat-pack form with high-strength fasteners.
            </p>
          </div>

          <div className="pt-4 border-t border-steel-200 text-xs text-steel-500">
            <p>For questions regarding freight or dispatch status, contact our logistics desk: {settings.phone_primary} or email {settings.email}.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
