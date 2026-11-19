import React from 'react';
import ProductCollectionSection from './ProductCollectionSection';

const SCRUB_SLUGS = [
  'scrub-suits',
  'scrubs',
  'scrub-suits-for-men-women',
  'scrub-suits-for-men',
  'scrub-suits-for-women',
];
const SCRUB_IDS = [14];
// Resilient match for scrub suits/sets only
const SCRUB_PATTERN = /\bscrub\s*(?:suit|set)s?\b/i;
// Strictly exclude underscrubs, lab aprons/coats, caps, gowns, patient wear
const SCRUB_EXCLUDE_PATTERN = /underscrub|apron|lab\s*coat|cap|gown|pant.*shirt/i;
const SCRUB_EXCLUDE_SLUGS = [
  'underscrubs',
  'aprons-lab-coats',
  'aprons',
  'scrub-caps',
  'patient-gown',
  'patient-pant-shirt',
];
const SCRUB_EXCLUDE_IDS = [15, 16, 18, 19, 20, 21];

const ProductListClassic = () => (
  <ProductCollectionSection
    id="scrubs-collection"
    bgClass="bg-white"
    eyebrow="Clinical Scrub Suits"
    title="Scrub Suits for Men & Women"
    subtitle="Breathable poly-viscose and cotton-rich clinical scrubs engineered for OT, ICU, and long ward shifts."
    ctaText="View all scrub products"
    ctaTo="/products/scrub-suits"
    categorySlugs={SCRUB_SLUGS}
    categoryIds={SCRUB_IDS}
    namePattern={SCRUB_PATTERN}
    excludeSlugs={SCRUB_EXCLUDE_SLUGS}
    excludeIds={SCRUB_EXCLUDE_IDS}
    excludePattern={SCRUB_EXCLUDE_PATTERN}
  />
);

export default ProductListClassic;
