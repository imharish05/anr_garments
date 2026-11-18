import React from 'react';
import ProductCollectionSection from './ProductCollectionSection';

const PATIENT_PANT_SHIRT_SLUGS = [
  'patient-pant-shirt',
  'two-piece-patient-pant-shirt-sets',
  'inpatient-striped-patient-uniforms',
];
const PATIENT_PANT_SHIRT_IDS = [19];
const PATIENT_PANT_SHIRT_PATTERN = /pant.*shirt|two-piece|patient.*uniform|striped.*ward/i;

const ProductListPatientPantShirt = () => (
  <ProductCollectionSection
    id="patient-pant-shirt-collection"
    bgClass="bg-white"
    eyebrow="Ward Uniforms & Recovery Sets"
    title="Patient Pant & Shirt Sets"
    subtitle="Comfortable two-piece patient uniforms and ward pyjama sets designed for inpatient mobility, dignity, and clinical convenience."
    ctaText="View all patient sets"
    ctaTo="/products/patient-pant-shirt"
    categorySlugs={PATIENT_PANT_SHIRT_SLUGS}
    categoryIds={PATIENT_PANT_SHIRT_IDS}
    namePattern={PATIENT_PANT_SHIRT_PATTERN}
  />
);

export default ProductListPatientPantShirt;
