import React from 'react';
import ProductCollectionSection from './ProductCollectionSection';

const UNDERSCRUB_SLUGS = ['underscrubs', 'underscrubs-for-men-women'];
const UNDERSCRUB_IDS = [16];
const UNDERSCRUB_PATTERN = /underscrub/i;
const UNDERSCRUB_EXCLUDE_PATTERN = /\bscrub\s*(?:suit|set)|apron|lab\s*coat|gown|pant.*shirt/i;
const UNDERSCRUB_EXCLUDE_SLUGS = [
  'scrub-suits',
  'scrub-suits-for-women',
  'aprons-lab-coats',
  'aprons',
  'patient-gown',
  'patient-pant-shirt',
  'scrub-caps',
];
const UNDERSCRUB_EXCLUDE_IDS = [14, 15, 18, 19, 20, 21];

const ProductListEcoflex = () => (
  <ProductCollectionSection
    id="underscrubs-collection"
    bgClass="bg-white"
    eyebrow="Moisture-Wicking Base Layers"
    title="Underscrubs"
    subtitle="Lightweight thermal-regulating inner layers built to sit comfortably underneath surgical scrubs in air-conditioned theatres."
    ctaText="View all underscrubs"
    ctaTo="/products/underscrubs"
    categorySlugs={UNDERSCRUB_SLUGS}
    categoryIds={UNDERSCRUB_IDS}
    namePattern={UNDERSCRUB_PATTERN}
    excludeSlugs={UNDERSCRUB_EXCLUDE_SLUGS}
    excludeIds={UNDERSCRUB_EXCLUDE_IDS}
    excludePattern={UNDERSCRUB_EXCLUDE_PATTERN}
  />
);

export default ProductListEcoflex;
