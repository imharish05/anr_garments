# Project: ANR Hospital Garments Storefront Optimization & Feature Implementation

## Architecture
- **Client Frontend**: React 19 (`Client/`), React Router DOM v7, Vite 8, Tailwind CSS v3, Lucide icons.
- **Server Backend**: Node.js Express 5 REST API (`Server/`), Sequelize ORM, MySQL database on port 5000.
- **Data Flow**:
  - Storefront fetches category tree from `GET /api/categories/tree` and products from `GET /api/products`.
  - Global shopping state is managed via `CartContext` (`Client/src/context/CartContext.jsx`), persisting cart items and wishlist items in `localStorage`.
  - Routing managed by `Client/src/App.jsx` using React Router DOM.
  - Performance animations powered by Web Animations API (`Client/src/utils/motion.js`), CSS keyframes (`index.css`), and `NavbarCircularItem.jsx`.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | F1: Dedicated Product Listing Page | `/products` route (with `/shop` alias) displaying full catalog with responsive layout | M2 | R1 Survey |
| 2 | F2: URL Query Param Filtering & Sorting | Filter by category, subcategory, search, sort, size, color, price range | M2 | R1 Survey |
| 3 | F3: Facet Sidebar, Drawer & Active Chips | Desktop sidebar and mobile sheet with interactive category tree, filters, chips | M2 | R1 Survey |
| 4 | F4: Desktop Navbar Category Rewiring | Category & subcategory links navigate to `/products?...` via React Router Link | M2 | R1 Survey |
| 5 | F5: Mobile Menu Drawer Link Rewiring | Mobile drawer category and subcategory links navigate to `/products?...` without reload | M2 | R1 Survey |
| 6 | F6: Storefront Anchor Hash Elimination | Replace `#id` links in ShopByCategory, SearchModal, Footer, Collection sections | M2 | R1 Survey |
| 7 | F7: Circular Clip-Path Wipe Optimization | Mathematical radius interpolation, remove computed style reads, translateZ(0) | M3 | R2 Survey |
| 8 | F8: Scroll Reveal & Card Hover Stagger | Scope `ProductCard` transition to `transform, box-shadow`, 3D translate3d transforms | M3 | R2 Survey |
| 9 | F9: GPU Layer & Compositor Optimization | Set `AnimatedText` default to words, remove global `.brisko-ch` will-change | M3 | R2 Survey |
| 10 | F10: Scroll Event Throttling & RAF | Throttle category scroll rails in Navbar and ShopByCategory with RAF | M3 | R2 Survey |
| 11 | F11: Hardware-Accelerated Keyframes | Upgrade `@keyframes marquee` and `@keyframes shimmer` to `translate3d` | M3 | R2 Survey |
| 12 | F12: Wishlist State Management Fix | Remove undefined `setWishlistCount`, integrate `addToWishlist`/`removeFromWishlist`/`isInWishlist` | M1 | R3 Survey |
| 13 | F13: Color Object Sanitization & React 19 Child Fix | Sanitize color in CartContext, guard JSX color rendering in CartDrawer & Checkout | M1 | R4 Survey |
| 14 | F14: Dedicated Cart Page Component | Create `CartPage.jsx` and register `/cart` route in `App.jsx` | M1 | R5 Survey |
| 15 | F15: Cart Quantity, Removal & Order Summary | Interactive item controls, custom embroidery details, summary, and checkout CTA | M1 | R5 Survey |
| 16 | F16: Comprehensive E2E Test Suite | 4-tier requirement-driven opaque-box test suite verifying all features end-to-end | E2E_Track | Testing Track |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | State, Color Objects & Cart Page | F12, F13, F14, F15: Fix wishlist errors, color object React child crashes, create dedicated CartPage | none | IN_PROGRESS |
| M2 | Product Listing Page & Navigation | F1, F2, F3, F4, F5, F6: Create ProductListingPage (`/products`), wire all desktop/mobile links | M1 | PLANNED |
| M3 | Animation Performance Optimization | F7, F8, F9, F10, F11: 60 FPS circular clip-path wipe, scroll reveal, compositor layers, keyframes | none | PLANNED |
| E2E | E2E Test Suite Track | F16: Requirement-driven E2E test harness & test suite (Tiers 1-4) | none | IN_PROGRESS |
| M_Final | Final Verification & Hardening | Pass 100% of E2E test suite + Tier 5 adversarial coverage hardening | M1, M2, M3, E2E | PLANNED |

## Interface Contracts
### `CartContext` ↔ `ProductCard` / `CartDrawer` / `CheckoutPage` / `CartPage`
- **Wishlist APIs**:
  - `addToWishlist(product: Product): void`
  - `removeFromWishlist(productId: number): void`
  - `isInWishlist(productId: number): boolean`
  - `wishlistCount: number` (read-only derived integer)
  - `wishlistItems: Product[]`
- **Cart Color Sanitization Contract**:
  - In `addToCart(product, selectedColor, selectedSize, quantity, embroidery)`: `selectedColor` must always be normalized to primitive string:
    `typeof selectedColor === 'object' && selectedColor !== null ? (selectedColor.name || selectedColor.hex || 'Navy Blue') : (selectedColor || 'Navy Blue')`.
  - In `cartItems`: each item's `color` property is guaranteed to be a primitive string.
  - In JSX rendering (`CartDrawer`, `CheckoutPage`, `CartPage`): color rendering guarded with:
    `typeof item.color === 'object' && item.color !== null ? (item.color.name || item.color.hex) : item.color`.

### `Navbar` / Router ↔ `ProductListingPage`
- Route: `/products` (and alias `/shop`).
- Query parameters:
  - `?category=<categorySlug>` (e.g. `scrub-suits`, `aprons-lab-coats`, `underscrubs`, `patient-gown`, `patient-pant-shirt`)
  - `?subcategory=<subcategorySlug>` (e.g. `womens-tailored-scrub-suits`)
  - `?search=<term>`
  - `?sort=price-asc|price-desc|newest|rating|popular`
  - `?size=<size>`
  - `?color=<colorName>`
  - `?minPrice=<min>&maxPrice=<max>`
- Navigation:
  - All desktop category & subcategory links use `<Link to="/products?category=...&subcategory=...">`.
  - All mobile drawer links navigate via `<Link to="..." onClick={() => setMobileMenuOpen(false)}>`.
  - No `#id` hash scroll jumps.

### Animation Primitives Contract
- `NavbarCircularItem`:
  - Mathematical progress interpolation without synchronous `window.getComputedStyle().clipPath`.
  - WAAPI keyframes: `[{ clipPath: startClip }, { clipPath: endClip }]` without pre-anim inline clip-path write.
  - Isolated composite layer with `transform: translateZ(0)`.
- `motion.js` & `ProductCard`:
  - Card transition scoped to `transition-[transform,box-shadow] duration-300 ease-out`.
  - WAAPI transforms upgraded to 3D `translate3d(0, y, 0)`.

## Code Layout
- `Client/src/pages/`:
  - `CartPage.jsx` (New, M1)
  - `ProductListingPage.jsx` (New, M2)
  - `CheckoutPage.jsx` (M1)
  - `WishlistPage.jsx` (M1)
- `Client/src/context/`:
  - `CartContext.jsx` (M1)
- `Client/src/components/`:
  - `ProductCard.jsx` (M1, M2)
  - `CartDrawer.jsx` (M1)
  - `Navbar.jsx` (M2, M3)
  - `NavbarCircularItem.jsx` (M3)
  - `ShopByCategory.jsx` (M2, M3)
  - `ShopByColor.jsx` (M2)
  - `SearchModal.jsx` (M2)
  - `ProductCollectionSection.jsx` (M2)
  - `Footer.jsx` (M2)
  - `MotionPrimitives.jsx` (M3)
- `Client/src/utils/`:
  - `motion.js` (M3)
- `Client/src/services/`:
  - `api.js` (M2)
- `Client/src/`:
  - `App.jsx` (M1, M2)
  - `index.css` (M3)
- `tests/e2e/`:
  - E2E Test Suite files (E2E Testing Track)
