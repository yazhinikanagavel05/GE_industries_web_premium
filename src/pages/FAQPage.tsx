import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'Products & Manufacturing' | 'Shipping & Delivery' | 'Commercial & Bulk' | 'Warranty & Care';
}

const FAQ_ITEMS: FAQItem[] = [
  {
    category: 'Products & Manufacturing',
    question: 'Where is GE Industries gym equipment manufactured?',
    answer: 'All GE Industries strength equipment is manufactured directly at our fabrication facility located at No. 2/159/A, Appipalayam Road, AK Pudhu Nagar, Karuppampalayam, Karur – 639003, Tamil Nadu, India.',
  },
  {
    category: 'Products & Manufacturing',
    question: 'What materials are used in your manual treadmills and stair steppers?',
    answer: 'We construct equipment primarily from high-grade structural mild steel (MS) square and rectangular hollow sections. Frames feature heavy wall gauges, precision MIG welding, dual precision crowned steel rollers with sealed bearings, and durable electrostatic powder coating.',
  },
  {
    category: 'Products & Manufacturing',
    question: 'What are your two main flagship products?',
    answer: 'Our two primary manufactured products are the GE Heavy-Duty Manual Walking Treadmill MT-01 (a 100% self-powered, non-motorized cardio machine with a fixed incline deck) and the GE Adjustable Dual-Handlebar Stair Stepper Climber SC-02 (a folding step climber with 5-hole resistance linkage). Both products are available in Classic Polar White and Industrial Matte Black finishes.',
  },
  {
    category: 'Shipping & Delivery',
    question: 'Do you deliver across India?',
    answer: 'Yes. Due to the significant weight of steel gym equipment, orders are shipped via specialized heavy-freight road transport partners with pan-India coverage. Typical delivery is 3–5 business days within Tamil Nadu and South India, and 6–9 business days for other states.',
  },
  {
    category: 'Shipping & Delivery',
    question: 'Is assembly required upon delivery?',
    answer: 'Manual treadmills and stair steppers arrive semi-assembled for safe freight transport. Final setup (attaching upright handlebars and star safety knobs) takes only 10–15 minutes with standard tools.',
  },
  {
    category: 'Commercial & Bulk',
    question: 'Can commercial gym owners request customized colors or specifications?',
    answer: 'Yes! For commercial gym setups, boutique studios, and institutional purchasers, we offer custom powder coat colors (matching your facility brand) and custom upright tube configurations. You can submit a commercial bulk enquiry directly on our website.',
  },
  {
    category: 'Warranty & Care',
    question: 'What warranty is provided with GE Industries equipment?',
    answer: 'Our equipment carries a 1-Year Structural Warranty on all mild steel welds and main frame fabrication against structural failure under rated lifting loads.',
  },
];

export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Products & Manufacturing', 'Shipping & Delivery', 'Commercial & Bulk', 'Warranty & Care'];

  const filteredItems = activeCategory === 'All'
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header Banner */}
      <div className="bg-brand-navy text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-brand-royal/40">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-brand-accent mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Help & Support Center</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl font-normal">
            Find answers regarding GE Industries gym equipment manufacturing, mild steel specifications, heavy freight delivery, and commercial orders.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border ${
                activeCategory === cat
                  ? 'bg-brand-navy text-white border-brand-navy shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List with Smooth Animation */}
        <div className="space-y-3">
          {filteredItems.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-brand-navy">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-brand-accent' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                        <p>{item.answer}</p>
                        <span className="inline-block mt-3 text-[10px] font-mono uppercase tracking-wider font-semibold text-brand-royal bg-brand-royal/10 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className="bg-brand-navy rounded-3xl p-8 text-white text-center border border-brand-royal/40 shadow-xl space-y-4">
          <MessageSquare className="w-10 h-10 text-brand-accent mx-auto" />
          <h3 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight">
            Have a Specific Engineering Question?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Our team in Karur is ready to help you plan your home gym layout or commercial fitness facility.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="px-6 py-3 bg-brand-accent hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md"
            >
              Contact Factory Office
            </Link>
            <a
              href="tel:+918778913412"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors border border-white/20"
            >
              Call +91 87789 13412
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
