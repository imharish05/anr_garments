import React from 'react';
import { FABRIC_FEATURES } from '../data/mockData';
import { Heart, Wind, Shield, RefreshCw, Move, Layers, CheckCircle } from 'lucide-react';

const ICON_MAP = {
  Heart,
  Wind,
  Shield,
  RefreshCw,
  Move,
  Layers
};

const FabricTechSection = () => {
  return (
    <section id="fabric-tech" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header from Image 2 */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1A175A] text-xs font-bold uppercase tracking-wider mb-3">
            <Shield className="w-4 h-4 text-[#1A175A]" />
            <span>Clinical Textile Science</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A175A] tracking-tight uppercase">
            Fabric That Works As Hard As You Do.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3 font-medium">
            Because comfort leads to better care. Engineered for 24-hour shifts, emergency surgeries, and high-temperature hospital sterilizations.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FABRIC_FEATURES.map((item, index) => {
            const Icon = ICON_MAP[item.icon] || Shield;
            return (
              <div
                key={index}
                className="bg-[#F8F9FD] p-8 rounded-3xl border border-slate-200/80 hover:border-[#1A175A]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#1A175A] text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:bg-[#141247] transition-all">
                    <Icon className="w-7 h-7 text-amber-300" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A175A] mb-3 group-hover:text-blue-800 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-2 text-xs font-semibold text-[#1A175A]">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>ANR Bangalore Quality Certified</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Cards from Image 2 */}
        <div className="mt-14 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900">
          <img
            src="/anr-collection-cards.jpg"
            alt="ANR Hospital Garments - Made for Healers, Designed for Comfort"
            className="w-full h-auto object-cover max-h-[500px]"
          />
        </div>

      </div>
    </section>
  );
};

export default FabricTechSection;
