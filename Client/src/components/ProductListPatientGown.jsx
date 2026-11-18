import React from 'react';
import ProductCollectionSection from './ProductCollectionSection';

const PATIENT_GOWN_SLUGS = [
  'patient-gown',
  'hospital-patient-gowns-tie-back',
  'ot-maternity-patient-gowns',
  'autoclavable-ot-green-drapes',
];
const PATIENT_GOWN_IDS = [18];
const PATIENT_GOWN_PATTERN = /patient\s*gown|tie-back|maternity\s*gown|surgical\s*patient\s*gown|gown/i;

const ProductListPatientGown = () => (
  <ProductCollectionSection
    id="patient-gown-collection"
    bgClass="bg-[#F8F9FE]"
    eyebrow="Inpatient & OT Recovery"
    title="Patient Gowns"
    subtitle="Hygiene-compliant hospital tie-back, surgical, and maternity gowns engineered for maximum patient dignity and frequent high-temp sterilization."
    ctaText="View all patient gowns"
    ctaTo="/products/patient-gown"
    categorySlugs={PATIENT_GOWN_SLUGS}
    categoryIds={PATIENT_GOWN_IDS}
    namePattern={PATIENT_GOWN_PATTERN}
  />
);

export default ProductListPatientGown;
