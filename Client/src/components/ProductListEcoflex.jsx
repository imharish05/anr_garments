import React from 'react';
import ProductCollectionSection from './ProductCollectionSection';

const UNDERSCRUB_SLUGS = ['underscrubs'];

const ProductListEcoflex = () => (
  <ProductCollectionSection
    id="underscrubs-collection"
    bgClass="bg-white"
    eyebrow="Moisture-Wicking Base Layers"
    title="Underscrubs & Performance Tees"
    subtitle="Lightweight thermal-regulating inner layers built to sit comfortably underneath surgical scrubs in air-conditioned theatres."
    ctaText="View all underscrubs"
    ctaTo="/products/underscrubs"
    categorySlugs={UNDERSCRUB_SLUGS}
  />
);

export default ProductListEcoflex;
