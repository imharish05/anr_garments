import React, { useState, useEffect } from 'react';
import { PATIENT_WEAR_LIST } from '../data/mockData';
import ProductCard from './ProductCard';
import { fetchProducts } from '../services/api';
import { Heart, ArrowRight } from 'lucide-react';

const ProductListPatientWear = () => {
  const [products, setProducts] = useState(PATIENT_WEAR_LIST);

  useEffect(() => {
    let isMounted = true;
    fetchProducts().then((all) => {
      if (!isMounted || !all || all.length === 0) return;
      const matched = all.filter(
        (p) =>
          p.categorySlug === 'patient-gown' ||
          p.categorySlug === 'patient-pant-shirt' ||
          p.categoryId === 19 ||
          p.categoryId === 20 ||
          /patient/i.test(p.category)
      );
      if (matched.length > 0) {
        setProducts(matched);
      }
    }).catch((err) => {
      console.warn('Using fallback patient wear:', err);
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <section id="patient-wear-collection" className="py-16 bg-[#F8F9FE] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-slate-200">
          <div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A175A] tracking-tight">
              Patient Gown • Patient Pant & Shirt
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Dignified, comfortable, and hygienic patient apparel designed for hospital wards, operation theatres, and recovery rooms.
            </p>
          </div>

          <a
            href="#bulk-inquiry"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1A175A] hover:text-blue-700 transition-colors group"
          >
            <span>Inpatient Hospital Ward Supply</span>
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

export default ProductListPatientWear;
