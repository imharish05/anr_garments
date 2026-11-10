'use strict';
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { Product, ProductVariant, Category, SubCategory, sequelize } = require('../models');

const COLOR_NAMES_MAP = {
  '#1E40AF': 'Royal Blue',
  '#1A175A': 'Navy Blue',
  '#0F766E': 'Teal Green',
  '#0F172A': 'Midnight Charcoal',
  '#3B82F6': 'Ceil Blue',
  '#6B1D2F': 'Burgundy / Wine',
  '#1C4E3D': 'OT Hunter Green',
  '#475569': 'Slate Grey',
  '#FFFFFF': 'Clinical White',
  '#E2E8F0': 'Pastel Grey',
  '#EC4899': 'Maternity Pink',
  '#60A5FA': 'Sky Blue',
};

const PRODUCTS_MASTER = [
  // ── Scrub Suits (Category: scrub-suits) ──────────────────────────────────
  {
    categorySlug: 'scrub-suits',
    subCategorySlug: 'classic-scrub-suits-unisex',
    name: 'ANR Classic Unisex 5-Pocket Scrub Suit',
    slug: 'anr-classic-unisex-5-pocket-scrub-suit',
    sku: 'ANR-SCRUB-UNI-01',
    price: 1299,
    comparePrice: 1699,
    rating: 4.9,
    reviewCount: 580,
    badge: 'Most Popular',
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    stock: 120,
    colors: ['#1E40AF', '#1A175A', '#0F766E', '#0F172A'],
    defaultProductImage: '/anr-hero-banner.jpg',
    images: ['/anr-hero-banner.jpg', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'],
    shortDescription: 'Autoclavable medical-grade poly-cotton weave engineered for 14+ hour shifts.',
    description: 'Autoclavable medical-grade poly-cotton weave engineered for 14+ hour shifts. Features 5 deep reinforced utility pockets for stethoscope, scissors & phone, with ergonomic side-slit hem for unrestricted mobility.',
    features: ['5 Deep Utility Pockets', 'Breathable & Sweat Absorbent', 'Side Slit Movement']
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
    reviewCount: 412,
    badge: 'Doctor Choice',
    isBestSeller: false,
    isFeatured: true,
    isNewArrival: true,
    stock: 90,
    colors: ['#3B82F6', '#1A175A', '#6B1D2F', '#0F766E'],
    defaultProductImage: 'https://images.unsplash.com/photo-1594824813633-82421bd97354?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1594824813633-82421bd97354?auto=format&fit=crop&w=800&q=80', '/anr-hero-banner.jpg'],
    shortDescription: 'Contoured princess-cut medical scrub tailored specifically for women healthcare practitioners.',
    description: 'Contoured princess-cut medical scrub tailored specifically for women practitioners. Fitted comfort with hidden zippered security pocket and silky soft hypoallergenic hand-feel.',
    features: ['Contoured Fit', 'Hidden Zipper Security Pocket', 'Soft On Skin']
  },
  {
    categorySlug: 'scrub-suits',
    subCategorySlug: 'mens-multi-pocket-cargo-scrubs',
    name: "ANR Men's Multi-Pocket Cargo Scrub Set",
    slug: 'anr-mens-multi-pocket-cargo-scrub-set',
    sku: 'ANR-SCRUB-MEN-03',
    price: 1449,
    comparePrice: 1899,
    rating: 4.8,
    reviewCount: 388,
    badge: 'High Mobility',
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    stock: 85,
    colors: ['#1A175A', '#1C4E3D', '#475569', '#1E40AF'],
    defaultProductImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80', '/anr-hero-banner.jpg'],
    shortDescription: 'Heavy-duty tactical medical cargo scrub set with 7 reinforced cargo pockets.',
    description: 'Heavy-duty tactical medical cargo scrub set with 7 reinforced cargo pockets, elasticated drawstring waistband, and high-mobility gusseting for emergency & surgical teams.',
    features: ['7 Reinforced Pockets', 'Elasticated Drawstring Waist', 'Autoclavable Weave']
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
    colors: ['#1C4E3D', '#3B82F6', '#1A175A'],
    defaultProductImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80', '/anr-hero-banner.jpg'],
    shortDescription: 'Sterile Operation Theatre scrub suit certified for surgical suites.',
    description: 'Sterile Operation Theatre scrub suit certified for surgical suites. Anti-glare OT Green/Blue dye, fluid splash repellent finish, and autoclaving endurance exceeding 60+ cycles.',
    features: ['Fade & Shrink Proof', 'Anti-Glare OT Dye', 'Autoclavable 60+ Cycles']
  },

  // ── Aprons & Lab Coats (Category: aprons-lab-coats) ────────────────────────
  {
    categorySlug: 'aprons-lab-coats',
    subCategorySlug: 'doctor-full-length-lab-coats',
    name: "ANR Doctor's Full-Length Consultation Lab Coat",
    slug: 'anr-doctors-full-length-consultation-lab-coat',
    sku: 'ANR-APRON-DOC-01',
    price: 1399,
    comparePrice: 1799,
    rating: 5.0,
    reviewCount: 620,
    badge: 'Senior Consultant',
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    stock: 100,
    colors: ['#FFFFFF'],
    defaultProductImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80'],
    shortDescription: 'Senior consultant full-length consultation lab coat with structured notch lapels.',
    description: 'Senior consultant full-length consultation lab coat with structured notch lapels, padded tablet pocket, stethoscope loop, and pre-shrunk cotton-rich twill that stays crisp all day.',
    features: ['Notch Lapel Collar', 'Tablet & Stethoscope Pockets', 'Pre-Shrunk Cotton-Poly']
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
    stock: 110,
    colors: ['#FFFFFF'],
    defaultProductImage: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80'],
    shortDescription: 'Ergonomic half-sleeve clinical examination coat with rear movement vent.',
    description: 'Ergonomic half-sleeve clinical examination coat with rear movement vent, dual chest pen slot, and nanotechnology stain-release barrier against medical fluids.',
    features: ['Ergonomic Back Vent', 'Chest Pen Slot', 'Stain Release Nanotech']
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
    isBestSeller: false,
    isFeatured: true,
    isNewArrival: true,
    stock: 75,
    colors: ['#FFFFFF'],
    defaultProductImage: 'https://images.unsplash.com/photo-1594824813633-82421bd97354?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1594824813633-82421bd97354?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80'],
    shortDescription: 'Tailored slim-cut doctor apron with non-yellowing bright white clinical weave.',
    description: 'Tailored slim-cut doctor apron with structured styling, non-yellowing bright white clinical weave resistant to repeated laundering, and deep utility pockets.',
    features: ['Smooth Non-Yellowing Fabric', 'Concealed Placket Closure', 'Deep Pen & Tablet Pockets']
  },
  {
    categorySlug: 'aprons-lab-coats',
    subCategorySlug: 'executive-lab-tech-aprons',
    name: "ANR Men's Executive Heavy-Duty Lab Apron",
    slug: 'anr-mens-executive-heavy-duty-lab-apron',
    sku: 'ANR-APRON-EXC-04',
    price: 1299,
    comparePrice: 1699,
    rating: 4.8,
    reviewCount: 275,
    badge: 'Reinforced Seams',
    isBestSeller: false,
    isFeatured: false,
    isNewArrival: false,
    stock: 65,
    colors: ['#FFFFFF'],
    defaultProductImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80'],
    shortDescription: 'Heavy-duty executive lab coat designed for diagnostic labs and pathology.',
    description: 'Heavy-duty executive lab coat designed for diagnostic labs and pathology. Features acid/chemical splash resistance, shatterproof buttons, and side pants-pocket pass-through slits.',
    features: ['Chemical Splash Resistant', 'Unbreakable Buttons', 'Side Access Slits']
  },

  // ── Underscrubs (Category: underscrubs) ───────────────────────────────────
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
    colors: ['#1A175A', '#0F172A', '#FFFFFF', '#475569'],
    defaultProductImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1594824813633-82421bd97354?auto=format&fit=crop&w=800&q=80'],
    shortDescription: 'Micro-knit long-sleeve performance base layer underscrub engineered for cold hospital wards.',
    description: 'Micro-knit long-sleeve performance base layer underscrub engineered for cold hospital wards and operation theatres. Thumbhole cuffs prevent sleeve ride-up during glove donning.',
    features: ['Ultra-Breathable Micro-Knit', 'Thumb-Hole Cuffs', 'Flatlock Anti-Chafe Seams']
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
    colors: ['#1E40AF', '#0F172A', '#FFFFFF'],
    defaultProductImage: 'https://images.unsplash.com/photo-1594824813633-82421bd97354?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1594824813633-82421bd97354?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'],
    shortDescription: 'Ultra-soft 4-way stretch poly-spandex underscrub with active evaporative cooling.',
    description: 'Ultra-soft 4-way stretch poly-spandex underscrub with active evaporative cooling and silky inner finish designed to prevent skin irritation under protective PPE.',
    features: ['Temperature Regulating', '4-Way Spandex Stretch', 'Soft Next to Skin']
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
    colors: ['#1A175A', '#475569', '#0F172A'],
    defaultProductImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'],
    shortDescription: 'Athletic crewneck compression-fit underscrub with odor-resistant silver-ion yarn.',
    description: 'Athletic crewneck compression-fit underscrub with odor-resistant silver-ion yarn and quick-dry breathability designed for intensive surgical duties.',
    features: ['Quick-Dry Poly-Spandex', 'Antimicrobial Treatment', 'Tagless Collar']
  },

  // ── Patient Gowns & Wear (Categories: patient-gown & patient-pant-shirt) ──
  {
    categorySlug: 'patient-gown',
    subCategorySlug: 'hospital-patient-gowns-tie-back',
    name: 'ANR Hospital Inpatient Patient Gown (Tie-Back)',
    slug: 'anr-hospital-inpatient-patient-gown-tie-back',
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
    colors: ['#3B82F6', '#0F766E', '#E2E8F0'],
    defaultProductImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'],
    shortDescription: 'Hygienic tie-back hospital inpatient gown with generous overlap modesty back.',
    description: 'Hygienic tie-back hospital inpatient gown with generous overlap modesty back, tear-resistant twill bindings, and 100% breathable skin-friendly cotton.',
    features: ['Full Overlap Modesty Back', 'Heavy-Duty Cotton Twill Ties', 'Soft Hypoallergenic Fabric']
  },
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
    colors: ['#1E40AF', '#3B82F6', '#475569'],
    defaultProductImage: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80'],
    shortDescription: 'Two-piece dignified ward patient uniform featuring easy-snap front shirt and elasticated trousers.',
    description: 'Two-piece dignified ward patient uniform featuring easy-snap front shirt and elasticated drawstring trousers. Breathable, durable, and comfortable for extended hospital stays.',
    features: ['Front Button / Snap Closure Shirt', 'Elastic Drawstring Pant', 'Breathable Long-Wear Cotton']
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
    colors: ['#0F766E', '#1E40AF'],
    defaultProductImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'],
    shortDescription: 'Pre-sterilization ready OT surgical patient gown with fluid-barrier chest and abdomen panel.',
    description: 'Pre-sterilization ready OT surgical patient gown with fluid-barrier chest and abdomen panel, raglan sleeve styling for fast IV access, and 60+ autoclave wash endurance.',
    features: ['Fluid Repellent Finish', 'Raglan Sleeves For IV Access', 'Autoclavable 60+ Cycles']
  },
  {
    categorySlug: 'patient-gown',
    subCategorySlug: 'ot-maternity-patient-gowns',
    name: 'ANR Maternity & Pediatric Patient Gown',
    slug: 'anr-maternity-pediatric-patient-gown',
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
    colors: ['#EC4899', '#3B82F6'],
    defaultProductImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80'],
    shortDescription: 'Maternity and pediatric patient gown featuring front shoulder snap closures for nursing access.',
    description: 'Maternity and pediatric patient gown featuring front shoulder snap closures for nursing access, tagless comfort, and non-toxic skin-safe hospital dyes.',
    features: ['Front Shoulder Snaps for Nursing', '100% Breathable Combed Cotton', 'Non-Toxic Skin-Safe Dyes']
  }
];

const SIZES = ['S', 'M', 'L', 'XL', '2XL'];

async function seedProducts() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    const categories = await Category.findAll();
    const subCategories = await SubCategory.findAll();

    const catMap = {};
    categories.forEach(c => { catMap[c.slug] = c.id; });

    const subMap = {};
    subCategories.forEach(s => { subMap[s.slug] = s.id; });

    console.log(`Found ${categories.length} categories, ${subCategories.length} subcategories.`);

    for (const item of PRODUCTS_MASTER) {
      const categoryId = catMap[item.categorySlug] || categories[0]?.id;
      let subCategoryId = subMap[item.subCategorySlug];
      if (!subCategoryId) {
        // Fallback to first subcategory matching categoryId
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
          features: item.features
        }
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
            stock: 25,
            colorHex: hex.startsWith('#') && hex.length === 7 ? hex : null,
            image: product.defaultProductImage,
            images: product.images,
            attributes: {
              Color: colorName,
              Size: size
            }
          };

          if (existingVariant) {
            await existingVariant.update(variantData);
          } else {
            await ProductVariant.create(variantData);
          }
        }
      }
    }

    console.log('\nAll 15 ANR Hospital Garment Products and variants seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seedProducts();
