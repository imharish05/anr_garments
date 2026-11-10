import React from 'react';
import TopAnnouncementBar from '../components/TopAnnouncementBar';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import ShopByCategory from '../components/ShopByCategory';
import ShopByColor from '../components/ShopByColor';
import ProductListClassic from '../components/ProductListClassic';
import ProductListLabCoats from '../components/ProductListLabCoats';
import ProductListEcoflex from '../components/ProductListEcoflex';
import ProductListPatientWear from '../components/ProductListPatientWear';
import CustomEmbroideryBanner from '../components/CustomEmbroideryBanner';
import InstitutionsServed from '../components/InstitutionsServed';
import FabricTechSection from '../components/FabricTechSection';
import SeenInANR from '../components/SeenInANR';
import BulkInquirySection from '../components/BulkInquirySection';
import FactoryLocationSection from '../components/FactoryLocationSection';
import FaqShippingPerks from '../components/FaqShippingPerks';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans antialiased selection:bg-[#1A175A] selection:text-white">
      {/* 100vh Hero Fold: Topbar + Navbar + Hero Banner */}
      <div className="min-h-screen lg:h-screen flex flex-col">
        {/* 1. Top Rotating Announcement Bar with Bangalore Factory & Direct Founders Lines */}
        <TopAnnouncementBar />

        {/* 2. Main Navigation Header with ΛNR Brand Logo and Quick Actions */}
        <Navbar />

        {/* 3. Hero Banner: Full width, fills 100vh, cropped slightly at the top */}
        <div className="flex-1 w-full min-h-0 relative">
          <HeroBanner />
        </div>
      </div>

      <main className="flex-1">
        {/* 4. 5 Core Product Categories Overview */}
        <ShopByCategory />

        {/* 6. ALL COLOURS. SAME QUALITY. SAME CARE. Palette Showcase */}
        <ShopByColor />

        {/* 7. Product Line 1: Scrub Suits for Men & Women */}
        <ProductListClassic />

        {/* 8. Product Line 2: Aprons for Men & Women (Doctor Lab Coats & Aprons) */}
        <ProductListLabCoats />

        {/* 9. Product Line 3: Underscrubs for Men & Women */}
        <ProductListEcoflex />

        {/* 10. Product Lines 4 & 5: Patient Gown • Patient Pant & Shirt */}
        <ProductListPatientWear />

        {/* 11. Mid-Page Personalization Banner: Custom Hospital Crest & Doctor Name Embroidery */}
        <CustomEmbroideryBanner />

        {/* 12. Institutions & Hospital Chains Served */}
        <InstitutionsServed />

        {/* 13. Fabric Science: Fabric That Works As Hard As You Do */}
        <FabricTechSection />

        {/* 14. Seen in ANR: Healthcare Professionals & Testimonials */}
        <SeenInANR />

        {/* 15. Institutional Bulk Procurement Desk (Mr. Manjunath Rao & Mr. Balraj. V) */}
        <BulkInquirySection />

        {/* 16. Bangalore Factory Location & Google Maps Interactive Integration */}
        <FactoryLocationSection />

        {/* 17. FAQs & Hospital Supply Guarantees */}
        <FaqShippingPerks />
      </main>

      {/* 18. Comprehensive ANR Bangalore Footer */}
      <Footer />

      {/* 19. Interactive Shopping Cart Drawer */}
      <CartDrawer />
    </div>
  );
};

export default HomePage;
