import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, Copy, Check, Percent, ArrowRight, ShieldCheck, Building2, Truck, Award } from 'lucide-react';
import { fetchCoupons } from '../services/api';

const DEFAULT_COUPONS = [
  {
    id: 1,
    code: 'WELCOME20',
    type: 'PERCENT',
    value: 20,
    minOrderValue: 499,
    description: '20% OFF on your first healthcare uniform order',
    validUntil: '2027-12-31',
    badge: 'First Order'
  },
  {
    id: 2,
    code: 'FESTIVE20',
    type: 'PERCENT',
    value: 20,
    minOrderValue: 999,
    description: '20% OFF on all OT Scrubs, Lab Coats & Patient Wear',
    validUntil: '2027-12-31',
    badge: 'Seasonal Special'
  },
  {
    id: 3,
    code: 'TWINA100',
    type: 'FLAT',
    value: 100,
    minOrderValue: 799,
    description: 'Flat ₹100 instant discount on clinical orders above ₹799',
    validUntil: '2027-12-31',
    badge: 'Instant Cash'
  }
];

const BULK_TIERS = [
  {
    tier: 'Tier 01',
    name: 'Clinics & OPD Practice',
    range: '10 – 50 Sets',
    discount: '15% Volume Off',
    tag: 'Quick Hospital Setup',
    perks: [
      'Free Doctor Name & Cadre embroidery',
      'All 13 department clinical colours available',
      'Doorstep express delivery across India'
    ],
    highlight: false,
  },
  {
    tier: 'Tier 02',
    name: 'Hospitals & Nursing Homes',
    range: '51 – 200 Sets',
    discount: '22% Direct Factory Off',
    tag: 'Most Popular for Wards',
    perks: [
      'Free Hospital Crest digitized & embroidered',
      'Mix & match sizes (S to 2XL) per department',
      'Anti-microbial & autoclavable certified fabric',
      'Priority 48-hour Bangalore factory dispatch'
    ],
    highlight: true,
  },
  {
    tier: 'Tier 03',
    name: 'Hospital Chains & Colleges',
    range: '200+ Sets (Institutional)',
    discount: 'Wholesale Contract Pricing',
    tag: 'Enterprise Procurement',
    perks: [
      'Custom bespoke pant-hem and sleeve tailoring',
      'Dedicated institutional key account manager',
      'GST Input Tax Credit (ITC) compliant invoicing',
      'Flexible Net-30 procurement credit terms'
    ],
    highlight: false,
  }
];

const OffersSection = () => {
  const [coupons, setCoupons] = useState(DEFAULT_COUPONS);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetchCoupons().then((items) => {
      if (isMounted && Array.isArray(items) && items.length > 0) {
        setCoupons(items);
      }
    }).catch(err => {
      console.warn('Using default coupons fallback:', err);
    });
    return () => { isMounted = false; };
  }, []);

  const handleCopy = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  return (
    <section id="offers" className="py-16 sm:py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Special Offers &amp; Bulk Procurement Privileges</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A175A] tracking-tight">
            Institutional Discounts &amp; Active Promo Codes
          </h2>
          <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-amber-400" />
          <p className="mt-4 text-slate-600 text-sm sm:text-base">
            Take advantage of direct-from-factory savings, active checkout voucher codes, and tiered wholesale pricing tailored for medical professionals and healthcare institutions.
          </p>
        </div>

        {/* 1. Active Promo Voucher Cards */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#1A175A]" />
              <h3 className="text-base sm:text-lg font-bold text-[#1A175A]">
                Active Checkout Promo Vouchers
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Apply code during checkout for instant savings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {coupons.map((coupon) => {
              const isCopied = copiedCode === coupon.code;
              const discountText = coupon.type === 'PERCENT'
                ? `${Math.round(coupon.value)}% OFF`
                : `₹${Math.round(coupon.value)} OFF`;

              return (
                <div
                  key={coupon.id || coupon.code}
                  className="relative group bg-white border border-dashed border-[#1A175A]/25 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#1A175A]"
                >
                  {/* Decorative Ticket Cutouts */}
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full border-r border-slate-300 pointer-events-none" />
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full border-l border-slate-300 pointer-events-none" />

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
                        {coupon.badge || (coupon.type === 'PERCENT' ? 'Percentage Off' : 'Flat Discount')}
                      </span>
                      <h4 className="text-2xl font-black text-[#1A175A] tracking-tight">
                        {discountText}
                      </h4>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#1A175A]/5 text-[#1A175A] flex items-center justify-center flex-shrink-0">
                      <Percent className="w-5 h-5" />
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-600 line-clamp-2 min-h-[32px]">
                    {coupon.description || `Applicable on orders with minimum cart value of ₹${coupon.minOrderValue || 0}.`}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="font-mono text-xs font-bold tracking-widest text-[#1A175A] bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 select-all">
                      {coupon.code}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(coupon.code)}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#1A175A] text-white hover:bg-[#282479]'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  {coupon.minOrderValue > 0 && (
                    <div className="mt-2 text-[10px] text-slate-400">
                      Min. Cart Value: ₹{Number(coupon.minOrderValue).toLocaleString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Volume & Institutional Bulk Tier Pricing */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <Building2 className="w-4 h-4 text-[#1A175A]" />
            <h3 className="text-base sm:text-lg font-bold text-[#1A175A]">
              Tiered Volume Discounts for Clinics &amp; Hospital Chains
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {BULK_TIERS.map((tier) => (
              <div
                key={tier.tier}
                className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                  tier.highlight
                    ? 'bg-[#1A175A] text-white shadow-xl shadow-[#1A175A]/20 scale-[1.02] border-2 border-amber-400'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-sm hover:shadow-md'
                }`}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-[#1A175A] text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                    Recommended for Hospitals
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${tier.highlight ? 'text-amber-300' : 'text-[#1A175A]'}`}>
                      {tier.tier}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tier.highlight ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {tier.tag}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold tracking-tight mb-1">
                    {tier.name}
                  </h4>
                  <div className={`text-xs font-medium mb-4 ${tier.highlight ? 'text-blue-200' : 'text-slate-500'}`}>
                    Order Volume: <strong className={tier.highlight ? 'text-white' : 'text-slate-800'}>{tier.range}</strong>
                  </div>

                  <div className={`p-3 rounded-xl mb-5 text-center font-black text-lg ${
                    tier.highlight ? 'bg-white/10 text-amber-300' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {tier.discount}
                  </div>

                  <ul className="space-y-2.5 mb-6">
                    {tier.perks.map((perk, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                        <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${tier.highlight ? 'text-amber-400' : 'text-emerald-600'}`} />
                        <span className={tier.highlight ? 'text-slate-100' : 'text-slate-600'}>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#bulk-inquiry"
                  className={`inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    tier.highlight
                      ? 'bg-amber-400 text-[#1A175A] hover:bg-amber-300 shadow-md'
                      : 'bg-[#1A175A] text-white hover:bg-[#282479]'
                  }`}
                >
                  <span>Request Custom Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Reassurance Perks Bar */}
        <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1A175A]/5 text-[#1A175A] flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Direct Bangalore Factory Dispatch</p>
              <p className="text-[11px] text-slate-500">Zero middleman markup, genuine manufacturer pricing</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1A175A]/5 text-[#1A175A] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Autoclavable Guarantee</p>
              <p className="text-[11px] text-slate-500">60+ wash autoclave test endurance certified</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1A175A]/5 text-[#1A175A] flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">GST Input Tax Credit Compliant</p>
              <p className="text-[11px] text-slate-500">Official commercial tax invoices for institutional claims</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default OffersSection;
