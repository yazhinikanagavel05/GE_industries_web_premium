import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  CheckCircle2, 
  ArrowRight, 
  Maximize2, 
  Dumbbell, 
  ShieldCheck, 
  Compass,
  Layers
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';

export const HomeGymPage: React.FC = () => {
  const { products } = useStore();

  // Highlight home gym friendly products (manual treadmill & stair steppers)
  const homeGymProducts = products.filter((p) => 
    p.category_id === 'cat-homegym' || 
    p.category_id === 'cat-treadmills' || 
    p.category_id === 'cat-steppers'
  );

  return (
    <div className="min-h-screen bg-brand-light pb-24">
      {/* Hero Banner */}
      <div className="relative bg-brand-navy text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-brand-royal/40 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="/images/products/stair-stepper-white-gym.jpg"
            alt="Home Gym Cardio Engineering"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-navy/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-royal/40 text-brand-accent text-xs font-mono font-bold uppercase tracking-wider mb-4 border border-brand-accent/30">
              <Home className="w-3.5 h-3.5" />
              <span>Dedicated Solutions for Home Workouts</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white leading-tight">
              Your Space. Your Pace. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
                Your Strength.
              </span>
            </h1>
            <p className="text-xl font-display font-bold text-sky-200 tracking-normal mt-3">
              Start with what fits. Build towards what you want.
            </p>
            <p className="text-sm sm:text-base text-steel-200 mt-4 leading-relaxed font-normal">
              Not everyone has room for a full-sized gym. But everyone deserves the opportunity to work towards their fitness goals. With the right equipment, an apartment corner or spare room can become a practical workout space. GE Industries aims to help home workout enthusiasts explore equipment options that suit their available space, training goals and budget.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/shop?category=home-gym"
                className="px-8 py-3.5 bg-brand-accent hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-brand-accent/30 inline-flex items-center gap-2"
              >
                <span>Browse Space-Saving Equipment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        {/* 3 Core Design Principles for Home Workouts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-steel-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-brand-royal/10 text-brand-royal flex items-center justify-center mb-4">
              <Maximize2 className="w-6 h-6 text-brand-accent" />
            </div>
            <h3 className="text-lg font-bold text-brand-navy uppercase">
              Footprint Efficiency
            </h3>
            <p className="text-xs text-steel-600 mt-2 leading-relaxed">
              Equip an effective personal strength setup within a 6 × 6 ft corner or spare room without overcrowding your living quarters.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-steel-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-brand-royal/10 text-brand-royal flex items-center justify-center mb-4">
              <Layers className="w-6 h-6 text-brand-accent" />
            </div>
            <h3 className="text-lg font-bold text-brand-navy uppercase">
              Zero-Power Portability
            </h3>
            <p className="text-xs text-steel-600 mt-2 leading-relaxed">
              Self-powered manual treadmills and folding stair steppers require zero electrical outlets and easily fold or stow away after your workout.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-steel-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-brand-royal/10 text-brand-royal flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-brand-accent" />
            </div>
            <h3 className="text-lg font-bold text-brand-navy uppercase">
              Floor Safe Construction
            </h3>
            <p className="text-xs text-steel-600 mt-2 leading-relaxed">
              Equipped with heavy-duty non-marring rubber endcaps and stable wide footings to protect residential tiles and hardwood floors.
            </p>
          </div>
        </div>

        {/* Home Gym Equipment Selection */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-steel-200 pb-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-royal">
                Curated Lineup
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-brand-navy uppercase tracking-tight mt-0.5">
                Recommended for Home Fitness Spaces
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-bold text-brand-royal hover:text-brand-accent uppercase tracking-wider flex items-center gap-1"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeGymProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Apartment & Home Setup Blueprint Guide */}
        <section className="bg-brand-navy text-white rounded-3xl p-8 sm:p-12 border border-brand-royal/40 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-accent">
                Layout Blueprint
              </span>
              <h3 className="text-2xl sm:text-4xl font-display font-black uppercase tracking-tight">
                Building a Home Gym in 3 Practical Steps
              </h3>

              <div className="space-y-3 pt-2 text-xs sm:text-sm text-steel-200">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-accent text-brand-dark font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-white">Start with Incline Cardio:</strong> The GE Manual Walking Treadmill MT-01 delivers natural, human-powered incline walking with zero electricity bills and complete user speed control.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-accent text-brand-dark font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-white">Add Vertical Step Conditioning:</strong> The GE Adjustable Stair Stepper SC-02 delivers high calorie-burning stair climbing that targets glutes, quads, and calves without joint impact.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-accent text-brand-dark font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-white">Save Apartment Floor Space:</strong> Both machines feature compact footprints and rubber floor protectors, and the stair stepper folds flat for easy closet storage.
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/shop"
                  className="px-6 py-3 bg-brand-accent hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors inline-block"
                >
                  Start Building Your Home Gym
                </Link>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src="/images/products/manual-treadmill-white.jpg"
                alt="Compact home workout layout"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
