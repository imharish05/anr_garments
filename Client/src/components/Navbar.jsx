import React, { Suspense, lazy, useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import anrLogo from '../assets/anr-logo.jpg';
import { fetchCategoriesTree, getCategoryPageLink, getSubcategoryPageLink } from '../services/api';
import useStorefrontSetting from '../hooks/useStorefrontSetting';
import NavbarCircularItem from './NavbarCircularItem';
import { observeElementHeightVar } from '../utils/viewportVars';

const SearchModal = lazy(() => import('./SearchModal'));
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowRight,
  Sparkles,
  User
} from 'lucide-react';

const Logo = ({ className = "h-9 sm:h-11 lg:h-12" }) => (
  <Link to="/" className="flex items-center flex-shrink-0">
    <img src={anrLogo} alt="ANR Hospital Garments" className={`${className} w-auto object-contain rounded`} />
  </Link>
);

const Navbar = () => {
  const { totalItems, setIsCartOpen, wishlistCount, currentUser } = useCart();
  const location = useLocation();
  const { data: storefront } = useStorefrontSetting('storefront');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ left: 0 });
  const [searchOpened, setSearchOpened] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);

  // Category slider & overflow state
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // References
  const headerRef = useRef(null);
  const navContainerRef = useRef(null);
  const navScrollRef = useRef(null);
  const categoryRefs = useRef({});
  const closeTimeoutRef = useRef(null);

  // Sync sticky navbar height CSS variable so HeroBanner + Topbar + Navbar = 100vh
  useLayoutEffect(
    () => observeElementHeightVar(headerRef.current, '--anr-navbar-height'),
    []
  );

  // Fetch dynamic categories tree from backend Admin API
  const loadCategories = useCallback(async () => {
    try {
      const tree = await fetchCategoriesTree();
      if (tree && tree.length > 0) {
        setCategoriesList(tree);
      }
    } catch (err) {
      console.warn('Navbar: failed to fetch categories tree:', err?.message);
      setCategoriesList([]);
    }
  }, []);

  useEffect(() => {
    loadCategories();
    // Refetch on window focus so admin changes in other tab reflect instantly
    window.addEventListener('focus', loadCategories);
    return () => {
      window.removeEventListener('focus', loadCategories);
    };
  }, [loadCategories]);

  // Keyboard shortcut (Ctrl/Cmd + K) to quickly trigger Search Modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpened(true);
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

  // Close dropdown and mobile drawer automatically on route navigation
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    setSearchModalOpen(false);
  }, [location.pathname, location.search]);

  // Close dropdown on window scroll
  useEffect(() => {
    const handleWindowScroll = () => {
      if (activeDropdown) setActiveDropdown(null);
    };
    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [activeDropdown]);

  // Transform dynamic categories into mainLinks (respecting isActive & showHeader)
  const mainLinks = categoriesList
    .filter((cat) => cat.isActive !== false && cat.showHeader !== false)
    .map((cat) => {
      const catHref =
        cat.href && cat.href.startsWith('/') ? cat.href : getCategoryPageLink(cat.slug);
      return {
        id: cat.id || cat.slug,
        slug: cat.slug || '',
        name: cat.name || cat.title,
        href: catHref,
        image: cat.image,
        description: cat.description,
        badge: cat.badge || null,
        subcategories: (cat.subcategories || [])
          .filter((sub) => sub.isActive !== false)
          .map((sub) => ({
            id: sub.id || sub.slug,
            slug: sub.slug || '',
            name: sub.name || sub.label,
            label: sub.name || sub.label,
            href:
              sub.href && sub.href.startsWith('/')
                ? sub.href
                : getSubcategoryPageLink(cat.slug, sub.slug),
            image: sub.image || cat.image,
          })),
      };
    });

  const bulkLink = {
    name: "Bulk Orders",
    href: "/bulk-order",
    highlight: true
  };

  const currentPath = location.pathname || '/';
  const isLoggedIn = Boolean(currentUser || (typeof window !== 'undefined' && localStorage.getItem('anr_user')));

  const iconBtn =
    "relative p-2.5 text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white";

  // Check category slider overflow status
  const checkNavOverflow = useCallback(() => {
    const el = navScrollRef.current;
    if (!el) return;

    // Check if scrollable content exceeds visible container
    const overflow = el.scrollWidth > el.clientWidth + 4;
    setIsOverflowing(overflow);

    if (!overflow) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 6);
  }, []);

  // Monitor element resizing and content changes for slider overflow
  useEffect(() => {
    const el = navScrollRef.current;
    if (!el) return;

    checkNavOverflow();

    const resizeObserver = new ResizeObserver(() => {
      checkNavOverflow();
    });

    resizeObserver.observe(el);
    window.addEventListener('resize', checkNavOverflow);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkNavOverflow);
    };
  }, [checkNavOverflow, mainLinks.length]);

  const handleScroll = () => {
    checkNavOverflow();
    if (activeDropdown) {
      setActiveDropdown(null);
    }
  };

  const scrollNav = (direction) => {
    const el = navScrollRef.current;
    if (!el) return;
    const distance = 240;
    el.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth'
    });
    setTimeout(checkNavOverflow, 280);
  };

  // Dropdown hover interactions with smooth grace timeout
  const handleCategoryMouseEnter = (link) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    if (!link.subcategories || link.subcategories.length === 0) {
      setActiveDropdown(null);
      return;
    }

    const itemEl = categoryRefs.current[link.name];
    const containerEl = navContainerRef.current;
    if (itemEl && containerEl) {
      const itemRect = itemEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();

      // Align dropdown card with category link
      let left = itemRect.left - containerRect.left;
      // Clamp dropdown so 320px width stays within the header container
      const maxLeft = containerRect.width - 330;
      left = Math.max(8, Math.min(left, maxLeft));

      setDropdownPos({ left });
    }

    setActiveDropdown(link.name);
  };

  const handleCategoryMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const handleDropdownMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleDropdownMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const activeDropdownLink = mainLinks.find((l) => l.name === activeDropdown);

  if (searchModalOpen && !searchOpened) {
    setSearchOpened(true);
  }

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-40 bg-[#1A175A] text-white shadow-lg">
        <div ref={navContainerRef} className="w-full px-4 sm:px-6 lg:px-6 xl:px-8 relative">
          <div className="flex items-center justify-between h-16 lg:h-[68px] gap-2.5 sm:gap-3 lg:gap-4 2xl:gap-6">

            {/* Left: Hamburger (mobile) + ANR Brand Logo */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className={`${iconBtn} lg:hidden -ml-2`}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <Logo />
            </div>

            {/* Center: Dynamic Category Navigation Links (Desktop Slider) */}
            <div className="hidden lg:flex items-center flex-1 min-w-0 relative px-1 xl:px-2">
              {/* Left scroll icon - only shown when overflowing and scrollable left */}
              {canScrollLeft && (
                <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center pr-4 bg-gradient-to-r from-[#1A175A] via-[#1A175A]/95 to-transparent">
                  <button
                    type="button"
                    onClick={() => scrollNav('left')}
                    className="p-1.5 rounded-full bg-[#141247] hover:bg-white text-white hover:text-[#1A175A] border border-white/25 shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-white group"
                    aria-label="Scroll categories left"
                    title="Previous categories"
                  >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                </div>
              )}

              {/* Scrollable category links track */}
              <nav
                ref={navScrollRef}
                onScroll={handleScroll}
                className={`flex items-center gap-0.5 xl:gap-1 2xl:gap-2.5 overflow-x-auto scrollbar-none scroll-smooth h-16 lg:h-[68px] w-full ${
                  isOverflowing ? 'justify-start' : 'justify-center'
                }`}
              >
                {mainLinks.map((link) => {
                  const hasSubs = link.subcategories && link.subcategories.length > 0;
                  const isDropdownOpen = activeDropdown === link.name;
                  const isRouteActive =
                    currentPath === link.href ||
                    currentPath.startsWith(`${link.href}/`);
                  const isItemActive = isDropdownOpen || isRouteActive;

                  return (
                    <div
                      key={link.name}
                      ref={(el) => (categoryRefs.current[link.name] = el)}
                      className="relative h-16 lg:h-[68px] flex items-center flex-shrink-0"
                      onMouseEnter={() => handleCategoryMouseEnter(link)}
                      onMouseLeave={handleCategoryMouseLeave}
                    >
                      <NavbarCircularItem
                        as={Link}
                        to={link.href}
                        active={isItemActive}
                        onClick={() => {
                          setActiveDropdown(null);
                        }}
                        className="rounded-full flex-shrink-0"
                        contentClassName="inline-flex items-center gap-1 px-2 xl:px-2.5 2xl:px-3.5 py-1.5 text-[12.5px] xl:text-[13px] 2xl:text-sm font-semibold whitespace-nowrap"
                        darkClassName="text-white/95"
                        lightClassName="bg-white text-[#1A175A] shadow-sm"
                        renderContent={({ isLight }) => (
                          <>
                            <span>{link.name}</span>
                            {link.badge && (
                              <span
                                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                  isLight
                                    ? 'bg-[#1A175A] text-white'
                                    : 'bg-sky-400 text-[#1A175A]'
                                }`}
                              >
                                {link.badge}
                              </span>
                            )}
                            {hasSubs && (
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                  isLight ? 'opacity-90 text-[#1A175A]' : 'opacity-70 text-white'
                                } ${isDropdownOpen ? 'rotate-180' : ''}`}
                              />
                            )}
                          </>
                        )}
                      />
                    </div>
                  );
                })}
              </nav>

              {/* Right scroll icon - only shown when overflowing and scrollable right */}
              {canScrollRight && (
                <div className="absolute right-0 top-0 bottom-0 z-20 flex items-center pl-4 bg-gradient-to-l from-[#1A175A] via-[#1A175A]/95 to-transparent">
                  <button
                    type="button"
                    onClick={() => scrollNav('right')}
                    className="p-1.5 rounded-full bg-[#141247] hover:bg-white text-white hover:text-[#1A175A] border border-white/25 shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-white group"
                    aria-label="Scroll categories right"
                    title="Next categories"
                  >
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              )}
            </div>

            {/* Right: Actions (Bulk Orders + Search Bar + My Account + Wishlist + Cart) */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <NavbarCircularItem
                as={Link}
                to={bulkLink.href}
                active={currentPath === '/bulk-order' || currentPath === '/bulk-inquiry'}
                className="hidden lg:inline-flex rounded-full mr-0.5 xl:mr-1 shadow-sm"
                contentClassName="inline-flex items-center px-3.5 py-1.5 text-xs xl:text-[13px] font-bold whitespace-nowrap"
                darkClassName="bg-white/15 border border-white/25 text-white"
                lightClassName="bg-white text-[#1A175A] shadow-sm"
              >
                {bulkLink.name}
              </NavbarCircularItem>

              {/* Search Icon Button */}
              <NavbarCircularItem
                as="button"
                type="button"
                active={searchModalOpen}
                onClick={() => setSearchModalOpen(true)}
                className="rounded-full w-9 h-9 sm:w-10 sm:h-10 justify-center flex-shrink-0"
                contentClassName="w-9 h-9 sm:w-10 sm:h-10 inline-flex items-center justify-center rounded-full"
                darkClassName="text-white"
                lightClassName="bg-white text-[#1A175A] shadow-sm"
                aria-label="Open search dialog"
                title="Search (Ctrl+K)"
              >
                <Search className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
              </NavbarCircularItem>

              {/* Simple White My Account / Login Icon right near Search Icon */}
              <NavbarCircularItem
                as={Link}
                to={isLoggedIn ? '/account' : '/login'}
                active={currentPath === '/account' || currentPath === '/login'}
                className="rounded-full w-9 h-9 sm:w-10 sm:h-10 justify-center flex-shrink-0"
                contentClassName="w-9 h-9 sm:w-10 sm:h-10 inline-flex items-center justify-center rounded-full"
                darkClassName="text-white"
                lightClassName="bg-white text-[#1A175A] shadow-sm"
                title="Doctor Account"
                aria-label="Doctor Account"
              >
                <User className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
              </NavbarCircularItem>

              {/* Wishlist Button */}
              <div className="relative flex-shrink-0">
                <NavbarCircularItem
                  as={Link}
                  to="/wishlist"
                  active={currentPath === '/wishlist'}
                  className="rounded-full w-9 h-9 sm:w-10 sm:h-10 justify-center"
                  contentClassName="w-9 h-9 sm:w-10 sm:h-10 inline-flex items-center justify-center rounded-full"
                  darkClassName="text-white"
                  lightClassName="bg-white text-[#1A175A] shadow-sm"
                  title="Saved Uniforms"
                  aria-label="Saved Uniforms"
                >
                  <Heart className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                </NavbarCircularItem>
                {wishlistCount > 0 && (
                  <span className="pointer-events-none absolute top-0 right-0 z-20 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {wishlistCount}
                  </span>
                )}
              </div>

              {/* Shopping Bag Button */}
              <div className="relative flex-shrink-0">
                <NavbarCircularItem
                  as="button"
                  type="button"
                  active={currentPath === '/cart'}
                  onClick={() => {
                    if (currentPath === '/cart') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                      setIsCartOpen(true);
                    }
                  }}
                  className="rounded-full w-9 h-9 sm:w-10 sm:h-10 justify-center"
                  contentClassName="w-9 h-9 sm:w-10 sm:h-10 inline-flex items-center justify-center rounded-full"
                  darkClassName="text-white"
                  lightClassName="bg-white text-[#1A175A] shadow-sm"
                  aria-label="Order bag"
                >
                  <ShoppingBag className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                </NavbarCircularItem>
                {totalItems > 0 && (
                  <span className="pointer-events-none absolute top-0 right-0 z-20 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {totalItems}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Category Dropdown rendered at container level so it's NEVER clipped */}
          {activeDropdownLink && activeDropdownLink.subcategories?.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: `${dropdownPos.left}px`
              }}
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleDropdownMouseLeave}
              className="z-50 w-72 sm:w-80 pt-1"
            >
              <div className="bg-[#141247] border border-white/15 rounded-2xl p-3 shadow-2xl">
                <div className="flex items-center justify-between px-2 pb-2 mb-1.5 border-b border-white/10">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                    Sub-Categories ({activeDropdownLink.subcategories.length})
                  </span>
                </div>

                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 scrollbar-none">
                  {activeDropdownLink.subcategories.map((sub) => (
                    <NavbarCircularItem
                      key={sub.label || sub.name || sub.id}
                      as={Link}
                      to={sub.href}
                      active={currentPath === sub.href}
                      onClick={() => {
                        setActiveDropdown(null);
                      }}
                      className="w-full rounded-xl"
                      contentClassName="w-full flex items-center gap-3.5 p-2.5 rounded-xl"
                      darkClassName="text-white"
                      lightClassName="bg-white text-[#1A175A] shadow-sm"
                      renderContent={({ isLight }) => (
                        <>
                          {sub.image && (
                            <div
                              className={`w-10 h-10 rounded-lg overflow-hidden border flex-shrink-0 shadow-sm relative ${
                                isLight
                                  ? 'bg-slate-100 border-slate-200'
                                  : 'bg-white/10 border-white/20'
                              }`}
                            >
                              <img
                                src={sub.image}
                                alt={sub.label || sub.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-semibold truncate ${
                                isLight ? 'text-[#1A175A]' : 'text-white'
                              }`}
                            >
                              {sub.label || sub.name}
                            </p>
                          </div>

                          <ArrowRight
                            className={`w-4 h-4 flex-shrink-0 transition-transform ${
                              isLight
                                ? 'text-[#1A175A] translate-x-0.5'
                                : 'text-blue-300 opacity-60'
                            }`}
                          />
                        </>
                      )}
                    />
                  ))}
                </div>

                <div className="pt-2.5 mt-2 border-t border-white/10 px-2">
                  <Link
                    to={activeDropdownLink.href}
                    onClick={() => setActiveDropdown(null)}
                    className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-blue-200 group/link"
                  >
                    <span>Browse All in {activeDropdownLink.name}</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Interactive Clinical Search Modal with Overview */}
      {(searchModalOpen || searchOpened) && (
        <Suspense fallback={null}>
          <SearchModal
            isOpen={searchModalOpen}
            onClose={() => setSearchModalOpen(false)}
          />
        </Suspense>
      )}

      {/* Mobile Drawer Navigation with Category & Subcategory Images */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
        <aside className={`absolute left-0 top-0 h-full w-4/5 max-w-sm bg-[#1A175A] text-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <Logo className="h-12" />
            <button onClick={() => setMobileMenuOpen(false)} className={iconBtn} aria-label="Close menu">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Search Button in Mobile Drawer */}
          <div className="px-6 py-3.5 border-b border-white/10 space-y-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchModalOpen(true);
              }}
              className="w-full flex items-center gap-3 bg-[#110E3F] text-blue-200/80 px-4 py-3 rounded-full text-sm border border-white/15"
            >
              <Search className="w-4 h-4 text-blue-200" />
              <span>Search scrubs, lab coats, specs...</span>
            </button>

            {/* Browse Catalog Link in Mobile Menu */}
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-between bg-white/10 hover:bg-white/15 text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-white" />
                <span>Browse All Apparel</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* My Account Link in Mobile Menu */}
            <Link
              to={isLoggedIn ? '/account' : '/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-between bg-white/10 hover:bg-white/15 text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-white" />
                <span>My Account</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Shopping Bag Link in Mobile Menu */}
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-between bg-white/10 hover:bg-white/15 text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>Shopping Bag {totalItems > 0 ? `(${totalItems})` : ''}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-3">
            {mainLinks.map((link) => {
              const isOpen = openMobileSection === link.name;
              const hasSubs = link.subcategories && link.subcategories.length > 0;

              return (
                <div key={link.name} className="border-b border-white/10 py-1.5">
                  <div className="flex items-center justify-between">
                    <Link
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 flex items-center gap-3.5 py-3.5 text-base font-semibold hover:text-blue-200"
                    >
                      {/* Category Thumbnail Image in Mobile Menu */}
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-800 border border-white/20 flex-shrink-0 shadow-sm">
                        <img
                          src={link.image}
                          alt={link.name}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block truncate">{link.name}</span>
                        {link.badge && (
                          <span className="text-[10px] bg-sky-400 text-[#1A175A] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5">
                            {link.badge}
                          </span>
                        )}
                      </div>
                    </Link>

                    {hasSubs && (
                      <button
                        onClick={() => setOpenMobileSection(isOpen ? null : link.name)}
                        className="p-2.5 text-white/80 hover:text-white"
                        aria-label={`Toggle ${link.name}`}
                        aria-expanded={isOpen}
                      >
                        <Plus className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-45 text-blue-200' : ''}`} />
                      </button>
                    )}
                  </div>

                  {/* Subcategories Accordion with Images in Mobile Menu */}
                  {hasSubs && (
                    <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <div className="pl-3.5 pb-3.5 ml-4 space-y-2.5 border-l-2 border-white/30">
                          {link.subcategories.map((sub) => (
                            <Link
                              key={sub.label || sub.name}
                              to={sub.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-3 py-1.5 text-sm text-blue-200 hover:text-white group"
                            >
                              {/* Subcategory Image Thumbnail in Mobile Drawer */}
                              <div className="w-7 h-7 rounded-md overflow-hidden bg-slate-800 border border-white/20 flex-shrink-0">
                                <img
                                  src={sub.image}
                                  alt={sub.label || sub.name}
                                  loading="lazy"
                                  decoding="async"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="group-hover:text-white transition-colors truncate">
                                {sub.label || sub.name}
                              </span>
                            </Link>
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
            <Link
              to="/bulk-order"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center bg-white text-[#1A175A] py-3 rounded-full font-bold text-sm hover:bg-blue-50 transition-colors shadow"
            >
              Request Hospital Bulk Quote
            </Link>
            <div className="space-y-1 text-xs text-blue-200 text-center">
              <p className="font-semibold text-white">{storefront?.brandName || 'ANR Hospital Garments'}</p>
              {Array.isArray(storefront?.phones) && storefront.phones.length > 0 && (
                <p>{storefront.phones.join(' / ')}</p>
              )}
              {storefront?.address && (
                <p className="text-[11px] text-blue-200 line-clamp-2">{storefront.address}</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Navbar;