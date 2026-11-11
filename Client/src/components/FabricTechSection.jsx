import React from 'react';
import useStorefrontSetting from '../hooks/useStorefrontSetting';
import { Heart, Wind, Shield, RefreshCw, Move, Layers, CheckCircle, AlertCircle } from 'lucide-react';
import { AnimatedText, ScrollReveal } from './MotionPrimitives';

const ICON_MAP = {
  Heart,
  Wind,
  Shield,
  RefreshCw,
  Move,
  Layers,
};

const ICON_SEQUENCE = [Shield, Move, RefreshCw, Layers, Wind, Heart];

const FabricTechSection = () => {
  const { data, loading, error, reload } = useStorefrontSetting('fabric_features');
  const features = Array.isArray(data?.features) ? data.features : [];

  return (
    <section id="fabric-tech" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal direction="pop" className="inline-block">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1A175A] text-xs font-bold uppercase tracking-wider mb-3">
              <Shield className="w-4 h-4 text-[#1A175A]" />
              <span>{data?.eyebrow || 'Clinical Textile Engineering'}</span>
            </div>
          </ScrollReveal>
          <AnimatedText
            as="h2"
            triggerKey={data?.title || 'default'}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A175A] tracking-tight uppercase block"
          >
            {data?.title || 'Fabric Performance'}
          </AnimatedText>
          {data?.subtitle && (
            <AnimatedText
              as="p"
              mode="words"
              delay={120}
              triggerKey={data.subtitle}
              className="text-slate-600 text-base sm:text-lg mt-3 font-medium"
            >
              {data.subtitle}
            </AnimatedText>
          )}
        </div>

        {/* Feature Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#F8F9FD] p-8 rounded-3xl border border-slate-200 space-y-4">
                <div className="w-14 h-14 rounded-2xl skeleton-bone" />
                <div className="h-5 w-3/4 skeleton-bone rounded" />
                <div className="h-4 w-full skeleton-bone rounded" />
                <div className="h-4 w-5/6 skeleton-bone-soft rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="max-w-lg mx-auto bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <AlertCircle className="w-7 h-7 text-red-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-red-700">{error}</p>
            <button
              type="button"
              onClick={reload}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1A175A] text-white text-xs font-bold hover:bg-blue-900"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Textile Specs
            </button>
          </div>
        ) : features.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500">
            Textile specifications are currently not configured.
          </div>
        ) : (
          <ScrollReveal
            staggerChildren
            staggerMs={75}
            triggerKey={features.length}
            className={`grid grid-cols-1 md:grid-cols-2 ${features.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 sm:gap-8`}
          >
            {features.map((item, index) => {
              const Icon = ICON_MAP[item.icon] || ICON_SEQUENCE[index % ICON_SEQUENCE.length];
              return (
                <div
                  key={item.title || index}
                  className="bg-[#F8F9FD] p-8 rounded-3xl border border-slate-200/80 hover:border-[#1A175A]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-[#1A175A] text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-[#141247] transition-all">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-[#1A175A] px-2.5 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-[#1A175A] mb-3 group-hover:text-blue-800 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.description || item.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-2 text-xs font-semibold text-[#1A175A]">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{item.metric || 'Hospital Certified'}</span>
                  </div>
                </div>
              );
            })}
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};

export default FabricTechSection;
