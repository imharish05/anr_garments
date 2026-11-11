import React from 'react';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import useStorefrontSetting from '../hooks/useStorefrontSetting';
import { MapPin } from 'lucide-react';

const ShippingPolicyPage = () => {
  const { data: storefront } = useStorefrontSetting('storefront');

  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Shipping & Delivery Policy' }]} />

      <section className="py-14 sm:py-20 bg-slate-50 min-h-screen font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/90 shadow-sm space-y-8 text-slate-700 leading-relaxed text-xs sm:text-sm">
            
            <div className="border-b border-slate-100 pb-6 space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#1A175A]">
                Official Store Policy
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
                Shipping & Delivery Policy
              </h1>
              <p className="text-xs text-slate-500">
                Effective Date: January 1, 2026 • ANR Hospital Garments Bangalore Hub
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">1. Dispatch Origin & Facility</h2>
              <p>
                All medical apparel products ordered through our platform are manufactured, sterilized, packed, and dispatched directly from our central manufacturing facility located at:
              </p>
              {storefront?.address && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#1A175A] shrink-0" />
                  <span>{storefront.address}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">2. Processing & Dispatch Timelines</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200">
                  <div className="text-xs font-bold text-[#1A175A] uppercase tracking-wider">
                    Non-Customized Plain Apparel
                  </div>
                  <div className="text-xl font-black text-slate-900 mt-1">24 to 48 Hours</div>
                  <p className="text-xs text-slate-600 mt-2">
                    Standard scrub sets, lab coats, and patient wear in stock are dispatched within 1–2 business days.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200">
                  <div className="text-xs font-bold text-[#1A175A] uppercase tracking-wider">
                    Custom Embroidery Garments
                  </div>
                  <div className="text-xl font-black text-slate-900 mt-1">3 to 5 Business Days</div>
                  <p className="text-xs text-slate-600 mt-2">
                    Requires computerized Tajima machine digitization, custom stitching of doctor name or hospital crest, and sterile QA before dispatch.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">3. Domestic Courier Partners & Tracking</h2>
              <p>
                We partner with India's leading surface and air cargo providers including <strong>Blue Dart Express</strong>, <strong>DTDC</strong>, and <strong>Delhivery</strong>. Once your consignment is booked, an automated SMS and WhatsApp update containing your courier airway bill (AWB) number and live tracking link will be provided.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">4. Shipping Charges & Free Delivery Threshold</h2>
              <p>
                • <strong>Retail & Clinic Orders:</strong> Free standard shipping across India on all prepaid orders exceeding ₹999.<br />
                • <strong>Institutional Freight:</strong> Bulk orders above 100 units enjoy direct factory road logistics coordination arranged by our dispatch managers.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">5. Undelivered or Returned Shipments</h2>
              <p>
                If a parcel cannot be delivered due to incorrect delivery address or recipient unavailability after 3 delivery attempts, the package will return to our Bangalore facility. Reshipment will be arranged upon confirmation of revised clinical contact details.
              </p>
            </div>

          </div>

        </div>
      </section>
    </Layout>
  );
};

export default ShippingPolicyPage;