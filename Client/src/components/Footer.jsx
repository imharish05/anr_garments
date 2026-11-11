import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategoriesTree, getCategoryPageLink } from '../services/api';
import useStorefrontSetting from '../hooks/useStorefrontSetting';
import anrLogo from '../assets/anr-logo.jpg';
import { Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import { ScrollReveal } from './MotionPrimitives';

// Base social platforms; WhatsApp number is dynamically derived from storefront settings
const BASE_SOCIAL_LINKS = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </svg>
    ),
  },
];

const WHATSAPP_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
  </svg>
);

const QUICK_LINKS = [
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Shipping & Delivery Policy', to: '/shipping-policy' },
  { label: 'Cancellation & Refund Policy', to: '/cancellation-refund-policy' },
  { label: 'Terms & Conditions', to: '/terms' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
];

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const { data: storefront } = useStorefrontSetting('storefront');

  useEffect(() => {
    let isMounted = true;
    fetchCategoriesTree()
      .then((tree) => {
        if (isMounted && tree && tree.length > 0) {
          setCategories(tree);
        }
      })
      .catch(() => {
        if (isMounted) setCategories([]);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const resolveCategoryHref = (cat) => {
    if (cat.href && cat.href.startsWith('/')) return cat.href;
    if (cat.link && cat.link.startsWith('/')) return cat.link;
    if (cat.slug) return getCategoryPageLink(cat.slug);
    return '/products';
  };

  const getCategoryName = (cat) => {
    return cat.name || cat.title || 'Category';
  };

  return (
    <footer className="bg-[#1A175A] text-white pt-14 pb-8 sm:pt-16 sm:pb-10 border-t border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer Columns */}
        <ScrollReveal
          staggerChildren
          staggerMs={80}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-white/10"
        >

          {/* Col 1: Brand & About */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img
                src={anrLogo}
                alt="ANR Hospital Garments"
                className="h-12 sm:h-14 w-auto rounded bg-white p-1.5 shadow-sm object-contain"
              />
              
            </Link>

            <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed max-w-sm">
              Manufacturers of premium medical apparel, clinical scrub suits, consultation aprons, and hospital wear. Crafted for comfort, hygiene, and durability in healthcare institutions across India.
            </p>

            <div className="pt-1 text-xs text-blue-200/90 space-y-2">
              {storefront?.phones?.length ? (
                <a
                  href={`tel:${storefront.phones[0]}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-200 flex-shrink-0" />
                  <span>{storefront.phones.join(' / ')}</span>
                </a>
              ) : null}
              {storefront?.email ? (
                <a
                  href={`mailto:${storefront.email}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-200 flex-shrink-0" />
                  <span>{storefront.email}</span>
                </a>
              ) : null}
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-blue-200 mb-4">
              Categories
            </h4>
            {categories.length > 0 ? (
              <ul className="space-y-2.5 text-xs sm:text-sm text-blue-100/90">
                {categories.map((cat, idx) => {
                  const href = resolveCategoryHref(cat);
                  const name = getCategoryName(cat);
                  return (
                    <li key={cat.id || cat.slug || idx}>
                      <Link
                        to={href}
                        className="hover:text-blue-200 transition-colors inline-flex items-center gap-2 group"
                      >
                        <ChevronRight className="w-3 h-3 text-blue-200/60 group-hover:text-blue-200 group-hover:translate-x-0.5 transition-all" />
                        <span>{name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-xs text-blue-200/70">Explore our uniform catalog from the store navigation.</p>
            )}
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-blue-200 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-blue-100/90">
              {QUICK_LINKS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="hover:text-blue-200 transition-colors inline-flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3 h-3 text-blue-200/60 group-hover:text-blue-200 group-hover:translate-x-0.5 transition-all" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Location & Social */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-blue-200 mb-4">
              Location
            </h4>
            <ul className="space-y-5 text-xs sm:text-sm text-blue-100/90">
              {storefront?.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-blue-200 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{storefront.address}</span>
                </li>
              )}
              <li>
                <p className="text-[11px] uppercase tracking-widest text-blue-200/70 mb-3">
                  Follow us
                </p>
                <div className="flex items-center gap-2.5">
                  {[
                    ...BASE_SOCIAL_LINKS,
                    ...(storefront?.phones?.[0]
                      ? [{
                          name: 'WhatsApp',
                          href: `https://wa.me/91${String(storefront.phones[0]).replace(/\D/g, '')}`,
                          icon: WHATSAPP_ICON,
                        }]
                      : []),
                  ].map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.name}
                      title={s.name}
                      className="w-10 h-10 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-[#1A175A] hover:border-white hover:-translate-y-0.5"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </li>
            </ul>
          </div>

        </ScrollReveal>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-200/80 gap-4">
          <div>
            © {new Date().getFullYear()} ANR Hospital Garments. All rights reserved.
          </div>
          <div className="text-[11px] text-blue-200 font-medium tracking-wide">
            {storefront?.slogan || ''}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;