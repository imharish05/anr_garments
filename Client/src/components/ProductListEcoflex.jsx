import React from 'react';
import ProductCollectionSection from './ProductCollectionSection';

const UNDERSCRUB_SLUGS = ['underscrubs', 'underscrubs-for-men-women'];
const UNDERSCRUB_IDS = [16];
const UNDERSCRUB_PATTERN = /underscrub/i;

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
  />
);

export default ProductListEcoflex;
