import React, { lazy } from 'react';
import TopAnnouncementBar from '../components/TopAnnouncementBar';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import LazySection from '../components/LazySection';
import LazyCartDrawer from '../components/LazyCartDrawer';
import ProductListClassic from '../components/ProductListClassic';
import ProductListLabCoats from '../components/ProductListLabCoats';
import ProductListEcoflex from '../components/ProductListEcoflex';
import ProductListPatientWear from '../components/ProductListPatientWear';
import { ProductCollectionSkeleton } from '../components/SkeletonLoaders';

const ShopByCategory = lazy(() => import('../components/ShopByCategory'));
const ShopByColor = lazy(() => import('../components/ShopByColor'));
const OffersSection = lazy(() => import('../components/OffersSection'));
const FabricTechSection = lazy(() => import('../components/FabricTechSection'));
const SeenInANR = lazy(() => import('../components/SeenInANR'));
const FaqShippingPerks = lazy(() => import('../components/FaqShippingPerks'));
const Footer = lazy(() => import('../components/Footer'));

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans antialiased selection:bg-[#1A175A] selection:text-white">
      {/* Above-the-fold: loaded eagerly for fast LCP */}
      <TopAnnouncementBar />
      <Navbar />

      <main className="flex-1">
        <HeroBanner />

        <LazySection anchorId="categories" minHeight={420}>
          <ShopByCategory />
        </LazySection>

        <LazySection anchorId="colors" minHeight={520}>
          <ShopByColor />
        </LazySection>

        <LazySection
          anchorId="scrubs-collection"
          minHeight={640}
          fallback={<ProductCollectionSkeleton bgClass="bg-white" />}
        >
          <ProductListClassic />
        </LazySection>

        <LazySection
          anchorId="aprons-collection"
          minHeight={640}
          fallback={<ProductCollectionSkeleton bgClass="bg-[#F8F9FE]" />}
        >
          <ProductListLabCoats />
        </LazySection>

        <LazySection
          anchorId="underscrubs-collection"
          minHeight={640}
          fallback={<ProductCollectionSkeleton bgClass="bg-white" />}
        >
          <ProductListEcoflex />
        </LazySection>

        <LazySection
          anchorId="patient-wear-collection"
          minHeight={640}
          fallback={<ProductCollectionSkeleton bgClass="bg-[#F8F9FE]" />}
        >
          <ProductListPatientWear />
        </LazySection>

        {/* <LazySection anchorId="offers" minHeight={420}>
          <OffersSection />
        </LazySection> */}

        {/* <LazySection anchorId="fabric-tech" minHeight={360}>
          <FabricTechSection />
        </LazySection> */}

        <LazySection anchorId="testimonials" minHeight={320}>
          <SeenInANR />
        </LazySection>

        <LazySection anchorId="faq" minHeight={380}>
          <FaqShippingPerks />
        </LazySection>
      </main>

      <LazySection anchorId="footer" minHeight={340} rootMargin="400px 0px">
        <Footer />
      </LazySection>

      <LazyCartDrawer />
    </div>
  );
};

export default HomePage;
