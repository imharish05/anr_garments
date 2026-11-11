import React from 'react';
import TopAnnouncementBar from './TopAnnouncementBar';
import Navbar from './Navbar';
import Footer from './Footer';
import LazyCartDrawer from './LazyCartDrawer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans antialiased selection:bg-[#1A175A] selection:text-white">
      {/* 1. Top Rotating Announcement Bar */}
      <TopAnnouncementBar />

      {/* 2. Main Storefront Navigation */}
      <Navbar />

      {/* 3. Page Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* 4. Footer */}
      <Footer />

      {/* 5. Cart Drawer (Lazy Loaded on first open) */}
      <LazyCartDrawer />
    </div>
  );
};

export default Layout;