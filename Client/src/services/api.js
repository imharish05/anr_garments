const RAW_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const API_BASE_URL = RAW_BASE.replace(/\/$/, '');
const SERVER_URL = import.meta.env.VITE_SERVER_URL || '';

const SESSION_STORAGE_KEY = 'anr_session_id';

export const getOrCreateSessionId = () => {
  try {
    let sid = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sid) {
      sid =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? `sess_${crypto.randomUUID()}`
          : `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(SESSION_STORAGE_KEY, sid);
    }
    return sid;
  } catch {
    return 'sess_browser';
  }
};

export const getAuthHeaders = () => {
  const headers = { 'x-session-id': getOrCreateSessionId() };
  try {
    const token = localStorage.getItem('anr_token');
    if (token) headers.Authorization = `Bearer ${token}`;
  } catch {
    // Ignore storage access restrictions
  }
  return headers;
};

/**
 * Shared fetch wrapper with 429 rate-limit error parsing and strict error propagation.
 */
const apiRequest = async (path, options = {}) => {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    cache: options.cache || 'no-store',
    ...options,
    headers,
  });

  let data = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  }

  if (res.status === 429) {
    const retryAfter =
      Number(res.headers.get('retry-after')) ||
      Number(data?.retryAfterSeconds) ||
      60;
    const rateErr = new Error(
      data?.message || `Too many requests right now. Please wait ${retryAfter}s and try again.`
    );
    rateErr.status = 429;
    rateErr.isRateLimited = true;
    rateErr.retryAfterSeconds = retryAfter;
    throw rateErr;
  }

  if (!res.ok || (data && data.success === false)) {
    const err = new Error(data?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.code = data?.code;
    err.data = data;
    throw err;
  }

  return data;
};

export const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return '';
  const trimmed = imagePath.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (trimmed.startsWith('uploads/')) {
    return SERVER_URL ? `${SERVER_URL.replace(/\/$/, '')}/${trimmed}` : `/${trimmed}`;
  }
  if (trimmed.startsWith('/uploads/')) {
    return SERVER_URL ? `${SERVER_URL.replace(/\/$/, '')}${trimmed}` : trimmed;
  }
  return trimmed;
};

// ── Caching & in-flight deduplication ─────────────────────────────────────────
const CACHE_TTL_MS = 60 * 1000;
let announcementsPromise = null;
const bannersPromiseCache = new Map();
let categoriesCache = null;
let categoriesPromise = null;
const productsCache = new Map();
const productsPromiseCache = new Map();
const settingsCache = new Map();
const settingsPromiseCache = new Map();

export const fetchAnnouncements = async (forceRefresh = false) => {
  if (forceRefresh) announcementsPromise = null;
  if (!announcementsPromise) {
    announcementsPromise = apiRequest('/marketing-messages')
      .then((data) => {
        const list = Array.isArray(data?.messages) ? data.messages : Array.isArray(data) ? data : [];
        return list
          .filter((item) => item && item.isActive !== false && (item.message || item.text))
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
          .map((item) => ({
            id: item.id,
            text: item.message || item.text || '',
            badge: item.badge || '',
            ctaText: item.ctaText || '',
            ctaLink: item.ctaLink || '',
          }));
      })
      .finally(() => {
        setTimeout(() => {
          announcementsPromise = null;
        }, CACHE_TTL_MS);
      });
  }
  return announcementsPromise;
};

export const fetchBanners = async (type = 'HERO', forceRefresh = false) => {
  if (forceRefresh) bannersPromiseCache.delete(type);
  if (!bannersPromiseCache.has(type)) {
    const req = apiRequest(`/banners?type=${encodeURIComponent(type)}`)
      .then((data) => {
        const list = Array.isArray(data?.banners) ? data.banners : Array.isArray(data) ? data : [];
        return list
          .filter((b) => b && b.isActive !== false)
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
          .map((b) => ({
            id: b.id,
            title: b.title || '',
            subtitle: b.subtitle || '',
            description: b.description || '',
            badge: b.badgeText || '',
            ctaText: b.ctaText || '',
            ctaLink: b.ctaLink || '/products',
            image: getImageUrl(b.image),
          }));
      })
      .finally(() => {
        setTimeout(() => {
          bannersPromiseCache.delete(type);
        }, CACHE_TTL_MS);
      });
    bannersPromiseCache.set(type, req);
  }
  return bannersPromiseCache.get(type);
};

export const getCategoryPageLink = (slug = '') => {
  const s = String(slug || '').trim();
  return s ? `/products/${encodeURIComponent(s)}` : '/products';
};

export const getSubcategoryPageLink = (catSlug = '', subSlug = '') => {
  const c = String(catSlug || '').trim();
  const sub = String(subSlug || '').trim();
  if (c && sub) return `/products/${encodeURIComponent(c)}/${encodeURIComponent(sub)}`;
  if (sub) return `/products/all/${encodeURIComponent(sub)}`;
  return getCategoryPageLink(c);
};

export const getCategorySectionLink = (slug = '') => getCategoryPageLink(slug);

export const fetchCategoriesTree = async (forceRefresh = false) => {
  if (!forceRefresh && categoriesCache) return categoriesCache;
  if (!forceRefresh && categoriesPromise) return categoriesPromise;

  categoriesPromise = (async () => {
    let rawCats = [];
    try {
      const data = await apiRequest('/categories/tree');
      rawCats = data?.categories || data?.data || (Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.status === 404) {
        const fallbackRes = await apiRequest('/categories?all=true');
        rawCats = fallbackRes?.categories || fallbackRes?.data || [];
      } else {
        throw err;
      }
    }

    const mapped = rawCats
      .filter((cat) => cat && cat.isActive !== false)
      .map((cat) => ({
        id: cat.id,
        name: cat.name || '',
        slug: cat.slug || '',
        description: cat.description || '',
        image: getImageUrl(cat.image),
        href: getCategoryPageLink(cat.slug),
        subcategories: (cat.subcategories || cat.subCategories || [])
          .filter((sub) => sub && sub.isActive !== false)
          .map((sub) => ({
            id: sub.id,
            name: sub.name || '',
            slug: sub.slug || '',
            href: getSubcategoryPageLink(cat.slug, sub.slug),
            image: getImageUrl(sub.image) || getImageUrl(cat.image),
          })),
      }));

    categoriesCache = mapped;
    setTimeout(() => {
      categoriesCache = null;
    }, CACHE_TTL_MS);
    return mapped;
  })().finally(() => {
    categoriesPromise = null;
  });

  return categoriesPromise;
};

const COLOR_NAME_HEX_MAP = {
  'royal blue': '#1E40AF',
  'ceil blue': '#3B82F6',
  'ceil / sky blue': '#60A5FA',
  'sky blue': '#60A5FA',
  'navy blue': '#1A175A',
  navy: '#1A175A',
  'teal green': '#0F766E',
  'teal blue': '#0D9488',
  teal: '#0D9488',
  'ot hunter green': '#1C4E3D',
  'hunter green': '#15803D',
  'forest green': '#14532D',
  'midnight charcoal': '#0F172A',
  charcoal: '#374151',
  'slate grey': '#475569',
  'pastel grey': '#E2E8F0',
  'clinical white': '#FFFFFF',
  'doctor white': '#FFFFFF',
  white: '#FFFFFF',
  'burgundy / wine': '#6B1D2F',
  'wine / burgundy': '#831843',
  burgundy: '#800020',
  wine: '#831843',
  'maternity pink': '#EC4899',
  'blush pink': '#F472B6',
  pink: '#F472B6',
  lavender: '#A855F7',
  purple: '#9333EA',
  'beige / khaki': '#D4B996',
  beige: '#F5F5DC',
  khaki: '#D4B996',
  'midnight black': '#0F172A',
  black: '#111111',
  red: '#E53E3E',
  crimson: '#DC143C',
  maroon: '#800000',
  blue: '#3B82F6',
  green: '#22C55E',
  olive: '#6B8E23',
  emerald: '#10B981',
  grey: '#9CA3AF',
  gray: '#9CA3AF',
  silver: '#C0C0C0',
  gold: '#B8860B',
  yellow: '#F59E0B',
  orange: '#F97316',
  brown: '#92400E',
  cream: '#FFFDD0',
  ivory: '#FFFFF0',
};

const normalizeHexString = (value) => {
  if (!value || typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(trimmed)) return trimmed;
  if (/^[0-9a-f]{6}$/i.test(trimmed)) return `#${trimmed}`;
  return '';
};

const resolveColorHex = (colorName, explicitHex) => {
  const validExplicit = normalizeHexString(explicitHex);
  if (validExplicit) return validExplicit;

  const validFromName = normalizeHexString(colorName);
  if (validFromName) return validFromName;

  const lower = String(colorName || '').toLowerCase().trim();
  if (!lower) return '#1A175A';
  if (COLOR_NAME_HEX_MAP[lower]) return COLOR_NAME_HEX_MAP[lower];

  const sortedKeys = Object.keys(COLOR_NAME_HEX_MAP).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (lower.includes(key)) return COLOR_NAME_HEX_MAP[key];
  }
  return '#1A175A';
};

export const normalizeColorOption = (entry) => {
  if (!entry) return null;
  if (typeof entry === 'string') {
    const trimmed = entry.trim();
    return { name: trimmed, hex: resolveColorHex(trimmed), image: '' };
  }
  const hex = normalizeHexString(entry.hex) || resolveColorHex(entry.name || '');
  return {
    name: entry.name || hex,
    hex,
    image: entry.image || '',
  };
};

const normalizeProduct = (p) => {
  if (!p) return null;
  let imgs = p.images;
  if (typeof imgs === 'string') {
    try {
      imgs = JSON.parse(imgs);
    } catch {
      imgs = [];
    }
  }
  const resolvedImages = Array.isArray(imgs)
    ? imgs.map((img) => getImageUrl(img)).filter(Boolean)
    : [];

  const firstImg = getImageUrl(p.defaultProductImage) || resolvedImages[0] || '';
  if (firstImg && !resolvedImages.includes(firstImg)) {
    resolvedImages.unshift(firstImg);
  }

  let specs = p.specifications;
  if (typeof specs === 'string') {
    try {
      specs = JSON.parse(specs);
    } catch {
      specs = [];
    }
  }

  let parsedAttributes = {};
  const variants = Array.isArray(p.variants) ? p.variants : [];
  const extractedSizes = [];
  const extractedColors = [];

  variants.forEach((v) => {
    let attrs = v.attributes;
    if (typeof attrs === 'string') {
      try {
        attrs = JSON.parse(attrs);
      } catch {
        attrs = {};
      }
    }
    if (attrs && typeof attrs === 'object') {
      const sizeVal = attrs.Size ?? attrs.size;
      if (sizeVal && !extractedSizes.includes(sizeVal)) {
        extractedSizes.push(sizeVal);
      }
      const colorName = attrs.Color ?? attrs.color ?? attrs.Colour ?? attrs.colour;
      const resolvedHex = resolveColorHex(colorName, v.colorHex || attrs.Hex || attrs.hex || attrs.colorHex);
      if (colorName || v.colorHex) {
        const displayName = colorName ? String(colorName).trim() : resolvedHex;
        const exists = extractedColors.some(
          (c) =>
            c.name.toLowerCase() === displayName.toLowerCase() &&
            c.hex.toLowerCase() === resolvedHex.toLowerCase()
        );
        if (!exists) {
          extractedColors.push({
            name: displayName,
            hex: resolvedHex,
            image: getImageUrl(v.image) || firstImg,
          });
        }
      }
    } else if (v.colorHex) {
      const resolvedHex = resolveColorHex('', v.colorHex);
      if (!extractedColors.some((c) => c.hex.toLowerCase() === resolvedHex.toLowerCase())) {
        extractedColors.push({
          name: resolvedHex,
          hex: resolvedHex,
          image: getImageUrl(v.image) || firstImg,
        });
      }
    }
  });

  if (typeof p.attributes === 'string') {
    try {
      parsedAttributes = JSON.parse(p.attributes);
    } catch {
      parsedAttributes = {};
    }
  } else if (p.attributes && typeof p.attributes === 'object') {
    parsedAttributes = p.attributes;
  }

  if (extractedColors.length === 0 && parsedAttributes && typeof parsedAttributes === 'object') {
    if (Array.isArray(parsedAttributes.colors)) {
      parsedAttributes.colors.forEach((c) => {
        if (!c) return;
        const rawName = typeof c === 'string' ? c : c.name || c.hex;
        const hex = resolveColorHex(rawName, typeof c === 'object' ? c.hex : '');
        if (!extractedColors.some((item) => item.hex.toLowerCase() === hex.toLowerCase())) {
          extractedColors.push({ name: rawName || hex, hex, image: firstImg });
        }
      });
    } else {
      const attrColorStr =
        parsedAttributes.Color ?? parsedAttributes.color ?? parsedAttributes.Colour ?? parsedAttributes.colour;
      if (typeof attrColorStr === 'string' && attrColorStr.trim()) {
        attrColorStr
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((name) => {
            const hex = resolveColorHex(name);
            if (!extractedColors.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
              extractedColors.push({ name, hex, image: firstImg });
            }
          });
      }
    }
  }

  const price = Number(p.price ?? p.basePrice ?? 0);
  const mrp = p.mrp ? Number(p.mrp) : p.compareAtPrice ? Number(p.compareAtPrice) : price;
  const computedDiscount = mrp > price && mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return {
    id: p.id,
    name: p.name || '',
    slug: p.slug || String(p.id),
    categoryId: p.categoryId || p.category?.id || null,
    subCategoryId: p.subCategoryId || p.subcategory?.id || null,
    category: p.category?.name || p.categoryName || '',
    categorySlug: p.category?.slug || '',
    subCategory: p.subcategory?.name || p.subCategoryName || '',
    subCategorySlug: p.subcategory?.slug || '',
    price,
    mrp,
    discountPercent: p.discountPercent ?? computedDiscount,
    discount: p.discountPercent ? `${p.discountPercent}% OFF` : computedDiscount > 0 ? `${computedDiscount}% OFF` : '',
    rating: p.rating != null ? Number(p.rating) : 0,
    reviews: p.reviewCount ?? 0,
    createdAt: p.createdAt || '',
    image: firstImg,
    images: resolvedImages,
    badge: p.isBestSeller ? 'BESTSELLER' : p.isNewArrival ? 'NEW' : p.isFeatured ? 'FEATURED' : '',
    shortDescription: p.shortDescription || '',
    description: p.description || p.shortDescription || '',
    fabricDetails: p.fabricDetails || '',
    specifications: Array.isArray(specs) ? specs : [],
    stock: p.stock ?? 0,
    sku: p.sku || '',
    sizes: extractedSizes.length > 0 ? extractedSizes : Array.isArray(parsedAttributes.sizes) ? parsedAttributes.sizes : [],
    colors: extractedColors,
    variants: variants.map((v) => ({
      ...v,
      price: Number(v.price ?? price),
      stock: v.stock ?? 0,
      image: getImageUrl(v.image) || firstImg,
    })),
    raw: p,
  };
};

export const fetchProducts = async (options = false) => {
  const opts = typeof options === 'boolean' ? { forceRefresh: options } : options || {};
  const {
    forceRefresh = false,
    category,
    page,
    limit = 100,
    search,
    featured,
    newArrival,
    bestSeller,
    sort,
    order,
  } = opts;

  const query = new URLSearchParams();
  if (limit) query.set('limit', String(limit));
  if (page) query.set('page', String(page));
  if (category) query.set('category', String(category));
  if (search) query.set('search', String(search));
  if (featured !== undefined) query.set('featured', String(featured));
  if (newArrival !== undefined) query.set('newArrival', String(newArrival));
  if (bestSeller !== undefined) query.set('bestSeller', String(bestSeller));
  if (sort) query.set('sort', String(sort));
  if (order) query.set('order', String(order));

  const cacheKey = query.toString() || 'default';

  if (!forceRefresh) {
    const cached = productsCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return cached.data;
    if (productsPromiseCache.has(cacheKey)) return productsPromiseCache.get(cacheKey);
  }

  const req = apiRequest(`/products?${query.toString()}`)
    .then((data) => {
      const list = Array.isArray(data?.products)
        ? data.products
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];
      const mapped = list
        .filter((p) => p && p.isActive !== false)
        .map(normalizeProduct)
        .filter(Boolean);
      productsCache.set(cacheKey, { data: mapped, expiresAt: Date.now() + CACHE_TTL_MS });
      return mapped;
    })
    .finally(() => {
      productsPromiseCache.delete(cacheKey);
    });

  productsPromiseCache.set(cacheKey, req);
  return req;
};

export const fetchCoupons = async () => {
  const data = await apiRequest('/coupons');
  const list = Array.isArray(data?.coupons) ? data.coupons : Array.isArray(data) ? data : [];
  return list.filter((c) => c && c.isActive !== false);
};

export const validateCouponApi = async (code, orderTotal) => {
  const total = Number(orderTotal) || 0;
  return apiRequest('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({
      code: String(code || '').trim().toUpperCase(),
      subtotal: total,
      orderTotal: total,
    }),
  });
};

export const fetchColorCollections = async () => {
  const data = await apiRequest('/colors');
  const list = Array.isArray(data?.colors) ? data.colors : Array.isArray(data) ? data : [];
  return list
    .filter((c) => c && c.isActive !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((c) => {
      const colorFilterUrl = c.name
        ? `/products?color=${encodeURIComponent(c.name)}`
        : '/products';
      const link = c.link && c.link.startsWith('/') ? c.link : colorFilterUrl;
      return {
        id: c.id,
        name: c.name || '',
        hex: c.hex || '#1A175A',
        image: getImageUrl(c.image),
        link,
        badge: c.badge || '',
        description: c.description || '',
      };
    });
};

export const fetchPublicReviews = async (limit = 6) => {
  const data = await apiRequest(`/reviews?limit=${encodeURIComponent(limit)}`);
  return Array.isArray(data?.reviews) ? data.reviews : [];
};

export const fetchProductReviewsApi = async (productId) => {
  return apiRequest(`/reviews/product/${encodeURIComponent(productId)}`);
};

export const fetchSetting = async (key, forceRefresh = false) => {
  if (!forceRefresh) {
    const cached = settingsCache.get(key);
    if (cached && cached.expiresAt > Date.now()) return cached.data;
    if (settingsPromiseCache.has(key)) return settingsPromiseCache.get(key);
  }

  const req = apiRequest(`/site-settings/${encodeURIComponent(key)}`)
    .then((data) => {
      const val = data?.data || data?.setting?.value || null;
      settingsCache.set(key, { data: val, expiresAt: Date.now() + CACHE_TTL_MS });
      return val;
    })
    .finally(() => {
      settingsPromiseCache.delete(key);
    });

  settingsPromiseCache.set(key, req);
  return req;
};

export const fetchProductBySlug = async (slug) => {
  try {
    const data = await apiRequest(`/products/${encodeURIComponent(slug)}`);
    const raw = data?.product || data?.data;
    if (!raw) return null;
    return normalizeProduct(raw);
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
};

export const fetchSearchAutocomplete = async (queryText) => {
  const data = await apiRequest(`/search/autocomplete?q=${encodeURIComponent(queryText || '')}`);
  return Array.isArray(data?.suggestions) ? data.suggestions : Array.isArray(data?.products) ? data.products.map(normalizeProduct).filter(Boolean) : [];
};

export const fetchTrendingSearches = async () => {
  const data = await apiRequest('/search/trending');
  return Array.isArray(data?.trending) ? data.trending : [];
};

export const submitContactEnquiry = async (enquiryData) => {
  return apiRequest('/contact-enquiries', {
    method: 'POST',
    body: JSON.stringify(enquiryData),
  });
};

export const submitBulkEnquiry = async (bulkData) => {
  const messageBody = [
    `[BULK INSTITUTIONAL ENQUIRY]`,
    `Organization: ${bulkData.hospitalName || 'N/A'}`,
    `Estimated Units: ${bulkData.estimatedQty || 'N/A'}`,
    `Apparel Category: ${bulkData.garmentType || 'N/A'}`,
    `Embroidery Required: ${bulkData.embroideryRequired ? 'Yes' : 'No'}`,
    `Notes: ${bulkData.notes || 'None'}`,
  ].join('\n');

  return submitContactEnquiry({
    name: bulkData.contactName || bulkData.hospitalName,
    email: bulkData.email,
    phone: bulkData.phone,
    subject: `Bulk Order Inquiry: ${bulkData.hospitalName} (${bulkData.estimatedQty || 'Bulk'})`,
    message: messageBody,
    institutionName: bulkData.hospitalName,
    enquiryType: 'BULK',
  });
};

export const subscribeNewsletterApi = async (email) => {
  return apiRequest('/site-settings/newsletter-subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const syncServerCart = async (items = []) => {
  const mappedItems = (Array.isArray(items) ? items : [])
    .filter((i) => i && (i.productId || i.id))
    .map((i) => ({
      productId: Number(i.productId || i.id),
      variantId: i.variantId ? Number(i.variantId) : null,
      quantity: Math.max(1, Number(i.quantity) || 1),
      selectedVariant: i.selectedVariant || {
        ...(i.size ? { Size: i.size } : {}),
        ...(i.color ? { Color: i.color } : {}),
      },
    }))
    .filter((i) => Number.isFinite(i.productId) && i.productId > 0);

  return apiRequest('/cart/sync', {
    method: 'POST',
    body: JSON.stringify({ items: mappedItems }),
  });
};

export const createCheckoutOrder = async (orderPayload) => {
  const items = Array.isArray(orderPayload?.items) ? orderPayload.items : [];
  if (!orderPayload?.isBuyNow && items.length > 0) {
    await syncServerCart(items);
  }

  return apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderPayload),
  });
};

export const initiatePaymentApi = async (orderId) => {
  return apiRequest('/payments/initiate', {
    method: 'POST',
    body: JSON.stringify({ orderId }),
  });
};

export const verifyPaymentApi = async (payload) => {
  return apiRequest('/payments/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const fetchCustomerOrders = async () => {
  const data = await apiRequest('/orders/my');
  return Array.isArray(data?.orders) ? data.orders : [];
};

export const trackOrderByIdentifier = async (identifier) => {
  const data = await apiRequest(`/orders/track/${encodeURIComponent(identifier)}`);
  return data?.order || null;
};

export const fetchCustomerOrderById = async (orderId) => {
  try {
    const data = await apiRequest(`/orders/my/${encodeURIComponent(orderId)}`);
    return data?.order || null;
  } catch (err) {
    if (err.status === 401 || err.status === 404) {
      return trackOrderByIdentifier(orderId);
    }
    throw err;
  }
};

export const requestOrderCancellation = async (orderId, reason) => {
  return apiRequest(`/orders/my/${encodeURIComponent(orderId)}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
};

export const sendLoginOtpApi = async (email) => {
  return apiRequest('/auth/send-login-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const verifyLoginOtpApi = async (email, otp) => {
  return apiRequest('/auth/verify-login-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });
};
