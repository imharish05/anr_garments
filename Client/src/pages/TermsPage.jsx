import React from 'react';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';

const TermsPage = () => {
  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Terms and Conditions' }]} />

      <section className="py-14 sm:py-20 bg-slate-50 min-h-screen font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/90 shadow-sm space-y-8 text-slate-700 leading-relaxed text-xs sm:text-sm">
            
            <div className="border-b border-slate-100 pb-6 space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#1A175A]">
                Commercial Agreement
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
                Terms and Conditions
              </h1>
              <p className="text-xs text-slate-500">
                Last Updated: January 1, 2026 • ANR Hospital Garments Bangalore
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
              <p>
                By accessing, browsing, or purchasing medical apparel from ANR Hospital Garments through our digital platform or institutional sales desks, you agree to be bound by these Terms and Conditions and all associated policies including our Cancellation & Refund Policy.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">2. Medical Uniform Specifications & Customization</h2>
              <p>
                Our garments are engineered for healthcare personnel. When uploading hospital crest logos or doctor names for computerized embroidery, the customer warrants that they possess lawful authorization to use said trademarks and names. ANR Hospital Garments disclaims liability for unauthorized crest reproductions supplied by purchasers.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">3. Pricing, Commercial Invoicing & Taxes</h2>
              <p>
                All retail consumer prices listed are in Indian National Rupees (INR) and include applicable Goods and Services Tax (GST). For institutional hospital orders, official GST commercial tax invoices indicating HSN/SAC codes and eligible Input Tax Credit (ITC) will be issued upon provision of a verified 15-digit GSTIN.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">4. Sanitary Exclusion of Returns</h2>
              <p>
                In compliance with medical sanitary regulations, all hospital garments are non-returnable and non-exchangeable once dispatched from our Bangalore manufacturing facility. Cancellations are permitted strictly prior to courier dispatch.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">5. Governing Law & Jurisdiction</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or in connection with transactions on this platform shall be subject to the exclusive jurisdiction of the competent courts in <strong>Bangalore, Karnataka</strong>.
              </p>
            </div>

          </div>

        </div>
      </section>
    </Layout>
  );
};

export default TermsPage;