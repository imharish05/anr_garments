import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, Quote, CheckCircle2 } from 'lucide-react';
import { AnimatedText, ScrollReveal } from './MotionPrimitives';

const STATIC_REVIEWS = [
  {
    id: 'anr-static-1',
    rating: 5,
    title: 'Built for 12-Hour OT Shifts',
    body: 'ANR Hospital Garments has supplied our surgical team for over four years. The breathable fabric and relaxed cut make a real difference during long operation theatre hours, with consistent stitching in every batch.',
    productName: 'ANR Classic Unisex 5-Pocket Scrub Suit',
    productHref: '/products/scrub-suits',
    reviewerName: 'Dr. Sandeep K.',
    role: 'Senior Consultant Surgeon · Bangalore',
    isVerifiedPurchase: true,
  },
  {
    id: 'anr-static-2',
    rating: 5,
    title: 'Tailored Fit & Zero Color Fade',
    body: 'The women’s contoured scrub fit and crisp computerized department embroidery look sharp on ward rounds. Even after repeated high-temperature hospital laundering, there is no shrinkage or color bleeding.',
    productName: 'Women’s Tailored Scrub Set & Lab Coat',
    productHref: '/products/aprons-lab-coats',
    reviewerName: 'Dr. Meenakshi S.',
    role: 'Chief Resident, OBGYN · Multi-Speciality Hospital',
    isVerifiedPurchase: true,
  },
  {
    id: 'anr-static-3',
    rating: 5,
    title: 'Reliable Direct Factory Supply',
    body: 'Sourcing directly from ANR’s Bangalore manufacturing unit ensures timely institutional dispatches and uniform fabric quality across departments—from soft patient gowns to durable ward pant and shirt sets.',
    productName: 'Patient Gowns & Ward Uniform Sets',
    productHref: '/products/patient-gown',
    reviewerName: 'Mr. Ramesh Babu',
    role: 'Materials & Procurement Head · Healthcare Network',
    isVerifiedPurchase: true,
  },
];

const SeenInANR = () => {
  return (
    <section id="seen-in-anr" className="py-20 bg-[#F8F9FE] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal direction="pop" className="inline-block">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-[#1A175A] text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>Verified Clinician Feedback</span>
            </div>
          </ScrollReveal>
          <AnimatedText
            as="h2"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A175A] tracking-tight block"
          >
            Seen in ANR Hospital Garments
          </AnimatedText>
          <AnimatedText
            as="p"
            mode="words"
            delay={120}
            className="text-slate-600 text-base sm:text-lg mt-3"
          >
            Real feedback from doctors, surgeons, nurses, and healthcare teams wearing ANR clinical uniforms.
          </AnimatedText>
        </div>

        {/* Testimonials Grid */}
        <ScrollReveal
          staggerChildren
          staggerMs={80}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {STATIC_REVIEWS.map((review) => {
            const rating = Math.min(5, Math.max(1, Number(review.rating) || 5));
            const initial = review.reviewerName.replace(/^(Dr\.|Mr\.|Ms\.)\s*/i, '').charAt(0).toUpperCase()
              || review.reviewerName.charAt(0).toUpperCase();

            return (
              <div
                key={review.id}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
              >
                <Quote className="w-10 h-10 text-blue-100 absolute top-6 right-6 pointer-events-none group-hover:text-blue-200 transition-colors" />

                <div>
                  {/* Rating stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#1A175A] text-[#1A175A]" />
                    ))}
                    <span className="ml-2 text-xs font-bold text-slate-800">{rating.toFixed(1)} / 5.0</span>
                  </div>

                  {review.title && (
                    <h3 className="text-sm font-bold text-[#1A175A] mb-2">{review.title}</h3>
                  )}

                  {/* Review Text */}
                  <p className="text-slate-700 text-sm leading-relaxed italic mb-6">
                    "{review.body}"
                  </p>

                  {/* Product Tag */}
                  {review.productName && (
                    <div className="mb-6 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 font-medium">
                      <span className="font-bold text-[#1A175A]">Product: </span>
                      <Link to={review.productHref} className="hover:underline text-blue-700">
                        {review.productName}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Reviewer Details */}
                <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100">
                  <div className="relative w-11 h-11 rounded-full bg-[#1A175A] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {initial}
                    {review.isVerifiedPurchase && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 fill-blue-600 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-bold text-[#1A175A] text-sm sm:text-base truncate">
                      {review.reviewerName}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      {review.role}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollReveal>

      </div>
    </section>
  );
};

export default SeenInANR;
