import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Send, Building2, Phone, Mail, MapPin, Package, HelpCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { RequirementType } from '../../types/enquiry';

interface BulkEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProduct?: string;
}

const INDIAN_STATES = [
  'Tamil Nadu',
  'Kerala',
  'Karnataka',
  'Andhra Pradesh',
  'Telangana',
  'Maharashtra',
  'Gujarat',
  'Delhi NCR',
  'Rajasthan',
  'Uttar Pradesh',
  'West Bengal',
  'Madhya Pradesh',
  'Punjab',
  'Haryana',
  'Odisha',
  'Other State / Union Territory',
];

export const BulkEnquiryModal: React.FC<BulkEnquiryModalProps> = ({
  isOpen,
  onClose,
  defaultProduct,
}) => {
  const { products, createEnquiry } = useStore();

  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Tamil Nadu');
  const [requirementType, setRequirementType] = useState<RequirementType>('Commercial Gym');
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    defaultProduct ? [defaultProduct] : []
  );
  const [estimatedQuantity, setEstimatedQuantity] = useState('3 - 5 units');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleProductToggle = (pName: string) => {
    setSelectedProducts((prev) =>
      prev.includes(pName) ? prev.filter((item) => item !== pName) : [...prev, pName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!city.trim()) {
      setErrorMsg('Please enter your city.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createEnquiry({
        full_name: fullName.trim(),
        company_name: companyName.trim() || undefined,
        phone: phone.trim(),
        email: email.trim(),
        city: city.trim(),
        state,
        requirement_type: requirementType,
        products_of_interest: selectedProducts.length > 0 ? selectedProducts : ['General Commercial Inquiry'],
        estimated_quantity: estimatedQuantity,
        message: message.trim(),
        is_demo: true,
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch {
      setIsSubmitting(false);
      setErrorMsg('Failed to submit enquiry. Please try again.');
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-dark/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-steel-200 overflow-hidden z-10"
          >
            {/* Header */}
            <div className="p-6 bg-brand-navy text-white flex items-center justify-between border-b border-brand-royal/40">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-brand-accent" />
                  <span className="text-xs uppercase font-mono tracking-widest text-brand-accent font-semibold">
                    Direct Factory Enquiries
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">
                  Bulk & Commercial Gym Enquiry
                </h3>
                <p className="text-xs text-steel-400 mt-0.5">
                  Connect with GE Industries manufacturing team in Karur, Tamil Nadu.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-steel-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content / Form */}
            <div className="p-6 max-h-[75vh] overflow-y-auto">
              {isSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-bold text-brand-navy">Enquiry Received!</h4>
                  <p className="text-sm text-steel-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-brand-navy">{fullName}</strong>. Your enquiry has been registered in our database. Our manufacturing and sales team from Karur will review your requirements and reach out within 24 hours.
                  </p>
                  <div className="p-4 bg-brand-light rounded-xl border border-steel-200 text-xs text-steel-600 inline-block text-left">
                    <p className="font-semibold text-brand-navy mb-1">Company Direct Contact:</p>
                    <p>Phone: +91 87789 13412 / +91 93842 33229</p>
                    <p>Email: geindustries3@gmail.com</p>
                  </div>
                  <div>
                    <button
                      onClick={handleReset}
                      className="px-6 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-royal transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
                      {errorMsg}
                    </div>
                  )}

                  {/* Requirement Type */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5">
                      Requirement Category *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['Home Gym', 'Commercial Gym', 'Dealer', 'Wholesale'] as RequirementType[]).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setRequirementType(type)}
                          className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all text-center ${
                            requirementType === type
                              ? 'bg-brand-royal text-white border-brand-royal shadow-sm'
                              : 'bg-brand-light text-steel-700 border-steel-200 hover:border-brand-royal/40'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Organization */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-steel-300 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        Fitness Centre / Company (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Titan Gym / FitCore Studio"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-steel-300 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                      />
                    </div>
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-steel-400 absolute left-3 top-2.5" />
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-9 pr-3.5 py-2 text-sm rounded-lg border border-steel-300 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-steel-400 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          required
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-9 pr-3.5 py-2 text-sm rounded-lg border border-steel-300 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location: City & State */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        City / Town *
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-steel-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Karur / Chennai / Bengaluru"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full pl-9 pr-3.5 py-2 text-sm rounded-lg border border-steel-300 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        State *
                      </label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-steel-300 focus:outline-none focus:border-brand-accent bg-white"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Products of Interest */}
                  <div>
                    <label className="block text-xs font-semibold text-steel-700 mb-1.5 flex items-center justify-between">
                      <span>Products of Interest (Select all that apply)</span>
                      <span className="text-[10px] text-steel-500 font-normal">Optional</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {products.map((p) => {
                        const checked = selectedProducts.includes(p.name);
                        return (
                          <label
                            key={p.id}
                            className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                              checked
                                ? 'bg-brand-royal/10 border-brand-royal text-brand-navy font-semibold'
                                : 'bg-brand-light border-steel-200 text-steel-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleProductToggle(p.name)}
                              className="rounded text-brand-royal focus:ring-brand-accent"
                            />
                            <span className="truncate">{p.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Estimated Quantity */}
                  <div>
                    <label className="block text-xs font-semibold text-steel-700 mb-1">
                      Estimated Quantity Requirement
                    </label>
                    <select
                      value={estimatedQuantity}
                      onChange={(e) => setEstimatedQuantity(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-steel-300 focus:outline-none focus:border-brand-accent bg-white"
                    >
                      <option value="1 - 2 units">1 - 2 units (Personal / Home Gym)</option>
                      <option value="3 - 5 units">3 - 5 units (Studio / Small Facility)</option>
                      <option value="6 - 15 units">6 - 15 units (Commercial Gym Expansion)</option>
                      <option value="16+ units / Full Setup">16+ units (Full Commercial Setup / Wholesale)</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-steel-700 mb-1">
                      Specific Requirements, Customizations, or Delivery Timeline
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Mention custom steel gauge preferences, target installation date, or specific gym dimensions..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-steel-300 focus:outline-none focus:border-brand-accent"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-brand-navy hover:bg-brand-royal text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Registering Enquiry...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Bulk Enquiry to GE Industries</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-steel-500 mt-2">
                      Registered in factory enquiries ledger. Privacy respected. No promotional spam.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
