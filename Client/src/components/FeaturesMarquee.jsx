import React from 'react';
import { Shield, Sparkles, Wind, Heart, Move, RefreshCw, CheckCircle, Award } from 'lucide-react';

const MARQUEE_ITEMS = [
  { text: "COMFORT THAT CARES • QUALITY THAT LASTS", icon: Heart },
  { text: "SOFT ON SKIN — ALL-DAY CLINICAL COMFORT", icon: Sparkles },
  { text: "BREATHABLE FABRIC — KEEPS YOU COOL & FRESH", icon: Wind },
  { text: "DURABLE — BUILT TO LAST SHIFT AFTER SHIFT", icon: Shield },
  { text: "EASY CARE — WASH, WEAR AND REPEAT", icon: RefreshCw },
  { text: "EASY MOVEMENT — ENGINEERED FOR PERFORMANCE", icon: Move },
  { text: "FADE & SHRINK RESISTANT HOSPITAL WEAVE", icon: Award },
  { text: "CARE IN EVERY THREAD • ANR BANGALORE", icon: CheckCircle }
];

const FeaturesMarquee = () => {
  return (
    <div className="bg-[#110E3F] border-y border-white/10 py-3.5 overflow-hidden select-none">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="inline-flex items-center gap-2.5 mx-6 text-white/90 text-xs sm:text-sm font-bold tracking-wider uppercase group"
            >
              <div className="p-1 rounded bg-white/10 group-hover:bg-amber-400 group-hover:text-[#1A175A] transition-colors">
                <Icon className="w-3.5 h-3.5 text-blue-300 group-hover:text-[#1A175A]" />
              </div>
              <span className="group-hover:text-amber-300 transition-colors">{item.text}</span>
              <span className="text-white/20 ml-4 font-light">★</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturesMarquee;
