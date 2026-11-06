import React from 'react';
import { TESTIMONIALS } from '../data/mockData';
import { Star, ShieldCheck, Quote, CheckCircle2 } from 'lucide-react';

const SeenInANR = () => {
  return (
    <section className="py-20 bg-[#F8F9FE] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-[#1A175A] text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Verified Healthcare Heroes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A175A] tracking-tight">
            Seen in ANR Hospital Garments
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3">
            Hear from leading surgeons, chief residents, and nurses who rely on ANR scrubs to get them through demanding 24-hour hospital shifts.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
            >
              <Quote className="w-10 h-10 text-blue-100 absolute top-6 right-6 pointer-events-none group-hover:text-blue-200 transition-colors" />

              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-2 text-xs font-bold text-slate-800">5.0 / 5.0</span>
                </div>

                {/* Review Text */}
                <p className="text-slate-700 text-sm leading-relaxed italic mb-6">
                  "{review.text}"
                </p>

                {/* Product Tag */}
                <div className="mb-6 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 font-medium">
                  <span className="font-bold text-[#1A175A]">Wears: </span>
                  {review.productUsed}
                </div>
              </div>

              {/* Doctor Details */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <div className="relative">
                  <img
                    src={review.image}
                    alt={review.doctor}
                    className="w-13 h-13 w-12 h-12 rounded-full object-cover border-2 border-[#1A175A]"
                  />
                  {review.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-blue-600 text-white" />
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-[#1A175A] text-sm sm:text-base">
                    {review.doctor}
                  </h4>
                  <p className="text-xs text-blue-800 font-medium">
                    {review.specialty}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {review.hospital}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Community Banner */}
        <div className="mt-12 text-center">
          <p className="text-sm font-semibold text-slate-600">
            Join 100,000+ medical professionals wearing ANR daily. Tag us on Instagram{" "}
            <span className="text-[#1A175A] font-bold">#ANRHospitalGarments</span>
          </p>
        </div>

      </div>
    </section>
  );
};

export default SeenInANR;
