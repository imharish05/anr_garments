import React from 'react';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import useStorefrontSetting from '../hooks/useStorefrontSetting';
import { AlertTriangle } from 'lucide-react';

const CancellationRefundPolicyPage = () => {
  const { data: storefront } = useStorefrontSetting('storefront');
  const dispatchPhone = Array.isArray(storefront?.phones) && storefront.phones.length > 0 ? storefront.phones[0] : '';

  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Cancellation & Refund Policy' }]} />

      <section className="py-14 sm:py-20 bg-slate-50 min-h-screen font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/90 shadow-sm space-y-8 text-slate-700 leading-relaxed text-xs sm:text-sm">
            
            <div className="border-b border-slate-100 pb-6 space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#1A175A]">
                Healthcare Compliance & Commerce Policy
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
                Cancellation & Refund Policy
              </h1>
              <p className="text-xs text-slate-500">
                Strict Hospital Sanitary Compliance • Non-Returnable Healthcare Apparel
              </p>
            </div>

            {/* Crucial Hospital Hygiene Banner */}
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 text-[#1A175A] space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-[#1A175A]">
                <AlertTriangle className="w-5 h-5 text-[#1A175A] shrink-0" />
                <span>Hospital Sanitary Exclusion: No Returns & No Exchanges</span>
              </div>
              <p className="text-xs text-[#1A175A]/85 leading-relaxed">
                In strict adherence to medical safety, clinical infection control, and biomedical sterilization guidelines, <strong>all medical apparel products (scrub suits, doctor lab coats, patient wear, and OT linens) are non-returnable and non-exchangeable once dispatched and delivered</strong>. We do not restock or resell apparel that has left our sterile Bangalore fulfillment center.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                1. Order Cancellation (Pre-Shipment Only)
              </h2>
              <p>
                Customers and healthcare institutions may cancel an order strictly <strong>before the consignment has been dispatched or handed over to our logistics partners</strong>.
              </p>
              <ul className="space-y-2 pl-4 list-disc text-slate-600">
                <li>
                  <strong>Plain / Off-the-Shelf Apparel:</strong> Cancellations are eligible anytime prior to the order status transitioning to <em>SHIPPED</em> in the customer tracking portal.
                </li>
                <li>
                  <strong>Personalized Embroidery Orders:</strong> Once computerized Tajima embroidery digitization and custom name tag stitching has commenced on a garment, that specific garment becomes non-cancellable.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                2. How to Request a Pre-Shipment Cancellation
              </h2>
              <p>
                Eligible orders can be cancelled through:
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div>• <strong>Customer Portal:</strong> Navigate to <a href="/account" className="text-[#1A175A] font-bold hover:underline">My Account → Orders</a> and click <em>Request Cancellation</em>.</div>
                {dispatchPhone && (
                  <div>• <strong>Direct Telephone Desk:</strong> Call our dispatch coordinators at <a href={`tel:${String(dispatchPhone).replace(/\s+/g, '')}`} className="text-[#1A175A] font-bold">{dispatchPhone}</a> with your Order ID.</div>
                )}
                <div>• <strong>Customer Support Form:</strong> Submit your Order ID via the <a href="/contact" className="text-[#1A175A] font-bold hover:underline">Contact Us</a> page.</div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                3. Refund Calculation & Settlement Timeline
              </h2>
              <p>
                Upon approval of an eligible pre-shipment cancellation:
              </p>
              <ul className="space-y-2 pl-4 list-disc text-slate-600">
                <li>
                  <strong>Prepaid Orders (Razorpay / UPI / Cards):</strong> 100% of the eligible order amount will be credited back to the original source account within <strong>5 to 7 business days</strong> in accordance with standard RBI payment gateway settlement norms.
                </li>
                <li>
                  <strong>Cash on Delivery (COD) Orders:</strong> Because no advance transaction was collected, the order will simply be marked as cancelled in the system with zero outstanding dues.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                4. Transit Damage & Manufacturing Defect Guarantee
              </h2>
              <p>
                While returns and exchanges are excluded, ANR Hospital Garments maintains a 100% factory guarantee against transit damage or stitching flaws. If an item arrives damaged or with incorrect customization from our side:
              </p>
              <p className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-medium">
                Please notify us within <strong>48 hours of delivery</strong> at <a href="mailto:contact@anrhospitalgarments.com" className="font-bold underline">contact@anrhospitalgarments.com</a> with unboxing photos or videos. Upon verification, a fresh replacement garment will be produced and dispatched express at zero additional cost to the customer.
              </p>
            </div>

          </div>

        </div>
      </section>
    </Layout>
  );
};

export default CancellationRefundPolicyPage;