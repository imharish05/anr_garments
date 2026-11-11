const { getUploadedUrl } = require('../services/cloudinaryService');
'use strict';
const { SiteSetting } = require('../models');

const defaultAboutSettings = {
  hero: {
    eyebrow: 'About Twin A Apparels',
    title: 'Founded with a passion for style and comfort',
    text: "We are manufacturers and wholesale distributors of high-quality men's wear, kid's wear, shorts, cargo pants, 3/4ths and stylish T-shirts, based in Coimbatore.",
    tags: [
      { kicker: 'We are', title: 'Manufacturers', foot: 'High-quality clothing' },
      { kicker: 'We are', title: 'Wholesale distributors', foot: "Men's, kid's & more" },
      { kicker: 'Based in', title: 'Coimbatore', foot: 'Style · Comfort' },
    ],
  },
  who: {
    eyebrow: 'Who We Are',
    title: 'Manufacturers and wholesale distributors',
    text: "High-quality men's wear, kid's wear, shorts, cargo pants, 3/4ths and stylish T-shirts, made and supplied from Coimbatore.",
    imageUrl: '',
  },
  fabrics: {
    eyebrow: 'Superior Materials',
    title: 'Superior fabrics, chosen with care',
    text: 'We use superior fabrics to ensure durability, comfort, and the latest trends for our customers.',
    list: ['2-way Lycra', 'NS Fabric', 'Loopknit', 'Pure Cotton', 'Muslin'],
  },
  mission:
    'To deliver exceptional clothing that combines **modern fashion** with **unmatched comfort**, while maintaining the **highest standards** of quality and affordability.',
  missionTitle: 'Our mission',
  valuesTitle: 'What we stand for',
  values: ['Style', 'Comfort', 'Quality', 'Affordability', 'Durability', 'Modern fashion', 'Latest trends'],
  missionImages: {
    main: '',
    accent: '',
  },
  contact: {
    eyebrow: 'Wholesale & Retail Inquiries',
    title: 'Get in touch',
    text: "Men's wear, kid's wear and ladies' wear, all in one place. We welcome wholesale partners, distributors, and bulk custom inquiries.",
    button: 'Contact us',
    to: '/contact',
  },
  office: {
    label: 'Manufacturing & Office',
    address: [
      '6/154, 2nd Street, Radhithya Avenue,',
      'Checkpost, Kinathukadavu - Pollachi Main Road,',
      'Coimbatore - 642109',
    ],
    phone: '+91 98765 43210',
    email: 'info@twinaapparels.com',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=6%2F154%2C+2nd+Street%2C+Radhithya+Avenue%2C+Checkpost%2C+Kinathukadavu+-+Pollachi+Main+Road%2C+Coimbatore+-+642109',
  },
};

const defaultOtpSettings = {
  inrThreshold: 20000,
  aedThreshold: 800,
  requireCodOtp: true,
  codOnly: true,
};

const defaultInventorySettings = {
  globalLowStockThreshold: 10,
};

const defaultTaxSettings = {
  taxRate: 5,
};

const defaultEmbroiderySettings = {
  enabled: true,
  namePrice: 150,
  logoPrice: 250,
  maxNameLength: 30,
  maxDeptLength: 35,
  allowLogoUpload: true,
};

const defaultPaymentSettings = {
  enableCod: true,
  enableOnline: true,
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_TBPx9EL1T1aqhC',
  codMinimumOrder: 0,
  codMaximumOrder: 50000,
};

const defaultStorefrontSettings = {
  brandName: 'ANR Hospital Garments',
  slogan: 'ANR Care in every thread',
  email: 'contact@anrhospitalgarments.com',
  phones: ['9986044574', '6363429113'],
  address: 'Banashankari, Bengaluru, Karnataka 560070, India',
  workingHours: 'Mon - Sat: 9:30 AM - 7:00 PM IST',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Banashankari+Bengaluru+Karnataka+560070',
};

const defaultFabricFeaturesSettings = {
  eyebrow: 'Clinical Textile Engineering',
  title: 'Engineered for 14-Hour Hospital Shifts',
  subtitle: 'Every ANR uniform is milled from medical-grade poly-viscose and breathable cotton blends tested for hospital laundering.',
  features: [
    {
      title: 'Fluid-Repellent Barrier',
      badge: 'Hydro-Shield',
      description: 'DWR-treated weave resists blood, saline, and clinical fluid splashes while staying soft on skin.',
      metric: 'Antimicrobial Finish',
    },
    {
      title: '4-Way Comfort Stretch',
      badge: 'FlexWeave',
      description: 'Ergonomic bi-directional stretch engineered for unrestricted movement in OT and ICU wards.',
      metric: '210 GSM Twill',
    },
    {
      title: 'Autoclave & High-Temp Wash',
      badge: 'ColorLock',
      description: 'Vat-dyed fibers retain color fastness and seam strength through repeated 60°C+ industrial sanitizing.',
      metric: '100+ Wash Cycles',
    },
    {
      title: 'Triple-Stitched Stress Points',
      badge: 'ProSeam',
      description: 'Reinforced pocket bar-tacks and double-needle seams carry clinical tools without tearing.',
      metric: 'Factory QC Certified',
    },
  ],
};

const defaultFaqSettings = {
  eyebrow: 'Healthcare Procurement & Support',
  title: 'Frequently Asked Questions',
  subtitle: 'Everything doctors, clinics, and hospital procurement teams need to know about ANR Hospital Garments.',
  shippingPerks: [
    { title: 'PAN INDIA', description: 'Pan-India express dispatch across hospitals and clinics.' },
    { title: 'Direct Bangalore Manufacturing', description: 'Factory-direct pricing with strict biomedical hygiene packing.' },
    { title: 'GST Input Tax Invoices', description: 'Compliant HSN tax invoices issued for every clinic and hospital order.' },
    { title: 'Pre-Shipment Cancellation', description: 'Full cancellation refund anytime before courier dispatch.' },
  ],
  items: [
    {
      category: 'Products & Sizing',
      q: 'What fabric GSM do ANR scrub suits and lab coats use?',
      a: 'Our scrub suits use breathable 180-210 GSM poly-viscose and cotton-rich clinical twill engineered for humid Indian wards, while doctor lab coats use crisp 220+ GSM medical suiting.',
    },
    {
      category: 'Products & Sizing',
      q: 'Can I order custom name or hospital crest embroidery?',
      a: 'Yes. On any product detail page you can add doctor name embroidery, department text, or upload your hospital logo for computerized Tajima stitching.',
    },
    {
      category: 'Bulk & Hospital Procurement',
      q: 'What is the minimum order quantity for bulk hospital pricing?',
      a: 'Tiered institutional discounts start automatically at 25+ uniforms, with deeper brackets at 100+ and 500+ units.',
    },
    {
      category: 'Bulk & Hospital Procurement',
      q: 'Do you provide GST tax invoices for Input Tax Credit (ITC)?',
      a: 'Yes. Enter your hospital or clinic 15-digit GSTIN during checkout or bulk enquiry to receive a compliant GST invoice.',
    },
    {
      category: 'Shipping & Sanitary Policy',
      q: 'How long does dispatch take across India?',
      a: 'Standard unembroidered uniforms dispatch within 24-48 business hours from our Bangalore center; custom embroidered sets dispatch within 3-5 business days.',
    },
    {
      category: 'Shipping & Sanitary Policy',
      q: 'Can I cancel or return a medical uniform order?',
      a: 'You may cancel anytime prior to dispatch from My Account -> Orders for a full refund. Once delivered, uniforms are non-returnable to uphold hospital sanitary and infection-control standards (defective items are replaced within 48 hours of delivery).',
    },
  ],
};

const defaultInstitutionsSettings = {
  title: 'Trusted by Clinical Teams Across India',
  institutions: [
    { name: 'Multi-Specialty Hospitals', city: 'Bengaluru & Pan-India', category: 'Surgical & ICU Scrubs' },
    { name: 'Medical Colleges & Teaching Hospitals', city: 'Karnataka & South India', category: 'Resident Doctor Aprons' },
    { name: 'Diagnostic & Pathology Networks', city: 'Metro Hubs', category: 'Lab Coats & Underscrubs' },
    { name: 'Dental & Specialty Clinics', city: 'Tier 1 & Tier 2 Cities', category: 'Custom Embroidered Sets' },
  ],
};

const defaultBulkTiersSettings = {
  tiers: [
    { id: 'tier-1', minQty: 25, maxQty: 99, discountPercent: 10, label: 'Tier 1 (Clinics & Small Teams)' },
    { id: 'tier-2', minQty: 100, maxQty: 499, discountPercent: 15, label: 'Tier 2 (Hospitals & Nursing Homes)' },
    { id: 'tier-3', minQty: 500, maxQty: null, discountPercent: 20, label: 'Tier 3 (Enterprise Hospital Chains)' },
  ],
};

/**
 * Validates and sanitizes the about page site settings.
 * Removes all legacy/unused fields so only valid website data is stored in DB.
 */
const validateAboutSettings = (input) => {
  if (!input || typeof input !== 'object') {
    return { valid: false, message: 'Settings payload must be a valid JSON object' };
  }

  // 1. Hero validation
  if (!input.hero || typeof input.hero !== 'object') {
    return { valid: false, message: 'Hero section data is required' };
  }
  const heroTitle = String(input.hero.title || '').trim();
  const heroText = String(input.hero.text || '').trim();
  if (!heroTitle) {
    return { valid: false, message: 'Hero title is required' };
  }
  if (!heroText) {
    return { valid: false, message: 'Hero description text is required' };
  }

  // Hang tags validation
  let tags = [];
  if (Array.isArray(input.hero.tags)) {
    tags = input.hero.tags.map(t => ({
      kicker: String(t.kicker || '').trim(),
      title: String(t.title || '').trim(),
      foot: String(t.foot || '').trim(),
    })).filter(t => t.title || t.kicker);
  }

  // 2. Who We Are validation
  if (!input.who || typeof input.who !== 'object') {
    return { valid: false, message: 'Who We Are section data is required' };
  }
  const whoTitle = String(input.who.title || '').trim();
  const whoText = String(input.who.text || '').trim();
  if (!whoTitle) {
    return { valid: false, message: 'Who We Are section title is required' };
  }
  if (!whoText) {
    return { valid: false, message: 'Who We Are description text is required' };
  }

  // 3. Fabrics validation
  const fabricsEyebrow = String(input.fabrics?.eyebrow || '').trim() || defaultAboutSettings.fabrics.eyebrow;
  const fabricsTitle = String(input.fabrics?.title || '').trim() || defaultAboutSettings.fabrics.title;
  const fabricsText = String(input.fabrics?.text || '').trim();
  const fabricList = Array.isArray(input.fabrics?.list)
    ? input.fabrics.list.map(f => String(f || '').trim()).filter(Boolean)
    : defaultAboutSettings.fabrics.list;

  // 4. Mission validation
  const mission = String(input.mission || '').trim();
  if (!mission) {
    return { valid: false, message: 'Mission statement is required' };
  }
  const missionTitle = String(input.missionTitle || '').trim() || defaultAboutSettings.missionTitle;
  const valuesTitle = String(input.valuesTitle || '').trim() || defaultAboutSettings.valuesTitle;
  const values = Array.isArray(input.values)
    ? input.values.map(v => String(v || '').trim()).filter(Boolean)
    : defaultAboutSettings.values;

  const missionImages = {
    main: String(input.missionImages?.main || '').trim(),
    accent: String(input.missionImages?.accent || '').trim(),
  };

  // 5. Contact validation
  const contactEyebrow = String(input.contact?.eyebrow || '').trim() || defaultAboutSettings.contact.eyebrow;
  const contactTitle = String(input.contact?.title || '').trim() || defaultAboutSettings.contact.title;
  const contactText = String(input.contact?.text || '').trim() || defaultAboutSettings.contact.text;
  const contactButton = String(input.contact?.button || '').trim() || defaultAboutSettings.contact.button;
  const contactTo = String(input.contact?.to || '').trim() || defaultAboutSettings.contact.to;

  // 6. Office validation
  const officeLabel = String(input.office?.label || '').trim() || defaultAboutSettings.office.label;
  let address = Array.isArray(input.office?.address)
    ? input.office.address.map(a => String(a || '').trim()).filter(Boolean)
    : (typeof input.office?.address === 'string'
      ? input.office.address.split('\n').map(a => a.trim()).filter(Boolean)
      : defaultAboutSettings.office.address);

  const phone = String(input.office?.phone || '').trim();
  const email = String(input.office?.email || '').trim();
  const mapsUrl = String(input.office?.mapsUrl || '').trim();

  // Construct cleansed payload — exactly matches website contents
  const cleanData = {
    hero: {
      eyebrow: String(input.hero.eyebrow || '').trim() || defaultAboutSettings.hero.eyebrow,
      title: heroTitle,
      text: heroText,
      tags: tags.length ? tags : defaultAboutSettings.hero.tags,
    },
    who: {
      eyebrow: String(input.who.eyebrow || '').trim() || defaultAboutSettings.who.eyebrow,
      title: whoTitle,
      text: whoText,
      imageUrl: input.who.imageUrl ? String(input.who.imageUrl).trim() : '',
    },
    fabrics: {
      eyebrow: fabricsEyebrow,
      title: fabricsTitle,
      text: fabricsText,
      list: fabricList,
    },
    mission,
    missionTitle,
    valuesTitle,
    values,
    missionImages,
    contact: {
      eyebrow: contactEyebrow,
      title: contactTitle,
      text: contactText,
      button: contactButton,
      to: contactTo,
    },
    office: {
      label: officeLabel,
      address,
      phone,
      email,
      mapsUrl,
    },
  };

  return { valid: true, cleanData };
};

const getSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await SiteSetting.findOne({ where: { key } });
    if (!setting) {
      if (key === 'about') {
        try {
          await SiteSetting.create({ key: 'about', value: JSON.stringify(defaultAboutSettings) });
        } catch (seedErr) {
          console.warn('Auto-seed SiteSetting[about] failed:', seedErr.message);
        }
        return res.json({ success: true, key, data: defaultAboutSettings });
      }
      if (key === 'otp_threshold' || key === 'security') {
        return res.json({ success: true, key, data: defaultOtpSettings });
      }
      if (key === 'inventory') {
        return res.json({ success: true, key, data: defaultInventorySettings });
      }
      if (key === 'tax' || key === 'gst') {
        return res.json({ success: true, key, data: defaultTaxSettings });
      }
      if (key === 'embroidery') {
        return res.json({ success: true, key, data: defaultEmbroiderySettings });
      }
      if (key === 'payment') {
        return res.json({ success: true, key, data: defaultPaymentSettings });
      }
      if (key === 'bulk_tiers') {
        return res.json({ success: true, key, data: defaultBulkTiersSettings });
      }
      if (key === 'storefront') {
        return res.json({ success: true, key, data: defaultStorefrontSettings });
      }
      if (key === 'faqs') {
        return res.json({ success: true, key, data: defaultFaqSettings });
      }
      if (key === 'fabric_features') {
        return res.json({ success: true, key, data: defaultFabricFeaturesSettings });
      }
      if (key === 'institutions') {
        return res.json({ success: true, key, data: defaultInstitutionsSettings });
      }
      return res.json({ success: true, key, data: {} });
    }

    let parsed = {};
    try {
      parsed = JSON.parse(setting.value);
    } catch {
      parsed = {};
    }

    if (key === 'about') {
      const merged = {
        hero: { ...defaultAboutSettings.hero, ...(parsed.hero || {}) },
        who: { ...defaultAboutSettings.who, ...(parsed.who || {}) },
        fabrics: { ...defaultAboutSettings.fabrics, ...(parsed.fabrics || {}) },
        mission: parsed.mission || defaultAboutSettings.mission,
        missionTitle: parsed.missionTitle || defaultAboutSettings.missionTitle,
        valuesTitle: parsed.valuesTitle || defaultAboutSettings.valuesTitle,
        values: parsed.values?.length ? parsed.values : defaultAboutSettings.values,
        missionImages: { ...defaultAboutSettings.missionImages, ...(parsed.missionImages || {}) },
        contact: { ...defaultAboutSettings.contact, ...(parsed.contact || {}) },
        office: { ...defaultAboutSettings.office, ...(parsed.office || {}) },
      };
      return res.json({ success: true, key, data: merged });
    }

    if (key === 'otp_threshold' || key === 'security') {
      return res.json({ success: true, key, data: { ...defaultOtpSettings, ...parsed } });
    }
    if (key === 'tax' || key === 'gst') {
      return res.json({ success: true, key, data: { ...defaultTaxSettings, ...parsed } });
    }
    if (key === 'embroidery') {
      return res.json({ success: true, key, data: { ...defaultEmbroiderySettings, ...parsed } });
    }
    if (key === 'payment') {
      return res.json({ success: true, key, data: { ...defaultPaymentSettings, ...parsed } });
    }
    if (key === 'bulk_tiers') {
      return res.json({ success: true, key, data: { ...defaultBulkTiersSettings, ...parsed } });
    }
    if (key === 'storefront') {
      return res.json({ success: true, key, data: { ...defaultStorefrontSettings, ...parsed } });
    }
    if (key === 'faqs') {
      return res.json({ success: true, key, data: { ...defaultFaqSettings, ...parsed } });
    }
    if (key === 'fabric_features') {
      return res.json({ success: true, key, data: { ...defaultFabricFeaturesSettings, ...parsed } });
    }
    if (key === 'institutions') {
      return res.json({ success: true, key, data: { ...defaultInstitutionsSettings, ...parsed } });
    }
    return res.json({ success: true, key, data: parsed });
  } catch (err) {
    console.error('getSetting error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    let data = {};
    
    if (req.body.data) {
      try {
        data = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data;
      } catch (e) {
        return res.status(400).json({ success: false, message: 'Invalid JSON payload in data field' });
      }
    } else {
      data = req.body;
    }

    let toSave = data;

    if (key === 'about') {
      const valResult = validateAboutSettings(data);
      if (!valResult.valid) {
        return res.status(400).json({ success: false, message: valResult.message });
      }
      toSave = valResult.cleanData;

      // Handle multi-image file uploads
      if (req.files && Array.isArray(req.files)) {
        const whoFile = req.files.find(f => f.fieldname === 'whoImage' || f.fieldname === 'image');
        if (whoFile) {
          toSave.who.imageUrl = `/uploads/settings/${whoFile.filename}`;
        }
        const mainFile = req.files.find(f => f.fieldname === 'missionMain');
        if (mainFile) {
          if (!toSave.missionImages) toSave.missionImages = {};
          toSave.missionImages.main = `/uploads/settings/${mainFile.filename}`;
        }
        const accentFile = req.files.find(f => f.fieldname === 'missionAccent');
        if (accentFile) {
          if (!toSave.missionImages) toSave.missionImages = {};
          toSave.missionImages.accent = `/uploads/settings/${accentFile.filename}`;
        }
      } else if (req.file) {
        // Fallback for single file upload
        toSave.who.imageUrl = `/uploads/settings/${req.file.filename}`;
      }
    }

    const valueStr = JSON.stringify(toSave);
    let setting = await SiteSetting.findOne({ where: { key } });
    if (setting) {
      await setting.update({ value: valueStr });
    } else {
      setting = await SiteSetting.create({ key, value: valueStr });
    }

    return res.json({ success: true, key, data: toSave });
  } catch (err) {
    console.error('updateSetting error:', err);
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
};

const subscribeNewsletter = async (req, res) => {
  return res.json({ success: true, message: 'Thank you!' });
};

module.exports = { getSetting, updateSetting, subscribeNewsletter };
