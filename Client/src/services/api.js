/**
 * ANR Hospital Garments - API Service
 * Handles fetching dynamic announcements and banners from Admin backend
 */

const SERVER_URL = (import.meta.env.VITE_SERVER_URL || 'http://localhost:5000').replace(/\/$/, '');
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || `${SERVER_URL}/api`).replace(/\/$/, '');

/**
 * Resolves image URL from backend uploads or public folder
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('data:') ||
    imagePath.startsWith('blob:')
  ) {
    return imagePath;
  }
  // If it's a backend upload path (e.g., uploads/banners/...)
  if (imagePath.includes('uploads/')) {
    const cleanPath = imagePath.replace(/^\/+/, '');
    return `${SERVER_URL}/${cleanPath}`;
  }
  // Otherwise it's a client static asset
  return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
};

/**
 * Fetch dynamic marketing / slider announcement messages from Admin
 */
export const fetchAnnouncements = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${API_BASE_URL}/marketing-messages`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[API] marketing-messages returned status ${res.status}`);
      return [];
    }

    const data = await res.json();
    const rawList = Array.isArray(data) ? data : data.messages || [];

    // Filter active and sort by position
    return rawList
      .filter((m) => m.isActive !== false)
      .sort((a, b) => (a.position || 0) - (b.position || 0))
      .map((m) => ({
        id: m.id,
        text: m.message || m.text || '',
        link: m.link || null,
        position: m.position || 0
      }))
      .filter((m) => Boolean(m.text.trim()));
  } catch (err) {
    console.warn('[API] Failed to fetch dynamic announcements, using fallback:', err.message);
    return [];
  }
};

/**
 * Fetch dynamic banners from Admin (Hero, Promo, etc.)
 */
export const fetchBanners = async (type = 'HERO') => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    // Try type-filtered first, otherwise all banners
    const res = await fetch(`${API_BASE_URL}/banners?type=${type}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[API] banners returned status ${res.status}`);
      return [];
    }

    const data = await res.json();
    const rawList = Array.isArray(data) ? data : data.banners || [];

    // Match type or section
    return rawList
      .filter((b) => {
        const isActive = b.isActive !== false && b.status !== 'Inactive';
        const matchesType =
          !type ||
          b.type?.toUpperCase() === type.toUpperCase() ||
          b.section?.toLowerCase() === type.toLowerCase();
        return isActive && matchesType;
      })
      .sort((a, b) => (a.position || a.sortOrder || 0) - (b.position || b.sortOrder || 0))
      .map((b) => ({
        id: b.id,
        title: b.title || '',
        subtitle: b.subtitle || b.description || b.content || '',
        badge: b.badgeText || 'Bangalore Factory Direct',
        primaryCta: b.ctaText || 'View Collection',
        primaryHref: b.ctaLink || b.link || '#scrubs-collection',
        secondaryCta: 'Hospital Bulk Quote',
        secondaryHref: '#bulk-inquiry',
        image: getImageUrl(b.image)
      }));
  } catch (err) {
    console.warn('[API] Failed to fetch dynamic banners, using fallback:', err.message);
    return [];
  }
};
