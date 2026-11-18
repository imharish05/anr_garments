'use strict';
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mysql = require('mysql2/promise');

const PRODUCTS_20 = [
  // ── 1. Scrub Suits for Men & Women (Category 14) ──
  {
    name: 'ANR Classic Unisex 5-Pocket Scrub Suit',
    slug: 'anr-classic-unisex-5-pocket-scrub-suit',
    categoryId: 14,
    subCategoryId: 1,
    sku: 'ANR-SCRUB-UNI-01',
    price: 1299,
    comparePrice: 1699,
    rating: 4.9,
    reviewCount: 380,
    isBestSeller: 1,
    isNewArrival: 0,
    isActive: 1,
    defaultProductImage: '/uploads/products/5f02e8ef-20d9-4e2a-86ad-78d3f90c0dc2.webp',
    images: JSON.stringify([
      '/uploads/products/5f02e8ef-20d9-4e2a-86ad-78d3f90c0dc2.webp',
      '/uploads/products/anr-p63-classic-scrub-spec.jpg'
    ]),
    shortDescription: 'Autoclavable medical-grade poly-cotton weave engineered for 14+ hour shifts with 5 deep utility pockets.',
    description: 'Autoclavable medical-grade poly-cotton weave engineered for 14+ hour hospital shifts. Features 5 deep reinforced utility pockets for stethoscope, scissors & mobile, with ergonomic side-slit hem for unrestricted OT and ward mobility.',
    colors: ['#1E40AF', '#1A175A', '#0D9488', '#0F172A'],
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  },
  {
    name: "ANR Women's Tailored Contoured Scrub Suit",
    slug: 'anr-womens-tailored-contoured-scrub-suit',
    categoryId: 14,
    subCategoryId: 2,
    sku: 'ANR-SCRUB-WMN-02',
    price: 1399,
    comparePrice: 1849,
    rating: 4.9,
    reviewCount: 420,
    isBestSeller: 1,
    isNewArrival: 0,
    isActive: 1,
    defaultProductImage: '/uploads/products/73fb1f2d-1502-4b3a-9b38-0a4dad73823e.png',
    images: JSON.stringify([
      '/uploads/products/73fb1f2d-1502-4b3a-9b38-0a4dad73823e.png',
      '/uploads/products/anr-p64-womens-scrub-spec.jpg'
    ]),
    shortDescription: 'Contoured princess-cut medical scrub tailored specifically for female physicians, surgeons, and nurses.',
    description: 'Contoured princess-cut medical scrub tailored specifically for women healthcare professionals. Fitted comfort with hidden zippered security pocket and silky soft hypoallergenic hand-feel.',
    colors: ['#60A5FA', '#1A175A', '#831843', '#0D9488'],
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  },
  {
    name: "ANR Men's Multi-Pocket Cargo Scrub Set",
    slug: 'anr-mens-multi-pocket-cargo-scrub-set',
    categoryId: 14,
    subCategoryId: 3,
    sku: 'ANR-SCRUB-MEN-03',
    price: 1449,
    comparePrice: 1899,
    rating: 4.8,
    reviewCount: 388,
    isBestSeller: 1,
    isNewArrival: 0,
    isActive: 1,
    defaultProductImage: '/uploads/products/13135b42-9ccc-48db-8416-615cc11bce06.png',
    images: JSON.stringify([
      '/uploads/products/13135b42-9ccc-48db-8416-615cc11bce06.png',
      '/uploads/products/anr-p65-cargo-scrub-spec.jpg'
    ]),
    shortDescription: 'Heavy-duty tactical medical cargo scrub set with 7 reinforced cargo pockets for emergency & surgical teams.',
    description: 'Heavy-duty tactical medical cargo scrub set with 7 reinforced utility pockets, elasticated drawstring waistband, and high-mobility gusseting for emergency & surgical teams.',
    colors: ['#1A175A', '#15803D', '#64748B', '#1E40AF'],
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  },
  {
    name: 'ANR Operation Theatre (OT) Surgical Scrub Set',
    slug: 'anr-operation-theatre-ot-surgical-scrub-set',
    categoryId: 14,
    subCategoryId: 4,
    sku: 'ANR-SCRUB-OT-04',
    price: 1199,
    comparePrice: 1599,
    rating: 4.9,
    reviewCount: 490,
    isBestSeller: 1,
    isNewArrival: 0,
    isActive: 1,
    defaultProductImage: '/uploads/products/d61ce7e7-e74f-445d-813a-57411b734b0e.png',
    images: JSON.stringify([
      '/uploads/products/d61ce7e7-e74f-445d-813a-57411b734b0e.png',
      '/uploads/products/anr-p66-ot-scrub-spec.jpg'
    ]),
    shortDescription: 'Sterile Operation Theatre scrub suit certified for surgical suites with anti-glare OT Green/Blue dye.',
    description: 'Sterile Operation Theatre scrub suit certified for surgical suites. Anti-glare OT Green/Blue dye, fluid splash repellent finish, and autoclaving endurance exceeding 60+ hospital laundry cycles.',
    colors: ['#15803D', '#60A5FA', '#1A175A'],
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  },

  // ── 2. Aprons & Lab Coats for Doctors (Category 15) ──
  {
    name: "ANR Doctor's Full-Length Consultation Lab Coat",
    slug: 'anr-doctors-full-length-consultation-lab-coat',
    categoryId: 15,
    subCategoryId: 5,
    sku: 'ANR-APRON-DOC-01',
    price: 1399,
    comparePrice: 1799,
    rating: 5.0,
    reviewCount: 620,
    isBestSeller: 1,
    isNewArrival: 0,
    isActive: 1,
    defaultProductImage: '/uploads/products/11a2e9ef-6329-4fa5-accd-617e1f486761.png',
    images: JSON.stringify([
      '/uploads/products/11a2e9ef-6329-4fa5-accd-617e1f486761.png',
      '/uploads/products/anr-p67-lab-coat-spec.jpg'
    ]),
    shortDescription: 'Senior consultant full-length consultation lab coat with structured notch lapels, tablet pocket, and pristine white twill.',
    description: 'Senior consultant full-length consultation lab coat with structured notch lapels, padded tablet pocket, stethoscope loop, and pre-shrunk cotton-rich twill that stays crisp all day.',
    colors: ['#FFFFFF'],
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  },
  {
    name: 'ANR Medical Consultation Half-Sleeve Apron',
    slug: 'anr-medical-consultation-half-sleeve-apron',
    categoryId: 15,
    subCategoryId: 6,
    sku: 'ANR-APRON-HLF-02',
    price: 899,
    comparePrice: 1199,
    rating: 4.8,
    reviewCount: 345,
    isBestSeller: 1,
    isNewArrival: 0,
    isActive: 1,
    defaultProductImage: '/uploads/products/8a56116a-2f3d-4b19-ab76-bb10987fae24.png',
    images: JSON.stringify([
      '/uploads/products/8a56116a-2f3d-4b19-ab76-bb10987fae24.png',
      '/uploads/products/anr-p68-half-sleeve-apron-spec.png'
    ]),
    shortDescription: 'Ergonomic half-sleeve clinical examination coat with rear movement vent and dual chest pen slots.',
    description: 'Ergonomic half-sleeve clinical examination coat with rear movement vent, dual chest pen slot, and nanotechnology stain-release barrier against medical fluids.',
    colors: ['#FFFFFF'],
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  },
  {
    name: "ANR Women's Fitted Slim-Cut Doctor Apron",
    slug: 'anr-womens-fitted-slim-cut-doctor-apron',
    categoryId: 15,
    subCategoryId: 7,
    sku: 'ANR-APRON-WMN-03',
    price: 1449,
    comparePrice: 1899,
    rating: 4.9,
    reviewCount: 290,
    isBestSeller: 1,
    isNewArrival: 0,
    isActive: 1,
    defaultProductImage: '/uploads/products/1caab93e-3ed1-49c1-a351-306f67b588c8.png',
    images: JSON.stringify([
      '/uploads/products/1caab93e-3ed1-49c1-a351-306f67b588c8.png',
      '/uploads/products/0e08aa16-7ba1-408e-a4d6-1491da1ef21f.png'
    ]),
    shortDescription: 'Tailored slim-cut doctor apron with waist-defining contouring and silky non-crease clinical fabric.',
    description: 'Tailored slim-cut doctor apron with structured styling, non-yellowing bright white clinical weave resistant to repeated laundering, and deep utility pockets.',
    colors: ['#FFFFFF'],
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  },
  {
    name: "ANR Men's Executive Heavy-Duty Lab Apron",
    slug: 'anr-mens-executive-heavy-duty-lab-apron',
    categoryId: 15,
    subCategoryId: 8,
    sku: 'ANR-APRON-EXC-04',
    price: 1299,
    comparePrice: 1699,
    rating: 4.9,
    reviewCount: 310,
    isBestSeller: 1,
    isNewArrival: 0,
    isActive: 1,
    defaultProductImage: '/uploads/products/77e26a5d-c13d-4416-a342-85e760820aa7.png',
    images: JSON.stringify([
      '/uploads/products/77e26a5d-c13d-4416-a342-85e760820aa7.png',
      '/uploads/products/anr-p67-lab-coat-spec.jpg'
    ]),
    shortDescription: 'Heavy-duty executive lab coat designed for diagnostic labs and pathology with acid/chemical splash resistance.',
    description: 'Heavy-duty executive lab coat designed for diagnostic labs and pathology. Features acid/chemical splash resistance, shatterproof buttons, and side pants-pocket pass-through slits.',
    colors: ['#FFFFFF'],
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  },

  // ── 3. Underscrubs & Performance Tees (Category 16) ──
  {
    name: "ANR Women's Cooling Moisture-Wicking Base Layer",
    slug: 'anr-womens-cooling-moisture-wicking-base-layer',
    categoryId: 16,
    subCategoryId: 10,
    sku: 'ANR-USCRUB-WMN-02',
    price: 749,
    comparePrice: 1049,
    rating: 4.8,
    reviewCount: 210,
    isBestSeller: 1,
    isNewArrival: 0,
    isActive: 1,
    defaultProductImage: '/uploads/products/8393e1fa-a4e9-4ea3-92aa-1414b32a8f36.jpg',
    images: JSON.stringify([
      '/uploads/products/8393e1fa-a4e9-4ea3-92aa-1414b32a8f36.jpg',
      '/uploads/products/anr-p72-womens-underscrub-spec.png'
    ]),
    shortDescription: 'Ultra-soft 4-way stretch poly-spandex underscrub with active evaporative cooling and silky inner finish.',
    description: 'Ultra-soft 4-way stretch poly-spandex underscrub with active evaporative cooling and silky inner finish designed to prevent skin irritation under protective PPE and surgical scrubs.',
    colors: ['#0F172A', '#1E40AF', '#FFFFFF'],
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  },
  {
    name: "ANR Men's Athletic Fit Crew Underscrub Tee",
    slug: 'anr-mens-athletic-fit-crew-underscrub-tee',
    categoryId: 16,
    subCategoryId: 11,
    sku: 'ANR-USCRUB-MEN-03',
    price: 649,
    comparePrice: 899,
    rating: 4.9,
    reviewCount: 185,
    isBestSeller: 1,
    isNewArrival: 0,
    isActive: 1,
    defaultProductImage: '/uploads/products/anr-p73-mens-crew-underscrub-main.jpg',
    images: JSON.stringify([
      '/uploads/products/anr-p73-mens-crew-underscrub-main.jpg',
      '/uploads/products/anr-p73-mens-crew-underscrub-spec.png'
    ]),
    shortDescription: 'Athletic crewneck compression-fit underscrub with odor-resistant silver-ion yarn and quick-dry breathability.',
    description: 'Athletic crewneck compression-fit underscrub with odor-resistant silver-ion yarn and quick-dry breathability designed for intensive surgical duties and long shifts.',
    colors: ['#64748B', '#1A175A', '#0F172A'],
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  },
  {
    name: 'ANR Unisex Performance Long Sleeve Underscrub',
    slug: 'anr-unisex-performance-long-sleeve-underscrub',
    categoryId: 16,
    subCategoryId: 11,
    sku: 'ANR-USCRUB-UNI-01',
    price: 699,
    comparePrice: 949,
    rating: 4.9,
    reviewCount: 310,
    isBestSeller: 1,
    isNewArrival: 0,
    isActive: 1,
    defaultProductImage: '/uploads/products/anr-p71-long-sleeve-underscrub-main.jpg',
    images: JSON.stringify([
      '/uploads/products/anr-p71-long-sleeve-underscrub-main.jpg',
      '/uploads/products/anr-p71-long-sleeve-underscrub-spec.jpg'
    ]),
    shortDescription: 'Micro-knit long-sleeve performance base layer underscrub engineered for cold hospital wards and OTs with thumbhole cuffs.',
    description: 'Micro-knit long-sleeve performance base layer underscrub engineered for cold hospital wards and operation theatres. Thumbhole cuffs prevent sleeve ride-up during sterile glove donning.',
    colors: ['#1A175A', '#0F172A', '#FFFFFF', '#64748B'],
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  },
  {
    name: "ANR Women's Seamless Thermal Performance Tee",
    slug: 'anr-womens-seamless-thermal-performance-tee',
    categoryId: 16,
    subCategoryId: 10,
    sku: 'ANR-USCRUB-WMN-04',
    price: 729,
    comparePrice: 999,
    rating: 4.8,
    reviewCount: 160,
    isBestSeller: 1,
    isNewArrival: 0,
    isActive: 1,
    defaultProductImage: '/uploads/products/anr-womens-underscrub.jpg',
    images: JSON.stringify([
      '/uploads/products/anr-womens-underscrub.jpg',
      '/uploads/products/anr-p72-womens-underscrub-spec.png'
    ]),
    shortDescription: 'Seamless moisture-wicking thermal underscrub tee tailored for female clinicians working in climate-controlled wards.',
    description: 'Seamless moisture-wicking thermal underscrub tee tailored for female clinicians working in climate-controlled wards and ICUs. Ultra-soft modal-cotton blend with anti-chafing flatlock stitch.',
    colors: ['#0F172A', '#1E40AF', '#FFFFFF'],
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  },

  // ── 4. Patient Gowns (Category 18) ──
  {
    name: 'ANR Hospital Inpatient Tie-Back Patient Gown',
    slug: 'anr-hospital-inpatient-tie-back-patient-gown',
    categoryId: 18,
    subCategoryId: 12,
    sku: 'ANR-PT-GOWN-01',
    price: 499,
    comparePrice: 699,
    rating: 4.9,
    reviewCount: 440,
    isBestSeller: 1,
    isNewArrival: 0,
    isActive: 1,
    defaultProductImage: '/uploads/products/37f696ac-926e-4022-921c-282d46ef57b1.png',
    images: JSON.stringify([
      '/uploads/products/37f696ac-926e-4022-921c-282d46ef57b1.png',
      '/uploads/products/anr-p74-patient-gown-spec.jpg'
    ]),
    shortDescription: 'Hygienic tie-back hospital inpatient gown with generous overlap modesty back, tear-resistant twill bindings, and 100% breathable cotton.',
    description: 'Hygienic tie-back hospital inpatient gown with generous overlap modesty back, tear-resistant twill bindings, and 100% breathable skin-friendly cotton.',
    colors: ['#60A5FA', '#0D9488', '#E2E8F0'],
    sizes: ['Regular', 'Large', 'XL']
  },
  {
    name: 'ANR Operation Theatre Surgical Patient Gown',
    slug: 'anr-operation-theatre-surgical-patient-gown',
    categoryId: 18,
    subCategoryId: 15,
    sku: 'ANR-PT-OT-03',
    price: 549,
    comparePrice: 749,
    rating: 4.8,
    reviewCount: 320,
    isBestSeller: 1,
    isNewArrival: 0,
    isActive: 1,
    defaultProductImage: '/uploads/products/d45c6320-95ce-4475-a478-7badcfc8f649.png',
    images: JSON.stringify([
      '/uploads/products/d45c6320-95ce-4475-a478-7badcfc8f649.png',
      '/uploads/products/anr-p76-ot-patient-gown-spec.png'
    ]),
    shortDescription: 'Pre-sterilization ready OT surgical patient gown with fluid-barrier chest and abdomen panel.',
    description: 'Pre-sterilization ready OT surgical patient gown with fluid-barrier chest and abdomen panel, raglan sleeve styling for fast IV access, and 60+ autoclave wash endurance.',
    colors: ['#15803D', '#1E40AF'],
    sizes: ['Regular', 'Large', 'XL']
  },
  {
    name: 'ANR Maternity & Nursing Patient Gown',
    slug: 'anr-maternity-pediatric-patient-gown',
    categoryId: 18,
    subCategoryId: 14,
    sku: 'ANR-PT-MAT-04',
    price: 529,
    comparePrice: 729,
    rating: 4.9,
    reviewCount: 380,
    isBestSeller: 1,
    isNewArrival: 0,
    isActive: 1,
    defaultProductImage: '/uploads/products/4bf83ec8-2b09-457c-b6fd-3cbaaaaebd8e.png',
    images: JSON.stringify([
      '/uploads/products/4bf83ec8-2b09-457c-b6fd-3cbaaaaebd8e.png',
      '/uploads/products/anr-p77-maternity-gown-spec.png'
    ]),
    shortDescription: 'Maternity and pediatric patient gown featuring front shoulder snap closures for nursing access.',
    description: 'Maternity and pediatric patient gown featuring front shoulder snap closures for nursing access, tagless comfort, and non-toxic skin-safe hospital dyes.',
    colors: ['#F472B6', '#60A5FA'],
    sizes: ['Regular', 'Large', 'XL']
  },
  {
    name: 'ANR Deluxe Overlap Dignity Patient Gown',
    slug: 'anr-deluxe-overlap-dignity-patient-gown',
    categoryId: 18,
    subCategoryId: 12,
    sku: 'ANR-PT-GOWN-05',
    price: 579,
    comparePrice: 799,
    rating: 4.9,
    reviewCount: 230,
    isBestSeller: 1,
    isNewArrival: 0,
    isActive: 1,
    defaultProductImage: '/uploads/products/anr-patient-gown-blue.jpg',
    images: JSON.stringify([
      '/uploads/products/anr-patient-gown-blue.jpg',
      '/uploads/products/anr-p74-patient-gown-spec.jpg'
    ]),
    shortDescription: 'Premium heavyweight cotton modesty patient gown with dual-side tie closures and telemetry pocket.',
    description: 'Premium heavyweight cotton modesty patient gown engineered for maximum dignity. Features dual-side tie closures, telemetry monitoring wire pass-through pocket, and reinforced neck bias tape.',
    colors: ['#60A5FA', '#1E40AF'],
    sizes: ['Regular', 'Large', 'XL']
  },

  // ── 5. Patient Pant & Shirt Sets (Category 19) ──
  {
    name: 'ANR Two-Piece Patient Pant & Shirt Set (Hospital Ward)',
    slug: 'anr-two-piece-patient-pant-shirt-set-hospital-ward',
    categoryId: 19,
    subCategoryId: 13,
    sku: 'ANR-PT-SET-02',
    price: 799,
    comparePrice: 1099,
    rating: 4.9,
    reviewCount: 380,
    isBestSeller: 1,
    isNewArrival: 0,
    isActive: 1,
    defaultProductImage: '/uploads/products/59131d68-563d-41b2-bbde-0e7aee5c65dc.png',
    images: JSON.stringify([
      '/uploads/products/59131d68-563d-41b2-bbde-0e7aee5c65dc.png',
      '/uploads/products/anr-p75-patient-pant-shirt-spec.png'
    ]),
    shortDescription: 'Two-piece dignified ward patient uniform featuring easy-snap front shirt and elasticated drawstring trousers.',
    description: 'Two-piece dignified ward patient uniform featuring easy-snap front shirt and elasticated drawstring trousers. Breathable, durable, and comfortable for extended hospital stays.',
    colors: ['#1E40AF', '#60A5FA', '#64748B'],
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  },
  {
    name: "ANR Men's Dignity Striped Inpatient Ward Uniform Set",
    slug: 'anr-mens-dignity-striped-inpatient-ward-uniform-set',
    categoryId: 19,
    subCategoryId: 18,
    sku: 'ANR-PT-SET-06',
    price: 849,
    comparePrice: 1149,
    rating: 4.8,
    reviewCount: 260,
    isBestSeller: 1,
    isNewArrival: 0,
    isActive: 1,
    defaultProductImage: '/uploads/products/anr-patient-pant-shirt-striped.png',
    images: JSON.stringify([
      '/uploads/products/anr-patient-pant-shirt-striped.png',
      '/uploads/products/anr-p75-patient-pant-shirt-spec.png'
    ]),
    shortDescription: 'Classic hospital pin-striped two-piece patient pyjama uniform set for clean ward identification and comfortable recovery.',
    description: 'Classic hospital pin-striped two-piece patient pyjama uniform set for clean ward identification. Built with heavy-duty bartacked seams and pre-shrunk colorfast cotton-poly weave.',
    colors: ['#60A5FA', '#E2E8F0'],
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  },
  {
    name: "ANR Women's Comfort Recovery Ward Uniform Set",
    slug: 'anr-womens-comfort-recovery-ward-uniform-set',
    categoryId: 19,
    subCategoryId: 13,
    sku: 'ANR-PT-SET-07',
    price: 829,
    comparePrice: 1129,
    rating: 4.9,
    reviewCount: 210,
    isBestSeller: 1,
    isNewArrival: 0,
    isActive: 1,
    defaultProductImage: '/uploads/products/anr-patient-pant-shirt-blue.jpg',
    images: JSON.stringify([
      '/uploads/products/anr-patient-pant-shirt-blue.jpg',
      '/uploads/products/anr-p75-patient-pant-shirt-spec.png'
    ]),
    shortDescription: 'Comfortable two-piece recovery ward uniform set tailored for female inpatients with elastic drawstring waistband.',
    description: 'Comfortable two-piece recovery ward uniform set tailored for female inpatients. Features a lightweight breathable tunic top with reinforced side pockets and soft cotton-rich pants.',
    colors: ['#60A5FA', '#1E40AF', '#831843'],
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  },
  {
    name: "ANR Men's Classic Cotton Inpatient Pajama Set",
    slug: 'anr-mens-classic-cotton-inpatient-pajama-set',
    categoryId: 19,
    subCategoryId: 13,
    sku: 'ANR-PT-SET-08',
    price: 789,
    comparePrice: 1079,
    rating: 4.8,
    reviewCount: 195,
    isBestSeller: 1,
    isNewArrival: 0,
    isActive: 1,
    defaultProductImage: '/uploads/products/anr-p75-patient-pant-shirt-main.jpg',
    images: JSON.stringify([
      '/uploads/products/anr-p75-patient-pant-shirt-main.jpg',
      '/uploads/products/anr-p75-patient-pant-shirt-spec.png'
    ]),
    shortDescription: 'Dignified 100% combed cotton patient sleep and recovery set designed for geriatric and long-term care wards.',
    description: 'Dignified 100% combed cotton patient sleep and recovery set designed for geriatric and long-term care wards. Features large front buttons for easy dressing and wide-leg trousers.',
    colors: ['#64748B', '#1E40AF', '#0F172A'],
    sizes: ['S', 'M', 'L', 'XL', '2XL']
  }
];

const COLOR_NAMES = {
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

async function seed() {
  console.log('Connecting to Local MySQL (anr_garments_db)...');
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'anr_garments_db'
  });

  console.log('Connected! Upserting 20 Products (4 per each of 5 categories)...');

  for (const p of PRODUCTS_20) {
    // Check if product exists by slug
    const [existing] = await conn.query('SELECT id FROM Products WHERE slug = ?', [p.slug]);
    let productId;

    if (existing.length > 0) {
      productId = existing[0].id;
      console.log(`Updating product ID ${productId}: ${p.name}`);
      await conn.query(
        `UPDATE Products SET 
          name = ?, categoryId = ?, subCategoryId = ?, sku = ?, price = ?, comparePrice = ?,
          rating = ?, reviewCount = ?, isBestSeller = ?, isNewArrival = ?, isActive = ?,
          defaultProductImage = ?, images = ?, shortDescription = ?, description = ?, updatedAt = NOW()
        WHERE id = ?`,
        [
          p.name, p.categoryId, p.subCategoryId, p.sku, p.price, p.comparePrice,
          p.rating, p.reviewCount, p.isBestSeller, p.isNewArrival, p.isActive,
          p.defaultProductImage, p.images, p.shortDescription, p.description, productId
        ]
      );
    } else {
      console.log(`Inserting product: ${p.name}`);
      const [result] = await conn.query(
        `INSERT INTO Products (
          name, slug, categoryId, subCategoryId, sku, price, comparePrice, currency, stock,
          rating, reviewCount, isBestSeller, isNewArrival, isFeatured, isActive,
          defaultProductImage, images, shortDescription, description, lowStockThreshold, gstRate,
          createdAt, updatedAt
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, 'INR', 300,
          ?, ?, ?, ?, 1, ?,
          ?, ?, ?, ?, 10, '0%',
          NOW(), NOW()
        )`,
        [
          p.name, p.slug, p.categoryId, p.subCategoryId, p.sku, p.price, p.comparePrice,
          p.rating, p.reviewCount, p.isBestSeller, p.isNewArrival, p.isActive,
          p.defaultProductImage, p.images, p.shortDescription, p.description
        ]
      );
      productId = result.insertId;
    }

    // Ensure variants exist for colors and sizes
    const [existingVariants] = await conn.query('SELECT id FROM ProductVariants WHERE productId = ?', [productId]);
    if (existingVariants.length === 0) {
      console.log(`  Creating variants for product ${productId}...`);
      for (const colorHex of p.colors) {
        const colorName = COLOR_NAMES[colorHex] || 'Standard';
        for (const size of p.sizes) {
          const varSku = `${p.sku}-${colorName.substring(0, 3).toUpperCase()}-${size}`;
          const attrs = JSON.stringify({ Color: colorName, Size: size });
          await conn.query(
            `INSERT INTO ProductVariants (
              productId, sku, price, mrp, stock, attributes, colorHex, image, lowStockThreshold, gstRate, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, 100, ?, ?, ?, 10, '0%', NOW(), NOW())`,
            [productId, varSku, p.price, p.comparePrice, attrs, colorHex, p.defaultProductImage]
          );
        }
      }
    }
  }

  // Remove any legacy misplaced product
  await conn.query("DELETE FROM Products WHERE slug = 'anr-mens-consultation-half-sleeve-apron' AND categoryId = 14");

  const [count] = await conn.query('SELECT categoryId, count(*) as cnt FROM Products GROUP BY categoryId');
  console.log('\nFinal product count per category in Local DB:');
  console.log(count);

  await conn.end();
  console.log('✅ Local Database updated successfully!');
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
