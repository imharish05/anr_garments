import React from 'react';
import { UNDERSCRUBS_LIST } from '../data/mockData';
import ProductCard from './ProductCard';
import { Layers, ArrowRight, Zap, Wind } from 'lucide-react';

const ProductListEcoflex = () => {
  return (
    <section id="underscrubs-collection" className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Product Line 03</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A175A] tracking-tight">
              Underscrubs for Men & Women
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Breathable, sweat-absorbent base layer tees and long-sleeve thermals engineered to be worn under hospital scrubs.
            </p>
          </div>

          <a
            href="#bulk-inquiry"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1A175A] hover:text-blue-700 transition-colors group"
          >
            <span>Request Underscrub Samples</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {UNDERSCRUBS_LIST.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProductListEcoflex;
