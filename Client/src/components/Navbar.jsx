import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { COMPANY_INFO } from '../data/mockData';
import anrLogo from '../assets/anr-logo.jpg';
import { Search, ShoppingBag, Heart, Menu, X, ChevronDown, PhoneCall, Plus } from 'lucide-react';

const Logo = ({ className = "h-12" }) => (
  <a href="#" className="flex items-center flex-shrink-0 group">
    <img src={anrLogo} alt="ANR Hospital Garments" className={`${className} w-auto object-contain rounded`} />
  </a>
);

const Navbar = () => {
  const { totalItems, setIsCartOpen, wishlistCount, searchQuery, setSearchQuery } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [openMobileSection, setOpenMobileSection] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navLinks = [
    {
      name: "Scrub Suits",
      href: "#scrubs-collection",
      subItems: [
        { label: "Classic Scrub Suits (Unisex)", href: "#scrubs-collection" },
        { label: "Women's Tailored Scrub Suits", href: "#scrubs-collection" },
        { label: "Men's Multi-Pocket Cargo Scrubs", href: "#scrubs-collection" },
        { label: "OT & Surgical Scrub Suits", href: "#scrubs-collection" }
      ]
    },
    {
      name: "Aprons & Lab Coats",
      href: "#aprons-collection",
      subItems: [
        { label: "Doctor Full-Length Lab Coats", href: "#aprons-collection" },
        { label: "Consultation Half-Sleeve Aprons", href: "#aprons-collection" },
        { label: "Women's Fitted Doctor Aprons", href: "#aprons-collection" },
        { label: "Executive Lab & Tech Aprons", href: "#aprons-collection" }
      ]
    },
    { name: "Underscrubs", href: "#underscrubs-collection", badge: "Base Layer" },
    {
      name: "Patient Wear",
      href: "#patient-wear-collection",
      subItems: [
        { label: "Hospital Patient Gowns (Tie-Back)", href: "#patient-wear-collection" },
        { label: "Two-Piece Patient Pant & Shirt Sets", href: "#patient-wear-collection" },
        { label: "OT & Maternity Gowns", href: "#patient-wear-collection" }
      ]
    },

    { name: "Bulk Orders", href: "#bulk-inquiry", highlight: true }
  ];

  const iconBtn =
    "relative p-2.5 text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400";

  const SearchInput = ({ autoFocus = false }) => (
    <div className="relative w-full">
      <Search className="w-4 h-4 text-blue-300 absolute left-4 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search scrubs, aprons, patient wear..."
        autoFocus={autoFocus}
        className="w-full bg-[#110E3F] text-white placeholder-blue-300/60 pl-11 pr-10 py-2.5 rounded-full text-sm border border-white/10 focus:outline-none focus:border-amber-400 transition-colors"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  return (
    <>
      <header className={`sticky top-0 z-40 bg-[#1A175A] text-white transition-shadow duration-300 ${scrolled ? 'shadow-xl' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ROW 1: logo | search | actions */}
          <div className="grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,28rem)_1fr] items-center gap-4 h-20">

            {/* Left: hamburger (mobile) + logo */}
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

            {/* Center: search (desktop) */}
            <div className="hidden lg:block">
              <SearchInput />
            </div>

            {/* Right: actions */}
            <div className="flex items-center justify-end gap-1 col-start-3 lg:col-start-auto">
              <a
                href={`tel:${COMPANY_INFO.phones[0]}`}
                className="hidden xl:inline-flex items-center gap-2 mr-2 px-3 py-2 rounded-full text-xs font-medium text-white hover:bg-white/10 transition-colors"
                title="Call Founder Mr. Manjunath Rao G"
              >
                <PhoneCall className="w-4 h-4 text-amber-300" />
                <span>Call Factory</span>
              </a>

              <button
                type="button"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className={`${iconBtn} lg:hidden`}
                aria-label="Search"
              >
                {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>

              <a href="#wishlist" className={iconBtn} title="Wishlist" aria-label="Wishlist">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </a>

              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="ml-1 flex items-center gap-2 text-white hover:bg-blue-50 pl-3.5 pr-4 py-2 rounded-full font-semibold text-xs sm:text-sm shadow-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Mobile search */}
          {mobileSearchOpen && (
            <div className="lg:hidden pb-4">
              <SearchInput autoFocus />
            </div>
          )}
        </div>

        {/* ROW 2: nav links (desktop) */}
        <div className="hidden lg:block border-t border-white/10">
          <nav className="max-w-7xl mx-auto px-8 flex items-center justify-center gap-1 xl:gap-3 h-12">
            {navLinks.filter(l => !l.highlight).map((link) => (
              <div
                key={link.name}
                className="relative h-full flex items-center"
                onMouseEnter={() => link.subItems && setActiveDropdown(link.name)}
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
                  {link.subItems && (
                    <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                  )}
                  <span className={`absolute left-3 right-3 bottom-0 h-[2px] bg-amber-400 origin-center transition-transform duration-300 ${activeDropdown === link.name ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                </a>

                {link.subItems && (
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 w-72 z-50 transition-all duration-200 ${activeDropdown === link.name ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-1 pointer-events-none'}`}>
                    <div className="bg-[#141247] border border-white/10 rounded-b-2xl p-2 shadow-2xl">
                      {link.subItems.map((sub) => (
                        <a
                          key={sub.label}
                          href={sub.href}
                          className="block px-3.5 py-2.5 text-xs font-medium text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <a
              href="#bulk-inquiry"
              className="ml-3 px-4 py-1.5 rounded-full bg-amber-400 text-[#1A175A] text-[13px] font-bold hover:bg-amber-300 transition-colors"
            >
              Bulk Orders
            </a>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
        <aside className={`absolute left-0 top-0 h-full w-4/5 max-w-sm bg-[#1A175A] text-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <Logo className="h-10" />
            <button onClick={() => setMobileMenuOpen(false)} className={iconBtn} aria-label="Close menu">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-2">
            {navLinks.filter(l => !l.highlight).map((link) => {
              const isOpen = openMobileSection === link.name;
              return (
                <div key={link.name} className="border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <a
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 flex items-center gap-2 py-3.5 text-base font-semibold hover:text-blue-200"
                    >
                      <span>{link.name}</span>
                      {link.badge && (
                        <span className="text-[10px] bg-sky-400 text-[#1A175A] font-bold px-2 py-0.5 rounded-full">{link.badge}</span>
                      )}
                    </a>
                    {link.subItems && (
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
                  {link.subItems && (
                    <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <div className="pl-4 pb-3 ml-1 space-y-1 border-l border-amber-400/40">
                          {link.subItems.map((sub) => (
                            <a key={sub.label} href={sub.href} onClick={() => setMobileMenuOpen(false)} className="block text-xs text-blue-200 hover:text-white py-1.5">
                              {sub.label}
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
            <a href="#bulk-inquiry" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center bg-amber-400 text-[#1A175A] py-3 rounded-full font-bold text-sm hover:bg-amber-300 transition-colors">
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