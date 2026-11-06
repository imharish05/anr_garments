import React from 'react';
import { COMPANY_INFO } from '../data/mockData';
import { ArrowRight, ShieldCheck, Sparkles, Feather, RefreshCw, Wind, CheckCircle2 } from 'lucide-react';

const HeroBanner = () => {
  return (
    <div className="relative bg-[#1A175A] text-white overflow-hidden border-b border-white/10">
      {/* Background radial and subtle grid */}
      <div className="absolute inset-0 bg-radial-gradient from-blue-900/40 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Content from Image 1 & 2 */}
          <div className="lg:col-span-7 space-y-6 z-10">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-semibold tracking-wide text-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Bangalore Factory Direct Medical Uniforms</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span className="text-white font-bold">Est. 2007</span>
            </div>

            {/* Official Headline from Image 1 */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black tracking-tight leading-[1.1] text-white uppercase font-sans">
                Designed for Care. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-sky-300 to-amber-300">
                  Made to Perform.
                </span>
              </h1>
            </div>

            {/* Official Subtitle from Image 1 */}
            <p className="text-base sm:text-lg text-blue-100 max-w-2xl leading-relaxed">
              {COMPANY_INFO.subheadline} Direct manufacturing in Bangalore for Super-Speciality Hospitals, Medical Colleges, and Clinical Professionals.
            </p>

            {/* 4 Feature Badges from Image 1 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-semibold text-white">
              <div className="flex items-center gap-2 bg-[#141247] p-2.5 rounded-xl border border-white/10">
                <ShieldCheck className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>PREMIUM QUALITY</span>
              </div>
              <div className="flex items-center gap-2 bg-[#141247] p-2.5 rounded-xl border border-white/10">
                <Feather className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>ALL DAY COMFORT</span>
              </div>
              <div className="flex items-center gap-2 bg-[#141247] p-2.5 rounded-xl border border-white/10">
                <RefreshCw className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>EASY CARE & DURABLE</span>
              </div>
              <div className="flex items-center gap-2 bg-[#141247] p-2.5 rounded-xl border border-white/10">
                <Wind className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>BREATHABLE FABRIC</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#scrubs-collection"
                className="inline-flex items-center gap-2 bg-white text-[#1A175A] hover:bg-blue-50 px-7 py-3.5 rounded-xl font-extrabold text-sm sm:text-base shadow-xl transition-all duration-200 hover:scale-105"
              >
                <span>Explore 5 Product Lines</span>
                <ArrowRight className="w-4 h-4 text-[#1A175A]" />
              </a>

              <a
                href="#bulk-inquiry"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#1A175A] px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-lg transition-all duration-200 hover:scale-105"
              >
                <span>Institutional Bulk Quote</span>
              </a>
            </div>

            {/* Sub-bar from Image 1: BUILT FOR EVERY SHIFT */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-blue-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-white">TRUSTED BY HOSPITALS</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-white">PREFERRED BY PROFESSIONALS</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-white">DESIGNED FOR PERFORMANCE</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image Showcase with Image 1 Poster */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-sky-500/20 rounded-3xl blur-2xl" />

              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-900 group">
                <img
                  src="/anr-hero-banner.jpg"
                  alt="ANR Hospital Garments - Designed for Care. Made to Perform."
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-102"
                />

                {/* Floating Bottom Card */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#141247]/95 backdrop-blur-md border border-white/20 p-3.5 rounded-xl text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                        Care in Every Thread
                      </p>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        Scrub Suits • Aprons • Underscrubs • Patient Wear
                      </h4>
                    </div>
                    <a
                      href="#factory-location"
                      className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-md border border-white/20 transition-colors flex-shrink-0"
                    >
                      Bangalore Unit
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
