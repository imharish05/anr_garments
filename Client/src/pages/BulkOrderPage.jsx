import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import { BulkTierSkeleton } from '../components/SkeletonLoaders';
import { fetchSetting, submitBulkEnquiry } from '../services/api';
import useStorefrontSetting from '../hooks/useStorefrontSetting';
import { AnimatedText, ScrollReveal } from '../components/MotionPrimitives';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Sparkles,
  Truck,
  Send,
  RefreshCw
} from 'lucide-react';

const BulkOrderPage = () => {
  const { data: storefront } = useStorefrontSetting('storefront');
  const [tiers, setTiers] = useState([]);

  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    designation: '',
    phone: '',
    email: '',
    deliveryLocation: '',
    category: 'Scrub Suits',
    estimatedQuantity: '100-499 pcs (Tier 2)',
    colorSizeMix: '',
    customizationRequirements: 'Doctor Name & Hospital Crest Embroidery',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [loadingTiers, setLoadingTiers] = useState(true);
  const [tiersError, setTiersError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loadTiers = useCallback(async () => {
    setLoadingTiers(true);
    setTiersError('');
    try {
      const data = await fetchSetting('bulk_tiers');
      setTiers(Array.isArray(data?.tiers) ? data.tiers : []);
    } catch (err) {
      setTiersError(err?.message || 'Unable to load volume discount tiers.');
      setTiers([]);
    } finally {
      setLoadingTiers(false);
    }
  }, []);

  useEffect(() => {
    loadTiers();
  }, [loadTiers]);

  const primaryPhone = Array.isArray(storefront?.phones) ? storefront.phones[0] : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.organizationName.trim() || !formData.contactPerson.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMsg('Please complete all required fields (Organization, Contact Person, Phone, Email).');
      return;
    }

    setLoading(true);
    try {
      const res = await submitBulkEnquiry({
        hospitalName: formData.organizationName,
        contactName: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        estimatedQty: formData.estimatedQuantity,
        garmentType: formData.category,
        embroideryRequired: Boolean(formData.customizationRequirements),
        notes: [
          formData.designation && `Designation: ${formData.designation}`,
          formData.deliveryLocation && `Location: ${formData.deliveryLocation}`,
          formData.colorSizeMix && `Color/Size Mix: ${formData.colorSizeMix}`,
          formData.customizationRequirements && `Customization: ${formData.customizationRequirements}`,
          formData.notes,
        ].filter(Boolean).join('\n'),
      });
      if (res.success) {
        setSuccessMsg(`Thank you, ${formData.contactPerson}. Your bulk procurement requisition for ${formData.organizationName} has been received. Our Institutional Accounts Manager will contact you with a formal quote and fabric swatch kit within 4 working hours.`);
        setFormData({
          organizationName: '',
          contactPerson: '',
          designation: '',
          phone: '',
          email: '',
          deliveryLocation: '',
          category: 'Scrub Suits',
          estimatedQuantity: '100-499 pcs (Tier 2)',
          colorSizeMix: '',
          customizationRequirements: 'Doctor Name & Hospital Crest Embroidery',
          notes: ''
        });
      } else {
        setErrorMsg(res.message || 'Failed to submit bulk enquiry.');
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Server communication error. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  const cleanWaPhone = primaryPhone ? String(primaryPhone).replace(/\D/g, '') : '';
  const whatsappUrl = cleanWaPhone
    ? `https://wa.me/91${cleanWaPhone}?text=${encodeURIComponent(
        'Hello ANR Hospital Garments, I would like to enquire about institutional bulk uniform procurement for my healthcare facility.'
      )}`
    : '';

  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Institutional Bulk Orders' }]} />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#141247] via-[#1A175A] to-[#141247] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <ScrollReveal direction="pop" immediate className="inline-block">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/25 text-white text-xs font-bold uppercase tracking-widest">
              <Building2 className="w-3.5 h-3.5" />
              Hospital & Institutional Procurement Desk
            </span>
          </ScrollReveal>
          <AnimatedText
            as="h1"
            immediate
            className="text-3xl sm:text-5xl font-black tracking-tight max-w-4xl mx-auto block"
          >
            Outfit Your Healthcare Facility with Bangalore's Premier Garment Factory
          </AnimatedText>
          <AnimatedText
            as="p"
            mode="words"
            immediate
            delay={150}
            className="text-sm sm:text-base text-blue-100/90 max-w-3xl mx-auto leading-relaxed"
          >
            Direct-from-manufacturer wholesale rates for hospitals, nursing homes, diagnostic labs, and dental clinics across India. Complete custom hospital crest embroidery and GST tax invoice included.
          </AnimatedText>
        </div>
      </section>

      {/* Dynamic Institutional Discount Tiers Strip (Synced with Admin!) */}
      <section className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <span className="text-[11px] uppercase font-black tracking-widest text-[#1A175A]">
              Active Institutional Volume Discounts
            </span>
          </div>

          {loadingTiers ? (
            <BulkTierSkeleton />
          ) : tiersError ? (
            <div className="max-w-lg mx-auto bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <AlertCircle className="w-7 h-7 text-red-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-red-700">{tiersError}</p>
              <button
                type="button"
                onClick={loadTiers}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1A175A] text-white text-xs font-bold hover:bg-blue-900"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Pricing Tiers
              </button>
            </div>
          ) : tiers.length === 0 ? (
            <div className="text-center py-6 text-sm text-slate-500">
              Volume discount brackets are calculated custom per quotation.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tiers.map((tier, idx) => (
                <div
                  key={tier.id || idx}
                  className="p-6 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white shadow-xs hover:border-[#1A175A]/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {tier.label || `Tier ${idx + 1}`}
                      </span>
                      <span className="text-xs font-black text-[#1A175A] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        Save {tier.discountPercent}%
                      </span>
                    </div>

                    <div className="text-3xl font-black text-[#1A175A] mt-3">
                      {tier.minQty}{tier.maxQty ? ` – ${tier.maxQty}` : '+'} Units
                    </div>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Ideal for {idx === 0 ? 'specialty clinics and department teams' : idx === 1 ? 'nursing homes and multi-bed hospitals' : 'large institutional hospital networks'}.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Free Bangalore dispatched sample kit available</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Form Section */}
      <section className="py-14 sm:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/90 shadow-xl shadow-[#1A175A]/5 space-y-8">
            
            <div className="border-b border-slate-200 pb-6 space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#1A175A]">
                Official Requisition Form
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Submit Institutional Bulk Requisition
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Please complete the following details. Our Institutional Sales team will prepare a formal GST commercial quotation.
              </p>
            </div>

            {successMsg && (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-semibold flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Institution Information */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  1. Healthcare Facility & Contact
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Organization / Hospital Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.organizationName}
                      onChange={e => setFormData({ ...formData, organizationName: e.target.value })}
                      placeholder="e.g. Manipal Hospitals, Apollo Clinic"
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Contact Person & Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactPerson}
                      onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="e.g. Dr. Ramesh / Purchase Manager"
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Official Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="purchase@hospital.com"
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Delivery City & State
                    </label>
                    <input
                      type="text"
                      value={formData.deliveryLocation}
                      onChange={e => setFormData({ ...formData, deliveryLocation: e.target.value })}
                      placeholder="e.g. Bangalore, Karnataka"
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                    />
                  </div>
                </div>
              </div>

              {/* Requirement Breakdown */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  2. Apparel Requirements & Quantities
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Primary Uniform Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                    >
                      <option value="Scrub Suits">Scrub Suits (Unisex / Tailored)</option>
                      <option value="Doctor Lab Coats & Aprons">Doctor Lab Coats & Consultation Aprons</option>
                      <option value="OT & Surgical Attire">OT & Surgical Scrub Suits</option>
                      <option value="Patient Gowns & Wear">Patient Gowns & Patient Sets</option>
                      <option value="Hospital Linen & Drapes">Hospital Linen & Bed Drapes</option>
                      <option value="Complete Hospital Uniform Package">Complete Hospital Uniform Package</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Estimated Total Quantity
                    </label>
                    <select
                      value={formData.estimatedQuantity}
                      onChange={e => setFormData({ ...formData, estimatedQuantity: e.target.value })}
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                    >
                      <option value="25-99 pcs (Tier 1)">25 – 99 pcs (Tier 1: 10% Off)</option>
                      <option value="100-499 pcs (Tier 2)">100 – 499 pcs (Tier 2: 15% Off)</option>
                      <option value="500+ pcs (Tier 3 Enterprise)">500+ pcs (Tier 3: 20% Off Enterprise)</option>
                      <option value="1000+ Annual Institutional Rate Contract">1000+ Annual Rate Contract</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Custom Embroidery & Hospital Crest Requirements
                  </label>
                  <input
                    type="text"
                    value={formData.customizationRequirements}
                    onChange={e => setFormData({ ...formData, customizationRequirements: e.target.value })}
                    placeholder="e.g. Hospital logo on left chest + Doctor name on right chest"
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Preferred Colors, Size Distribution, or Fabric Specs
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. 50 Navy Blue, 50 Ceil Blue. Need 4-Way Stretch fabric for surgical OT staff..."
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto flex-1 py-4 px-6 rounded-xl bg-[#1A175A] hover:bg-[#141247] text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] disabled:opacity-70"
                >
                  <span>{loading ? 'Submitting Requisition...' : 'Submit Institutional Requisition'}</span>
                  <Send className="w-4 h-4 text-blue-200" />
                </button>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-100" />
                    <span>Fast-Track on WhatsApp</span>
                  </a>
                )}
              </div>

            </form>

            {/* Bottom Institutional Perks */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>GST Commercial Tax Invoices with Input Tax Credit</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Direct Bangalore factory freight dispatch pan-India</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1A175A] shrink-0" />
                <span>Free sample fabric kit on institutional requests</span>
              </div>
            </div>

          </div>
        </div>
      </section>

    </Layout>
  );
};

export default BulkOrderPage;