import React from 'react';
import useStorefrontSetting from '../hooks/useStorefrontSetting';
import { MapPin, Phone, Mail, Navigation, Clock, Building2, CheckCircle2 } from 'lucide-react';

const FactoryLocationSection = () => {
  const { data: storefront } = useStorefrontSetting('storefront');
  const phones = Array.isArray(storefront?.phones) ? storefront.phones : [];
  const address = storefront?.address || '';
  const mapsUrl = storefront?.googleMapsUrl || (address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : '');
  const mapEmbedUrl = address ? `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed` : '';

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
            Visit Our Manufacturing Unit
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Inspect our fabric rolls, verify garment sizing, and discuss institutional procurement directly with our production team.
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
                  {storefront?.brandName || 'Hospital Garments Unit'}
                </span>
              </div>

              {/* Physical Address */}
              {address && (
                <div className="flex items-start gap-3 pt-2">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-blue-200" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-1">
                      Factory & Office Address
                    </h4>
                    <p className="text-sm font-semibold text-white leading-relaxed">
                      {address}
                    </p>
                  </div>
                </div>
              )}

              {/* Direct Contact */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                {phones.length > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone className="w-5 h-5 text-blue-200" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-1">
                        Direct Executive Lines
                      </h4>
                      {phones.map((ph) => (
                        <p key={ph} className="text-sm font-bold text-white mt-0.5">
                          <a href={`tel:${ph}`} className="text-blue-200 hover:text-white hover:underline">{ph}</a>
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {storefront?.email && (
                  <div className="flex items-start gap-3 pt-2">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Mail className="w-5 h-5 text-blue-200" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-0.5">
                        Official Email
                      </h4>
                      <a
                        href={`mailto:${storefront.email}`}
                        className="text-sm font-bold text-blue-200 hover:text-white hover:underline"
                      >
                        {storefront.email}
                      </a>
                    </div>
                  </div>
                )}

                {storefront?.workingHours && (
                  <div className="flex items-start gap-3 pt-2">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="w-5 h-5 text-blue-200" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-0.5">
                        Factory Working Hours
                      </h4>
                      <p className="text-xs text-white">
                        {storefront.workingHours}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Button */}
            {mapsUrl && (
              <div className="pt-8">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-xl bg-white hover:bg-blue-50 text-[#1A175A] font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <Navigation className="w-4 h-4 text-[#1A175A]" />
                  <span>Open in Google Maps App</span>
                </a>
              </div>
            )}
          </div>

          {/* Right Map Embed & Facility Highlights */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            {/* Google Map Iframe Card */}
            <div className="bg-white rounded-3xl p-3 border border-slate-200 shadow-xl overflow-hidden flex-1 min-h-[340px]">
              {mapEmbedUrl ? (
                <iframe
                  title="ANR Hospital Garments Manufacturing Location"
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ minHeight: "340px", border: 0, borderRadius: "1.25rem" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="h-[340px] rounded-2xl bg-slate-100 flex flex-col items-center justify-center text-slate-400 text-sm">
                  <MapPin className="w-8 h-8 mb-2" />
                  <span>Location coordinates loading...</span>
                </div>
              )}
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
