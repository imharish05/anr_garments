import React, { useState } from 'react';
import { FAQS } from '../data/mockData';
import { Truck, RotateCcw, ShieldCheck, HelpCircle, ChevronDown, Award } from 'lucide-react';

const PERKS = [
  {
    icon: Truck,
    title: "Pan-India Fast Delivery",
    desc: "Free shipping on prepaid orders. Express air dispatch across metro and tier-2 cities."
  },
  {
    icon: RotateCcw,
    title: "7-Day Doorstep Exchange",
    desc: "Easy size exchange if the fit isn't right. Courier doorstep pickup provided."
  },
  {
    icon: ShieldCheck,
    title: "100% Hospital Certified",
    desc: "Tested for autoclaving, antimicrobial resistance, and zero color bleeding."
  },
  {
    icon: Award,
    title: "Direct Factory Pricing",
    desc: "Premium clinical apparel manufactured in-house without inflated retail markups."
  }
];

const FaqShippingPerks = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Guarantee Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {PERKS.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <div
                key={idx}
                className="bg-[#F8F9FE] p-6 rounded-2xl border border-slate-200/80 flex items-start gap-4 hover:border-[#1A175A]/30 transition-all hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-[#1A175A] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <Icon className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1A175A]">
                    {perk.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {perk.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1A175A] text-xs font-bold uppercase tracking-wider mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-[#1A175A]" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1A175A] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Everything you need to know about sizing, customized hospital embroidery, and caring for your scrubs.
            </p>
          </div>

          {/* Accordion */}
          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200"
                >
                  <button
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
          </div>
        </div>

      </div>
    </section>
  );
};

export default FaqShippingPerks;
