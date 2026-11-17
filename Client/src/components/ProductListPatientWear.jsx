import React from 'react';
import ProductCollectionSection from './ProductCollectionSection';

const PATIENT_SLUGS = ['patient-gown', 'patient-pant-shirt', 'patient-wear'];
const PATIENT_IDS = [17, 18, 19];
const PATIENT_PATTERN = /patient/i;

const ProductListPatientWear = () => (
  <ProductCollectionSection
    id="patient-wear-collection"
    bgClass="bg-[#F8F9FE]"
    eyebrow="Inpatient & OT Recovery"
    title="Patient Gown • Patient Pant & Shirt"
    subtitle="Hygiene-compliant hospital patient gowns and ward sets built for repeated high-temperature industrial laundering."
    ctaText="View all patient wear"
    ctaTo="/products/patient-gown"
    categorySlugs={PATIENT_SLUGS}
    categoryIds={PATIENT_IDS}
    namePattern={PATIENT_PATTERN}
  />
);

export default ProductListPatientWear;
