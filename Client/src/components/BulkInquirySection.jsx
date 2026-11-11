import React, { useState } from 'react';
import useStorefrontSetting from '../hooks/useStorefrontSetting';
import { submitBulkEnquiry } from '../services/api';
import { Phone, Mail, CheckCircle2, Send, Sparkles, MapPin, UserCheck, AlertCircle } from 'lucide-react';

const BulkInquirySection = () => {
  const { data: storefront } = useStorefrontSetting('storefront');
  const [formData, setFormData] = useState({
    hospitalName: '',
    contactName: '',
    phone: '',
    email: '',
    quantity: '50-200 sets',
    category: 'Scrub suits for Men & Women',
    customEmbroidery: true,
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      await submitBulkEnquiry({
        hospitalName: formData.hospitalName,
        contactName: formData.contactName,
        phone: formData.phone,
        email: formData.email,
        estimatedQty: formData.quantity,
        garmentType: formData.category,
        embroideryRequired: formData.customEmbroidery,
        notes: formData.notes,
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err?.message || 'Unable to submit your inquiry right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const phones = Array.isArray(storefront?.phones) ? storefront.phones : [];
  const primaryPhone = phones[0] || '';
  const secondaryPhone = phones[1] || '';

  return (
    <section id="bulk-inquiry" className="py-20 bg-[#1A175A] text-white relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text & Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-blue-200 border border-white/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Factory Supply Desk</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Hospital & Institutional Bulk Procurement
            </h2>

            <p className="text-blue-100 text-base leading-relaxed">
              We partner directly with leading hospital networks, medical colleges, nursing hostels, and diagnostic clinics. Deal directly with our founders to get factory prices, custom departmental coding, and physical sample swatch delivery.
            </p>

            {/* Institutional Contact Card */}
            {(phones.length > 0 || storefront?.email) && (
              <div className="p-5 rounded-2xl bg-[#141247] border border-white/15 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <UserCheck className="w-5 h-5 text-blue-200" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    Direct Procurement Desk
                  </h4>
                </div>

                {phones.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {primaryPhone && (
                      <div>
                        <p className="font-bold text-white text-sm">Sales Desk</p>
                        <p className="text-blue-300">Hospital Quotations</p>
                        <a
                          href={`tel:${primaryPhone}`}
                          className="inline-flex items-center gap-1.5 font-bold text-blue-200 hover:text-white mt-1"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>+91 {primaryPhone}</span>
                        </a>
                      </div>
                    )}

                    {secondaryPhone && (
                      <div>
                        <p className="font-bold text-white text-sm">Operations Desk</p>
                        <p className="text-blue-300">Bulk Fulfillment</p>
                        <a
                          href={`tel:${secondaryPhone}`}
                          className="inline-flex items-center gap-1.5 font-bold text-blue-200 hover:text-white mt-1"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>+91 {secondaryPhone}</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {storefront?.email && (
                  <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-xs text-blue-200">
                    <Mail className="w-4 h-4 text-blue-200 flex-shrink-0" />
                    <a href={`mailto:${storefront.email}`} className="hover:text-white underline">
                      {storefront.email}
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Factory Address Card */}
            {storefront?.address && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-200 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-100">
                  <span className="font-bold text-white block mb-0.5">Manufacturing & Office:</span>
                  <span>{storefront.address}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white text-slate-900 p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-[#1A175A]">Quotation Request Dispatched!</h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto">
                    Thank you. Our procurement team will review your specifications and contact you shortly with bulk pricing and fabric swatch options.
                  </p>
                  {phones.length > 0 && (
                    <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-700 max-w-sm mx-auto">
                      <p className="font-semibold text-[#1A175A]">Immediate Inquiry?</p>
                      <p>Call directly: <strong>{phones.join(' / ')}</strong></p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-[#1A175A] text-white text-xs font-bold"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-b border-slate-100 pb-3 mb-4">
                    <h3 className="text-xl sm:text-2xl font-black text-[#1A175A]">
                      Request Institutional Wholesale Quotation
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Direct factory quotation delivered by ANR founders within 2 working hours.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Hospital / Organization Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.hospitalName}
                        onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                        placeholder="e.g. Apollo Hospital / Manipal Clinic"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        placeholder="e.g. Dr. Ramesh / Purchase Head"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 99860 00000"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="procurement@hospital.org"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                      />
                    </div>
                  </div>

                  {/* 5 Product Options in Dropdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Primary Garment Required
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A175A] bg-white font-medium"
                      >
                        <option>1. Scrub suits for Men & Women</option>
                        <option>2. Aprons for Men & Women</option>
                        <option>3. Underscrubs for Men & Women</option>
                        <option>4. Patient Gown</option>
                        <option>5. Patient Pant & Shirt</option>
                        <option>Full Mixed Hospital Package</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Quantity Requirement
                      </label>
                      <select
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A175A] bg-white font-medium"
                      >
                        <option>25 - 50 sets</option>
                        <option>50 - 200 sets</option>
                        <option>200 - 500 sets</option>
                        <option>500 - 1,000 sets</option>
                        <option>1,000+ sets (Full Hospital Order)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="embroideryCheck"
                      checked={formData.customEmbroidery}
                      onChange={(e) => setFormData({ ...formData, customEmbroidery: e.target.checked })}
                      className="w-4 h-4 text-[#1A175A] rounded border-slate-300 focus:ring-[#1A175A]"
                    />
                    <label htmlFor="embroideryCheck" className="text-xs text-slate-700 font-semibold cursor-pointer">
                      Require Hospital Crest & Doctor Name Computerized Embroidery
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Department or Color Specifications (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="e.g., Need 60 Royal Blue Scrub Sets and 30 Patient Gowns with logo."
                      className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                    />
                  </div>

                  {submitError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#1A175A] hover:bg-[#141247] disabled:opacity-60 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    <Send className="w-4 h-4 text-blue-200" />
                    <span>{submitting ? 'Submitting Inquiry...' : 'Send Inquiry to ANR Factory'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BulkInquirySection;
