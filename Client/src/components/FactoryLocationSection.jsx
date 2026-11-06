import React from 'react';
import { COMPANY_INFO } from '../data/mockData';
import { MapPin, Phone, Mail, Navigation, Clock, Building2, CheckCircle2 } from 'lucide-react';

const FactoryLocationSection = () => {
  return (
    <section id="factory-location" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#1A175A] text-xs font-bold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5 text-blue-700" />
            <span>Manufacturing Facility & Head Office</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A175A] tracking-tight">
            Visit Our Bangalore Factory
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Inspect our fabric rolls, try sample sizes, and discuss institutional procurement directly with our founders in Banashankari, Bangalore.
          </p>
        </div>

        {/* Location Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Contact & Address Card */}
          <div className="lg:col-span-5 bg-[#1A175A] text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="font-sans text-2xl font-black tracking-wider text-white">ΛNR</span>
                <span className="text-[10px] uppercase tracking-widest text-blue-200 font-bold border-l border-white/20 pl-3">
                  Hospital Garments Unit
                </span>
              </div>

              {/* Physical Address */}
              <div className="flex items-start gap-3 pt-2">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-1">
                    Factory & Office Address
                  </h4>
                  <p className="text-sm font-semibold text-white leading-relaxed">
                    {COMPANY_INFO.address}
                  </p>
                  <p className="text-xs text-blue-200 mt-0.5">
                    Landmark: Near Girinagar 1st Stage, Banashankari
                  </p>
                </div>
              </div>

              {/* Founders Contact */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-1">
                      Direct Executive Lines
                    </h4>
                    <p className="text-sm font-bold text-white">
                      Mr. Manjunath Rao G: <a href="tel:9986044574" className="text-amber-300 hover:underline">9986044574</a>
                    </p>
                    <p className="text-sm font-bold text-white mt-1">
                      Mr. Balraj. V: <a href="tel:6363429113" className="text-amber-300 hover:underline">6363429113</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-0.5">
                      Official Email
                    </h4>
                    <a
                      href={`mailto:${COMPANY_INFO.email}`}
                      className="text-sm font-bold text-amber-300 hover:underline"
                    >
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-0.5">
                      Factory Working Hours
                    </h4>
                    <p className="text-xs text-white">
                      Monday to Saturday: 9:30 AM – 7:30 PM IST
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Button */}
            <div className="pt-8">
              <a
                href={COMPANY_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#1A175A] font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <Navigation className="w-4 h-4 text-[#1A175A]" />
                <span>Open in Google Maps App</span>
              </a>
            </div>
          </div>

          {/* Right Map Embed & Facility Highlights */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            {/* Google Map Iframe Card */}
            <div className="bg-white rounded-3xl p-3 border border-slate-200 shadow-xl overflow-hidden flex-1 min-h-[340px]">
              <iframe
                title="ANR Hospital Garments Bangalore Location"
                src="https://maps.google.com/maps?q=1205,%2012th%20Cross,%202nd%20Phase,%201st%20Stage,%20Banashankari,%20Girinagar,%20Bangalore-560085&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ minHeight: "340px", border: 0, borderRadius: "1.25rem" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Quick Facility Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-800">In-House Cutting & Stitching</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-800">Computerized Embroidery</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-800">Pan-India Express Dispatch</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default FactoryLocationSection;
