import React from 'react';
import ProductCollectionSection from './ProductCollectionSection';

const APRON_SLUGS = ['aprons', 'aprons-lab-coats', 'aprons-for-men-women'];
const APRON_IDS = [15];
const APRON_PATTERN = /apron|lab\s*coat/i;

const ProductListLabCoats = () => (
  <ProductCollectionSection
    id="aprons-collection"
    bgClass="bg-[#F8F9FE]"
    eyebrow="Consultation & Lab Apparel"
    title="Aprons & Lab Coats for Doctors"
    subtitle="Crisp, structured lab coats and consultation aprons with reinforced instrument pockets and optional name embroidery."
    ctaText="View all lab coats & aprons"
    ctaTo="/products/aprons"
    categorySlugs={APRON_SLUGS}
    categoryIds={APRON_IDS}
    namePattern={APRON_PATTERN}
  />
);

export default ProductListLabCoats;
