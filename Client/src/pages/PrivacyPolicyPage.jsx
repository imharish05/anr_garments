import React from 'react';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import useStorefrontSetting from '../hooks/useStorefrontSetting';

const PrivacyPolicyPage = () => {
  const { data: storefront } = useStorefrontSetting('storefront');
  const phones = Array.isArray(storefront?.phones) ? storefront.phones.filter(Boolean) : [];
  const email = storefront?.email || '';
  const address = storefront?.address || '';

  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      <section className="py-14 sm:py-20 bg-slate-50 min-h-screen font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/90 shadow-sm space-y-8 text-slate-700 leading-relaxed text-xs sm:text-sm">
            
            <div className="border-b border-slate-100 pb-6 space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#1A175A]">
                Data Protection & Privacy
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
                Privacy Policy
              </h1>
              <p className="text-xs text-slate-500">
                ANR Hospital Garments • Healthcare Confidentiality Standards
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">1. Information We Collect</h2>
              <p>
                We collect information necessary to process your healthcare apparel orders, customize doctor name embroidery, deliver to clinical facilities, and issue commercial GST tax invoices:
              </p>
              <ul className="space-y-2 pl-4 list-disc text-slate-600">
                <li><strong>Identity Information:</strong> Doctor / Purchaser Name, Hospital / Clinic Name, Designation.</li>
                <li><strong>Contact Details:</strong> Phone number, email address, clinical shipping and billing addresses.</li>
                <li><strong>Tax Information:</strong> Hospital Legal Entity Name and 15-digit GSTIN (where provided).</li>
                <li><strong>Customization Content:</strong> Doctor embroidery names, department lines, and uploaded hospital crest vector files.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">2. How We Use Your Data</h2>
              <p>
                Your information is used solely for order production, precision embroidery, freight logistics coordination, GST invoice generation, and customer service communication. <strong>We strictly do not sell, rent, or trade healthcare professional contact details or hospital institutional procurement data to any third party.</strong>
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">3. Payment Information Security</h2>
              <p>
                All online payments are securely processed through <strong>Razorpay</strong> via 256-bit SSL encryption adhering to PCI-DSS Level 1 compliance. ANR Hospital Garments never captures, stores, or processes complete credit card numbers, CVV, or banking passwords on our local servers.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">4. Contacting Our Data Grievance Desk</h2>
              <p>
                For data access requests, address updates, or privacy concerns, please contact our Bangalore administration desk at:
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold space-y-1">
                {email && (
                  <div>Email: <a href={`mailto:${email}`} className="text-[#1A175A] underline">{email}</a></div>
                )}
                {phones.length > 0 && (
                  <div>Phone: {phones.join(' / ')}</div>
                )}
                {address && <div>Address: {address}</div>}
                {!email && phones.length === 0 && !address && (
                  <div>Reach us anytime via our <a href="/contact" className="text-[#1A175A] underline">Contact Us</a> desk.</div>
                )}
              </div>
            </div>

          </div>

        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicyPage;