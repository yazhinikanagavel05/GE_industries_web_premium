import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle, 
  FileText, 
  Building2,
  Download
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { settings, createEnquiry } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [subject, setSubject] = useState('Product Enquiry');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter your contact phone number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createEnquiry({
        full_name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        city: city.trim() || 'Karur / General',
        state: 'Tamil Nadu',
        requirement_type: subject === 'Commercial Gym Inquiry' ? 'Commercial Gym' : 'Home Gym',
        products_of_interest: [subject],
        estimated_quantity: '1 - 2 units',
        message: message.trim(),
        is_demo: true,
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch {
      setIsSubmitting(false);
      setErrorMsg('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-light pb-24">
      {/* Header Banner with Rich Gym Equipment Background */}
      <div className="relative bg-[#071328] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-brand-accent/20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/products/manual-treadmill-black.jpg"
            alt="Contact GE Industries Karur"
            className="w-full h-full object-cover object-center opacity-25 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071328] via-[#071328]/95 to-[#071328]/85" />
          <div className="absolute inset-0 bg-subtle-grid-dark opacity-30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-accent">
            Karur, Tamil Nadu • Factory & Office
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight mt-1">
            Contact GE Industries
          </h1>
          <p className="text-base sm:text-lg text-sky-200 mt-2 max-w-2xl font-bold">
            Your Strength. Our Engineering.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Official Contact Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-steel-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-royal">
                  Headquarters & Works
                </span>
                <h3 className="text-xl font-display font-black text-brand-navy uppercase tracking-tight mt-1">
                  Manufacturing Facility
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-steel-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-brand-navy">Factory Address</h4>
                    <p className="text-steel-600 text-xs mt-0.5 leading-relaxed">
                      {settings.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-brand-navy">Phone Inquiries</h4>
                    <p className="text-steel-600 text-xs mt-0.5">
                      <a href={`tel:${settings.phone_primary}`} className="hover:text-brand-navy font-semibold">
                        {settings.phone_primary}
                      </a>{' '}
                      /{' '}
                      <a href={`tel:${settings.phone_secondary}`} className="hover:text-brand-navy font-semibold">
                        {settings.phone_secondary}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-brand-navy">Email Desk</h4>
                    <p className="text-steel-600 text-xs mt-0.5">
                      <a href={`mailto:${settings.email}`} className="hover:text-brand-navy font-semibold">
                        {settings.email}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-brand-royal flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-brand-navy">Operational Hours</h4>
                    <p className="text-steel-600 text-xs mt-0.5">
                      {settings.contact.hours}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-steel-100 flex items-center justify-between text-xs font-mono text-steel-500">
                  <span>GSTIN Number:</span>
                  <span className="font-bold text-brand-navy">{settings.gstin}</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="/brand/ge-industries-brochure.pdf"
                  download="GE-Industries-Brochure.pdf"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-light hover:bg-steel-200 text-brand-navy rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border border-steel-300"
                >
                  <Download className="w-4 h-4 text-brand-royal" />
                  <span>Download Company Profile (PDF)</span>
                </a>
              </div>
            </div>

            {/* Embedded Location Card */}
            <div className="bg-brand-navy rounded-3xl p-6 text-white border border-brand-royal/40 shadow-md space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-brand-accent uppercase font-bold">
                <MapPin className="w-4 h-4" />
                <span>Karur Manufacturing Hub</span>
              </div>
              <h4 className="font-bold text-base">Karuppampalayam, Karur – 639003</h4>
              <p className="text-xs text-steel-300 leading-relaxed">
                Karur is a key industrial engineering cluster in central Tamil Nadu, providing direct rail and highway freight connectivity to Chennai, Bengaluru, Coimbatore, Kochi, and Hyderabad.
              </p>
            </div>
          </div>

          {/* Right Column: Direct Message Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-steel-200 p-6 sm:p-10 shadow-sm">
              <div className="border-b border-steel-200 pb-4 mb-6">
                <h3 className="text-xl sm:text-2xl font-display font-black text-brand-navy uppercase tracking-tight">
                  Send a Direct Message
                </h3>
                <p className="text-xs text-steel-500 mt-1">
                  Have questions about equipment dimensions, mild steel fabrication, or delivery timelines? Reach out to our Karur office.
                </p>
              </div>

              {isSubmitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-bold text-brand-navy">Message Delivered!</h4>
                  <p className="text-sm text-steel-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-brand-navy">{name}</strong>. Your message has been logged in our enquiries dashboard. A member of our team will call or email you shortly.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 bg-brand-navy text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-royal transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Karthik"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-steel-300 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-steel-300 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="karthik@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-steel-300 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        City / Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Karur / Salem / Bengaluru"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-steel-300 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-steel-700 mb-1">
                      Subject / Inquiry Type
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-steel-300 bg-white focus:outline-none focus:border-brand-accent"
                    >
                      <option value="Product Enquiry">Product Specifications & Availability</option>
                      <option value="Home Gym Setup">Home Gym Planning & Advice</option>
                      <option value="Commercial Gym Inquiry">Commercial / Wholesale Gym Quote</option>
                      <option value="Delivery & Freight">Freight & Pan-India Shipping Query</option>
                      <option value="Other">Other Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-steel-700 mb-1">
                      Message / Inquiry Details
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Write your questions or equipment requirements here..."
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
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-brand-accent" />
                        <span>Send Message to GE Industries</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
