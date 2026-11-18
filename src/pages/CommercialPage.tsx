import React, { useState } from 'react';
import { 
  Building2, 
  Send, 
  CheckCircle, 
  ShieldCheck, 
  Truck, 
  Wrench, 
  Phone, 
  Mail, 
  MapPin, 
  Users, 
  Briefcase,
  FileSpreadsheet
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { RequirementType } from '../types/enquiry';

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

export const CommercialPage: React.FC = () => {
  const { products, settings, createEnquiry } = useStore();

  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Tamil Nadu');
  const [requirementType, setRequirementType] = useState<RequirementType>('Commercial Gym');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [estimatedQuantity, setEstimatedQuantity] = useState('6 - 15 units');
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
      setErrorMsg('Please enter your full contact name.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid business email address.');
      return;
    }
    if (!city.trim()) {
      setErrorMsg('Please enter your city/town.');
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
        products_of_interest: selectedProducts.length > 0 ? selectedProducts : ['Full Commercial Package'],
        estimated_quantity: estimatedQuantity,
        message: message.trim(),
        is_demo: true,
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch {
      setIsSubmitting(false);
      setErrorMsg('Failed to register commercial enquiry. Please check your network and retry.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-light pb-24">
      {/* Hero Banner */}
      <div className="relative bg-brand-navy text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-brand-royal/40 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="/images/products/manual-treadmill-black.jpg"
            alt="Commercial fitness manufacturing"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-navy/95" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-royal/40 text-brand-accent text-xs font-mono font-bold uppercase tracking-wider mb-4 border border-brand-accent/30">
              <Building2 className="w-3.5 h-3.5" />
              <span>Direct Factory Wholesale & Institutional Orders</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-white leading-tight">
              Building Gyms Starts with the Right Partner.
            </h1>
            <p className="text-xl font-display font-bold text-sky-200 tracking-normal mt-3">
              Planning a new gym or a bulk order? Let's discuss your requirements.
            </p>
            <p className="text-sm sm:text-base text-steel-200 mt-4 leading-relaxed font-normal">
              For gym owners, dealers and wholesale buyers, equipment selection is about more than filling a space. It is about choosing a suitable product range, planning investment and sourcing equipment that meets business needs. GE Industries welcomes enquiries from businesses exploring equipment for commercial setups and bulk purchasing.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Commercial Manufacturing Benefits (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-steel-200 p-6 sm:p-8 shadow-sm space-y-5">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-royal">
                Why Partner with GE Industries
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-black text-brand-navy uppercase tracking-tight">
                Factory Direct Advantages
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-steel-700">
                <div className="flex items-start gap-3">
                  <Wrench className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-brand-navy">Structural Mild Steel</h4>
                    <p className="text-steel-600 text-xs mt-0.5">Heavy gauge steel tube profiling built to withstand relentless commercial usage.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-brand-navy">Custom Branding & Finishes</h4>
                    <p className="text-steel-600 text-xs mt-0.5">Custom electrostatic powder coat color matching for your gym brand identity.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-brand-navy">Coordinated Logistics from Karur</h4>
                    <p className="text-steel-600 text-xs mt-0.5">Palletized freight dispatch with direct transit tracking across all Indian states.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-brand-navy">Institutional Invoicing & GST</h4>
                    <p className="text-steel-600 text-xs mt-0.5">GST registered billing with formal input tax credit eligibility for enterprises.</p>
                  </div>
                </div>
              </div>

              {/* Direct Contacts box */}
              <div className="p-4 bg-brand-light rounded-2xl border border-steel-200 text-xs text-steel-600 space-y-2">
                <p className="font-bold text-brand-navy uppercase">Direct Sales Desk:</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-600" /> {settings.phone_primary} / {settings.phone_secondary}</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-sky-600" /> {settings.email}</p>
                <p className="flex items-start gap-2"><MapPin className="w-4 h-4 text-brand-accent mt-0.5" /> {settings.address}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Working Bulk Enquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-steel-200 p-6 sm:p-10 shadow-sm">
              <div className="border-b border-steel-200 pb-4 mb-6">
                <h3 className="text-xl sm:text-2xl font-display font-black text-brand-navy uppercase tracking-tight">
                  Request Commercial Proposal
                </h3>
                <p className="text-xs text-steel-500 mt-1">
                  Fill in your project details. Our manufacturing engineering team will review requirements and respond within 24 hours.
                </p>
              </div>

              {isSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-bold text-brand-navy">Commercial Enquiry Registered!</h4>
                  <p className="text-sm text-steel-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-brand-navy">{fullName}</strong>. Your requirement has been saved in the GE Industries commercial ledger. Our sales manager will contact you with volume pricing and freight options.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 bg-brand-navy text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-royal transition-colors"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                      {errorMsg}
                    </div>
                  )}

                  {/* Requirement Type Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5">
                      Business Entity / Requirement Type *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['Commercial Gym', 'Home Gym', 'Dealer', 'Wholesale'] as RequirementType[]).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setRequirementType(t)}
                          className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                            requirementType === t
                              ? 'bg-brand-royal text-white border-brand-royal shadow-sm'
                              : 'bg-brand-light text-steel-700 border-steel-200 hover:border-brand-royal/40'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name and Organization */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anandha Kumar"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-steel-300 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        Gym / Company Name (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Iron Vault Fitness"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-steel-300 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                      />
                    </div>
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98400 12345"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-steel-300 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="business@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-steel-300 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                      />
                    </div>
                  </div>

                  {/* City & State */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        City / Town *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Karur / Coimbatore / Bengaluru"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-steel-300 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        State *
                      </label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-steel-300 bg-white focus:outline-none focus:border-brand-accent"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Quantity Range */}
                  <div>
                    <label className="block text-xs font-semibold text-steel-700 mb-1">
                      Estimated Units Needed
                    </label>
                    <select
                      value={estimatedQuantity}
                      onChange={(e) => setEstimatedQuantity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-steel-300 bg-white focus:outline-none focus:border-brand-accent"
                    >
                      <option value="1 - 2 units">1 - 2 units (Sampling / Trial)</option>
                      <option value="3 - 5 units">3 - 5 units (Studio / Boutique Gym)</option>
                      <option value="6 - 15 units">6 - 15 units (Commercial Floor Expansion)</option>
                      <option value="16+ units / Full Setup">16+ units (Full Commercial Facility / Dealer)</option>
                    </select>
                  </div>

                  {/* Products Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-steel-700 mb-1.5 flex items-center justify-between">
                      <span>Products of Interest</span>
                      <span className="text-[10px] text-steel-400">Select applicable</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {products.map((p) => {
                        const checked = selectedProducts.includes(p.name);
                        return (
                          <label
                            key={p.id}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
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

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-steel-700 mb-1">
                      Facility Dimensions, Timelines, or Steel Gauge Requests
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share details such as target gym opening date, floor area (sq. ft.), or specific frame color scheme..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-steel-300 focus:outline-none focus:border-brand-accent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-brand-navy hover:bg-brand-royal text-white font-bold rounded-xl text-sm uppercase tracking-wider transition-all shadow-lg shadow-brand-navy/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Transmitting Enquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-brand-accent" />
                        <span>Submit Bulk Enquiry to Factory</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-steel-400">
                    Stored in factory enquiries ledger. Privacy respected.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
