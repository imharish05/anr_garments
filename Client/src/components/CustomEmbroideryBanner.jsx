import React from 'react';
import { COMPANY_INFO } from '../data/mockData';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';

const CustomEmbroideryBanner = () => {
  return (
    <section id="custom-embroidery" className="py-16 bg-[#1A175A] text-white relative overflow-hidden">
      {/* Decorative background grid and glow */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>In-House Bangalore Embroidery Unit</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight font-sans">
              Personalized Hospital Crest & Doctor Name Embroidery
            </h2>

            <p className="text-blue-100 text-base sm:text-lg leading-relaxed max-w-2xl">
              Elevate your clinical distinction. We embroider doctor names, academic degrees (MBBS, MD, MS, DNB), specialized departments, and multi-color hospital crests with permanent, autoclave-tested Madeira™ threads.
            </p>

            {/* Feature checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Doctor Name & Qualifications (MD, MS, MBBS)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Hospital Logo Vector Digitizing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Bleed-Proof, Autoclave-Safe Threads</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Fast 48-Hour Turnaround in Bangalore</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#bulk-inquiry"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#1A175A] px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-lg transition-transform hover:scale-105"
              >
                <span>Order With Custom Embroidery</span>
                <ArrowRight className="w-4 h-4 text-[#1A175A]" />
              </a>
              <span className="text-xs text-blue-200">
                Direct Consultation with Mr. Manjunath Rao & Mr. Balraj
              </span>
            </div>
          </div>

          {/* Right Visual Embroidery Mockup Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#141247] p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                  Live Embroidery Mockup
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                  Autoclave Tested
                </span>
              </div>

              {/* Simulated Scrub Pocket */}
              <div className="bg-gradient-to-br from-[#1A175A] to-[#252079] p-6 rounded-2xl border-2 border-dashed border-white/30 text-white relative shadow-inner">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center p-2 text-white font-black text-xl">
                    ΛNR
                  </div>
                  <div>
                    <p className="font-serif text-lg sm:text-xl font-bold tracking-wide text-white">
                      Dr. Manjunath Rao, MS
                    </p>
                    <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
                      Chief of Surgical Care
                    </p>
                    <p className="text-[11px] text-amber-300 font-medium mt-0.5">
                      ANR Hospital Garments • Bangalore
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-blue-200">
                  <span>Thread: Silver Satin #001</span>
                  <span>Digitizing: Exact Vector Match</span>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-blue-300">
                  Free digitized crest sample provided for orders above 25 sets.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CustomEmbroideryBanner;
