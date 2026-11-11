import React from 'react';
import ProductCollectionSection from './ProductCollectionSection';

const SCRUB_SLUGS = ['scrub-suits'];

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
  />
);

export default ProductListClassic;
