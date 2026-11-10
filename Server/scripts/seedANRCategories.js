'use strict';
require('dotenv').config();
const { Category, SubCategory } = require('../models');

const slugify = (text, prefix = '') => {
  let str = (prefix ? `${prefix}-` : '') + text;
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const anrCategories = [
  {
    name: 'Scrub Suits',
    slug: 'scrub-suits',
    description: 'Functional, comfortable, durable medical scrubs made for hospital shifts.',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=700&q=80',
    sortOrder: 1,
    subcategories: [
      { name: 'Classic Scrub Suits (Unisex)', slug: 'classic-scrub-suits-unisex', image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80', sortOrder: 1 },
      { name: "Women's Tailored Scrub Suits", slug: 'womens-tailored-scrub-suits', image: 'https://images.unsplash.com/photo-1594824813633-82421bd97354?auto=format&fit=crop&w=400&q=80', sortOrder: 2 },
      { name: "Men's Multi-Pocket Cargo Scrubs", slug: 'mens-multi-pocket-cargo-scrubs', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80', sortOrder: 3 },
      { name: 'OT & Surgical Scrub Suits', slug: 'ot-surgical-scrub-suits', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80', sortOrder: 4 }
    ]
  },
  {
    name: 'Aprons & Lab Coats',
    slug: 'aprons-lab-coats',
    description: 'Doctor consultation coats, clinical aprons, and executive lab attire.',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=700&q=80',
    sortOrder: 2,
    subcategories: [
      { name: "Doctor Full-Length Lab Coats", slug: 'doctor-full-length-lab-coats', image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80', sortOrder: 1 },
      { name: 'Consultation Half-Sleeve Aprons', slug: 'consultation-half-sleeve-aprons', image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=400&q=80', sortOrder: 2 },
      { name: "Women's Fitted Doctor Aprons", slug: 'womens-fitted-doctor-aprons', image: 'https://images.unsplash.com/photo-1594824813633-82421bd97354?auto=format&fit=crop&w=400&q=80', sortOrder: 3 },
      { name: 'Executive Lab & Tech Aprons', slug: 'executive-lab-tech-aprons', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80', sortOrder: 4 }
    ]
  },
  {
    name: 'Underscrubs',
    slug: 'underscrubs',
    description: 'Moisture-wicking, thermal breathable base layer for sterile OT environments.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=700&q=80',
    sortOrder: 3,
    subcategories: [
      { name: 'Performance Long Sleeve Underscrubs', slug: 'performance-long-sleeve-underscrubs', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80', sortOrder: 1 },
      { name: "Women's Cooling Moisture-Wicking", slug: 'womens-cooling-moisture-wicking', image: 'https://images.unsplash.com/photo-1594824813633-82421bd97354?auto=format&fit=crop&w=400&q=80', sortOrder: 2 },
      { name: "Men's Athletic Fit Crew Underscrubs", slug: 'mens-athletic-fit-crew-underscrubs', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80', sortOrder: 3 }
    ]
  },
  {
    name: 'Patient Wear',
    slug: 'patient-wear',
    description: 'Hygienic tie-back gowns and 2-piece patient sets designed for dignity.',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=700&q=80',
    sortOrder: 4,
    subcategories: [
      { name: 'Hospital Patient Gowns (Tie-Back)', slug: 'hospital-patient-gowns-tie-back', image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=400&q=80', sortOrder: 1 },
      { name: 'Two-Piece Patient Pant & Shirt Sets', slug: 'two-piece-patient-pant-shirt-sets', image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=400&q=80', sortOrder: 2 },
      { name: 'OT & Maternity Patient Gowns', slug: 'ot-maternity-patient-gowns', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80', sortOrder: 3 }
    ]
  },
  {
    name: 'Hospital Linen & Drapes',
    slug: 'hospital-linen-drapes',
    description: 'Sterile surgical drapes, hospital bed sets, and clinic privacy curtains.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=700&q=80',
    sortOrder: 5,
    subcategories: [
      { name: 'Autoclavable OT Green Drapes', slug: 'autoclavable-ot-green-drapes', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80', sortOrder: 1 },
      { name: 'Hospital Ward Fitted Bed Sheets', slug: 'hospital-ward-fitted-bed-sheets', image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=400&q=80', sortOrder: 2 },
      { name: 'Patient Privacy Curtains', slug: 'patient-privacy-curtains', image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=400&q=80', sortOrder: 3 }
    ]
  }
];

async function seed() {
  // Deactivate legacy categories
  await Category.update({ isActive: false }, { where: { slug: ['kids-wear', 'men-s-wear', 'women-s-wear'] } });

  let rootCount = 0;
  let subCount = 0;

  for (const catData of anrCategories) {
    let [category] = await Category.findOrCreate({
      where: { slug: catData.slug },
      defaults: {
        name: catData.name,
        slug: catData.slug,
        description: catData.description,
        image: catData.image,
        sortOrder: catData.sortOrder,
        isActive: true,
        showHeader: true
      }
    });

    await category.update({
      name: catData.name,
      description: catData.description,
      image: catData.image,
      sortOrder: catData.sortOrder,
      isActive: true,
      showHeader: true
    });
    rootCount++;

    for (const sub of catData.subcategories) {
      let [subCat] = await SubCategory.findOrCreate({
        where: { slug: sub.slug },
        defaults: {
          categoryId: category.id,
          name: sub.name,
          slug: sub.slug,
          description: sub.name,
          image: sub.image,
          sortOrder: sub.sortOrder,
          isActive: true
        }
      });

      await subCat.update({
        categoryId: category.id,
        name: sub.name,
        image: sub.image,
        sortOrder: sub.sortOrder,
        isActive: true
      });
      subCount++;
    }
  }

  console.log(`Seeded ${rootCount} ANR categories and ${subCount} subcategories successfully.`);
}

module.exports = { anrCategories, seed };

if (require.main === module) {
  seed().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
