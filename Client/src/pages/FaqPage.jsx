import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import useStorefrontSetting from '../hooks/useStorefrontSetting';
import { ChevronDown, ChevronUp, HelpCircle, Phone, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const FaqPage = () => {
  const [openItems, setOpenItems] = useState({});
  const { data: faqData, loading, error, reload } = useStorefrontSetting('faqs');
  const { data: storefront } = useStorefrontSetting('storefront');

  const categorizedFaqs = useMemo(() => {
    const rawItems = Array.isArray(faqData?.items) ? faqData.items : [];
    const grouped = new Map();
    rawItems.forEach((item) => {
      if (item && Array.isArray(item.items)) {
        const key = item.category || 'General Questions';
        grouped.set(key, [...(grouped.get(key) || []), ...item.items]);
      } else if (item && item.q && item.a) {
        const key = item.category || 'General Questions';
        grouped.set(key, [...(grouped.get(key) || []), item]);
      }
    });
    return Array.from(grouped.entries()).map(([category, items]) => ({ category, items }));
  }, [faqData]);

  const primaryPhone = Array.isArray(storefront?.phones) ? storefront.phones[0] : '';

  const toggleItem = (catIndex, itemIndex) => {
    const key = `${catIndex}-${itemIndex}`;
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Frequently Asked Questions' }]} />

      <section className="py-14 sm:py-20 bg-slate-50 min-h-screen font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center space-y-3 mb-12">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#1A175A]">
              {faqData?.eyebrow || 'Help & Information Center'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              {faqData?.title || 'Frequently Asked Questions'}
            </h1>
            {faqData?.subtitle && (
              <p className="text-sm text-slate-600 max-w-xl mx-auto">
                {faqData.subtitle}
              </p>
            )}
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-3">
                  <div className="h-4 w-48 skeleton-bone rounded" />
                  <div className="h-12 skeleton-bone-soft rounded-2xl" />
                  <div className="h-12 skeleton-bone-soft rounded-2xl" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-white rounded-3xl p-8 border border-red-200 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
              <p className="text-sm font-bold text-slate-800">{error}</p>
              <button
                type="button"
                onClick={reload}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1A175A] text-white text-xs font-bold hover:bg-blue-900"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Loading FAQs
              </button>
            </div>
          ) : categorizedFaqs.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-dashed border-slate-300 text-center text-sm text-slate-500">
              No FAQs are currently published. Please reach out via our contact desk.
            </div>
          ) : (
            <div className="space-y-8">
              {categorizedFaqs.map((cat, catIdx) => (
                <div key={cat.category || catIdx} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A175A] pb-3 border-b border-slate-100">
                    {cat.category}
                  </h3>

                  <div className="space-y-3">
                    {cat.items.map((it, itemIdx) => {
                      const isOpen = Boolean(openItems[`${catIdx}-${itemIdx}`]);
                      return (
                        <div
                          key={it.q || itemIdx}
                          className="rounded-2xl border border-slate-200/80 overflow-hidden transition-all"
                        >
                          <button
                            type="button"
                            onClick={() => toggleItem(catIdx, itemIdx)}
                            className="w-full p-4 text-left flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 font-bold text-xs sm:text-sm text-slate-900 transition-colors"
                          >
                            <span>{it.q}</span>
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4 text-[#1A175A] shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                          </button>

                          {isOpen && (
                            <div className="p-4 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                              {it.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Need More Assistance Card */}
          <div className="mt-12 bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4">
            <HelpCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Have a Clinical Department Query?</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Our institutional tailoring and sales support team is ready to assist you.
            </p>
            <div className="flex justify-center gap-4 pt-2 flex-wrap">
              {primaryPhone && (
                <a
                  href={`tel:${primaryPhone}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A175A] text-white text-xs font-bold hover:bg-[#141247]"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-300" />
                  <span>Call {primaryPhone}</span>
                </a>
              )}
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200"
              >
                <span>Contact Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>
    </Layout>
  );
};

export default FaqPage;
