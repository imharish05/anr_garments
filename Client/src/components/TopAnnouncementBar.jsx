import React, { useState, useEffect } from 'react';
import { ANNOUNCEMENTS } from '../data/mockData';
import { fetchAnnouncements } from '../services/api';
import { ChevronRight } from 'lucide-react';

const TopAnnouncementBar = () => {
  const [messages, setMessages] = useState(
    ANNOUNCEMENTS.map((text, idx) => ({ id: `default-${idx}`, text, link: null }))
  );

  // Fetch dynamic announcements from Admin API
  useEffect(() => {
    let isMounted = true;

    const loadDynamicMessages = async () => {
      try {
        const dynamicList = await fetchAnnouncements();
        if (isMounted && dynamicList && dynamicList.length > 0) {
          setMessages(dynamicList);
        }
      } catch (err) {
        console.warn('Failed to load dynamic announcements:', err);
      }
    };

    loadDynamicMessages();
    return () => {
      isMounted = false;
    };
  }, []);

  // Build marquee items (ensure enough items for continuous seamless loop on all screen sizes)
  const buildMarqueeList = () => {
    if (!messages || messages.length === 0) return [];
    let base = [...messages];
    while (base.length < 8) {
      base = [...base, ...messages];
    }
    // Duplicate once more so -50% translateX marquee loops infinitely without any gap
    return [...base, ...base];
  };

  const marqueeList = buildMarqueeList();

  return (
    <div className="bg-[#141247] text-white text-xs border-b border-white/10 font-sans overflow-hidden select-none relative">
      {/* Subtle Gradient Fade Masks at the ends of the bar */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#141247] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#141247] to-transparent z-10" />

      {/* Fast Continuous Scrolling Marquee Announcement Ticker */}
      <div className="py-2 overflow-hidden relative" aria-label="Announcements ticker">
        <div className="animate-marquee-topbar flex items-center whitespace-nowrap">
          {marqueeList.map((item, idx) => (
            <div key={`${item.id || idx}-${idx}`} className="inline-flex items-center flex-shrink-0">
              {/* Announcement Content */}
              <div className="inline-flex items-center text-[11px] sm:text-xs font-medium tracking-wide">
                {item.link ? (
                  <a
                    href={item.link}
                    className="font-semibold text-white hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                  >
                    <span>{item.text}</span>
                    <ChevronRight className="w-3 h-3 text-amber-300" />
                  </a>
                ) : (
                  <span className="font-semibold text-white">
                    {item.text}
                  </span>
                )}
              </div>

              {/* Simple Diamond Separator at the end */}
              <span 
                className="inline-block w-2 h-2 rotate-45 bg-amber-400 mx-6 sm:mx-8 flex-shrink-0 select-none rounded-[1px] shadow-[0_0_6px_rgba(251,191,36,0.45)]" 
                aria-hidden="true" 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopAnnouncementBar;
