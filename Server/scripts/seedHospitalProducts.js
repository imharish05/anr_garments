'use strict';
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { Product, ProductVariant, Category, SubCategory, sequelize } = require('../models');

const CATALOG_CATEGORIES = [
  {
    name: 'Scrub suits for Men & Women',
    slug: 'scrub-suits',
    image: '/uploads/products/anr-mens-scrub-navy.jpg',
    description: 'Medical scrub suits designed for comfortable, practical shifts for men and women.',
    subcategories: [
      {
        name: "Men's Classic Scrub Suits",
        slug: 'classic-scrub-suits-unisex',
        image: '/uploads/products/anr-mens-scrub-navy.jpg',
        description: "Tailored V-neck classic medical scrubs engineered for men's shifts.",
      },
      {
        name: "Women's Tailored Scrub Suits",
        slug: 'womens-tailored-scrub-suits',
        image: '/uploads/products/anr-womens-scrub-ceil.jpg',
        description: 'Contoured princess-cut medical scrub suits tailored specifically for women.',
      },
      {
        name: "Men's Cargo Scrub Suits",
        slug: 'mens-multi-pocket-cargo-scrubs',
        image: '/uploads/products/anr-unisex-cargo-scrub.jpg',
        description: 'Tactical cargo scrub suits with reinforced utility pockets for high mobility.',
      },
      {
        name: 'OT & Surgical Scrub Suits',
        slug: 'ot-surgical-scrub-suits',
        image: '/uploads/products/anr-ot-surgical-scrub.jpg',
        description: 'Certified Operation Theatre surgical scrub suits with anti-glare finish.',
      },
    ],
  },
  {
    name: 'Aprons for Men & Women',
    slug: 'aprons-lab-coats',
    image: '/uploads/products/anr-mens-doctor-apron.jpg',
    description: 'Doctor aprons and lab coats for clinical, consultation, and laboratory use.',
    subcategories: [
      {
        name: "Men's Full-Length Doctor Aprons",
        slug: 'doctor-full-length-lab-coats',
        image: '/uploads/products/anr-mens-doctor-apron.jpg',
        description: 'Crisp white senior consultant full-length medical coats with notch lapels.',
      },
      {
        name: "Women's Doctor Aprons",
        slug: 'womens-fitted-doctor-aprons',
        image: '/uploads/products/anr-womens-doctor-apron.jpg',
        description: 'Fitted slim-cut doctor aprons with waist-defining structure.',
      },
      {
        name: 'Half-Sleeve Medical Aprons',
        slug: 'consultation-half-sleeve-aprons',
        image: '/uploads/products/anr-half-sleeve-apron.jpg',
        description: 'Ergonomic half-sleeve examination aprons for busy OPD consultations.',
      },
      {
        name: 'Executive Lab & Tech Aprons',
        slug: 'executive-lab-tech-aprons',
        image: '/uploads/products/anr-mens-doctor-apron.jpg',
        description: 'Heavy-duty lab coats with chemical splash resistance and pass-through slits.',
      },
    ],
  },
  {
    name: 'Underscrubs for Men & Women',
    slug: 'underscrubs',
    image: '/uploads/products/anr-long-sleeve-underscrub.jpg',
    description: 'Soft, breathable base layers made to wear under medical scrubs.',
    subcategories: [
      {
        name: 'Unisex Long-Sleeve Underscrubs',
        slug: 'performance-long-sleeve-underscrubs',
        image: '/uploads/products/anr-long-sleeve-underscrub.jpg',
        description: 'Micro-knit performance base layer with thumbhole cuffs for cold wards.',
      },
      {
        name: "Women's Cooling Underscrubs",
        slug: 'womens-cooling-moisture-wicking',
        image: '/uploads/products/anr-womens-underscrub.jpg',
        description: '4-way stretch poly-spandex moisture-wicking cooling base layers for women.',
      },
      {
        name: "Men's Athletic Crew Underscrubs",
        slug: 'mens-athletic-fit-crew-underscrubs',
        image: '/uploads/products/anr-mens-crew-underscrub.jpg',
        description: 'Athletic crew-neck compression-fit underscrubs with silver-ion yarn.',
      },
    ],
  },
  {
    name: 'Patient Gown',
    slug: 'patient-gown',
    image: '/uploads/products/anr-patient-gown-blue.jpg',
    description: 'Comfortable hospital gowns for patient care, maternity, and OT use.',
    subcategories: [
      {
        name: 'Hospital Inpatient Tie-Back Gowns',
        slug: 'hospital-patient-gowns-tie-back',
        image: '/uploads/products/anr-patient-gown-blue.jpg',
        description: 'Dignified hospital inpatient tie-back gowns with full overlap back.',
      },
      {
        name: 'OT Surgical Patient Gowns',
        slug: 'autoclavable-ot-green-drapes',
        image: '/uploads/products/anr-patient-gown-ot-green.jpg',
        description: 'Fluid-barrier surgical patient gowns ready for pre-sterilization.',
      },
      {
        name: 'Maternity & Nursing Patient Gowns',
        slug: 'ot-maternity-patient-gowns',
        image: '/uploads/products/anr-patient-gown-maternity.jpg',
        description: 'Maternity gowns with shoulder snap closures for nursing and easy access.',
      },
    ],
  },
  {
    name: 'Patient Pant & Shirt',
    slug: 'patient-pant-shirt',
    image: '/uploads/products/anr-patient-pant-shirt-blue.jpg',
    description: 'Comfortable two-piece patient clothing for hospital wards and inpatient care.',
    subcategories: [
      {
        name: 'Two-Piece Patient Pant & Shirt Sets',
        slug: 'two-piece-patient-pant-shirt-sets',
        image: '/uploads/products/anr-patient-pant-shirt-blue.jpg',
        description: 'Comfortable short-sleeve button tunic with drawstring trousers.',
      },
      {
        name: 'Inpatient Striped Patient Uniforms',
        slug: 'inpatient-striped-patient-uniforms',
        image: '/uploads/products/anr-patient-pant-shirt-striped.png',
        description: 'Classic pin-striped patient uniform sets for hospital ward dignity.',
      },
    ],
  },
];

const COLOR_NAMES_MAP = {
  '#1E40AF': 'Royal Blue',
  '#1A175A': 'Navy Blue',
  '#0D9488': 'Teal Green',
  '#0F172A': 'Midnight Charcoal',
  '#60A5FA': 'Ceil Blue',
  '#831843': 'Burgundy / Wine',
  '#15803D': 'OT Hunter Green',
  '#64748B': 'Slate Grey',
  '#FFFFFF': 'Clinical White',
  '#E2E8F0': 'Pastel Grey',
  '#F472B6': 'Maternity Pink',
};

const PRODUCTS_MASTER = [
  // ── 1. Scrub Suits for Men & Women ──────────────────────────────────────────
  {
    categorySlug: 'scrub-suits',
    subCategorySlug: 'classic-scrub-suits-unisex',
    name: "ANR Men's Classic 4-Pocket Scrub Suit",
    slug: 'anr-mens-classic-4-pocket-scrub-suit',
    sku: 'ANR-SCRUB-MEN-01',
    price: 1299,
    comparePrice: 1699,
    rating: 4.9,
    reviewCount: 580,
    badge: 'Most Popular',
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    stock: 120,
    colors: ['#1A175A', '#1E40AF', '#60A5FA', '#0F172A'],
    defaultProductImage: '/uploads/products/anr-mens-scrub-navy.jpg',
    images: ['/uploads/products/anr-mens-scrub-navy.jpg', '/uploads/products/anr-unisex-cargo-scrub.jpg'],
    shortDescription: 'Tailored 4-pocket medical scrub suit engineered with breathable 4-way stretch poly-viscose for 14+ hour hospital shifts.',
    description: 'Designed in collaboration with frontline doctors, the ANR Men\'s Classic Scrub Suit delivers unmatched shift mobility and clean contemporary styling. Crafted from proprietary wrinkle-resistant poly-viscose-spandex twill, it features a tailored V-neck top with reinforced chest pocket, pen loop, and straight-leg trousers with deep side and back utility pockets. Autoclavable up to 60+ cycles with color-lock technology.',
    features: ['4 Deep Reinforced Utility Pockets', '4-Way Mechanical Stretch Fabric', 'Autoclavable 60+ Hospital Wash Cycles', 'Side-Hem Vents for Easy Movement']
  },
  {
    categorySlug: 'scrub-suits',
    subCategorySlug: 'womens-tailored-scrub-suits',
    name: "ANR Women's Tailored Contoured Scrub Suit",
    slug: 'anr-womens-tailored-contoured-scrub-suit',
    sku: 'ANR-SCRUB-WMN-02',
    price: 1399,
    comparePrice: 1849,
    rating: 4.9,
    reviewCount: 420,
    badge: 'Doctor Choice',
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    stock: 95,
    colors: ['#60A5FA', '#1E40AF', '#831843', '#0D9488'],
    defaultProductImage: '/uploads/products/anr-womens-scrub-ceil.jpg',
    images: ['/uploads/products/anr-womens-scrub-ceil.jpg', '/uploads/products/anr-mens-scrub-navy.jpg'],
    shortDescription: 'Contoured princess-cut medical scrub suit tailored specifically for female physicians, surgeons, and nurses.',
    description: 'Experience refined elegance and clinical functionality with the ANR Women\'s Tailored Scrub Suit. Designed with princess back seams and gentle waist shaping, it flatters without compromising mobility. Includes a hidden zippered security pocket for rings/keys, dual spacious hip pockets, and soft yoga-knit waistband trousers with adjustable drawstrings.',
    features: ['Princess-Seam Contoured Tailoring', 'Hidden Zipper Security Pocket', 'Silky Hypoallergenic Fabric Feel', 'Fade & Shrink Resistant Weave']
  },
  {
    categorySlug: 'scrub-suits',
    subCategorySlug: 'mens-multi-pocket-cargo-scrubs',
    name: "ANR Multi-Pocket Tactical Cargo Scrub Set",
    slug: 'anr-multi-pocket-tactical-cargo-scrub-set',
    sku: 'ANR-SCRUB-CRG-03',
    price: 1449,
    comparePrice: 1899,
    rating: 4.8,
    reviewCount: 388,
    badge: 'High Mobility',
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    stock: 85,
    colors: ['#1E40AF', '#1A175A', '#64748B', '#15803D'],
    defaultProductImage: '/uploads/products/anr-unisex-cargo-scrub.jpg',
    images: ['/uploads/products/anr-unisex-cargo-scrub.jpg', '/uploads/products/anr-mens-scrub-navy.jpg'],
    shortDescription: 'Heavy-duty cargo scrub suit equipped with 7 reinforced tactical utility pockets for emergency, trauma, and ICU teams.',
    description: 'When carrying diagnostics tools, shears, penlights, stethoscopes, and charts is mandatory, the ANR Tactical Cargo Scrub Set stands ready. Features 7 reinforced double-stitched pockets including secure velcro cargo flaps, reinforced knee darts, and heavy-duty triple-stitched stress seams for demanding clinical duties.',
    features: ['7 Reinforced Tactical Pockets', 'Knee Articulation Darts', 'Heavy-Duty Elasticated Waist with Cord', 'Liquid Repellent Finish']
  },
  {
    categorySlug: 'scrub-suits',
    subCategorySlug: 'ot-surgical-scrub-suits',
    name: 'ANR Operation Theatre (OT) Surgical Scrub Set',
    slug: 'anr-operation-theatre-ot-surgical-scrub-set',
    sku: 'ANR-SCRUB-OT-04',
    price: 1199,
    comparePrice: 1599,
    rating: 4.9,
    reviewCount: 490,
    badge: 'OT Certified',
    isBestSeller: true,
    isFeatured: false,
    isNewArrival: false,
    stock: 140,
    colors: ['#15803D', '#60A5FA', '#1A175A'],
    defaultProductImage: '/uploads/products/anr-ot-surgical-scrub.jpg',
    images: ['/uploads/products/anr-ot-surgical-scrub.jpg', '/uploads/products/anr-mens-scrub-navy.jpg'],
    shortDescription: 'Sterile Operation Theatre surgical scrub suit certified for surgical suites, sterile zones, and clean rooms.',
    description: 'Certified for surgical suites and sterile environments, this OT Scrub Set uses specialized anti-glare OT Hunter Green / Blue dye to minimize eye strain under overhead surgical lights. Low-linting, hypoallergenic, and tested to withstand high-pressure hospital autoclaves above 134°C without seam puckering.',
    features: ['Anti-Glare OT Green Dye', 'Zero-Lint Surgical Grade Fabric', 'High-Temp Autoclavable', 'Fluid Splash Protection']
  },

  // ── 2. Aprons for Men & Women ───────────────────────────────────────────────
  {
    categorySlug: 'aprons-lab-coats',
    subCategorySlug: 'doctor-full-length-lab-coats',
    name: "ANR Men's Full-Length Doctor Consultation Coat",
    slug: 'anr-mens-full-length-doctor-consultation-coat',
    sku: 'ANR-APRON-DOC-01',
    price: 1399,
    comparePrice: 1799,
    rating: 5.0,
    reviewCount: 620,
    badge: 'Senior Consultant',
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    stock: 110,
    colors: ['#FFFFFF'],
    defaultProductImage: '/uploads/products/anr-mens-doctor-apron.jpg',
    images: ['/uploads/products/anr-mens-doctor-apron.jpg', '/uploads/products/anr-half-sleeve-apron.jpg'],
    shortDescription: 'Senior consultant full-length consultation lab coat with structured notch lapels, tablet pocket, and pristine white twill.',
    description: 'Exude authority and trust with the ANR Full-Length Doctor Consultation Coat. Crafted from dense 210 GSM non-yellowing medical twill, it features classic notch lapels, a dedicated stethoscope loop, an interior tablet pocket, dual reinforced lower pockets, and side pass-through slits for seamless pants access.',
    features: ['Classic Notch Lapel Collar', 'Padded Tablet & Pen Pockets', 'Pants Pass-Through Side Slits', 'Non-Yellowing Bright White Twill']
  },
  {
    categorySlug: 'aprons-lab-coats',
    subCategorySlug: 'womens-fitted-doctor-aprons',
    name: "ANR Women's Fitted Slim-Cut Doctor Apron",
    slug: 'anr-womens-fitted-slim-cut-doctor-apron',
    sku: 'ANR-APRON-WMN-03',
    price: 1449,
    comparePrice: 1899,
    rating: 4.9,
    reviewCount: 290,
    badge: 'Tailored Cut',
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: true,
    stock: 80,
    colors: ['#FFFFFF'],
    defaultProductImage: '/uploads/products/anr-womens-doctor-apron.jpg',
    images: ['/uploads/products/anr-womens-doctor-apron.jpg', '/uploads/products/anr-half-sleeve-apron.jpg'],
    shortDescription: 'Tailored slim-cut doctor apron with waist-defining contouring and silky non-crease clinical fabric.',
    description: 'Designed specifically for modern female doctors, clinicians, and dentists, this apron offers a sculpted silhouette without sacrificing clinical comfort. Features concealed horn buttons, back walking vent, chest pocket with precision pen slot, and stain-release surface technology.',
    features: ['Fitted Princess-Cut Silhouette', 'Concealed Front Placket Buttons', 'Nanotech Stain-Release Weave', 'Pre-Shrunk Cotton-Rich Twill']
  },
  {
    categorySlug: 'aprons-lab-coats',
    subCategorySlug: 'consultation-half-sleeve-aprons',
    name: 'ANR Medical Consultation Half-Sleeve Apron',
    slug: 'anr-medical-consultation-half-sleeve-apron',
    sku: 'ANR-APRON-HLF-02',
    price: 899,
    comparePrice: 1199,
    rating: 4.8,
    reviewCount: 345,
    badge: 'Daily Clinical Wear',
    isBestSeller: false,
    isFeatured: true,
    isNewArrival: false,
    stock: 130,
    colors: ['#FFFFFF'],
    defaultProductImage: '/uploads/products/anr-half-sleeve-apron.jpg',
    images: ['/uploads/products/anr-half-sleeve-apron.jpg', '/uploads/products/anr-mens-doctor-apron.jpg'],
    shortDescription: 'Ergonomic half-sleeve clinical examination coat with rear movement vent and dual chest pen slots.',
    description: 'Ideal for tropical hospital climates, dental procedures, and high-frequency ward consultations. The half-sleeve cut prevents cuffs from contacting patient surfaces or fluids, ensuring maximum hygiene and ease of hand disinfection between rounds.',
    features: ['Hygiene-First Half-Sleeve Design', 'Dual Chest Pen & Light Pockets', 'Back Movement Action Pleat', 'Bleach-Safe Industrial Wash Proof']
  },

  // ── 3. Underscrubs for Men & Women ──────────────────────────────────────────
  {
    categorySlug: 'underscrubs',
    subCategorySlug: 'performance-long-sleeve-underscrubs',
    name: 'ANR Unisex Performance Long Sleeve Underscrub',
    slug: 'anr-unisex-performance-long-sleeve-underscrub',
    sku: 'ANR-USCRUB-UNI-01',
    price: 699,
    comparePrice: 949,
    rating: 4.9,
    reviewCount: 310,
    badge: 'Thermal Comfort',
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    stock: 150,
    colors: ['#1A175A', '#0F172A', '#FFFFFF', '#64748B'],
    defaultProductImage: '/uploads/products/anr-long-sleeve-underscrub.jpg',
    images: ['/uploads/products/anr-long-sleeve-underscrub.jpg', '/uploads/products/anr-womens-underscrub.jpg'],
    shortDescription: 'Micro-knit long-sleeve performance base layer underscrub engineered for cold hospital wards and operation theatres.',
    description: 'Stay warm in chilly ICU units and air-conditioned OT suites. The ANR Performance Underscrub features silky micro-knit modal-spandex with active moisture management. Low-profile flatlock seams eliminate friction under scrub tops, and integrated thumbholes keep sleeves anchored when slipping into sterile surgical gloves.',
    features: ['Thumbhole Cuff Sleeve Anchors', 'Silky Micro-Knit Modal Spandex', 'Chafe-Free Flatlock Seams', 'Odor-Resistant Silver-Ion Tech']
  },
  {
    categorySlug: 'underscrubs',
    subCategorySlug: 'womens-cooling-moisture-wicking',
    name: "ANR Women's Cooling Moisture-Wicking Base Layer",
    slug: 'anr-womens-cooling-moisture-wicking-base-layer',
    sku: 'ANR-USCRUB-WMN-02',
    price: 749,
    comparePrice: 1049,
    rating: 4.8,
    reviewCount: 210,
    badge: 'Cooling Tech',
    isBestSeller: false,
    isFeatured: true,
    isNewArrival: true,
    stock: 95,
    colors: ['#0F172A', '#1E40AF', '#FFFFFF'],
    defaultProductImage: '/uploads/products/anr-womens-underscrub.jpg',
    images: ['/uploads/products/anr-womens-underscrub.jpg', '/uploads/products/anr-long-sleeve-underscrub.jpg'],
    shortDescription: 'Ultra-soft 4-way stretch poly-spandex underscrub with active evaporative cooling for women healthcare practitioners.',
    description: 'Engineered with micro-perforated cooling mesh zones across the back and underarms, this underscrub pulls perspiration away from the skin instantly. Keeps you dry and comfortable during intensive ER procedures and double shifts.',
    features: ['Active Moisture-Wicking Zones', 'Featherlight 4-Way Stretch', 'Feminine Crew-Neck Cut', 'Tagless Comfort Collar']
  },
  {
    categorySlug: 'underscrubs',
    subCategorySlug: 'mens-athletic-fit-crew-underscrubs',
    name: "ANR Men's Athletic Fit Crew Underscrub Tee",
    slug: 'anr-mens-athletic-fit-crew-underscrub-tee',
    sku: 'ANR-USCRUB-MEN-03',
    price: 649,
    comparePrice: 899,
    rating: 4.9,
    reviewCount: 185,
    badge: 'OT Duty',
    isBestSeller: false,
    isFeatured: false,
    isNewArrival: false,
    stock: 120,
    colors: ['#64748B', '#1A175A', '#0F172A'],
    defaultProductImage: '/uploads/products/anr-mens-crew-underscrub.jpg',
    images: ['/uploads/products/anr-mens-crew-underscrub.jpg', '/uploads/products/anr-long-sleeve-underscrub.jpg'],
    shortDescription: 'Athletic crewneck compression-fit short-sleeve underscrub tee with odor-resistant silver-ion yarn.',
    description: 'Designed as the definitive base layer for men under scrub tops. Features breathable mesh panels, an athletic tapered fit that stays neatly tucked into scrub pants, and antibacterial silver-ion fibers that stop shift odor at the source.',
    features: ['Technical Cooling Micro-Mesh', 'Tuck-Stay Athletic Hem', 'Antibacterial Silver-Ion Weave', 'High-Stretch Comfort']
  },

  // ── 4. Patient Gown ────────────────────────────────────────────────────────
  {
    categorySlug: 'patient-gown',
    subCategorySlug: 'hospital-patient-gowns-tie-back',
    name: 'ANR Hospital Inpatient Tie-Back Patient Gown',
    slug: 'anr-hospital-inpatient-tie-back-patient-gown',
    sku: 'ANR-PT-GOWN-01',
    price: 499,
    comparePrice: 699,
    rating: 4.9,
    reviewCount: 440,
    badge: 'Patient Dignity',
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    stock: 200,
    colors: ['#60A5FA', '#0D9488', '#E2E8F0'],
    defaultProductImage: '/uploads/products/anr-patient-gown-blue.jpg',
    images: ['/uploads/products/anr-patient-gown-blue.jpg', '/uploads/products/anr-patient-gown-ot-green.jpg'],
    shortDescription: 'Hygienic tie-back hospital inpatient gown with generous overlap modesty back and reinforced twill ties.',
    description: 'Crafted with patient dignity at the forefront, the ANR Tie-Back Gown provides a full generous back overlap to prevent inadvertent exposure. Built from 100% skin-safe, combed hospital cotton with reinforced herringbone twill ties that endure industrial wash cycles and autoclaves without ripping.',
    features: ['Full Modesty Overlap Back', 'Heavy-Duty Herringbone Twill Ties', '100% Hypoallergenic Soft Cotton', 'Autoclavable 60+ Hospital Washes']
  },
  {
    categorySlug: 'patient-gown',
    subCategorySlug: 'autoclavable-ot-green-drapes',
    name: 'ANR Operation Theatre Surgical Patient Gown',
    slug: 'anr-operation-theatre-surgical-patient-gown',
    sku: 'ANR-PT-OT-03',
    price: 549,
    comparePrice: 749,
    rating: 4.8,
    reviewCount: 320,
    badge: 'Sterile Surgery',
    isBestSeller: false,
    isFeatured: false,
    isNewArrival: false,
    stock: 160,
    colors: ['#15803D', '#1E40AF'],
    defaultProductImage: '/uploads/products/anr-patient-gown-ot-green.jpg',
    images: ['/uploads/products/anr-patient-gown-ot-green.jpg', '/uploads/products/anr-patient-gown-blue.jpg'],
    shortDescription: 'Pre-sterilization ready OT surgical patient gown with fluid-barrier chest panel and raglan sleeves.',
    description: 'Engineered specifically for pre-op and intra-operative patient wear. Features a dual-layer fluid-repellent chest and abdominal panel, raglan sleeves that allow instant intravenous line placement, and high-tensile neck and waist tie closures.',
    features: ['Fluid Barrier Chest & Abdomen Panel', 'Raglan Cut for Quick IV Access', 'Color-Fast Non-Glare OT Green', 'Pre-Sterilization Autoclave Ready']
  },
  {
    categorySlug: 'patient-gown',
    subCategorySlug: 'ot-maternity-patient-gowns',
    name: 'ANR Maternity & Nursing Patient Gown',
    slug: 'anr-maternity-nursing-patient-gown',
    sku: 'ANR-PT-MAT-04',
    price: 529,
    comparePrice: 729,
    rating: 4.9,
    reviewCount: 215,
    badge: 'Easy Access',
    isBestSeller: false,
    isFeatured: true,
    isNewArrival: true,
    stock: 110,
    colors: ['#F472B6', '#60A5FA'],
    defaultProductImage: '/uploads/products/anr-patient-gown-maternity.jpg',
    images: ['/uploads/products/anr-patient-gown-maternity.jpg', '/uploads/products/anr-patient-gown-blue.jpg'],
    shortDescription: 'Maternity and pediatric patient gown featuring front shoulder snap closures for nursing access and fetal monitoring.',
    description: 'Designed specifically for maternity labor, delivery, and postpartum recovery. Magnetic/snap shoulder closures allow immediate breastfeeding and skin-to-skin bonding without gown removal. Generous tummy room and skin-safe AZO-free dyes safeguard both mother and newborn.',
    features: ['Dual Shoulder Snaps for Nursing Access', 'Epidural & Fetal Monitor Accessible Back', 'Ultra-Soft 100% Combed Cotton', 'Safe AZO-Free Non-Toxic Dyes']
  },

  // ── 5. Patient Pant & Shirt ────────────────────────────────────────────────
  {
    categorySlug: 'patient-pant-shirt',
    subCategorySlug: 'two-piece-patient-pant-shirt-sets',
    name: 'ANR Two-Piece Patient Pant & Shirt Set (Hospital Ward)',
    slug: 'anr-two-piece-patient-pant-shirt-set-hospital-ward',
    sku: 'ANR-PT-SET-02',
    price: 799,
    comparePrice: 1099,
    rating: 4.9,
    reviewCount: 510,
    badge: 'Inpatient Uniform',
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    stock: 180,
    colors: ['#60A5FA', '#1E40AF', '#64748B'],
    defaultProductImage: '/uploads/products/anr-patient-pant-shirt-blue.jpg',
    images: ['/uploads/products/anr-patient-pant-shirt-blue.jpg', '/uploads/products/anr-patient-pant-shirt-striped.png'],
    shortDescription: 'Two-piece dignified ward patient uniform featuring easy-button front tunic shirt and elasticated drawstring trousers.',
    description: 'The modern alternative to standard open-back gowns for mobile inpatients, rehabilitation wards, and long-term care facilities. The short-sleeve shirt includes large, easy-to-grip buttons and a front chest pocket, paired with generous wide-leg trousers equipped with soft elastic and drawstring closure.',
    features: ['Easy-Snap / Button Front Shirt', 'Elastic & Drawstring Trousers', 'Breathable Long-Wear Hospital Cotton', 'Generous Inpatient Dignity Fit']
  },
  {
    categorySlug: 'patient-pant-shirt',
    subCategorySlug: 'inpatient-striped-patient-uniforms',
    name: 'ANR Dignity Striped Inpatient Ward Uniform Set',
    slug: 'anr-dignity-striped-inpatient-ward-uniform-set',
    sku: 'ANR-PT-STRIPE-05',
    price: 849,
    comparePrice: 1149,
    rating: 4.8,
    reviewCount: 260,
    badge: 'Ward Standard',
    isBestSeller: false,
    isFeatured: false,
    isNewArrival: true,
    stock: 140,
    colors: ['#60A5FA', '#E2E8F0'],
    defaultProductImage: '/uploads/products/anr-patient-pant-shirt-striped.png',
    images: ['/uploads/products/anr-patient-pant-shirt-striped.png', '/uploads/products/anr-patient-pant-shirt-blue.jpg'],
    shortDescription: 'Classic hospital pin-striped two-piece patient pyjama uniform set for clean ward identification and comfortable recovery.',
    description: 'Featuring distinctive hospital pin-stripes for swift patient and ward department identification. Built with heavy-duty bartacked seams at pocket corners and crotch gusset, engineered to survive 80+ industrial laundry sanitize wash cycles without color bleeding.',
    features: ['Dignified Hospital Pin-Stripe Pattern', 'Reinforced Pocket & Crotch Bartacks', 'Wide Ankle Cut for Splints & Casts', 'Pre-Shrunk Colorfast Cotton-Poly']
  },
];

const SIZES = ['S', 'M', 'L', 'XL', '2XL'];

async function seedProducts() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    // 1. Seed Categories & SubCategories
    for (let categoryIndex = 0; categoryIndex < CATALOG_CATEGORIES.length; categoryIndex += 1) {
      const item = CATALOG_CATEGORIES[categoryIndex];
      const [category] = await Category.findOrCreate({
        where: { slug: item.slug },
        defaults: {
          name: item.name,
          slug: item.slug,
          description: item.description,
          image: item.image,
          sortOrder: categoryIndex + 1,
          isActive: true,
          showHeader: true,
        },
      });
      await category.update({
        name: item.name,
        description: item.description,
        image: item.image,
        sortOrder: categoryIndex + 1,
        isActive: true,
        showHeader: true,
      });

      for (let subIndex = 0; subIndex < item.subcategories.length; subIndex += 1) {
        const sub = item.subcategories[subIndex];
        const [subcategory] = await SubCategory.findOrCreate({
          where: { slug: sub.slug },
          defaults: {
            categoryId: category.id,
            name: sub.name,
            slug: sub.slug,
            description: sub.description,
            image: sub.image,
            sortOrder: subIndex + 1,
            isActive: true,
          },
        });
        await subcategory.update({
          categoryId: category.id,
          name: sub.name,
          description: sub.description,
          image: sub.image,
          sortOrder: subIndex + 1,
          isActive: true,
        });
      }
    }
    console.log('Seeded categories and subcategories.');

    // Remove or deactivate legacy patient-wear category if exists
    const legacyWear = await Category.findOne({ where: { slug: 'patient-wear' } });
    if (legacyWear) {
      await legacyWear.update({ isActive: false, showHeader: false });
    }

    const categories = await Category.findAll();
    const subCategories = await SubCategory.findAll();

    const catMap = {};
    categories.forEach(c => { catMap[c.slug] = c.id; });

    const subMap = {};
    subCategories.forEach(s => { subMap[s.slug] = s.id; });

    // 2. Seed Products & Variants
    for (const item of PRODUCTS_MASTER) {
      const categoryId = catMap[item.categorySlug] || categories[0]?.id;
      let subCategoryId = subMap[item.subCategorySlug];
      if (!subCategoryId) {
        const match = subCategories.find(s => s.categoryId === categoryId);
        subCategoryId = match ? match.id : null;
      }

      const productPayload = {
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        price: item.price,
        comparePrice: item.comparePrice,
        currency: 'INR',
        stock: item.stock,
        categoryId,
        subCategoryId,
        defaultProductImage: item.defaultProductImage,
        images: item.images,
        shortDescription: item.shortDescription,
        description: item.description,
        rating: item.rating,
        reviewCount: item.reviewCount,
        isFeatured: item.isFeatured,
        isBestSeller: item.isBestSeller,
        isNewArrival: item.isNewArrival,
        isActive: true,
        tags: item.features,
        attributes: {
          badge: item.badge,
          colors: item.colors,
          features: item.features,
        },
      };

      let existing = await Product.findOne({ where: { slug: item.slug } });
      let product;
      if (existing) {
        await existing.update(productPayload);
        product = existing;
        console.log(`Updated product: ${product.name} (ID: ${product.id})`);
      } else {
        product = await Product.create(productPayload);
        console.log(`Created product: ${product.name} (ID: ${product.id})`);
      }

      // Generate variants for each color and size
      const colors = item.colors || ['#1A175A'];
      for (let cIdx = 0; cIdx < colors.length; cIdx++) {
        const hex = colors[cIdx];
        const colorName = COLOR_NAMES_MAP[hex] || `Color ${cIdx + 1}`;
        for (let sIdx = 0; sIdx < SIZES.length; sIdx++) {
          const size = SIZES[sIdx];
          const vSku = `${product.sku}-${colorName.substring(0, 3).toUpperCase()}-${size}`;

          const existingVariant = await ProductVariant.findOne({ where: { sku: vSku } });
          const variantData = {
            productId: product.id,
            sku: vSku,
            price: product.price,
            mrp: product.comparePrice,
            stock: 30,
            colorHex: hex.startsWith('#') && hex.length === 7 ? hex : null,
            image: product.defaultProductImage,
            images: product.images,
            attributes: {
              Color: colorName,
              Size: size,
            },
          };

          if (existingVariant) {
            await existingVariant.update(variantData);
          } else {
            await ProductVariant.create(variantData);
          }
        }
      }
    }

    console.log(`\nSuccessfully seeded all ${PRODUCTS_MASTER.length} products with complete variants across all 5 categories!`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seedProducts();
