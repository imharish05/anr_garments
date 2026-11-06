import React from 'react';
import { SCRUB_SUITS } from '../data/mockData';
import ProductCard from './ProductCard';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const ProductListClassic = () => {
  return (
    <section id="scrubs-collection" className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A175A] uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Product Line 01</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A175A] tracking-tight">
              Scrub Suits for Men & Women
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Ergonomically cut clinical scrub suits with multi-pocket utility, reinforced stress points, and breathable comfort.
            </p>
          </div>

          <a
            href="#bulk-inquiry"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1A175A] hover:text-blue-700 transition-colors group"
          >
            <span>Order Scrub Sets in Bulk</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SCRUB_SUITS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProductListClassic;
