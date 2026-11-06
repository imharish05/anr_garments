import React, { useState } from 'react';
import { COLOR_COLLECTIONS } from '../data/mockData';
import { Palette, Check, ArrowRight, Sparkles, Heart, Wind, Shield, RefreshCw, Move, CheckCircle2 } from 'lucide-react';

const ShopByColor = () => {
  const [selectedColor, setSelectedColor] = useState(COLOR_COLLECTIONS[0]);

  return (
    <section id="shop-colors" className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header from Image 3 */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1A175A] text-xs font-bold tracking-wider uppercase mb-3">
            <Palette className="w-3.5 h-3.5 text-[#1A175A]" />
            <span>Hospital Department Color Palette</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-[#1A175A] tracking-tight uppercase">
            All Colours. <br className="sm:hidden" />
            <span className="text-blue-700">Same Quality. Same Care.</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Premium hospital garments designed for comfort, performance, and reliability across all department color codes.
          </p>

          {/* Color Swatch Circles Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-6">
            {COLOR_COLLECTIONS.map((color) => {
              const isSelected = selectedColor.name === color.name;
              return (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`group flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 ${
                    isSelected
                      ? 'border-[#1A175A] bg-[#1A175A] text-white shadow-md scale-105'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: color.hex }}
                  >
                    {isSelected && <Check className="w-2 h-2 text-white stroke-[3]" />}
                  </span>
                  <span>{color.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Official Banner Visual & Feature Badges from Image 3 */}
        <div className="bg-[#1A175A] text-white rounded-3xl overflow-hidden shadow-2xl border border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 p-6 sm:p-10 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold border border-white/15">
                <span
                  className="w-3 h-3 rounded-full border border-white"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <span>Selected Shade: <strong className="text-white">{selectedColor.name}</strong></span>
                <span className="text-white/30">|</span>
                <span className="text-amber-300 font-bold">{selectedColor.count}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Consistent Color Fastness Shift After Shift
              </h3>

              <p className="text-blue-100 text-sm leading-relaxed">
                Whether you select Royal Blue for Surgery, Ceil Blue for Wards, Hunter Green for OT, or Doctor White for Consultation Aprons, our high-density reactive dyeing prevents fading, bleeding, and dullness through industrial autoclave laundering.
              </p>

              {/* 6 Icons from Image 3 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <Heart className="w-4 h-4 text-amber-300 mb-1" />
                  <h5 className="text-xs font-bold text-white">SOFT ON SKIN</h5>
                  <p className="text-[10px] text-blue-200">All-day comfort</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <Wind className="w-4 h-4 text-amber-300 mb-1" />
                  <h5 className="text-xs font-bold text-white">BREATHABLE</h5>
                  <p className="text-[10px] text-blue-200">Keeps you cool</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <Shield className="w-4 h-4 text-amber-300 mb-1" />
                  <h5 className="text-xs font-bold text-white">DURABLE</h5>
                  <p className="text-[10px] text-blue-200">Shift after shift</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <RefreshCw className="w-4 h-4 text-amber-300 mb-1" />
                  <h5 className="text-xs font-bold text-white">EASY CARE</h5>
                  <p className="text-[10px] text-blue-200">Wash, wear & repeat</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <Move className="w-4 h-4 text-amber-300 mb-1" />
                  <h5 className="text-xs font-bold text-white">EASY MOVEMENT</h5>
                  <p className="text-[10px] text-blue-200">Free flexibility</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 mb-1" />
                  <h5 className="text-xs font-bold text-white">HEALTHCARE FIT</h5>
                  <p className="text-[10px] text-blue-200">Trusted everywhere</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="#scrubs-collection"
                  className="inline-flex items-center gap-2 bg-white text-[#1A175A] hover:bg-blue-50 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105"
                >
                  <span>Order in {selectedColor.name}</span>
                  <ArrowRight className="w-4 h-4 text-[#1A175A]" />
                </a>
                <a
                  href="#bulk-inquiry"
                  className="text-xs font-semibold text-blue-200 hover:text-white underline underline-offset-4"
                >
                  Request Swatch Booklet
                </a>
              </div>
            </div>

            {/* Right Image Banner from Image 3 */}
            <div className="lg:col-span-6 h-full relative overflow-hidden bg-slate-900 flex items-center justify-center p-4">
              <img
                src="/anr-colors-banner.jpg"
                alt="ANR Hospital Garments - All Colours. Same Quality. Same Care."
                className="w-full h-auto max-h-[480px] object-contain rounded-2xl shadow-xl"
              />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default ShopByColor;
