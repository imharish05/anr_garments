import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { fetchAnnouncements } from '../services/api';
import { observeElementHeightVar } from '../utils/viewportVars';

const TopAnnouncementBar = () => {
  const [messages, setMessages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const loadDynamicMessages = async () => {
      try {
        const dynamicList = await fetchAnnouncements();
        if (isMounted) {
          setMessages(Array.isArray(dynamicList) ? dynamicList : []);
        }
      } catch (err) {
        console.warn('Failed to load dynamic announcements:', err?.message);
        if (isMounted) setMessages([]);
      } finally {
        if (isMounted) setLoaded(true);
      }
    };

    loadDynamicMessages();
    return () => {
      isMounted = false;
    };
  }, []);

  useLayoutEffect(() => {
    const activeEl = loaded && messages.length > 0 ? barRef.current : null;
    return observeElementHeightVar(activeEl, '--anr-topbar-height', 0);
  }, [loaded, messages.length]);

  if (!loaded || messages.length === 0) {
    return null;
  }

  // Build marquee items (ensure enough items for continuous seamless loop on all screen sizes)
  const buildMarqueeList = () => {
    let base = [...messages];
    while (base.length < 8) {
      base = [...base, ...messages];
    }
    return [...base, ...base];
  };

  const marqueeList = buildMarqueeList();

  return (
    <div
      ref={barRef}
      className="bg-[#141247] text-white text-xs border-b border-white/10 font-sans overflow-hidden select-none relative"
    >
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#141247] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#141247] to-transparent z-10" />

      <div className="py-2 overflow-hidden relative" aria-label="Announcements ticker">
        <div className="animate-marquee-topbar flex items-center whitespace-nowrap">
          {marqueeList.map((item, idx) => (
            <div key={`${item.id || idx}-${idx}`} className="inline-flex items-center flex-shrink-0">
              <div className="inline-flex items-center text-[11px] sm:text-xs font-medium tracking-wide">
                {item.ctaLink ? (
                  <a
                    href={item.ctaLink}
                    className="font-semibold text-white hover:text-blue-200 transition-colors inline-flex items-center gap-1"
                  >
                    <span>{item.text}</span>
                    <ChevronRight className="w-3 h-3 text-blue-200" />
                  </a>
                ) : (
                  <span className="font-semibold text-white">
                    {item.text}
                  </span>
                )}
              </div>

              <span
                className="inline-block w-2 h-2 rotate-45 bg-white/75 mx-6 sm:mx-8 flex-shrink-0 select-none rounded-[1px] shadow-[0_0_6px_rgba(255,255,255,0.45)]"
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
