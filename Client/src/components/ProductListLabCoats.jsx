import React, { useState, useEffect } from 'react';
import { APRONS_LIST } from '../data/mockData';
import ProductCard from './ProductCard';
import { fetchProducts } from '../services/api';
import { Award, ArrowRight } from 'lucide-react';

const ProductListLabCoats = () => {
  const [products, setProducts] = useState(APRONS_LIST);

  useEffect(() => {
    let isMounted = true;
    fetchProducts().then((all) => {
      if (!isMounted || !all || all.length === 0) return;
      const matched = all.filter(
        (p) => p.categorySlug === 'aprons-lab-coats' || p.categoryId === 17 || /apron|lab coat/i.test(p.category)
      );
      if (matched.length > 0) {
        setProducts(matched);
      }
    }).catch((err) => {
      console.warn('Using fallback aprons:', err);
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <section id="aprons-collection" className="py-16 bg-[#F8F9FE] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A175A] uppercase tracking-wider mb-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Product Line 02</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A175A] tracking-tight">
              Aprons for Men & Women
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Physician consultation coats, doctor aprons, and clinical examination wear tailored in non-yellowing, stain-release twill.
            </p>
          </div>

          <a
            href="#custom-embroidery"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1A175A] hover:text-blue-700 transition-colors group"
          >
            <span>Add Name & Hospital Embroidery</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProductListLabCoats;
