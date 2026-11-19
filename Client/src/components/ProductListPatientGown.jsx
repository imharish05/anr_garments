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
const PATIENT_GOWN_EXCLUDE_PATTERN = /pant.*shirt|two-piece|\bscrub|apron|lab\s*coat/i;
const PATIENT_GOWN_EXCLUDE_SLUGS = [
  'scrub-suits',
  'aprons-lab-coats',
  'aprons',
  'underscrubs',
  'patient-pant-shirt',
  'scrub-caps',
];
const PATIENT_GOWN_EXCLUDE_IDS = [14, 15, 16, 19, 20, 21];

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
    excludeSlugs={PATIENT_GOWN_EXCLUDE_SLUGS}
    excludeIds={PATIENT_GOWN_EXCLUDE_IDS}
    excludePattern={PATIENT_GOWN_EXCLUDE_PATTERN}
  />
);

export default ProductListPatientGown;
