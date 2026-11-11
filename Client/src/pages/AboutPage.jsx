import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import useStorefrontSetting from '../hooks/useStorefrontSetting';
import { AnimatedText, ScrollReveal } from '../components/MotionPrimitives';
import {
  ShieldCheck,
  Award,
  Sparkles,
  Building2,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Activity
} from 'lucide-react';

const AboutPage = () => {
  const { data: storefront } = useStorefrontSetting('storefront');
  const { data: fabricData } = useStorefrontSetting('fabric_features');
  const { data: instData } = useStorefrontSetting('institutions');

  const phones = Array.isArray(storefront?.phones) ? storefront.phones : [];
  const features = Array.isArray(fabricData?.features) ? fabricData.features : [];
  const institutions = Array.isArray(instData?.institutions) ? instData.institutions : [];

  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#141247] via-[#1A175A] to-[#141247] text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.14),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <ScrollReveal direction="pop" immediate className="inline-block">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/25 text-white text-xs font-bold uppercase tracking-widest">
              <Award className="w-3.5 h-3.5" />
              {storefront?.brandName || 'ANR Hospital Garments'}
            </span>
          </ScrollReveal>
          <AnimatedText
            as="h1"
            immediate
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight block"
          >
            Crafting Dignity, Comfort &amp; Protection for Healthcare Teams
          </AnimatedText>
          {storefront?.slogan && (
            <AnimatedText
              as="p"
              mode="words"
              immediate
              delay={160}
              className="text-sm sm:text-lg text-blue-100/90 max-w-3xl mx-auto leading-relaxed"
            >
              {storefront.slogan}
            </AnimatedText>
          )}
        </div>
      </section>

      {/* Main Narrative & Manufacturing Highlights */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            <div className="space-y-6">
              <span className="text-xs uppercase font-extrabold tracking-widest text-blue-700">
                Direct Medical Apparel Manufacturer
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                Engineered In-House for Clinical Performance
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                <p>
                  At <strong>{storefront?.brandName || 'ANR Hospital Garments'}</strong>, medical apparel is treated as protective clinical gear tailored for demanding shifts, infection-control protocols, and institutional durability.
                </p>
                <p>
                  From breathable fabric milling and ergonomic pattern drafting to automated bar-tack stress stitching and custom computerized crest embroidery, we control our production chain end-to-end without intermediary markups.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/bulk-order"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A175A] hover:bg-[#141247] text-white text-xs sm:text-sm font-bold shadow-md transition-all"
                >
                  <span>Institutional Bulk Procurement</span>
                  <ArrowRight className="w-4 h-4 text-blue-200" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 hover:border-[#1A175A] text-[#1A175A] text-xs sm:text-sm font-bold shadow-xs transition-colors"
                >
                  <MapPin className="w-4 h-4 text-[#1A175A]" />
                  <span>Contact Our Team</span>
                </Link>
              </div>
            </div>

            {/* Dynamic Feature Mosaic Cards (no hardcoded external stock URLs) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1A175A] flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-[#1A175A]">Clinical Ergonomics</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Unrestricted movement through ward rounds, emergency OT shifts, and ICU duties.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#1A175A] text-white shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold">High-Temp Launder Ready</div>
                <p className="text-xs text-blue-100/85 leading-relaxed">
                  Pre-shrunk, colorfast textiles designed to withstand industrial hospital wash cycles.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#1A175A] text-white shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold">Custom Crest Embroidery</div>
                <p className="text-xs text-blue-100/85 leading-relaxed">
                  High-density doctor names, clinical departments, and hospital logos digitized in-house.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1A175A] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-[#1A175A]">Direct Factory Supply</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Compliant GST ITC billing and pan-India dispatch for clinics and hospital chains.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Dynamic Textile Specifications (from /site-settings/fabric_features) */}
      {features.length > 0 && (
        <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#1A175A]">
                {fabricData?.eyebrow || 'Manufacturing Standards'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
                {fabricData?.title || 'Core Textile Capabilities'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feat, idx) => (
                <div
                  key={feat.title || idx}
                  className="p-6 rounded-2xl border border-slate-200/90 bg-white shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div>
                    {feat.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#1A175A] px-2.5 py-0.5 rounded-full">
                        {feat.badge}
                      </span>
                    )}
                    <h3 className="text-base font-bold text-slate-900 mt-3">{feat.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-2">
                      {feat.description || feat.desc}
                    </p>
                  </div>
                  {feat.metric && (
                    <div className="pt-3 border-t border-slate-100 text-[11px] font-semibold text-[#1A175A]">
                      {feat.metric}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Institutional Segments & Contact Bar (from /site-settings/storefront & /site-settings/institutions) */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-4">
                <span className="text-xs uppercase font-bold tracking-widest text-blue-700">
                  Institutional Supply Desk
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Partner with {storefront?.brandName || 'ANR Hospital Garments'}
                </h3>
                {institutions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {institutions.map((inst, idx) => (
                      <span
                        key={inst.name || idx}
                        className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {inst.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  {phones.map((ph) => (
                    <a
                      key={ph}
                      href={`tel:${ph}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-[#1A175A] hover:bg-blue-50"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{ph}</span>
                    </a>
                  ))}
                  {storefront?.email && (
                    <a
                      href={`mailto:${storefront.email}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-[#1A175A] hover:bg-blue-50"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{storefront.email}</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#1A175A] text-white space-y-4 text-center">
                <Building2 className="w-10 h-10 text-blue-200 mx-auto" />
                <h4 className="text-base font-bold">Manufacturing & Office</h4>
                {storefront?.address && (
                  <p className="text-xs text-blue-100/85 leading-relaxed">
                    {storefront.address}
                  </p>
                )}
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-white hover:bg-blue-50 text-[#1A175A] font-bold text-xs shadow-md transition-all"
                >
                  Contact &amp; Map Directions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default AboutPage;
