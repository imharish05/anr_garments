import React, { useState } from 'react';
import useStorefrontSetting from '../hooks/useStorefrontSetting';
import { Truck, RotateCcw, ShieldCheck, HelpCircle, ChevronDown, Award, AlertCircle, RefreshCw } from 'lucide-react';
import { AnimatedText, ScrollReveal } from './MotionPrimitives';

const PERK_ICONS = [Truck, Award, ShieldCheck, RotateCcw];

const FaqShippingPerks = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const { data, loading, error, reload } = useStorefrontSetting('faqs');

  const perks = Array.isArray(data?.shippingPerks) ? data.shippingPerks : [];
  const faqItems = Array.isArray(data?.items) ? data.items : [];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Guarantee Badges */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-bone-soft p-6 rounded-2xl border border-slate-200/80 h-36" />
            ))}
          </div>
        ) : perks.length > 0 ? (
          <ScrollReveal
            staggerChildren
            staggerMs={75}
            triggerKey={perks.length}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 items-stretch"
          >
            {perks.map((perk, idx) => {
              const Icon = PERK_ICONS[idx % PERK_ICONS.length];
              return (
                <div
                  key={perk.title || idx}
                  className="h-full bg-[#F8F9FE] p-6 rounded-2xl border border-slate-200/80 flex flex-col hover:border-[#1A175A]/30 transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-3.5 min-h-[3rem]">
                    <div className="w-11 h-11 rounded-xl bg-[#1A175A] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-sm font-bold text-[#1A175A] leading-snug">
                      {perk.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 mt-3.5 leading-relaxed">
                    {perk.description || perk.desc}
                  </p>
                </div>
              );
            })}
          </ScrollReveal>
        ) : null}

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <ScrollReveal direction="pop" className="inline-block">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1A175A] text-xs font-bold uppercase tracking-wider mb-2">
                <HelpCircle className="w-3.5 h-3.5 text-[#1A175A]" />
                <span>{data?.eyebrow || 'Support & Procurement'}</span>
              </div>
            </ScrollReveal>
            <AnimatedText
              as="h2"
              triggerKey={data?.title || 'default'}
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1A175A] tracking-tight block"
            >
              {data?.title || 'Frequently Asked Questions'}
            </AnimatedText>
            {data?.subtitle && (
              <AnimatedText
                as="p"
                mode="words"
                delay={120}
                triggerKey={data.subtitle}
                className="text-slate-600 text-sm mt-1"
              >
                {data.subtitle}
              </AnimatedText>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 rounded-2xl border border-slate-200 skeleton-bone-soft" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <AlertCircle className="w-7 h-7 text-red-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-red-700">{error}</p>
              <button
                type="button"
                onClick={reload}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1A175A] text-white text-xs font-bold hover:bg-blue-900"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry FAQs
              </button>
            </div>
          ) : faqItems.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-500">
              No FAQs published at this moment.
            </div>
          ) : (
            <ScrollReveal
              staggerChildren
              staggerMs={55}
              triggerKey={faqItems.length}
              className="space-y-3"
            >
              {faqItems.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={faq.q || index}
                    className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-sm sm:text-base font-bold text-[#1A175A]">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#1A175A] flex-shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </ScrollReveal>
          )}
        </div>

      </div>
    </section>
  );
};

export default FaqShippingPerks;
