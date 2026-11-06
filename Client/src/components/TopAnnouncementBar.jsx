import React, { useState, useEffect } from 'react';
import { ANNOUNCEMENTS, COMPANY_INFO } from '../data/mockData';
import { fetchAnnouncements } from '../services/api';
import { Sparkles, Phone, Mail, MapPin, ChevronRight } from 'lucide-react';

const TopAnnouncementBar = () => {
  const [messages, setMessages] = useState(
    ANNOUNCEMENTS.map((text, idx) => ({ id: `default-${idx}`, text, link: null }))
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch dynamic announcements from Admin API
  useEffect(() => {
    let isMounted = true;

    const loadDynamicMessages = async () => {
      const dynamicList = await fetchAnnouncements();
      if (isMounted && dynamicList && dynamicList.length > 0) {
        setMessages(dynamicList);
        setCurrentIndex(0);
      }
    };

    loadDynamicMessages();
    return () => {
      isMounted = false;
    };
  }, []);

  // Revolving timer
  useEffect(() => {
    if (messages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [messages.length]);

  const currentMessage = messages[currentIndex] || messages[0];

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

        {/* Center: Dynamic Announcement from Admin */}
        <div className="flex-1 flex items-center justify-center text-center px-2">
          <div className="flex items-center gap-2 transition-all duration-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0 animate-pulse" />
            {currentMessage?.link ? (
              <a
                href={currentMessage.link}
                className="font-semibold tracking-wide text-[11px] sm:text-xs text-white hover:text-amber-300 transition-colors inline-flex items-center gap-1"
              >
                <span>{currentMessage.text}</span>
                <ChevronRight className="w-3 h-3 text-amber-300" />
              </a>
            ) : (
              <span className="font-semibold tracking-wide text-[11px] sm:text-xs text-white">
                {currentMessage?.text}
              </span>
            )}
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
