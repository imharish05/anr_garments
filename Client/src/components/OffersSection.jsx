import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Truck,
  Award,
  Scissors,
  BadgePercent
} from 'lucide-react';
import { fetchCoupons, fetchSetting } from '../services/api';
import { CouponCardSkeleton, BulkTierSkeleton } from './SkeletonLoaders';
import { AnimatedText, ScrollReveal } from './MotionPrimitives';

const OffersSection = () => {
  const [coupons, setCoupons] = useState([]);
  const [bulkTiers, setBulkTiers] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [loadingTiers, setLoadingTiers] = useState(true);
  const [couponsError, setCouponsError] = useState('');
  const [tiersError, setTiersError] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    let alive = true;
    fetchCoupons()
      .then((items) => {
        if (!alive) return;
        const list = Array.isArray(items) ? items : [];
        setCoupons(
          list.map((c, i) => ({
            ...c,
            badge: c.badge || (i === 0 ? 'First Order' : i === 1 ? 'Seasonal Special' : 'Instant Savings'),
          }))
        );
      })
      .catch((err) => {
        if (alive) {
          setCouponsError(err?.message || 'Unable to load offers right now.');
          setCoupons([]);
        }
      })
      .finally(() => {
        if (alive) setLoadingCoupons(false);
      });

    fetchSetting('bulk_tiers')
      .then((settingData) => {
        if (!alive) return;
        const tiers = Array.isArray(settingData?.tiers) ? settingData.tiers : [];
        setBulkTiers(tiers);
      })
      .catch((err) => {
        if (alive) {
          setTiersError(err?.message || 'Unable to load bulk pricing tiers.');
          setBulkTiers([]);
        }
      })
      .finally(() => {
        if (alive) setLoadingTiers(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const handleCopy = (code) => {
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  return (
    <section
      id="offers"
      className="scroll-mt-24 py-16 sm:py-20 bg-gradient-to-b from-[#F7F8FC] via-white to-[#F7F8FC] border-b border-slate-200/80 relative overflow-hidden"
    >
      {/* Decorative background glow blobs */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#1A175A]/[0.03] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-blue-500/[0.08] blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <AnimatedText
            as="h2"
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A175A] tracking-tight block"
          >
            Exclusive Offers & Bulk Discounts
          </AnimatedText>

          <ScrollReveal direction="scale" delay={180}>
            <div className="mx-auto mt-4 h-[3px] w-14 rounded-full bg-[#1A175A]" />
          </ScrollReveal>

          <AnimatedText
            as="p"
            mode="words"
            delay={120}
            className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed"
          >
            Apply active discount voucher codes at checkout or unlock institutional tier pricing directly.
          </AnimatedText>
        </div>

        {/* 1. Coupon Vouchers Grid */}
        <ScrollReveal
          staggerChildren
          staggerMs={80}
          triggerKey={loadingCoupons ? 'loading' : coupons.length}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14"
        >
          {loadingCoupons ? (
            [1, 2, 3].map((i) => <CouponCardSkeleton key={i} />)
          ) : couponsError ? (
            <div className="md:col-span-3 rounded-2xl border border-blue-200 bg-blue-50/80 p-6 text-center text-sm font-medium text-[#1A175A]">
              {couponsError}
            </div>
          ) : coupons.length === 0 ? (
            <div className="md:col-span-3 rounded-2xl border border-dashed border-slate-300 bg-white/80 p-8 text-center text-sm text-slate-600">
              No active discount coupons at this time.
            </div>
          ) : (
            coupons.map((c) => {
            const isCopied = copiedCode === c.code;
            const offText =
              c.type === 'PERCENT'
                ? `${Math.round(c.value)}% OFF`
                : `₹${Math.round(c.value)} OFF`;

            return (
              <div
                key={c.id || c.code}
                className="group relative flex flex-col sm:flex-row rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-[#1A175A]/10 transition-all duration-300 overflow-hidden"
              >
                {/* Left Ticket Stub (Navy with Perforation Effect) */}
                <div className="relative bg-[#1A175A] text-white p-5 flex flex-col justify-between items-center sm:items-start text-center sm:text-left sm:w-36 flex-shrink-0">
                  <div className="w-full flex items-center justify-between sm:justify-start gap-1.5 text-blue-200">
                    <BadgePercent className="w-4 h-4" />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest">
                      {c.badge || 'Voucher'}
                    </span>
                  </div>

                  <div className="my-3 sm:my-0">
                    <span className="block text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
                      {offText}
                    </span>
                    <span className="block text-[10px] text-blue-200 font-medium mt-1 uppercase tracking-wider">
                      Factory Coupon
                    </span>
                  </div>

                  <div className="hidden sm:flex items-center gap-1 text-[10px] text-blue-300/80">
                    <Scissors className="w-3 h-3 rotate-90" />
                    <span>Clip &amp; Apply</span>
                  </div>

                  {/* Semicircle Ticket Cutouts for perforation look on desktop */}
                  <div className="hidden sm:block absolute -right-3 top-[-10px] w-6 h-6 rounded-full bg-[#F7F8FC] border border-slate-200/60" />
                  <div className="hidden sm:block absolute -right-3 bottom-[-10px] w-6 h-6 rounded-full bg-[#F7F8FC] border border-slate-200/60" />
                </div>

                {/* Right Details Stub with Dashed Border */}
                <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between sm:border-l-2 sm:border-dashed sm:border-slate-200 bg-white">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      {/* <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        Active Today
                      </span> */}

                      {c.minOrderValue > 0 && (
                        <span className="text-[11px] font-semibold text-slate-500">
                          Min. Order ₹{Number(c.minOrderValue).toLocaleString()}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug line-clamp-2">
                      {c.description}
                    </p>
                  </div>

                  {/* Copy Coupon Action Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="font-mono text-xs font-black tracking-widest text-[#1A175A] bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 select-all">
                      {c.code}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(c.code)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-xs ${
                        isCopied
                          ? 'bg-emerald-600 text-white scale-105'
                          : 'bg-[#1A175A] hover:bg-blue-700 text-white'
                      }`}
                      aria-label={`Copy discount code ${c.code}`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          }))}
        </ScrollReveal>

        {/* 2. Institutional Bulk Volume Procurement Tiers (Hospital Ward Supply) */}
        <div className="mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-3 border-b border-slate-200">
            <div>
              <ScrollReveal direction="pop" className="inline-block">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-widest">
                  Hospital Procurement
                </p>
              </ScrollReveal>
              <AnimatedText
                as="h3"
                className="text-2xl sm:text-3xl font-black text-[#1A175A] tracking-tight mt-1 block"
              >
                Tiered Hospital Bulk Pricing
              </AnimatedText>
            </div>

          </div>

          <ScrollReveal
            staggerChildren
            staggerMs={90}
            triggerKey={loadingTiers ? 'loading' : bulkTiers.length}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {loadingTiers ? (
              [1, 2, 3].map((i) => <BulkTierSkeleton key={i} />)
            ) : tiersError ? (
              <div className="md:col-span-3 rounded-2xl border border-blue-200 bg-blue-50/80 p-6 text-center text-sm font-medium text-[#1A175A]">
                {tiersError}
              </div>
            ) : bulkTiers.length === 0 ? (
              <div className="md:col-span-3 rounded-2xl border border-dashed border-slate-300 bg-white/80 p-8 text-center text-sm text-slate-600">
                Contact our institutional sales desk for custom hospital volume brackets.
              </div>
            ) : (
              bulkTiers.map((tier, tierIdx) => {
                const isPopular = tier.popular ?? tierIdx === 1;
                const volumeLabel =
                  tier.volume ||
                  (tier.maxQty
                    ? `${tier.minQty} – ${tier.maxQty} Units`
                    : `${tier.minQty}+ Units`);
                const discountLabel =
                  tier.discount || `${tier.discountPercent}% Volume Off`;
                const tierTitle = tier.name || tier.label || `Tier ${tierIdx + 1}`;
                const tierTag = tier.tag || (isPopular ? 'Most Popular' : 'Direct Institutional');
                const tierCode = tier.tier || `Tier 0${tierIdx + 1}`;

                return (
                  <div
                    key={tier.id || tierCode}
                    className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                      isPopular
                        ? 'bg-[#1A175A] text-white shadow-xl shadow-[#1A175A]/20 ring-2 ring-blue-500'
                        : 'bg-white text-slate-800 border border-slate-200 hover:border-[#1A175A]/40 shadow-xs hover:shadow-md'
                    }`}
                  >
                    {isPopular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white text-[#1A175A] ring-1 ring-blue-200 text-[10px] font-black uppercase tracking-wider shadow-md">
                        ★ {tierTag}
                      </span>
                    )}

                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider ${
                            isPopular ? 'text-blue-200' : 'text-slate-500'
                          }`}
                        >
                          {tierCode} {!isPopular && `• ${tierTag}`}
                        </span>
                        <span
                          className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                            isPopular
                              ? 'bg-white/15 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {volumeLabel}
                        </span>
                      </div>

                      <h4
                        className={`text-lg sm:text-xl font-black tracking-tight ${
                          isPopular ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {tierTitle}
                      </h4>

                      <div className="mt-3 mb-5">
                        <span
                          className={`inline-block text-xl sm:text-2xl font-black tracking-tight ${
                            isPopular ? 'text-blue-200' : 'text-emerald-600'
                          }`}
                        >
                          {discountLabel}
                        </span>
                      </div>

                      {Array.isArray(tier.perks) && tier.perks.length > 0 && (
                        <ul className="space-y-2.5 mb-8">
                          {tier.perks.map((perk, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs leading-relaxed">
                              <Check
                                className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                                  isPopular ? 'text-blue-200' : 'text-emerald-600'
                                }`}
                              />
                              <span className={isPopular ? 'text-blue-100' : 'text-slate-600'}>
                                {perk}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <a
                      href="/bulk-order"
                      className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        isPopular
                          ? 'bg-white hover:bg-blue-50 text-[#1A175A] shadow-md'
                          : 'bg-[#1A175A] hover:bg-[#141247] text-white shadow-xs'
                      }`}
                    >
                      <span>Request Tier Quote</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                );
              })
            )}
          </ScrollReveal>
        </div>

        {/* 3. Reassurance Perks & Factory Quality Guarantees Bar */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1A175A]/5 text-[#1A175A] flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-slate-900">Direct Bangalore Factory Dispatch</h5>
              <p className="text-xs text-slate-500 mt-0.5">
                Zero middleman markup, genuine Bangalore manufacturer wholesale pricing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1A175A]/5 text-[#1A175A] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-slate-900">60+ Autoclave Wash Guarantee</h5>
              <p className="text-xs text-slate-500 mt-0.5">
                Steam sterilization tested endurance, shrink-proof &amp; anti-microbial fabric weave.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1A175A]/5 text-[#1A175A] flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-slate-900">Official GST ITC Compliant</h5>
              <p className="text-xs text-slate-500 mt-0.5">
                GST commercial tax invoices issued for hospital input tax credit claims.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default OffersSection;
