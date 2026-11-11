import React, { useState } from 'react';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import useStorefrontSetting from '../hooks/useStorefrontSetting';
import { submitContactEnquiry } from '../services/api';
import { AnimatedText, ScrollReveal } from '../components/MotionPrimitives';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Navigation,
  ArrowUpRight
} from 'lucide-react';

const ContactPage = () => {
  const { data: storefront, loading: storefrontLoading } = useStorefrontSetting('storefront');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Hospital Apparel Inquiry',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const phones = Array.isArray(storefront?.phones) ? storefront.phones : [];
  const primaryPhone = phones[0] || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in your name, email address, and message.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitContactEnquiry(formData);
      if (res.success) {
        setSuccessMsg('Your message has been delivered to our support desk. Our team will contact you within 4 business hours.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'Hospital Apparel Inquiry',
          message: ''
        });
      } else {
        setErrorMsg(res.message || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Unable to connect to the server. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  const cleanWaPhone = primaryPhone ? String(primaryPhone).replace(/\D/g, '') : '';
  const whatsappUrl = cleanWaPhone
    ? `https://wa.me/91${cleanWaPhone}?text=${encodeURIComponent(
        'Hello ANR Hospital Garments, I would like to enquire about medical uniforms and hospital apparel.'
      )}`
    : '';
  const mapsAddress = storefront?.address || '';
  const googleMapsUrl = storefront?.googleMapsUrl || (mapsAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsAddress)}` : '');
  const mapEmbedUrl = mapsAddress ? `https://maps.google.com/maps?q=${encodeURIComponent(mapsAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed` : '';

  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#141247] via-[#1A175A] to-[#141247] text-white py-14 sm:py-20 text-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <ScrollReveal direction="pop" immediate className="inline-block">
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-200">
              Direct Bangalore Factory Support
            </span>
          </ScrollReveal>
          <AnimatedText
            as="h1"
            immediate
            className="text-3xl sm:text-5xl font-black tracking-tight block"
          >
            Contact ANR Hospital Garments
          </AnimatedText>
          <AnimatedText
            as="p"
            mode="words"
            immediate
            delay={140}
            className="text-sm sm:text-base text-blue-100/90 max-w-2xl mx-auto"
          >
            Reach out to our Bangalore manufacturing desk for clinic orders, hospital rate contracts, or custom department embroidery.
          </AnimatedText>
        </div>
      </section>

      {/* Main Grid: Info + Contact Form */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left 5 Cols: Contact Details & Founder Cards */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Direct Support Desks */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-blue-700">
                  Direct Support Desks
                </h3>

                <div className="space-y-3">
                  {storefrontLoading ? (
                    <div className="space-y-3">
                      <div className="h-16 rounded-2xl skeleton-bone" />
                      <div className="h-16 rounded-2xl skeleton-bone" />
                    </div>
                  ) : phones.length > 0 ? (
                    phones.map((phone, idx) => (
                      <div
                        key={phone}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="text-sm font-bold text-slate-900">
                            {idx === 0 ? 'Production & Sourcing Desk' : 'Institutional Sales Desk'}
                          </div>
                          <div className="text-xs text-slate-500">
                            {idx === 0 ? 'Custom Orders & Fabric Specs' : 'Hospital Contracts & Dispatch'}
                          </div>
                        </div>
                        <a
                          href={`tel:${String(phone).replace(/\s+/g, '')}`}
                          className="px-3 py-1.5 rounded-lg bg-[#1A175A] text-white text-xs font-bold hover:bg-[#141247] flex items-center gap-1.5 transition-colors shrink-0"
                        >
                          <Phone className="w-3.5 h-3.5 text-blue-200" />
                          <span>{phone}</span>
                        </a>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-500">
                      Phone numbers are temporarily unavailable. Please use the online inquiry form.
                    </div>
                  )}
                </div>

                {whatsappUrl && (
                  <div className="pt-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-100" />
                      <span>Instant WhatsApp Direct Chat</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Facility & Hours Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1A175A]/5 text-[#1A175A] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-[#1A175A]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Manufacturing Facility
                    </h4>
                    <p className="text-sm font-semibold text-slate-800 mt-1 leading-relaxed">
                      {mapsAddress || (storefrontLoading ? 'Loading facility address...' : 'Facility address available on request.')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-[#1A175A]/5 text-[#1A175A] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5 text-[#1A175A]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Operating Hours
                    </h4>
                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      {storefront?.workingHours || (storefrontLoading ? 'Loading hours...' : 'Monday to Saturday business hours')}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Emergency hospital dispatches supported on call.
                    </p>
                  </div>
                </div>

                {storefront?.email && (
                  <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-[#1A175A]/5 text-[#1A175A] flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="w-5 h-5 text-[#1A175A]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Official Inquiries
                      </h4>
                      <a
                        href={`mailto:${storefront.email}`}
                        className="text-sm font-semibold text-[#1A175A] hover:underline mt-1 block"
                      >
                        {storefront.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right 7 Cols: Storefront Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-lg shadow-[#1A175A]/5">
                <div className="mb-6 space-y-1">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-[#1A175A]">
                    Online Inquiry Form
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    Send Us a Message
                  </h3>
                  <p className="text-xs text-slate-500">
                    Submit your requirement and our sales engineering team will respond promptly.
                  </p>
                </div>

                {successMsg && (
                  <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {errorMsg && (
                  <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Full Name / Dr. Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Dr. Arjun Mehta"
                        className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Official Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="doctor@hospital.com"
                        className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Inquiry Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                      >
                        <option value="Hospital Apparel Inquiry">Hospital Apparel Inquiry</option>
                        <option value="Custom Embroidery Order">Custom Embroidery Order</option>
                        <option value="Institutional Rate Contract">Institutional Rate Contract</option>
                        <option value="Sample Swatch Request">Sample Swatch Request</option>
                        <option value="Order Tracking / Support">Order Tracking / Support</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Message / Uniform Requirements *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share details such as department, product types, required sizes, or customization requirements..."
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-xl bg-[#1A175A] hover:bg-[#141247] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] disabled:opacity-70"
                  >
                    <span>{loading ? 'Submitting Message...' : 'Send Inquiry to Bangalore Desk'}</span>
                    <Send className="w-4 h-4 text-blue-200" />
                  </button>
                </form>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Full-Width Interactive Google Maps Embed */}
      <section className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#1A175A]">
                Bangalore Hub Location
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Visit Our Manufacturing Facility
              </h3>
            </div>
            {googleMapsUrl && (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A175A] text-white text-xs font-bold shadow-sm hover:bg-[#141247] transition-all"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-200" />
                <span>Open in Google Maps</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/70" />
              </a>
            )}
          </div>

          {mapEmbedUrl && (
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm aspect-[16/7] w-full bg-slate-100">
              <iframe
                title="ANR Hospital Garments Location Map"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>
      </section>

    </Layout>
  );
};

export default ContactPage;