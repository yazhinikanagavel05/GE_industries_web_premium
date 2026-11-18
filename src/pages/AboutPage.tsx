import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Target, 
  Compass, 
  Award, 
  CheckCircle, 
  FileText, 
  Download, 
  Wrench, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Eye
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AboutPage: React.FC = () => {
  const { settings } = useStore();

  const coreValues = [
    {
      title: 'Quality in Every Detail',
      desc: 'Giving careful attention to material selection, fabrication and consistent finishing.',
      icon: Award,
    },
    {
      title: 'Engineering with Purpose',
      desc: 'Creating practical equipment around real training needs and available space.',
      icon: Wrench,
    },
    {
      title: 'Continuous Improvement',
      desc: 'Refining products and processes as customer needs and fitness trends evolve.',
      icon: TrendingUp,
    },
    {
      title: 'Trust Through Transparency',
      desc: 'Providing clear product specifications and straightforward purchasing information.',
      icon: Eye,
    },
    {
      title: 'Customers at the Centre',
      desc: 'Recognizing the needs of home gym buyers, fitness enthusiasts and commercial purchasers.',
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-brand-light pb-24">
      {/* Header Banner with Rich Gym Equipment Background */}
      <div className="relative bg-[#071328] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-brand-accent/20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/products/manual-treadmill-white.jpg"
            alt="About GE Industries manufacturing facility"
            className="w-full h-full object-cover object-center opacity-25 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071328] via-[#071328]/95 to-[#071328]/85" />
          <div className="absolute inset-0 bg-subtle-grid-dark opacity-30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-accent">
            Karur, Tamil Nadu, India
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight mt-1">
            About GE Industries
          </h1>
          <p className="text-base sm:text-lg text-sky-200 mt-2 max-w-2xl font-bold">
            Your Strength. Our Engineering.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        {/* Brand Story (From Brochure) */}
        <section className="bg-white rounded-3xl border border-steel-200 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-royal">
                Company Profile & Heritage
              </span>
              <h2 className="text-2xl sm:text-4xl font-display font-black text-brand-navy uppercase tracking-tight">
                {settings.brand_story.title}
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-steel-700 leading-relaxed font-normal">
                {settings.brand_story.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="pt-2">
                <a
                  href="/brand/ge-industries-brochure.pdf"
                  download="GE-Industries-Brochure.pdf"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-navy hover:bg-brand-royal text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
                >
                  <Download className="w-4 h-4 text-brand-accent" />
                  <span>Download Company Profile (PDF)</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-xl border border-steel-200">
              <img
                src="/images/products/stair-stepper-black-gym.jpg"
                alt="GE Industries fitness equipment manufacturing"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="p-4 bg-brand-navy text-white text-xs">
                <p className="font-bold">GE Industries Manufacturing</p>
                <p className="text-steel-300 text-[11px]">Karuppampalayam, Karur – 639003, Tamil Nadu</p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision */}
          <div className="bg-brand-navy text-white rounded-3xl p-8 sm:p-10 border border-brand-royal/40 shadow-xl space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-brand-royal/40 flex items-center justify-center text-brand-accent">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-wide text-brand-accent">
              Our Vision
            </h3>
            <p className="text-sm sm:text-base text-steel-200 leading-relaxed">
              {settings.brand_story.vision}
            </p>
            <p className="text-xs text-steel-400 leading-relaxed pt-2 border-t border-brand-royal/30">
              We envision a future where every fitness enthusiast, regardless of the size of their workout space, has access to equipment that supports their goals.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-brand-royal text-white rounded-3xl p-8 sm:p-10 border border-blue-400/30 shadow-xl space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-brand-navy/40 flex items-center justify-center text-white">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-wide text-white">
              Our Mission
            </h3>
            <p className="text-sm sm:text-base text-blue-50 leading-relaxed">
              {settings.brand_story.mission}
            </p>
            <p className="text-xs text-blue-200 leading-relaxed pt-2 border-t border-white/20">
              We aim to build lasting customer relationships through clear product information, responsive communication and continuous improvement guided by customer needs.
            </p>
          </div>
        </section>

        {/* Core Values (From Brochure Page 5) */}
        <section className="bg-white rounded-3xl border border-steel-200 p-8 sm:p-12 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-royal">
              Foundational Pillars
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-black text-brand-navy uppercase tracking-tight mt-1">
              Our Core Values
            </h2>
            <p className="text-xs sm:text-sm text-steel-600 mt-2">
              The operational philosophy guiding our workshop in Karur every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {coreValues.map((v, i) => {
              const IconComp = v.icon;
              return (
                <div key={i} className="p-5 rounded-2xl bg-brand-light border border-steel-200 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-brand-royal/10 text-brand-royal flex items-center justify-center mb-3">
                      <IconComp className="w-5 h-5 text-brand-accent" />
                    </div>
                    <h4 className="text-sm font-bold text-brand-navy uppercase tracking-wide">
                      {v.title}
                    </h4>
                    <p className="text-xs text-steel-600 mt-2 leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quality & Care Section (From Brochure Page 11) */}
        <section className="bg-brand-dark text-white rounded-3xl p-8 sm:p-12 border border-brand-royal/30 shadow-xl">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-accent">
              Quality & Care
            </span>
            <h3 className="text-2xl sm:text-4xl font-display font-black uppercase tracking-tight">
              Know Your Equipment. Choose with Confidence.
            </h3>
            <p className="text-sm sm:text-base text-steel-200 leading-relaxed">
              We believe confidence in gym equipment begins with understanding how it is made. Our focus is on careful material selection, appropriate fabrication, consistent finishing and clear product specifications.
            </p>
            <p className="text-sm text-steel-300 leading-relaxed">
              We aim to help customers make informed decisions by providing relevant information about the equipment they choose. Our goal is to offer products designed around functionality, quality and customer needs.
            </p>
            <div className="pt-4 flex items-center gap-4">
              <Link
                to="/shop"
                className="px-6 py-3 bg-brand-royal hover:bg-brand-accent text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
              >
                Explore Catalogue
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors border border-white/20"
              >
                Contact Factory
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
