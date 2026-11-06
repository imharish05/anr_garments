import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { COMPANY_INFO } from '../data/mockData';
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ChevronDown,
  PhoneCall,
  MapPin,
  Sparkles
} from 'lucide-react';

const Navbar = () => {
  const { totalItems, setIsCartOpen, wishlistCount, searchQuery, setSearchQuery } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

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
    {
      name: "Underscrubs",
      href: "#underscrubs-collection",
      badge: "Base Layer"
    },
    {
      name: "Patient Wear",
      href: "#patient-wear-collection",
      subItems: [
        { label: "Hospital Patient Gowns (Tie-Back)", href: "#patient-wear-collection" },
        { label: "Two-Piece Patient Pant & Shirt Sets", href: "#patient-wear-collection" },
        { label: "OT & Maternity Gowns", href: "#patient-wear-collection" }
      ]
    },
    { name: "All Colours", href: "#shop-colors" },
    { name: "Bangalore Factory", href: "#factory-location" },
    { name: "Bulk Orders", href: "#bulk-inquiry", highlight: true }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#1A175A] text-white shadow-lg transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-white hover:bg-white/10 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo: ΛNR HOSPITAL GARMENTS */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <a href="#" className="flex items-center gap-2 group">
                <div className="h-14 py-1 px-3 rounded-lg bg-white/5 border border-white/10 group-hover:border-white/30 transition-all flex items-center gap-2.5">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans text-2xl font-black tracking-widest text-white leading-none">
                        ΛNR
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    </div>
                    <span className="text-[9px] tracking-[0.28em] uppercase text-blue-200 font-bold -mt-0.5">
                      Hospital Garments
                    </span>
                    <span className="text-[8px] text-amber-300/90 font-medium tracking-wide">
                      Bangalore
                    </span>
                  </div>
                </div>
              </a>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  className="relative group"
                  onMouseEnter={() => link.subItems && setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <a
                    href={link.href}
                    className={`inline-flex items-center gap-1 px-3 py-2 text-xs xl:text-sm font-semibold transition-colors duration-150 rounded-lg ${
                      link.highlight
                        ? 'bg-amber-400 text-[#1A175A] font-bold hover:bg-amber-300 shadow-md'
                        : 'text-white hover:text-blue-200 hover:bg-white/5'
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="text-[9px] bg-sky-400 text-[#1A175A] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                        {link.badge}
                      </span>
                    )}
                    {link.subItems && (
                      <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                    )}
                  </a>

                  {/* Dropdown Menu */}
                  {link.subItems && activeDropdown === link.name && (
                    <div className="absolute top-full left-0 w-64 pt-2 shadow-2xl z-50">
                      <div className="bg-[#141247] border border-white/10 rounded-xl p-3 shadow-2xl backdrop-blur-md">
                        {link.subItems.map((sub) => (
                          <a
                            key={sub.label}
                            href={sub.href}
                            className="block px-3 py-2 text-xs font-medium text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          >
                            {sub.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Action Icons & Direct Call Hotline */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Direct Call Button */}
              <a
                href={`tel:${COMPANY_INFO.phones[0]}`}
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white font-medium transition-all"
                title="Call Founder Mr. Manjunath Rao G"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
                <span>Call Factory</span>
              </a>

              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-white hover:text-blue-200 hover:bg-white/10 rounded-full transition-colors relative"
                aria-label="Search garments"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <a
                href="#wishlist"
                className="p-2 text-white hover:text-blue-200 hover:bg-white/10 rounded-full transition-colors relative"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </a>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 bg-white text-[#1A175A] hover:bg-blue-50 px-3.5 py-2 rounded-full font-semibold text-xs sm:text-sm shadow-md transition-all hover:scale-105"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-[#1A175A]" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">Order Bag</span>
              </button>
            </div>

          </div>

          {/* Search Input Bar */}
          {searchOpen && (
            <div className="pb-4 pt-1 animate-fade-in">
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Scrub suits, Doctor aprons, Underscrubs, Patient gowns, Patient pant & shirt..."
                  className="w-full bg-[#110E3F] text-white placeholder-blue-300/60 pl-11 pr-10 py-3 rounded-full text-sm border border-white/20 focus:outline-none focus:border-white shadow-inner"
                  autoFocus
                />
                <Search className="w-5 h-5 text-blue-300 absolute left-4 top-3.5" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-3.5 text-blue-300 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#1A175A] text-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div>
                <span className="font-sans text-2xl font-black tracking-wider block">ΛNR</span>
                <span className="text-[10px] uppercase tracking-widest text-blue-200">
                  Hospital Garments • Bangalore
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md text-white hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="py-6 space-y-4 flex-1">
              {navLinks.map((link) => (
                <div key={link.name} className="border-b border-white/5 pb-2">
                  <a
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-base font-semibold text-white hover:text-blue-200"
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="text-[10px] bg-sky-400 text-[#1A175A] font-bold px-2 py-0.5 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </a>
                  {link.subItems && (
                    <div className="pl-4 mt-1 space-y-2">
                      {link.subItems.map((sub) => (
                        <a
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-xs text-blue-200 hover:text-white py-1"
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Contact Card */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <a
                href="#bulk-inquiry"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center bg-amber-400 text-[#1A175A] py-3 rounded-xl font-bold text-sm shadow hover:bg-amber-300"
              >
                Request Hospital Bulk Quote
              </a>
              <div className="space-y-1.5 text-xs text-blue-200 pt-2 text-center">
                <p className="font-semibold text-white">Contacts: Mr. Manjunath Rao & Mr. Balraj</p>
                <p>9986044574 / 6363429113</p>
                <p className="text-[11px] text-amber-300">Girinagar, Banashankari, Bangalore</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
