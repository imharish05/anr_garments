import React from 'react';
import ProductCollectionSection from './ProductCollectionSection';

const APRON_SLUGS = ['aprons-lab-coats'];

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
  />
);

export default ProductListLabCoats;
