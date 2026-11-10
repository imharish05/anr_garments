import React from 'react';
import { Scissors, UserRound, Building2, ShieldCheck, Clock3, ArrowRight } from 'lucide-react';

const FEATURES = [
  { Icon: UserRound, title: 'Doctor Name & Degree', desc: 'MBBS, MD, MS, DNB and department stitched in clean, readable lettering.' },
  { Icon: Building2, title: 'Hospital Logo Digitizing', desc: 'Your crest converted to an exact stitch file from your artwork.' },
  { Icon: ShieldCheck, title: 'Autoclave-Safe Thread', desc: 'Bleed-proof Madeira™ thread that survives hospital sterilization.' },
  { Icon: Clock3, title: '48-Hour Turnaround', desc: 'Finished at our in-house Bangalore embroidery unit.' },
];

/* Faint abstract thread lines, same idea as the icon backdrop in ShopByCategory */
const ThreadBackdrop = () => (
  <svg
    viewBox="0 0 1200 700"
    preserveAspectRatio="xMidYMid slice"
    className="absolute inset-0 w-full h-full pointer-events-none"
    aria-hidden="true"
  >
    <g fill="none" strokeLinecap="round">
      <path d="M-40 120 C 220 40, 380 240, 640 140 S 1000 40, 1240 160" stroke="#1A175A" strokeOpacity=".08" strokeWidth="2" />
      <path d="M-40 150 C 230 70, 390 270, 650 170 S 1010 70, 1240 190" stroke="#1A175A" strokeOpacity=".07" strokeWidth="1.5" strokeDasharray="9 9" />
      <path d="M-40 600 C 240 520, 420 700, 680 580 S 1020 480, 1240 590" stroke="#E3B23C" strokeOpacity=".28" strokeWidth="2" />
      <path d="M-40 630 C 250 550, 430 730, 690 610 S 1030 510, 1240 620" stroke="#E3B23C" strokeOpacity=".2" strokeWidth="1.5" strokeDasharray="9 9" />
    </g>
  </svg>
);

const CustomEmbroideryBanner = () => {
  return (
    <section
      id="custom-embroidery"
      className="relative overflow-hidden py-16 sm:py-20 bg-[#F8F9FD] border-b border-slate-100"
    >
      <ThreadBackdrop />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header, same pattern as other ANR sections */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1A175A] text-xs font-bold uppercase tracking-wider mb-3">
            <Scissors className="w-4 h-4" />
            <span>In-House Embroidery Unit, Bangalore</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A175A] tracking-tight uppercase">
            Custom Embroidery
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3 font-medium">
            Your name and your hospital crest, stitched on every coat and scrub set.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: navy showcase card with embroidered pocket */}
          <div className="lg:col-span-5 bg-[#1A175A] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />

            <div className="relative">
              <div
                className="rounded-2xl p-6 sm:p-8 bg-white"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, rgba(26,23,90,.05) 0 2px, transparent 2px 6px)',
                }}
              >
                <div className="border-2 border-dashed border-[#1A175A]/40 rounded-xl p-5 text-center">
                  <p
                    className="font-serif italic text-2xl sm:text-3xl text-[#1A175A]"
                    style={{ textShadow: '0 1px 0 rgba(255,255,255,.9), 0 -1px 0 rgba(26,23,90,.25)' }}
                  >
                    Dr. Manjunath Rao
                  </p>
                  <p
                    className="mt-2 text-sm font-semibold text-amber-600"
                    style={{ textShadow: '0 1px 0 rgba(255,255,255,.9)' }}
                  >
                    MS · General Surgery
                  </p>
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-blue-200">Sample embroidered pocket</p>
            </div>

            <div className="relative mt-8 space-y-4">
              <a
                href="#bulk-inquiry"
                className="w-full inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#1A175A] px-6 py-3.5 rounded-xl font-bold shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              >
                Request Embroidery Quote
                <ArrowRight className="w-4 h-4" />
              </a>
              <p className="text-xs text-blue-200 text-center">
                Free digitized crest sample on orders of 25 sets or more.
              </p>
            </div>
          </div>

          {/* Right: feature cards, same style as FabricTechSection */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-[#1A175A]/40 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#1A175A] flex items-center justify-center mb-5 shadow-md group-hover:bg-[#141247] transition-colors">
                  <Icon className="w-6 h-6 text-amber-300" />
                </div>
                <h3 className="text-lg font-bold text-[#1A175A] mb-2">{title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-slate-600">
          Direct consultation with{' '}
          <span className="font-semibold text-[#1A175A]">Mr. Manjunath Rao</span> and{' '}
          <span className="font-semibold text-[#1A175A]">Mr. Balraj</span>
        </p>
      </div>
    </section>
  );
};

export default CustomEmbroideryBanner;