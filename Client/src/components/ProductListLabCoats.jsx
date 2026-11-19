import React from 'react';
import ProductCollectionSection from './ProductCollectionSection';

const APRON_SLUGS = ['aprons', 'aprons-lab-coats', 'aprons-for-men-women'];
const APRON_IDS = [15, 20];
const APRON_PATTERN = /apron|lab\s*coat/i;
const APRON_EXCLUDE_PATTERN = /\bscrub|gown|pant.*shirt/i;
const APRON_EXCLUDE_SLUGS = [
  'scrub-suits',
  'underscrubs',
  'patient-gown',
  'patient-pant-shirt',
  'scrub-caps',
];
const APRON_EXCLUDE_IDS = [14, 16, 18, 19, 21];

const ProductListLabCoats = () => (
  <ProductCollectionSection
    id="aprons-collection"
    bgClass="bg-[#F8F9FE]"
    eyebrow="Consultation & Lab Apparel"
    title="Aprons & Lab Coats for Doctors"
    subtitle="Crisp, structured lab coats and consultation aprons with reinforced instrument pockets and optional name embroidery."
    ctaText="View all lab coats & aprons"
    ctaTo="/products/aprons-lab-coats"
    categorySlugs={APRON_SLUGS}
    categoryIds={APRON_IDS}
    namePattern={APRON_PATTERN}
    excludeSlugs={APRON_EXCLUDE_SLUGS}
    excludeIds={APRON_EXCLUDE_IDS}
    excludePattern={APRON_EXCLUDE_PATTERN}
  />
);

export default ProductListLabCoats;
