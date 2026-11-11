# Comprehensive Survey Report: Storefront Routing, Navbar Navigation, and Product Listing Page (R1)

**Investigator**: `explorer_survey_1` (Teamwork Explorer)  
**Date**: 2026-11-11T08:10:00Z  
**Target Project**: ANR Hospital Garments Storefront (`Client/` & `Server/`)  
**Objective**: Architectural survey of routing, navigation links, catalog data model, and full specification for a dedicated Product Listing Page (PLP) eliminating `#id` anchor scrolling.

---

## 1. Executive Summary

A comprehensive investigation of the ANR Hospital Garments codebase was performed to evaluate the current storefront routing, category navigation, catalog data flow, and product listing architecture. 

### Key Discoveries:
1. **Dedicated Product Listing Page is Completely Missing**: There is no `/products` or `/shop` route in `Client/src/App.jsx`. In `Client/src/pages/`, no PLP component exists. Any navigation to `/products` (without a `:slug`) or `/shop` is caught by the wildcard fallback (`<Route path="*" element={<HomePage />} />`), returning users to the homepage.
2. **Anchor Hash Navigation Disconnect**: All navbar categories, dropdown subcategories, category cards, and search modal product clicks are hardwired to anchor hashes (such as `#scrubs-collection`, `#aprons-collection`, `#underscrubs-collection`, `#patient-wear-collection`, and `#categories`) via `getCategorySectionLink()` in `Client/src/services/api.js`.
   - On non-homepage views (`/about`, `/contact`, `/wishlist`, `/product/:slug`, `/checkout`), clicking category/subcategory links changes the URL hash (e.g., `/about#scrubs-collection`) but fails to navigate to products because the sections do not exist on those pages.
   - On the homepage, clicking links abruptly scrolls to 1 of 4 hardcoded sections, completely bypassing subcategory filtering, facet controls, sorting, or pagination. Subcategory links all scroll to the parent section with zero filtering applied.
3. **Backend Catalog API is Healthy & Capable**: The backend (`http://localhost:5000`) is active. `GET /api/categories/tree` provides 5 healthcare garment categories with their subcategories. `GET /api/products` provides 14 medical uniform products with full variant, color, size, pricing, and category metadata. The endpoint already supports filtering by category/subcategory slug via the `category` query param.
4. **Implementation Blueprint Ready**: A complete architectural plan has been formulated for `ProductListingPage.jsx`, mapped to `/products` (and alias `/shop`), driven by URL query parameters (`?category=...&subcategory=...&sort=...&search=...`), equipped with responsive facet filters (categories, subcategories, price range, garment sizes, colors, and stock/bestseller badges), and fully rewired across all desktop and mobile navigation entry points to eliminate anchor scrolling.

---

## 2. Storefront Routing Setup (`App.jsx`, React Router, Pages)

### 2.1 Configuration Analysis
- **Framework & Libraries**: React 19.3.1 (`Client/package.json:14`), React Router DOM 7.18.5 (`Client/package.json:16`), Vite 8.3.6 (`Client/package.json:26`).
- **Router Implementation**: Standard declarative `<BrowserRouter>` with `<Routes>` and lazy-loaded components wrapped in `<Suspense fallback={<RouteFallback />}>`.

### 2.2 Route Table in `Client/src/App.jsx`
```jsx
// Client/src/App.jsx (lines 28-59)
<Routes>
  {/* 1. Core Storefront */}
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />

  {/* 2. Institutional & Informational Pages */}
  <Route path="/about" element={<AboutPage />} />
  <Route path="/contact" element={<ContactPage />} />
  <Route path="/bulk-order" element={<BulkOrderPage />} />
  <Route path="/bulk-inquiry" element={<BulkOrderPage />} />

  {/* 3. Product Catalog & Customization Studio */}
  <Route path="/product/:slug" element={<ProductDetailPage />} />
  <Route path="/products/:slug" element={<ProductDetailPage />} />

  {/* 4. Customer Shopping & Checkout Flow */}
  <Route path="/wishlist" element={<WishlistPage />} />
  <Route path="/checkout" element={<CheckoutPage />} />
  <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
  <Route path="/account" element={<AccountPage />} />
  <Route path="/my-orders" element={<AccountPage />} />

  {/* 5. Healthcare Legal & Hospital Policies */}
  <Route path="/faq" element={<FaqPage />} />
  <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
  <Route path="/cancellation-refund-policy" element={<CancellationRefundPolicyPage />} />
  <Route path="/terms" element={<TermsPage />} />
  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

  {/* Fallback */}
  <Route path="*" element={<HomePage />} />
</Routes>
```

### 2.3 Critical Routing Gaps Identified
1. **Missing `/products` and `/shop`**: Notice line 41 has `/products/:slug`, which requires a slug parameter. If a user enters `/products` or clicks a link to `/products`, it does NOT match line 41; it falls through to line 58 (`<Route path="*" element={<HomePage />} />`).
2. **Missing `/cart`**: There is no route for `/cart`. The shopping bag in the navbar toggles `isCartOpen(true)` (the drawer). If `/cart` is accessed, it falls back to `HomePage`.
3. **Layout Consistency**: `Client/src/components/Layout.jsx` provides a consistent shell (`<TopAnnouncementBar />`, `<Navbar />`, `<main>{children}</main>`, `<Footer />`, `<LazyCartDrawer />`), which is utilized by secondary pages (e.g., `WishlistPage.jsx:17`, `AboutPage.jsx`). The new `ProductListingPage.jsx` can adopt this exact `<Layout>` wrapper for 100% visual and functional consistency.

---

## 3. Current Product Listing Status & In-Page Limitations

### 3.1 Status of PLP
- **Dedicated PLP File**: Does NOT exist in `Client/src/pages/` or `Client/src/components/`.
- **Where Products Currently Live**: Products are rendered exclusively on the homepage (`Client/src/pages/HomePage.jsx`), split into 4 separate presentation sections:
  1. `<ProductListClassic />` (`Client/src/components/ProductListClassic.jsx`):
     - Section ID: `#scrubs-collection`
     - Query filter: `categorySlugs = ['scrub-suits']`
     - Limit: 12 products
  2. `<ProductListLabCoats />` (`Client/src/components/ProductListLabCoats.jsx`):
     - Section ID: `#aprons-collection`
     - Query filter: `categorySlugs = ['aprons-lab-coats']`
     - Limit: 12 products
  3. `<ProductListEcoflex />` (`Client/src/components/ProductListEcoflex.jsx`):
     - Section ID: `#underscrubs-collection`
     - Query filter: `categorySlugs = ['underscrubs']`
     - Limit: 12 products
  4. `<ProductListPatientWear />` (`Client/src/components/ProductListPatientWear.jsx`):
     - Section ID: `#patient-wear-collection`
     - Query filter: `categorySlugs = ['patient-gown', 'patient-pant-shirt']`, `categoryIds = [19, 20]`
     - Limit: 12 products

### 3.2 Key Deficiencies of the Current Approach
- **No Subcategory Granularity**: When a user selects a subcategory like "Women's Tailored Scrub Suits", there is no way on the homepage to isolate or filter down to just tailored scrub suits. All 4 scrub suits are rendered indiscriminately in the `#scrubs-collection` grid.
- **No Facet Filters**: There are no filters for size (S, M, L, XL, 2XL), color swatches, price range, or rating.
- **No Sorting Controls**: Users cannot sort products by price (low-high / high-low), popularity, or newest arrivals.
- **Section CTA Dead End**: The collection section headers have a CTA button (`ProductCollectionSection.jsx:15-16`) that currently links to `ctaTo="/bulk-order"` instead of viewing the full product collection!
- **Non-Home Broken Navigation**: If a user is on `/bulk-order` or `/about` or `/product/:slug` and clicks a category link in the navbar, the browser attempts an in-page anchor jump to `#scrubs-collection`, doing nothing and stranding the user.

---

## 4. Navbar Architecture & Anchor Hash Wiring Analysis

### 4.1 Root Cause in `Client/src/services/api.js`
In `Client/src/services/api.js` (lines 170-177):
```javascript
export const getCategorySectionLink = (slug = '') => {
  const s = String(slug).toLowerCase();
  if (s.includes('scrub') && !s.includes('under')) return '#scrubs-collection';
  if (s.includes('apron') || s.includes('lab') || s.includes('coat')) return '#aprons-collection';
  if (s.includes('under') || s.includes('ecoflex')) return '#underscrubs-collection';
  if (s.includes('patient') || s.includes('gown')) return '#patient-wear-collection';
  return '#categories';
};
```
In `fetchCategoriesTree()` (lines 197-215):
```javascript
const mapped = rawCats
  .filter((cat) => cat && cat.isActive !== false)
  .map((cat) => ({
    id: cat.id,
    name: cat.name || '',
    slug: cat.slug || '',
    description: cat.description || '',
    image: getImageUrl(cat.image),
    href: getCategorySectionLink(cat.slug), // <-- HARDCODED TO ANCHOR HASH
    subcategories: (cat.subcategories || cat.subCategories || [])
      .filter((sub) => sub && sub.isActive !== false)
      .map((sub) => ({
        id: sub.id,
        name: sub.name || '',
        slug: sub.slug || '',
        href: getCategorySectionLink(cat.slug), // <-- HARDCODED TO PARENT ANCHOR HASH
        image: getImageUrl(sub.image) || getImageUrl(cat.image),
      })),
  }));
```

### 4.2 Impacted Navigation Components Across the Codebase
| File | Line(s) | Current Link Construct | Issue / Impact |
|---|---|---|---|
| `Client/src/components/Navbar.jsx` | 116, 126 | `href: cat.href \|\| ... \|\| getCategorySectionLink(cat.slug)` | Maps both categories and subcategories to `#...-collection` |
| `Client/src/components/Navbar.jsx` | 312-321 | `<NavbarCircularItem as="a" href={link.href} ...>` | Native `<a>` tag with `#id` anchor jump |
| `Client/src/components/Navbar.jsx` | 480-489 | `<NavbarCircularItem as="a" href={sub.href} ...>` | Subcategory dropdown link scrolls to parent `#id` |
| `Client/src/components/Navbar.jsx` | 537-545 | `<a href={activeDropdownLink.href}>Browse All in...</a>` | Dropdown footer scrolls to `#id` |
| `Client/src/components/Navbar.jsx` | 587-597 | `<a href="#shop-categories">Shop by Category</a>` | Mobile menu button jumps to `#shop-categories` |
| `Client/src/components/Navbar.jsx` | 621-645 | `<a href={link.href}>...</a>` | Mobile drawer category link jumps to `#id` |
| `Client/src/components/Navbar.jsx` | 665-686 | `<a href={sub.href}>...</a>` | Mobile drawer subcategory link jumps to `#id` |
| `Client/src/components/ShopByCategory.jsx` | 189-195 | `<a href={cat.link \|\| cat.href \|\| '#scrubs-collection'}>` | Category hexagon cards jump to `#scrubs-collection` |
| `Client/src/components/ShopByColor.jsx` | 288-299 | `<a href={color.link \|\| '#scrubs-collection'}>` | Color cards jump to `#scrubs-collection` |
| `Client/src/components/SearchModal.jsx` | 104-110, 234 | `handleSelectProduct(product.sectionId)` with `scrollIntoView` | Search results jump to homepage sections |
| `Client/src/components/ProductCollectionSection.jsx` | 15-16, 86-93 | `<Link to={ctaTo}>` with `ctaTo="/bulk-order"` | CTA directs users to bulk orders instead of catalog |
| `Client/src/components/Footer.jsx` | 83-86 | `getCategorySectionLink(cat.slug)` returning `#...` | Footer category links point to homepage anchors |

---

## 5. Catalog Data Model & API Infrastructure

### 5.1 Categories API (`GET /api/categories/tree`)
Verified live from `http://localhost:5000/api/categories/tree`. The database contains 5 active categories and 14 active subcategories:

| Category ID | Category Name | Category Slug | Active Subcategories (Name & Slug) |
|---|---|---|---|
| **16** | **Scrub Suits** | `scrub-suits` | • Classic Scrub Suits (Unisex) (`classic-scrub-suits-unisex`)<br>• Women's Tailored Scrub Suits (`womens-tailored-scrub-suits`)<br>• Men's Multi-Pocket Cargo Scrubs (`mens-multi-pocket-cargo-scrubs`)<br>• OT & Surgical Scrub Suits (`ot-surgical-scrub-suits`) |
| **17** | **Aprons & Lab Coats** | `aprons-lab-coats` | • Doctor Full-Length Lab Coats (`doctor-full-length-lab-coats`)<br>• Consultation Half-Sleeve Aprons (`consultation-half-sleeve-aprons`)<br>• Women's Fitted Doctor Aprons (`womens-fitted-doctor-aprons`) |
| **18** | **Underscrubs** | `underscrubs` | • Performance Long Sleeve Underscrubs (`performance-long-sleeve-underscrubs`)<br>• Women's Cooling Moisture-Wicking (`womens-cooling-moisture-wicking`)<br>• Men's Athletic Fit Crew Underscrubs (`mens-athletic-fit-crew-underscrubs`) |
| **19** | **Patient Gown** | `patient-gown` | • Hospital Patient Gowns (Tie-Back) (`hospital-patient-gowns-tie-back`)<br>• Two-Piece Patient Pant & Shirt Sets (`two-piece-patient-pant-shirt-sets`)<br>• OT & Maternity Patient Gowns (`ot-maternity-patient-gowns`) |
| **20** | **Patient Pant & Shirt** | `patient-pant-shirt` | • Autoclavable OT Green Drapes (`autoclavable-ot-green-drapes`) |

### 5.2 Products API (`GET /api/products`)
Verified live from `http://localhost:5000/api/products?limit=100`. Total products in database: **14 items**.

#### Sample Product Data Model (normalized by `Client/src/services/api.js`):
```typescript
interface NormalizedProduct {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  subCategoryId: number | null;
  category: string;             // e.g. "Scrub Suits"
  categorySlug: string;         // e.g. "scrub-suits"
  subcategory?: string;         // from raw.subcategory?.name
  subcategorySlug?: string;     // from raw.subcategory?.slug
  price: number;                // e.g. 1299
  mrp: number;                  // e.g. 1699
  discountPercent: number;      // e.g. 24
  discount: string;             // e.g. "24% OFF"
  rating: number;               // e.g. 4.9
  reviews: number;              // e.g. 580
  image: string;                // primary image URL
  images: string[];             // gallery array
  hoverImage?: string;          // secondary image for hover flip
  badge: string;                // "BESTSELLER" | "NEW" | "FEATURED"
  shortDescription: string;
  description: string;
  stock: number;
  sku: string;
  sizes: string[];              // ["S", "M", "L", "XL", "2XL"]
  colors: Array<{
    name: string;               // e.g. "Navy Blue"
    hex: string;                // e.g. "#1A175A"
    image: string;
  }>;
  variants: Array<{
    id: number;
    sku: string;
    price: number;
    stock: number;
    attributes: Record<string, any>;
    colorHex: string;
    image: string;
  }>;
}
```

### 5.3 Backend Controller Capabilities (`Server/controllers/productController.js`)
The `getAll` controller in `productController.js` (lines 164-237) already parses the following query parameters:
- `page` & `limit` (pagination)
- `category` (slug or id - checks Category first, then SubCategory)
- `minPrice` & `maxPrice` (Sequelize `Op.gte` / `Op.lte`)
- `sort` & `order` (`createdAt`, `price`, `name`, etc.)
- `search` (Sequelize `Op.like %search%` on product name)
- `featured`, `newArrival`, `bestSeller` (boolean filters)
- `minDiscount` & `maxDiscount`

*Note*: If both `category` AND `subcategory` slugs are supplied in the query string (`?category=scrub-suits&subcategory=classic-scrub-suits-unisex`), the client can either pass `category=classic-scrub-suits-unisex` to the backend (which resolves the subcategory directly) or the client-side PLP filter engine can apply instantaneous in-memory subcategory filtering on the loaded category dataset, ensuring a latency-free 60 FPS user experience.

---

## 6. Implementation Plan: Dedicated Product Listing Page (`/products`)

### 6.1 Route Specification
In `Client/src/App.jsx`:
```jsx
const ProductListingPage = lazy(() => import('./pages/ProductListingPage'));

// Under Product Catalog routes:
<Route path="/products" element={<ProductListingPage />} />
<Route path="/shop" element={<ProductListingPage />} />
<Route path="/product/:slug" element={<ProductDetailPage />} />
<Route path="/products/:slug" element={<ProductDetailPage />} />
```
*Note*: In React Router v7, `/products` and `/products/:slug` co-exist cleanly without conflict. Exact `/products` matches `ProductListingPage`, while `/products/something-slug` matches `ProductDetailPage`.

### 6.2 URL Query Parameter Scheme
The PLP will synchronize its state with `window.location.search` via `useSearchParams()`:

| Query Param | Type | Example | Purpose |
|---|---|---|---|
| `category` | string (slug) | `?category=scrub-suits` | Filters products by root category |
| `subcategory` | string (slug) | `?subcategory=womens-tailored-scrub-suits` | Filters products by specific subcategory |
| `search` | string | `?search=ot` | Filters products by keyword in name, category, or description |
| `sort` | string | `?sort=price-asc` | Sorting (`price-asc`, `price-desc`, `newest`, `rating`, `popular`) |
| `minPrice` | number | `?minPrice=1000` | Minimum price filter |
| `maxPrice` | number | `?maxPrice=2000` | Maximum price filter |
| `color` | string | `?color=Navy+Blue` | Filter products containing the specified color |
| `size` | string | `?size=L` | Filter products containing the specified size |

When any filter or sort option changes, the URL search params are updated via `setSearchParams(newParams, { replace: true })`, ensuring all filter states are bookmarkable, shareable, and support browser back/forward buttons.

### 6.3 Page Architecture & Layout Breakdown
The page will be created as `Client/src/pages/ProductListingPage.jsx` wrapped inside `<Layout>`:

```
┌────────────────────────────────────────────────────────────────────────┐
│  <TopAnnouncementBar />                                               │
├────────────────────────────────────────────────────────────────────────┤
│  <Navbar />                                                            │
├────────────────────────────────────────────────────────────────────────┤
│  Breadcrumbs: Home > Products > [Category Name] > [Subcategory Name]   │
│  Hero Header: Category Title, Subtitle, & Live Count Badge             │
├────────────────────────────────────────────────────────────────────────┤
│  Quick Category Pills Rail: [All Products] [Scrub Suits] [Aprons]...  │
│  Subcategory Pills (when category is active): [All] [Classic] [OT]... │
├────────────────────────────────────────┬───────────────────────────────┤
│  SIDEBAR FILTERS (Desktop)             │  CATALOG MAIN AREA            │
│  • Categories & Subcategories Tree     │  • Search Bar (Inline)        │
│  • Active Filter Tags (dismissible)    │  • Active Filter Count        │
│  • Price Range Slider / Inputs         │  • Sort Dropdown              │
│  • Garment Sizes (S, M, L, XL, 2XL)    │  • Mobile Filter Sheet Toggle │
│  • Color Swatches (with tooltips)      │  ───────────────────────────  │
│  • Badges (Bestseller, New Arrival)    │  RESPONSIVE PRODUCT GRID      │
│  • "Reset All Filters" Button          │  [Card]  [Card]  [Card]       │
│                                        │  [Card]  [Card]  [Card]       │
│  (Mobile: Slide-over Drawer / Sheet)   │  [Card]  [Card]  [Card]       │
│                                        │  ───────────────────────────  │
│                                        │  Empty State / Loading Skeletons│
├────────────────────────────────────────┴───────────────────────────────┤
│  <Footer />                                                            │
├────────────────────────────────────────────────────────────────────────┤
│  <LazyCartDrawer />                                                    │
└────────────────────────────────────────────────────────────────────────┘
```

### 6.4 Key Features of `ProductListingPage.jsx`
1. **Responsive Multi-Column Grid**:
   - Mobile (`< 640px`): `grid-cols-1`
   - Tablet (`640px - 1024px`): `grid-cols-2`
   - Desktop with Sidebar (`1024px - 1536px`): `grid-cols-3`
   - Wide Desktop (`>= 1536px`): `grid-cols-4`
2. **Interactive Cards with Existing Reusable Component**:
   - Uses `Client/src/components/ProductCard.jsx`.
   - Supports 2nd photo flip on hover or tap.
   - Interactive color swatches selecting color variant.
   - Size picker buttons.
   - Quick "Add to Cart" button with instant feedback.
   - Wishlist toggle button.
3. **Facet Sidebar**:
   - Category accordions showing subcategory count badges.
   - Visual color palette buttons displaying true hex codes.
   - Size grid selector.
   - Price range min/max inputs with preset quick links (e.g. "Under ₹1,000", "₹1,000 - ₹1,500", "₹1,500+").
4. **Active Filters Bar**:
   - Shows chips for all active filters (e.g., `Category: Scrub Suits ✕`, `Size: L ✕`, `Max: ₹1,500 ✕`).
   - One-click "Clear All" button.
5. **Zero Products Fallback**:
   - Clean healthcare-themed UI with `PackageOpen` icon, descriptive guidance, and a prominent "Clear Filters" button.
6. **Smooth Loading Skeletons**:
   - Uses `ProductCardSkeleton` from `SkeletonLoaders.jsx` to prevent layout shift (CLS: 0).

---

## 7. Rewiring Navbar & Storefront Links (Eliminating Anchor Scrolling)

To completely eliminate `#id` anchor scrolling across the entire site, the following updates are required:

### 7.1 `Client/src/services/api.js`
1. **Update `getCategorySectionLink`**:
   Change from returning `#scrubs-collection` to returning `/products?category=${slug}`:
   ```javascript
   export const getCategorySectionLink = (slug = '') => {
     if (!slug) return '/products';
     return `/products?category=${encodeURIComponent(slug)}`;
   };
   ```
2. **Update `fetchCategoriesTree`**:
   Map category and subcategory `href` and `to` properties to the dedicated PLP routes:
   ```javascript
   href: `/products?category=${encodeURIComponent(cat.slug)}`,
   to: `/products?category=${encodeURIComponent(cat.slug)}`,
   subcategories: (cat.subcategories || []).map(sub => ({
     ...
     href: `/products?category=${encodeURIComponent(cat.slug)}&subcategory=${encodeURIComponent(sub.slug)}`,
     to: `/products?category=${encodeURIComponent(cat.slug)}&subcategory=${encodeURIComponent(sub.slug)}`,
   }))
   ```

### 7.2 `Client/src/components/Navbar.jsx`
1. **Import `Link` and `useNavigate` from `react-router-dom`**.
2. **Desktop Category Links**:
   Pass `as={Link}` and `to={link.to || link.href}` to `NavbarCircularItem`:
   ```jsx
   <NavbarCircularItem
     as={Link}
     to={link.to || link.href}
     active={isItemActive}
     onClick={() => {
       setActiveCategory(link.name);
       setActiveDropdown(null);
     }}
     ...
   />
   ```
3. **Desktop Subcategory Dropdown Items**:
   Pass `as={Link}` and `to={sub.to || sub.href}` to `NavbarCircularItem`:
   ```jsx
   <NavbarCircularItem
     key={sub.slug || sub.name}
     as={Link}
     to={sub.to || sub.href}
     onClick={() => {
       setActiveCategory(activeDropdownLink.name);
       setActiveDropdown(null);
     }}
     ...
   />
   ```
4. **Desktop "Browse All in [Category]"**:
   Replace `<a href={activeDropdownLink.href}>` with:
   ```jsx
   <Link
     to={activeDropdownLink.to || activeDropdownLink.href}
     onClick={() => setActiveDropdown(null)}
     className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-blue-200 group/link"
   >
     <span>Browse All in {activeDropdownLink.name}</span>
     <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
   </Link>
   ```
5. **Mobile Drawer Category & Subcategory Links**:
   Replace `<a href={link.href}>` and `<a href={sub.href}>` with `<Link to={...} onClick={() => setMobileMenuOpen(false)}>`.
   Replace `<a href="#shop-categories">` with `<Link to="/products" onClick={() => setMobileMenuOpen(false)}>`.

### 7.3 Supporting Components
1. **`Client/src/components/ShopByCategory.jsx`**:
   Replace `<a href={href}>` with `<Link to={`/products?category=${cat.slug}`}>`.
2. **`Client/src/components/ShopByColor.jsx`**:
   Replace `<a href={color.link}>` with `<Link to={`/products?color=${encodeURIComponent(color.name)}`}>`.
3. **`Client/src/components/ProductCollectionSection.jsx`**:
   Update `ctaTo` prop in `ProductListClassic.jsx`, `ProductListLabCoats.jsx`, `ProductListEcoflex.jsx`, and `ProductListPatientWear.jsx` to `/products?category=${slug}` with `ctaText="View all products"`.
4. **`Client/src/components/SearchModal.jsx`**:
   Update `handleSelectProduct` so clicking a product item navigates directly to `/product/${product.slug || product.id}` via `navigate()`, and add a "View All Matching Products" footer linking to `/products?search=${encodeURIComponent(searchQuery)}`.
5. **`Client/src/components/Footer.jsx`**:
   Replace `<a href={resolveCategoryHref(cat)}>` with `<Link to={`/products?category=${cat.slug}`}>`.

---

## 8. Dependent / Related Issues Noted for Coordination

While the primary focus of R1 is routing, navbar navigation, and the dedicated PLP, the exploration identified critical connections to the other requirements in `ORIGINAL_REQUEST.md`:
1. **R3 (Wishlist Runtime Error)**: In `Client/src/components/ProductCard.jsx:12` & `41`, `const { setWishlistCount } = useCart()` is invoked, but `CartContext.jsx` does not export `setWishlistCount`. Fixing this in `ProductCard` and `CartContext` will allow the wishlist button on the new PLP cards to function cleanly without throwing exceptions.
2. **R4 (React Child Object Error)**: `product.colors` contains objects with keys `{ name, hex, image }`. In components like `CartDrawer.jsx:105` (`{item.color}`) or `CheckoutPage.jsx:618` (`{item.color}`), rendering `item.color` directly when it is an object throws `Objects are not valid as a React child`. Ensuring primitive string extraction (`item.color?.name || item.color?.hex || item.color`) will protect PLP and Cart drawers from runtime crashes.
3. **R5 (Cart Page Display)**: Adding a dedicated `/cart` route or handling `/cart` cleanly will resolve blank screen navigation when users visit `/cart`.

---

## 9. Verification Strategy

The survey findings and subsequent implementation can be independently verified through the following checks:
1. **Static Analysis & Build Verification**:
   - Run `npm run build` in `Client/` to ensure bundle compilation succeeds with zero syntax or route errors.
2. **Route Availability Verification**:
   - Navigate directly to `http://localhost:5173/products` — should display the full catalog grid with breadcrumbs, sidebar filters, and total product count.
   - Navigate to `http://localhost:5173/products?category=scrub-suits` — should load with the "Scrub Suits" category active, subcategories displayed, and only 4 scrub suit products listed.
   - Navigate to `http://localhost:5173/products?category=scrub-suits&subcategory=ot-surgical-scrub-suits` — should display only the OT surgical scrub set.
   - Navigate to `http://localhost:5173/shop` — should display the Product Listing Page.
3. **Navbar & Navigation Interactivity**:
   - From any page (e.g. `http://localhost:5173/about`), click "Scrub Suits" in the desktop navbar — should transition to `/products?category=scrub-suits` without full page reload or in-page anchor jump.
   - From mobile drawer, click "Aprons & Lab Coats" -> "Doctor Full-Length Lab Coats" — drawer closes and user lands on `/products?category=aprons-lab-coats&subcategory=doctor-full-length-lab-coats`.
   - Check URL bar: Contains clean query parameters (`/products?category=...`), and browser back/forward buttons restore prior category filter states.
4. **Console Health**:
   - Zero console errors (`TypeError`, `Objects are not valid as a React child`, or WebSocket disconnections).
