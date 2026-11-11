import React from 'react';
import useStorefrontSetting from '../hooks/useStorefrontSetting';
import { Building2, Award, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const InstitutionsServed = () => {
  const { data, loading, error, reload } = useStorefrontSetting('institutions');
  const institutions = Array.isArray(data?.institutions) ? data.institutions : [];

  return (
    <section id="institutions" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 text-[#1A175A] text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5 text-blue-700" />
            <span>Institutional Partnerships</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1A175A] tracking-tight">
            {data?.title || 'Healthcare Partners & Institutions'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Direct uniform manufacturing built for hospital networks, medical colleges, and diagnostic centers across India.
          </p>
        </div>

        {/* Institutions Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-bone-soft p-6 rounded-2xl border border-slate-200 h-44" />
            ))}
          </div>
        ) : error ? (
          <div className="max-w-lg mx-auto bg-white border border-red-200 rounded-2xl p-6 text-center">
            <AlertCircle className="w-7 h-7 text-red-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-red-700">{error}</p>
            <button
              type="button"
              onClick={reload}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1A175A] text-white text-xs font-bold hover:bg-blue-900"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Partners
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {institutions.map((inst, index) => (
              <div
                key={inst.name || index}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#1A175A]/40 transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1A175A] flex items-center justify-center group-hover:bg-[#1A175A] group-hover:text-white transition-colors">
                    <Building2 className="w-5 h-5" />
                  </div>
                  {(inst.badge || inst.category) && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 max-w-[65%] truncate">
                      {inst.badge || inst.category}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-[#1A175A] transition-colors">
                    {inst.name}
                  </h4>
                  {(inst.city || inst.location) && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {inst.city || inst.location}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span>Institutional Supply Ready</span>
                </div>
              </div>
            ))}

            {/* Institutional CTA Card */}
            <div className="bg-[#1A175A] text-white p-6 rounded-2xl border border-[#1A175A] shadow-md flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block mb-2">
                  Hospital Procurement
                </span>
                <h4 className="text-lg font-bold text-white leading-snug">
                  Equip Your Medical Team
                </h4>
                <p className="text-xs text-blue-100 mt-2">
                  Get dedicated fabric swatches, custom logo samples, and institutional pricing for your organization.
                </p>
              </div>

              <a
                href="#bulk-inquiry"
                className="mt-4 inline-block text-center bg-white text-[#1A175A] hover:bg-blue-50 py-2.5 px-4 rounded-xl text-xs font-bold shadow transition-colors"
              >
                Get Hospital Quote →
              </a>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default InstitutionsServed;
