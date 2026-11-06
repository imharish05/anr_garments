import React, { useState, useEffect } from 'react';
import { ANNOUNCEMENTS, COMPANY_INFO } from '../data/mockData';
import { Sparkles, Phone, Mail, MapPin } from 'lucide-react';

const TopAnnouncementBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#141247] text-white text-xs border-b border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-1.5 md:gap-4">
        
        {/* Left: Bangalore Location */}
        <div className="hidden lg:flex items-center gap-2 text-blue-200 text-[11px]">
          <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <a
            href={COMPANY_INFO.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Factory: Girinagar, Banashankari, Bangalore-560085
          </a>
        </div>

        {/* Center: Dynamic Announcement */}
        <div className="flex-1 flex items-center justify-center text-center px-2">
          <div className="flex items-center gap-2 transition-all duration-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0 animate-pulse" />
            <span className="font-semibold tracking-wide text-[11px] sm:text-xs text-white">
              {ANNOUNCEMENTS[currentIndex]}
            </span>
          </div>
        </div>

        {/* Right: Direct Founders Mobile & Email */}
        <div className="flex items-center gap-3 text-[11px] text-blue-200">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-amber-400" />
            <a href={`tel:${COMPANY_INFO.phones[0]}`} className="hover:text-white font-medium">
              {COMPANY_INFO.phones[0]}
            </a>
            <span className="text-white/30">/</span>
            <a href={`tel:${COMPANY_INFO.phones[1]}`} className="hover:text-white font-medium">
              {COMPANY_INFO.phones[1]}
            </a>
          </div>
          <span className="text-white/20 hidden sm:inline">|</span>
          <a
            href={`mailto:${COMPANY_INFO.email}`}
            className="hidden sm:flex items-center gap-1 hover:text-white text-amber-300 font-semibold"
          >
            <Mail className="w-3 h-3" />
            <span>{COMPANY_INFO.email}</span>
          </a>
        </div>

      </div>
    </div>
  );
};

export default TopAnnouncementBar;
