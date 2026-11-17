'use strict';
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { Product, ProductVariant, Category, SubCategory, sequelize } = require('../models');

const CATALOG_MAPPING = [
  // ── 1. Scrub suits for Men & Women ──────────────────────────────────────────
  {
    category: {
      name: 'Scrub suits for Men & Women',
      slug: 'scrub-suits',
      image: '/uploads/products/anr-p63-classic-scrub-main.jpg',
      description: 'Medical scrub suits designed for comfortable, practical shifts for men and women.',
    },
    subcategories: [
      {
        name: 'Classic Scrub Suits (Unisex)',
        slug: 'classic-scrub-suits-unisex',
        image: '/uploads/products/anr-p63-classic-scrub-main.jpg',
        description: 'Autoclavable medical-grade classic scrub suits for everyday shifts.',
        products: [
          {
            name: 'ANR Classic Unisex 5-Pocket Scrub Suit',
            slug: 'anr-classic-unisex-5-pocket-scrub-suit',
            sku: 'ANR-SCRUB-UNI-01',
            price: 1299,
            comparePrice: 1699,
            badge: 'Most Popular',
            mainImage: '/uploads/products/anr-p63-classic-scrub-main.jpg',
            specImage: '/uploads/products/anr-p63-classic-scrub-spec.jpg',
            shortDescription: 'Autoclavable medical-grade poly-cotton weave engineered for 14+ hour shifts with 5 deep utility pockets.',
            description: 'Autoclavable medical-grade poly-cotton weave engineered for 14+ hour shifts. Features 5 deep reinforced utility pockets for stethoscope, scissors & phone, with ergonomic side-slit hem for unrestricted mobility.',
            colors: ['#1E40AF', '#1A175A', '#0D9488', '#0F172A'],
            features: ['5 Deep Utility Pockets', 'Breathable & Sweat Absorbent', 'Side Slit Movement', 'Autoclavable 60+ Cycles'],
          },
        ],
      },
      {
        name: "Women's Tailored Scrub Suits",
        slug: 'womens-tailored-scrub-suits',
        image: '/uploads/products/anr-p64-womens-scrub-main.jpg',
        description: "Contoured princess-cut medical scrub suits tailored specifically for women.",
        products: [
          {
            name: "ANR Women's Tailored Contoured Scrub Suit",
            slug: 'anr-womens-tailored-contoured-scrub-suit',
            sku: 'ANR-SCRUB-WMN-02',
            price: 1399,
            comparePrice: 1849,
            badge: 'Doctor Choice',
            mainImage: '/uploads/products/anr-p64-womens-scrub-main.jpg',
            specImage: '/uploads/products/anr-p64-womens-scrub-spec.jpg',
            shortDescription: 'Contoured princess-cut medical scrub tailored specifically for female physicians, surgeons, and nurses.',
            description: 'Contoured princess-cut medical scrub tailored specifically for women practitioners. Fitted comfort with hidden zippered security pocket and silky soft hypoallergenic hand-feel.',
            colors: ['#60A5FA', '#1A175A', '#831843', '#0D9488'],
            features: ['Contoured Princess Seams', 'Hidden Zipper Security Pocket', 'Soft On Skin', 'Fade & Shrink Resistant'],
          },
        ],
      },
      {
        name: "Men's Cargo Scrub Suits",
        slug: 'mens-multi-pocket-cargo-scrubs',
        image: '/uploads/products/anr-p65-cargo-scrub-main.jpg',
        description: 'Tactical cargo scrub suits with reinforced utility pockets for high mobility.',
        products: [
          {
            name: "ANR Men's Multi-Pocket Cargo Scrub Set",
            slug: 'anr-mens-multi-pocket-cargo-scrub-set',
            sku: 'ANR-SCRUB-MEN-03',
            price: 1449,
            comparePrice: 1899,
            badge: 'High Mobility',
            mainImage: '/uploads/products/anr-p65-cargo-scrub-main.jpg',
            specImage: '/uploads/products/anr-p65-cargo-scrub-spec.jpg',
            shortDescription: 'Heavy-duty tactical medical cargo scrub set with 7 reinforced cargo pockets for emergency & surgical teams.',
            description: 'Heavy-duty tactical medical cargo scrub set with 7 reinforced cargo pockets, elasticated drawstring waistband, and high-mobility gusseting for emergency & surgical teams.',
            colors: ['#1A175A', '#15803D', '#64748B', '#1E40AF'],
            features: ['7 Reinforced Pockets', 'Elasticated Drawstring Waist', 'Autoclavable Weave', 'High-Mobility Gusset'],
          },
        ],
      },
      {
        name: 'OT & Surgical Scrub Suits',
        slug: 'ot-surgical-scrub-suits',
        image: '/uploads/products/anr-p66-ot-scrub-main.jpg',
        description: 'Certified Operation Theatre surgical scrub suits with anti-glare finish.',
        products: [
          {
            name: 'ANR Operation Theatre (OT) Surgical Scrub Set',
            slug: 'anr-operation-theatre-ot-surgical-scrub-set',
            sku: 'ANR-SCRUB-OT-04',
            price: 1199,
            comparePrice: 1599,
            badge: 'OT Certified',
            mainImage: '/uploads/products/anr-p66-ot-scrub-main.jpg',
            specImage: '/uploads/products/anr-p66-ot-scrub-spec.jpg',
            shortDescription: 'Sterile Operation Theatre scrub suit certified for surgical suites with anti-glare OT Green/Blue dye.',
            description: 'Sterile Operation Theatre scrub suit certified for surgical suites. Anti-glare OT Green/Blue dye, fluid splash repellent finish, and autoclaving endurance exceeding 60+ cycles.',
            colors: ['#15803D', '#60A5FA', '#1A175A'],
            features: ['Fade & Shrink Proof', 'Anti-Glare OT Dye', 'Autoclavable 60+ Cycles', 'Fluid Splash Protection'],
          },
        ],
      },
    ],
  },

  // ── 2. Aprons for Men & Women ───────────────────────────────────────────────
  {
    category: {
      name: 'Aprons for Men & Women',
      slug: 'aprons-lab-coats',
      image: '/uploads/products/anr-p67-lab-coat-main.jpg',
      description: 'Doctor aprons and lab coats for clinical, consultation, and laboratory use.',
    },
    subcategories: [
      {
        name: "Doctor Full-Length Lab Coats",
        slug: 'doctor-full-length-lab-coats',
        image: '/uploads/products/anr-p67-lab-coat-main.jpg',
        description: 'Senior consultant full-length consultation lab coats with structured notch lapels.',
        products: [
          {
            name: "ANR Doctor's Full-Length Consultation Lab Coat",
            slug: 'anr-doctors-full-length-consultation-lab-coat',
            sku: 'ANR-APRON-DOC-01',
            price: 1399,
            comparePrice: 1799,
            badge: 'Senior Consultant',
            mainImage: '/uploads/products/anr-p67-lab-coat-main.jpg',
            specImage: '/uploads/products/anr-p67-lab-coat-spec.jpg',
            shortDescription: 'Senior consultant full-length consultation lab coat with structured notch lapels, padded tablet pocket, and stethoscope loop.',
            description: 'Senior consultant full-length consultation lab coat with structured notch lapels, padded tablet pocket, stethoscope loop, and pre-shrunk cotton-rich twill that stays crisp all day.',
            colors: ['#FFFFFF'],
            features: ['Notch Lapel Collar', 'Tablet & Stethoscope Pockets', 'Pre-Shrunk Cotton-Poly', 'Side Access Slits'],
          },
        ],
      },
      {
        name: 'Consultation Half-Sleeve Aprons',
        slug: 'consultation-half-sleeve-aprons',
        image: '/uploads/products/anr-p68-half-sleeve-apron-main.jpg',
        description: 'Ergonomic half-sleeve clinical examination coats with rear movement vents.',
        products: [
          {
            name: 'ANR Medical Consultation Half-Sleeve Apron',
            slug: 'anr-medical-consultation-half-sleeve-apron',
            sku: 'ANR-APRON-HLF-02',
            price: 899,
            comparePrice: 1199,
            badge: 'Daily Clinical Wear',
            mainImage: '/uploads/products/anr-p68-half-sleeve-apron-main.jpg',
            specImage: '/uploads/products/anr-p68-half-sleeve-apron-spec.png',
            shortDescription: 'Ergonomic half-sleeve clinical examination coat with rear movement vent and dual chest pen slots.',
            description: 'Ergonomic half-sleeve clinical examination coat with rear movement vent, dual chest pen slot, and nanotechnology stain-release barrier against medical fluids.',
            colors: ['#FFFFFF'],
            features: ['Ergonomic Back Vent', 'Chest Pen Slot', 'Stain Release Nanotech', 'Bleach-Safe Weave'],
          },
        ],
      },
      {
        name: "Women's Fitted Doctor Aprons",
        slug: 'womens-fitted-doctor-aprons',
        image: '/uploads/products/anr-p69-womens-doctor-apron-main.jpg',
        description: 'Tailored slim-cut doctor aprons with waist-defining contouring.',
        products: [
          {
            name: "ANR Women's Fitted Slim-Cut Doctor Apron",
            slug: 'anr-womens-fitted-slim-cut-doctor-apron',
            sku: 'ANR-APRON-WMN-03',
            price: 1449,
            comparePrice: 1899,
            badge: 'Tailored Cut',
            mainImage: '/uploads/products/anr-p69-womens-doctor-apron-main.jpg',
            specImage: '/uploads/products/anr-p69-womens-doctor-apron-spec.png',
            shortDescription: 'Tailored slim-cut doctor apron with structured styling and non-yellowing bright white clinical weave.',
            description: 'Tailored slim-cut doctor apron with structured styling, non-yellowing bright white clinical weave resistant to repeated laundering, and deep utility pockets.',
            colors: ['#FFFFFF'],
            features: ['Smooth Non-Yellowing Fabric', 'Concealed Placket Closure', 'Deep Pen & Tablet Pockets', 'Tailored Silhouette'],
          },
        ],
      },
      {
        name: 'Executive Lab & Tech Aprons',
        slug: 'executive-lab-tech-aprons',
        image: '/uploads/products/anr-p67-lab-coat-main.jpg',
        description: 'Heavy-duty lab coats designed for diagnostic labs and pathology.',
        products: [
          {
            name: "ANR Men's Executive Heavy-Duty Lab Apron",
            slug: 'anr-mens-executive-heavy-duty-lab-apron',
            sku: 'ANR-APRON-EXC-04',
            price: 1299,
            comparePrice: 1699,
            badge: 'Reinforced Seams',
            mainImage: '/uploads/products/anr-p67-lab-coat-main.jpg',
            specImage: '/uploads/products/anr-p67-lab-coat-spec.jpg',
            shortDescription: 'Heavy-duty executive lab coat designed for diagnostic labs and pathology with acid/chemical splash resistance.',
            description: 'Heavy-duty executive lab coat designed for diagnostic labs and pathology. Features acid/chemical splash resistance, shatterproof buttons, and side pants-pocket pass-through slits.',
            colors: ['#FFFFFF'],
            features: ['Chemical Splash Resistant', 'Unbreakable Buttons', 'Side Access Slits', 'Reinforced Pocket Corners'],
          },
        ],
      },
    ],
  },

  // ── 3. Underscrubs for Men & Women ──────────────────────────────────────────
  {
    category: {
      name: 'Underscrubs for Men & Women',
      slug: 'underscrubs',
      image: '/uploads/products/anr-p71-long-sleeve-underscrub-main.jpg',
      description: 'Soft, breathable base layers made to wear under medical scrubs.',
    },
    subcategories: [
      {
        name: 'Performance Long Sleeve Underscrubs',
        slug: 'performance-long-sleeve-underscrubs',
        image: '/uploads/products/anr-p71-long-sleeve-underscrub-main.jpg',
        description: 'Micro-knit long-sleeve performance base layer underscrubs engineered for cold hospital wards.',
        products: [
          {
            name: 'ANR Unisex Performance Long Sleeve Underscrub',
            slug: 'anr-unisex-performance-long-sleeve-underscrub',
            sku: 'ANR-USCRUB-UNI-01',
            price: 699,
            comparePrice: 949,
            badge: 'Thermal Comfort',
            mainImage: '/uploads/products/anr-p71-long-sleeve-underscrub-main.jpg',
            specImage: '/uploads/products/anr-p71-long-sleeve-underscrub-spec.jpg',
            shortDescription: 'Micro-knit long-sleeve performance base layer underscrub engineered for cold hospital wards and OTs with thumbhole cuffs.',
            description: 'Micro-knit long-sleeve performance base layer underscrub engineered for cold hospital wards and operation theatres. Thumbhole cuffs prevent sleeve ride-up during glove donning.',
            colors: ['#1A175A', '#0F172A', '#FFFFFF', '#64748B'],
            features: ['Ultra-Breathable Micro-Knit', 'Thumb-Hole Cuffs', 'Flatlock Anti-Chafe Seams', 'Odor Control'],
          },
        ],
      },
      {
        name: "Women's Cooling Moisture-Wicking",
        slug: 'womens-cooling-moisture-wicking',
        image: '/uploads/products/anr-p72-womens-underscrub-main.jpg',
        description: 'Ultra-soft 4-way stretch poly-spandex underscrubs with active evaporative cooling.',
        products: [
          {
            name: "ANR Women's Cooling Moisture-Wicking Base Layer",
            slug: 'anr-womens-cooling-moisture-wicking-base-layer',
            sku: 'ANR-USCRUB-WMN-02',
            price: 749,
            comparePrice: 1049,
            badge: 'Cooling Tech',
            mainImage: '/uploads/products/anr-p72-womens-underscrub-main.jpg',
            specImage: '/uploads/products/anr-p72-womens-underscrub-spec.png',
            shortDescription: 'Ultra-soft 4-way stretch poly-spandex underscrub with active evaporative cooling and silky inner finish.',
            description: 'Ultra-soft 4-way stretch poly-spandex underscrub with active evaporative cooling and silky inner finish designed to prevent skin irritation under protective PPE.',
            colors: ['#0F172A', '#1E40AF', '#FFFFFF'],
            features: ['Temperature Regulating', '4-Way Spandex Stretch', 'Soft Next to Skin', 'Active Cooling Mesh'],
          },
        ],
      },
      {
        name: "Men's Athletic Fit Crew Underscrubs",
        slug: 'mens-athletic-fit-crew-underscrubs',
        image: '/uploads/products/anr-p73-mens-crew-underscrub-main.jpg',
        description: 'Athletic crewneck compression-fit underscrubs with silver-ion yarn.',
        products: [
          {
            name: "ANR Men's Athletic Fit Crew Underscrub Tee",
            slug: 'anr-mens-athletic-fit-crew-underscrub-tee',
            sku: 'ANR-USCRUB-MEN-03',
            price: 649,
            comparePrice: 899,
            badge: 'OT Duty',
            mainImage: '/uploads/products/anr-p73-mens-crew-underscrub-main.jpg',
            specImage: '/uploads/products/anr-p73-mens-crew-underscrub-spec.png',
            shortDescription: 'Athletic crewneck compression-fit underscrub with odor-resistant silver-ion yarn and quick-dry breathability.',
            description: 'Athletic crewneck compression-fit underscrub with odor-resistant silver-ion yarn and quick-dry breathability designed for intensive surgical duties.',
            colors: ['#64748B', '#1A175A', '#0F172A'],
            features: ['Quick-Dry Poly-Spandex', 'Antimicrobial Treatment', 'Tagless Collar', 'Tuck-Stay Hem'],
          },
        ],
      },
    ],
  },

  // ── 4. Patient Gown ────────────────────────────────────────────────────────
  {
    category: {
      name: 'Patient Gown',
      slug: 'patient-gown',
      image: '/uploads/products/anr-p74-patient-gown-main.jpg',
      description: 'Comfortable hospital gowns for patient care, maternity, and OT use.',
    },
    subcategories: [
      {
        name: 'Hospital Patient Gowns (Tie-Back)',
        slug: 'hospital-patient-gowns-tie-back',
        image: '/uploads/products/anr-p74-patient-gown-main.jpg',
        description: 'Hygienic tie-back hospital inpatient gowns with generous overlap modesty back.',
        products: [
          {
            name: 'ANR Hospital Inpatient Tie-Back Patient Gown',
            slug: 'anr-hospital-inpatient-tie-back-patient-gown',
            sku: 'ANR-PT-GOWN-01',
            price: 499,
            comparePrice: 699,
            badge: 'Patient Dignity',
            mainImage: '/uploads/products/anr-p74-patient-gown-main.jpg',
            specImage: '/uploads/products/anr-p74-patient-gown-spec.jpg',
            shortDescription: 'Hygienic tie-back hospital inpatient gown with generous overlap modesty back, tear-resistant twill bindings, and 100% breathable cotton.',
            description: 'Hygienic tie-back hospital inpatient gown with generous overlap modesty back, tear-resistant twill bindings, and 100% breathable skin-friendly cotton.',
            colors: ['#60A5FA', '#0D9488', '#E2E8F0'],
            features: ['Full Overlap Modesty Back', 'Heavy-Duty Cotton Twill Ties', 'Soft Hypoallergenic Fabric', 'Autoclavable 60+ Washes'],
          },
        ],
      },
      {
        name: 'OT Surgical Patient Gowns',
        slug: 'autoclavable-ot-green-drapes',
        image: '/uploads/products/anr-p76-ot-patient-gown-main.jpg',
        description: 'Fluid-barrier surgical patient gowns ready for pre-sterilization.',
        products: [
          {
            name: 'ANR Operation Theatre Surgical Patient Gown',
            slug: 'anr-operation-theatre-surgical-patient-gown',
            sku: 'ANR-PT-OT-03',
            price: 549,
            comparePrice: 749,
            badge: 'Sterile Surgery',
            mainImage: '/uploads/products/anr-p76-ot-patient-gown-main.jpg',
            specImage: '/uploads/products/anr-p76-ot-patient-gown-spec.png',
            shortDescription: 'Pre-sterilization ready OT surgical patient gown with fluid-barrier chest and abdomen panel.',
            description: 'Pre-sterilization ready OT surgical patient gown with fluid-barrier chest and abdomen panel, raglan sleeve styling for fast IV access, and 60+ autoclave wash endurance.',
            colors: ['#15803D', '#1E40AF'],
            features: ['Fluid Repellent Finish', 'Raglan Sleeves For IV Access', 'Autoclavable 60+ Cycles', 'Colorfast OT Green'],
          },
        ],
      },
      {
        name: 'OT & Maternity Patient Gowns',
        slug: 'ot-maternity-patient-gowns',
        image: '/uploads/products/anr-p77-maternity-gown-main.jpg',
        description: 'Maternity and pediatric patient gowns featuring front shoulder snap closures.',
        products: [
          {
            name: 'ANR Maternity & Nursing Patient Gown',
            slug: 'anr-maternity-pediatric-patient-gown',
            sku: 'ANR-PT-MAT-04',
            price: 529,
            comparePrice: 729,
            badge: 'Easy Access',
            mainImage: '/uploads/products/anr-p77-maternity-gown-main.jpg',
            specImage: '/uploads/products/anr-p77-maternity-gown-spec.png',
            shortDescription: 'Maternity and pediatric patient gown featuring front shoulder snap closures for nursing access.',
            description: 'Maternity and pediatric patient gown featuring front shoulder snap closures for nursing access, tagless comfort, and non-toxic skin-safe hospital dyes.',
            colors: ['#F472B6', '#60A5FA'],
            features: ['Front Shoulder Snaps for Nursing', '100% Breathable Combed Cotton', 'Non-Toxic Skin-Safe Dyes', 'Fetal Monitor Access'],
          },
        ],
      },
    ],
  },

  // ── 5. Patient Pant & Shirt ────────────────────────────────────────────────
  {
    category: {
      name: 'Patient Pant & Shirt',
      slug: 'patient-pant-shirt',
      image: '/uploads/products/anr-p75-patient-pant-shirt-main.jpg',
      description: 'Comfortable two-piece patient clothing for hospital wards and inpatient care.',
    },
    subcategories: [
      {
        name: 'Two-Piece Patient Pant & Shirt Sets',
        slug: 'two-piece-patient-pant-shirt-sets',
        image: '/uploads/products/anr-p75-patient-pant-shirt-main.jpg',
        description: 'Two-piece dignified ward patient uniform featuring easy-snap front shirt and elasticated trousers.',
        products: [
          {
            name: 'ANR Two-Piece Patient Pant & Shirt Set (Hospital Ward)',
            slug: 'anr-two-piece-patient-pant-shirt-set-hospital-ward',
            sku: 'ANR-PT-SET-02',
            price: 799,
            comparePrice: 1099,
            badge: 'Inpatient Uniform',
            mainImage: '/uploads/products/anr-p75-patient-pant-shirt-main.jpg',
            specImage: '/uploads/products/anr-p75-patient-pant-shirt-spec.png',
            shortDescription: 'Two-piece dignified ward patient uniform featuring easy-snap front shirt and elasticated drawstring trousers.',
            description: 'Two-piece dignified ward patient uniform featuring easy-snap front shirt and elasticated drawstring trousers. Breathable, durable, and comfortable for extended hospital stays.',
            colors: ['#1E40AF', '#60A5FA', '#64748B'],
            features: ['Front Button / Snap Closure Shirt', 'Elastic Drawstring Pant', 'Breathable Long-Wear Cotton', 'Generous Inpatient Fit'],
          },
        ],
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

const SIZES = ['S', 'M', 'L', 'XL', '2XL'];

async function runMapping() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // Remove duplicates or legacy entries
    await Product.destroy({ where: { slug: ['anr-mens-classic-4-pocket-scrub-suit', 'anr-multi-pocket-tactical-cargo-scrub-set', 'anr-mens-full-length-doctor-consultation-coat', 'anr-dignity-striped-inpatient-ward-uniform-set'] } });
    await SubCategory.update({ isActive: false }, { where: { slug: ['inpatient-striped-patient-uniforms', 'hospital-ward-fitted-bed-sheets', 'patient-privacy-curtains'] } });
    await Category.update({ isActive: false }, { where: { slug: 'patient-wear' } });

    for (let catIdx = 0; catIdx < CATALOG_MAPPING.length; catIdx++) {
      const catData = CATALOG_MAPPING[catIdx];
      
      const [category] = await Category.findOrCreate({
        where: { slug: catData.category.slug },
        defaults: {
          name: catData.category.name,
          slug: catData.category.slug,
          description: catData.category.description,
          image: catData.category.image,
          sortOrder: catIdx + 1,
          isActive: true,
          showHeader: true,
        },
      });

      await category.update({
        name: catData.category.name,
        description: catData.category.description,
        image: catData.category.image,
        sortOrder: catIdx + 1,
        isActive: true,
        showHeader: true,
      });

      for (let subIdx = 0; subIdx < catData.subcategories.length; subIdx++) {
        const subData = catData.subcategories[subIdx];

        const [subcategory] = await SubCategory.findOrCreate({
          where: { slug: subData.slug },
          defaults: {
            categoryId: category.id,
            name: subData.name,
            slug: subData.slug,
            description: subData.description,
            image: subData.image,
            sortOrder: subIdx + 1,
            isActive: true,
          },
        });

        await subcategory.update({
          categoryId: category.id,
          name: subData.name,
          description: subData.description,
          image: subData.image,
          sortOrder: subIdx + 1,
          isActive: true,
        });

        for (const prodData of subData.products) {
          const productPayload = {
            name: prodData.name,
            slug: prodData.slug,
            sku: prodData.sku,
            price: prodData.price,
            comparePrice: prodData.comparePrice,
            currency: 'INR',
            stock: 120,
            categoryId: category.id,
            subCategoryId: subcategory.id,
            defaultProductImage: prodData.mainImage,
            images: [prodData.mainImage, prodData.specImage],
            shortDescription: prodData.shortDescription,
            description: prodData.description,
            rating: 4.9,
            reviewCount: 380,
            isFeatured: true,
            isBestSeller: true,
            isNewArrival: false,
            isActive: true,
            tags: prodData.features,
            attributes: {
              badge: prodData.badge,
              colors: prodData.colors,
              features: prodData.features,
            },
          };

          let [product] = await Product.findOrCreate({
            where: { slug: prodData.slug },
            defaults: productPayload,
          });

          await product.update(productPayload);
          console.log(`Updated Product: ${product.name} (ID: ${product.id})`);
          console.log(`   -> Main: ${prodData.mainImage}`);
          console.log(`   -> Spec (Hover): ${prodData.specImage}`);

          // Seed variants
          for (const hex of prodData.colors) {
            const colorName = COLOR_NAMES_MAP[hex] || 'Color';
            for (const size of SIZES) {
              const vSku = `${product.sku}-${colorName.substring(0, 3).toUpperCase()}-${size}`;
              const [variant] = await ProductVariant.findOrCreate({
                where: { sku: vSku },
                defaults: {
                  productId: product.id,
                  sku: vSku,
                  price: product.price,
                  mrp: product.comparePrice,
                  stock: 30,
                  colorHex: hex,
                  image: prodData.mainImage,
                  images: [prodData.mainImage, prodData.specImage],
                  attributes: { Color: colorName, Size: size },
                },
              });

              await variant.update({
                productId: product.id,
                price: product.price,
                mrp: product.comparePrice,
                colorHex: hex,
                image: prodData.mainImage,
                images: [prodData.mainImage, prodData.specImage],
                attributes: { Color: colorName, Size: size },
              });
            }
          }
        }
      }
    }

    console.log('\nAll categories, subcategories, products and hover spec images mapped successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Mapping error:', err);
    process.exit(1);
  }
}

runMapping();
