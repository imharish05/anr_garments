const SERVER_URL = (import.meta.env.VITE_SERVER_URL || 'http://localhost:5000').replace(/\/$/, '');
const API_BASE = (import.meta.env.VITE_API_BASE_URL || `${SERVER_URL}/api`).replace(/\/$/, '');

// Utility to safely resolve image URLs coming from Admin/Server
export const resolveImageUrl = (path, fallback = '/anr-hero-banner.jpg') => {
  if (!path || typeof path !== 'string' || !path.trim()) return fallback;
  const trimmed = path.trim();
  if (/^(https?:)?\/\//i.test(trimmed) || /^(data:|blob:)/i.test(trimmed)) {
    return trimmed;
  }
  const cleanPath = trimmed.replace(/^\/+/, '');
  // If path already starts with api/, don't double it
  if (cleanPath.startsWith('api/')) {
    return `${SERVER_URL}/${cleanPath}`;
  }
  return `${SERVER_URL}/${cleanPath}`;
};

// Fetch Dynamic Announcements / Promo Messages from Admin
export const fetchDynamicAnnouncements = async () => {
  try {
    const endpoints = [
      `${API_BASE}/promo-bar/active`,
      `${API_BASE}/promo-bar`,
      `${API_BASE}/marketing-messages`,
      `${API_BASE}/slider-messages`,
      `${API_BASE}/announcements`
    ];

    for (const url of endpoints) {
      try {
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (res.ok) {
          const data = await res.json();
          const list = data?.messages || data?.value || (Array.isArray(data) ? data : []);
          const activeList = list
            .filter((m) => m && (m.isActive !== false) && (m.status !== 'Inactive'))
            .map((m) => typeof m === 'string' ? m : m.message || m.title || m.text)
            .filter(Boolean);

          if (activeList.length > 0) {
            return activeList;
          }
        }
      } catch (err) {
        // Continue to next endpoint attempt
      }
    }
    return null;
  } catch (error) {
    console.warn('[Announcements API] Fallback to default announcements:', error);
    return null;
  }
};

// Fetch Dynamic Hero Banners from Admin
export const fetchDynamicBanners = async () => {
  try {
    const endpoints = [
      `${API_BASE}/banners?type=HERO`,
      `${API_BASE}/banners?section=hero`,
      `${API_BASE}/banners`
    ];

    for (const url of endpoints) {
      try {
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (res.ok) {
          const data = await res.json();
          const list = data?.banners || data?.value || (Array.isArray(data) ? data : []);

          // Filter active hero banners
          const activeList = list.filter((b) => {
            if (!b) return false;
            if (b.isActive === false || b.status === 'Inactive') return false;
            if (b.type && b.type !== 'HERO') return false;
            if (b.section && b.section.toLowerCase() !== 'hero') return false;
            return true;
          });

          if (activeList.length > 0) {
            return activeList.map((b) => ({
              id: b.id,
              title: b.title || "ANR HOSPITAL GARMENTS",
              subtitle: b.subtitle || b.content || "Designed for Care. Made to Perform.",
              alt: b.title || b.content || "ANR Hospital Garments Banner",
              image: resolveImageUrl(b.image, '/anr-hero-banner.jpg'),
              href: b.link || b.ctaLink || '#scrubs-collection',
              ctaText: b.ctaText || "Explore Collection"
            }));
          }
        }
      } catch (err) {
        // Continue to next endpoint attempt
      }
    }
    return null;
  } catch (error) {
    console.warn('[Banners API] Fallback to default hero banner slides:', error);
    return null;
  }
};
