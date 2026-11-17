import React from 'react';
import ProductCollectionSection from './ProductCollectionSection';

const SCRUB_SLUGS = ['scrub-suits', 'scrubs', 'scrub-suits-for-men-women'];
const SCRUB_PATTERN = /scrub/i;

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
    namePattern={SCRUB_PATTERN}
  />
);

export default ProductListClassic;
