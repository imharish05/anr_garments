import React from 'react';
import { CATEGORIES } from '../data/mockData';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

const ShopByCategory = () => {
  return (
    <section id="shop-categories" className="py-16 bg-[#F8F9FD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A175A] uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Bangalore Manufacturing Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A175A] tracking-tight">
              Our 5 Core Product Lines
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Direct manufacturing of hospital garments built for everyday care, doctor authority, and patient comfort.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-2 text-xs font-bold text-blue-900 bg-blue-100/70 px-3.5 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>SCRUBS • LAB COATS • THEATRE WEAR • PATIENT WEAR</span>
          </div>
        </div>

        {/* 5 Core Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {CATEGORIES.map((cat, index) => (
            <a
              key={cat.id}
              href={cat.link}
              className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div>
                {/* Image Container with Aspect Ratio */}
                <div className="relative aspect-[4/4.5] overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  
                  {/* Category Number Badge */}
                  <span className="absolute top-3 left-3 bg-[#1A175A] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                    0{index + 1}
                  </span>

                  {cat.badge && (
                    <span className="absolute top-3 right-3 bg-amber-400 text-[#1A175A] text-[9px] font-black px-2 py-0.5 rounded-full shadow">
                      {cat.badge}
                    </span>
                  )}

                  {/* Title overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-semibold text-blue-200 uppercase tracking-wider block">
                      {cat.count}
                    </span>
                    <h3 className="text-base font-bold leading-snug drop-shadow-sm group-hover:text-amber-300 transition-colors">
                      {cat.title}
                    </h3>
                  </div>
                </div>

                <div className="p-3.5 bg-white">
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Card Footer action bar */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1A175A] group-hover:bg-[#1A175A] group-hover:text-white transition-colors duration-200">
                <span>View Collection</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ShopByCategory;
