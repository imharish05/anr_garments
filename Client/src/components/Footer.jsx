import React, { useState, useEffect } from 'react';
import { COMPANY_INFO, CATEGORIES } from '../data/mockData';
import { fetchCategoriesTree, getCategorySectionLink } from '../services/api';
import anrLogo from '../assets/anr-logo.jpg';
import {
  Mail,
  Phone,
  MapPin,
  Navigation,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';

const Footer = () => {
  const [categories, setCategories] = useState(CATEGORIES);

  useEffect(() => {
    let isMounted = true;
    fetchCategoriesTree()
      .then((tree) => {
        if (isMounted && tree && tree.length > 0) {
          setCategories(tree);
        }
      })
      .catch((err) => {
        console.warn('Footer: failed to load categories, using fallback:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const resolveCategoryHref = (cat) => {
    if (cat.href && cat.href !== '#bulk-inquiry') return cat.href;
    if (cat.link && cat.link !== '#bulk-inquiry') return cat.link;
    if (cat.slug) {
      const link = getCategorySectionLink(cat.slug);
      if (link !== '#bulk-inquiry') return link;
    }
    return '#shop-categories';
  };

  const getCategoryName = (cat) => {
    return cat.name || cat.title || 'Category';
  };

  return (
    <footer className="bg-[#1A175A] text-white pt-14 pb-8 sm:pt-16 sm:pb-10 border-t border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand & About */}
          <div className="space-y-4">
            <a href="#" className="inline-flex items-center gap-3 group">
              <img
                src={anrLogo}
                alt="ANR Hospital Garments"
                className="h-10 w-auto rounded bg-white p-1 shadow-sm object-contain"
              />
              <div>
                <span className="font-sans text-xl font-black tracking-wider text-white block">
                  ANR
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-amber-300 font-semibold block">
                  Hospital Garments
                </span>
              </div>
            </a>

            <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed max-w-sm">
              Manufacturers of premium medical apparel, clinical scrub suits, consultation aprons, and hospital wear. Crafted for comfort, hygiene, and durability in healthcare institutions across India.
            </p>

            <div className="pt-1 text-xs text-blue-200/90 space-y-2">
              <a
                href="tel:9986044574"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                <span>+91 99860 44574 / 63634 29113</span>
              </a>
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                <span>{COMPANY_INFO.email}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Categories (Dynamic from categories) */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-amber-300 mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-blue-100/90">
              {categories.map((cat, idx) => {
                const href = resolveCategoryHref(cat);
                const name = getCategoryName(cat);
                return (
                  <li key={cat.id || cat.slug || idx}>
                    <a
                      href={href}
                      className="hover:text-amber-300 transition-colors inline-flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-3 h-3 text-amber-300/60 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all" />
                      <span>{name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-amber-300 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-blue-100/90">
              <li>
                <a
                  href="#shop-categories"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-2 group"
                >
                  <ChevronRight className="w-3 h-3 text-amber-300/60 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all" />
                  <span>All Categories</span>
                </a>
              </li>
              <li>
                <a
                  href="#shop-colors"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-2 group"
                >
                  <ChevronRight className="w-3 h-3 text-amber-300/60 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all" />
                  <span>Hospital Color Palette</span>
                </a>
              </li>
              <li>
                <a
                  href="#custom-embroidery"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-2 group"
                >
                  <ChevronRight className="w-3 h-3 text-amber-300/60 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all" />
                  <span>Custom Embroidery</span>
                </a>
              </li>
              <li>
                <a
                  href="#fabric-tech"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-2 group"
                >
                  <ChevronRight className="w-3 h-3 text-amber-300/60 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all" />
                  <span>Fabric Technology</span>
                </a>
              </li>
              <li>
                <a
                  href="#seen-in-anr"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-2 group"
                >
                  <ChevronRight className="w-3 h-3 text-amber-300/60 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all" />
                  <span>Healthcare Reviews</span>
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-2 group"
                >
                  <ChevronRight className="w-3 h-3 text-amber-300/60 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all" />
                  <span>FAQs & Support</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Bangalore Facility & Contact */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-amber-300 mb-4">
              Bangalore Facility
            </h4>
            <ul className="space-y-3.5 text-xs sm:text-sm text-blue-100/90">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{COMPANY_INFO.address}</span>
              </li>
              <li className="pt-1">
                <a
                  href={COMPANY_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all shadow-sm hover:border-amber-300/50"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-300" />
                  <span>View on Google Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-300/80" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-200/80 gap-4">
          <div>
            © {new Date().getFullYear()} ANR Hospital Garments. Bangalore, Karnataka. All rights reserved.
          </div>
          <div className="text-[11px] text-amber-300 font-medium tracking-wide">
            {COMPANY_INFO.slogan}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;