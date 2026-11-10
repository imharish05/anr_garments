import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import anrLogo from '../assets/anr-logo.jpg';
import { CATEGORIES } from '../data/mockData';
import { fetchCategoriesTree } from '../services/api';
import SearchModal from './SearchModal';
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ChevronDown,
  Plus,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const Logo = ({ className = "h-12" }) => (
  <a href="#" className="flex items-center flex-shrink-0">
    <img src={anrLogo} alt="ANR Hospital Garments" className={`${className} w-auto object-contain rounded`} />
  </a>
);

const Navbar = () => {
  const { totalItems, setIsCartOpen, wishlistCount, searchQuery, setSearchQuery } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [openMobileSection, setOpenMobileSection] = useState(null);
  const [categoriesList, setCategoriesList] = useState(CATEGORIES);

  // Fetch dynamic categories tree from backend Admin API
  useEffect(() => {
    let isMounted = true;
    fetchCategoriesTree().then((tree) => {
      if (isMounted && tree && tree.length > 0) {
        setCategoriesList(tree);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Keyboard shortcut (Ctrl/Cmd + K) to quickly trigger Search Modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Transform dynamic categories into mainLinks
  const mainLinks = categoriesList.map((cat) => ({
    id: cat.id || cat.slug,
    name: cat.name || cat.title,
    href: cat.href || cat.link || '#scrubs-collection',
    image: cat.image,
    description: cat.description,
    badge: cat.badge || null,
    subcategories: (cat.subcategories || []).map((sub) => ({
      id: sub.id || sub.slug,
      name: sub.name || sub.label,
      label: sub.name || sub.label,
      href: sub.href || sub.link || cat.href || '#scrubs-collection',
      image: sub.image || cat.image
    }))
  }));

  const bulkLink = {
    name: "Bulk Orders",
    href: "#bulk-inquiry",
    highlight: true
  };

  const iconBtn =
    "relative p-2.5 text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400";

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#1A175A] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4 sm:gap-6">

            {/* Left: Hamburger (mobile) + ANR Brand Logo */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className={`${iconBtn} lg:hidden -ml-2`}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <Logo />
            </div>

            {/* Center: Dynamic Category Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {mainLinks.map((link) => {
                const hasSubs = link.subcategories && link.subcategories.length > 0;
                const isDropdownOpen = activeDropdown === link.name;

                return (
                  <div
                    key={link.name}
                    className="relative h-20 flex items-center"
                    onMouseEnter={() => hasSubs && setActiveDropdown(link.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <a
                      href={link.href}
                      className="group relative inline-flex items-center gap-1.5 px-3 h-full text-[13px] font-semibold text-white/90 hover:text-white transition-colors"
                    >
                      <span>{link.name}</span>
                      {link.badge && (
                        <span className="text-[9px] bg-sky-400 text-[#1A175A] font-extrabold px-1.5 rounded-full uppercase tracking-wider">
                          {link.badge}
                        </span>
                      )}
                      {hasSubs && (
                        <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-amber-300' : ''}`} />
                      )}
                      <span className={`absolute left-3 right-3 bottom-5 h-[2px] bg-amber-400 origin-center transition-transform duration-300 ${isDropdownOpen ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                    </a>

                    {/* Professional & Simple Category Dropdown */}
                    {hasSubs && (
                      <div
                        className={`absolute top-full left-0 w-72 sm:w-80 z-50 transition-all duration-200 ${
                          isDropdownOpen
                            ? 'opacity-100 translate-y-0 pointer-events-auto'
                            : 'opacity-0 translate-y-2 pointer-events-none'
                        }`}
                      >
                        <div className="bg-[#141247] border border-white/15 rounded-2xl p-3 shadow-2xl backdrop-blur-xl">
                          <div className="flex items-center justify-between px-2 pb-2 mb-1.5 border-b border-white/10">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                              Sub-Categories ({link.subcategories.length})
                            </span>
                          </div>

                          <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                            {link.subcategories.map((sub) => (
                              <a
                                key={sub.label || sub.name}
                                href={sub.href}
                                onClick={() => setActiveDropdown(null)}
                                className="group/sub flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                              >
                                {sub.image && (
                                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-800 border border-white/20 flex-shrink-0 shadow-sm relative">
                                    <img
                                      src={sub.image}
                                      alt={sub.label}
                                      className="w-full h-full object-cover group-hover/sub:scale-110 transition-transform duration-200"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                )}

                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-white group-hover/sub:text-amber-300 transition-colors truncate">
                                    {sub.label}
                                  </p>
                                </div>

                                <ArrowRight className="w-3.5 h-3.5 text-blue-300 opacity-0 group-hover/sub:opacity-100 group-hover/sub:translate-x-0.5 transition-all flex-shrink-0" />
                              </a>
                            ))}
                          </div>

                          <div className="pt-2 mt-1.5 border-t border-white/10 px-2">
                            <a
                              href={link.href}
                              onClick={() => setActiveDropdown(null)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 group/link"
                            >
                              <span>Browse All in {link.name}</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right: Actions (Bulk Orders + Search Bar + Wishlist + Cart) */}
            <div className="flex items-center gap-1 sm:gap-2">
              <a
                href={bulkLink.href}
                className="hidden lg:inline-flex items-center px-4 py-2 mr-1 rounded-full bg-amber-400 text-[#1A175A] text-[13px] font-bold hover:bg-amber-300 transition-colors shadow-sm"
              >
                {bulkLink.name}
              </a>

              {/* Desktop Search Trigger Bar */}
              <div
                onClick={() => setSearchModalOpen(true)}
                className="hidden xl:flex items-center relative w-64 mr-1 cursor-pointer group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') setSearchModalOpen(true); }}
                aria-label="Open search dialog"
              >
                <Search className="w-4 h-4 text-blue-300 absolute left-4 top-1/2 -translate-y-1/2 group-hover:text-amber-400 transition-colors" />
                <input
                  type="text"
                  readOnly
                  value={searchQuery}
                  placeholder="Search scrubs, aprons..."
                  className="w-full bg-[#110E3F] text-white placeholder-blue-300/60 pl-11 pr-16 py-2.5 rounded-full text-xs border border-white/10 group-hover:border-amber-400/60 transition-colors cursor-pointer focus:outline-none"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <span className="text-[10px] text-blue-300/70 border border-white/15 px-1.5 py-0.5 rounded font-mono">
                    ⌘K
                  </span>
                </div>
              </div>

              {/* Search Toggle Button for < xl screens */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className={`${iconBtn} xl:hidden`}
                aria-label="Open Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Button */}
              <a href="#wishlist" className={iconBtn} title="Wishlist" aria-label="Wishlist">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {wishlistCount}
                  </span>
                )}
              </a>

              {/* Shopping Bag Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className={iconBtn}
                aria-label="Order bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Interactive Clinical Search Modal with Overview */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Mobile Drawer Navigation with Category & Subcategory Images */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
        <aside className={`absolute left-0 top-0 h-full w-4/5 max-w-sm bg-[#1A175A] text-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <Logo className="h-10" />
            <button onClick={() => setMobileMenuOpen(false)} className={iconBtn} aria-label="Close menu">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Search Button in Mobile Drawer */}
          <div className="px-6 py-3 border-b border-white/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchModalOpen(true);
              }}
              className="w-full flex items-center gap-2.5 bg-[#110E3F] text-blue-200/80 px-4 py-2.5 rounded-full text-xs border border-white/15"
            >
              <Search className="w-4 h-4 text-amber-300" />
              <span>Search scrubs, lab coats, specs...</span>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-2">
            {mainLinks.map((link) => {
              const isOpen = openMobileSection === link.name;
              const hasSubs = link.subcategories && link.subcategories.length > 0;

              return (
                <div key={link.name} className="border-b border-white/10 py-1">
                  <div className="flex items-center justify-between">
                    <a
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 flex items-center gap-3 py-3 text-sm font-semibold hover:text-blue-200"
                    >
                      {/* Category Thumbnail Image in Mobile Menu */}
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-800 border border-white/20 flex-shrink-0 shadow-sm">
                        <img
                          src={link.image}
                          alt={link.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block truncate">{link.name}</span>
                        {link.badge && (
                          <span className="text-[9px] bg-sky-400 text-[#1A175A] font-bold px-1.5 py-0.2 rounded-full inline-block mt-0.5">
                            {link.badge}
                          </span>
                        )}
                      </div>
                    </a>

                    {hasSubs && (
                      <button
                        onClick={() => setOpenMobileSection(isOpen ? null : link.name)}
                        className="p-2 text-white/80 hover:text-white"
                        aria-label={`Toggle ${link.name}`}
                        aria-expanded={isOpen}
                      >
                        <Plus className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-45 text-amber-300' : ''}`} />
                      </button>
                    )}
                  </div>

                  {/* Subcategories Accordion with Images in Mobile Menu */}
                  {hasSubs && (
                    <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <div className="pl-3 pb-3 ml-4 space-y-2 border-l-2 border-amber-400/40">
                          {link.subcategories.map((sub) => (
                            <a
                              key={sub.label}
                              href={sub.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-2.5 py-1 text-xs text-blue-200 hover:text-white group"
                            >
                              {/* Subcategory Image Thumbnail in Mobile Drawer */}
                              <div className="w-7 h-7 rounded-md overflow-hidden bg-slate-800 border border-white/20 flex-shrink-0">
                                <img
                                  src={sub.image}
                                  alt={sub.label}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="group-hover:text-amber-300 transition-colors truncate">
                                {sub.label}
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="px-6 py-5 border-t border-white/10 space-y-3">
            <a
              href="#bulk-inquiry"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center bg-amber-400 text-[#1A175A] py-3 rounded-full font-bold text-sm hover:bg-amber-300 transition-colors shadow"
            >
              Request Hospital Bulk Quote
            </a>
            <div className="space-y-1 text-xs text-blue-200 text-center">
              <p className="font-semibold text-white">Contacts: Mr. Manjunath Rao & Mr. Balraj</p>
              <p>9986044574 / 6363429113</p>
              <p className="text-[11px] text-amber-300">Girinagar, Banashankari, Bangalore</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Navbar;
