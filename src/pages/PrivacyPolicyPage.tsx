import React from 'react';
import { useStore } from '../context/StoreContext';

export const PrivacyPolicyPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="min-h-screen bg-brand-light pb-24">
      <div className="bg-brand-navy text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-brand-royal/40">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-accent">
            Legal & Trust
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-white mt-1">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-steel-200 mt-2 font-normal">
            GE Industries • Karur, Tamil Nadu, India
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white rounded-3xl border border-steel-200 p-8 sm:p-12 shadow-sm space-y-6 text-xs sm:text-sm text-steel-700 leading-relaxed font-normal">
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-navy uppercase tracking-wider">
              1. Information We Collect
            </h2>
            <p>
              GE Industries collects customer contact details (name, delivery address, telephone number, email) and project information solely to facilitate equipment dispatch, coordinate freight road transport, respond to bulk enquiries, and fulfill warranty records.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-navy uppercase tracking-wider">
              2. Data Protection & Confidentiality
            </h2>
            <p>
              We do not sell, rent, or trade your contact information with external marketing agencies. Customer information is shared strictly with authorized logistics carriers for the express purpose of freight delivery coordination.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-navy uppercase tracking-wider">
              3. Payment Security
            </h2>
            <p>
              Payment data is processed through encrypted payment gateway gateways compliant with Reserve Bank of India (RBI) standards. GE Industries does not store credit card numbers, CVVs, or online banking passwords on our local servers.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-brand-navy uppercase tracking-wider">
              4. Contact for Privacy Matters
            </h2>
            <p>
              For questions regarding privacy, you may contact our privacy officer at {settings.email} or by mail at our factory address: {settings.address}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
