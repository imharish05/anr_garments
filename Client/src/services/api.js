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

/**
 * Maps category slug to on-page anchor section
 */
export const getCategorySectionLink = (slug = '') => {
  const normalized = (slug || '').toLowerCase();
  if (normalized.includes('under')) return '#underscrubs-collection';
  if (normalized.includes('scrub')) return '#scrubs-collection';
  if (normalized.includes('apron') || normalized.includes('coat')) return '#aprons-collection';
  if (normalized.includes('patient')) return '#patient-wear-collection';
  if (normalized.includes('linen') || normalized.includes('drape') || normalized.includes('bed')) return '#bulk-inquiry';
  return '#shop-categories';
};

/**
 * Fetch dynamic categories tree from Admin backend
 * Includes category images and all subcategories with images
 */
export const fetchCategoriesTree = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    // Try /categories/tree first, fallback to /categories
    let res = await fetch(`${API_BASE_URL}/categories/tree`, {
      signal: controller.signal,
      cache: 'no-store'
    });

    if (!res.ok) {
      res = await fetch(`${API_BASE_URL}/categories?all=true`, {
        signal: controller.signal,
        cache: 'no-store'
      });
    }
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[API] categories returned status ${res.status}`);
      return [];
    }

    const data = await res.json();
    const rawCategories = data.categories || data.rows || (Array.isArray(data) ? data : []);

    return rawCategories
      .filter((cat) => cat.isActive !== false)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        showHeader: cat.showHeader !== false,
        title: cat.name,
        description: cat.description || '',
        image: getImageUrl(cat.image) || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
        href: getCategorySectionLink(cat.slug),
        link: getCategorySectionLink(cat.slug),
        subcategories: (cat.subcategories || [])
          .filter((sub) => sub.isActive !== false)
          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
          .map((sub) => ({
            id: sub.id,
            name: sub.name,
            label: sub.name,
            slug: sub.slug,
            image: getImageUrl(sub.image) || getImageUrl(cat.image) || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
            href: getCategorySectionLink(cat.slug),
            link: getCategorySectionLink(cat.slug)
          }))
      }));
  } catch (err) {
    console.warn('[API] Failed to fetch dynamic categories tree, using fallback:', err.message);
    return [];
  }
};

/**
 * Fetch dynamic products from Admin backend for live search & catalog
 */
export const fetchProducts = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${API_BASE_URL}/products?limit=100`, {
      signal: controller.signal,
      cache: 'no-store'
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[API] products returned status ${res.status}`);
      return [];
    }

    const data = await res.json();
    const rawProducts = data.products || data.rows || (Array.isArray(data) ? data : []);

    return rawProducts
      .filter((p) => p.isActive !== false)
      .map((p) => {
        let parsedImages = [];
        try {
          parsedImages = Array.isArray(p.images) ? p.images : JSON.parse(p.images || '[]');
        } catch {
          parsedImages = [];
        }
        const firstImg = p.defaultProductImage || parsedImages[0] || '';

        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          category: p.category?.name || 'Medical Apparel',
          price: parseFloat(p.price) || 0,
          originalPrice: p.comparePrice ? parseFloat(p.comparePrice) : null,
          image: getImageUrl(firstImg) || '/anr-hero-banner.jpg',
          rating: p.rating ? parseFloat(p.rating).toFixed(1) : '4.9',
          reviews: p.reviewCount || 18,
          inStock: (p.stock || 0) > 0,
          sku: p.sku || '',
          badge: p.isBestSeller ? 'Best Seller' : p.isNewArrival ? 'New Arrival' : '',
          sectionId: getCategorySectionLink(p.category?.slug),
          overview: p.shortDescription || p.description || ''
        };
      });
  } catch (err) {
    console.warn('[API] Failed to fetch dynamic products, using fallback:', err.message);
    return [];
  }
};

/**
 * Fetch dynamic shop-by-color palette from Admin backend
 */
export const fetchColorCollections = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${API_BASE_URL}/colors`, {
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[API] colors returned status ${res.status}`);
      return [];
    }

    const data = await res.json();
    const rawList = data.colors || (Array.isArray(data) ? data : []);

    return rawList
      .filter((c) => c.isActive !== false)
      .map((c) => ({
        id: c.id,
        name: c.name,
        hex: c.hex,
        image: c.image ? getImageUrl(c.image) : null,
        link: c.link || '#scrubs-collection',
        badge: c.badge || '',
        count: c.description || 'Top Seller for Surgery & OT',
        popular: Boolean(c.badge && c.badge.toLowerCase().includes('most')),
        sortOrder: c.sortOrder ?? 0,
      }));
  } catch (err) {
    console.warn('[API] Failed to fetch dynamic colors, using fallback:', err.message);
    return [];
  }
};
