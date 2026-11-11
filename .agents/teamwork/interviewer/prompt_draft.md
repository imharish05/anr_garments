Fix animation lag, update navbar category and subcategory navigation to route to a proper product listing page instead of hash scrolling, resolve runtime React errors (`setWishlistCount`, object-as-child), fix cart display, and implement product listing and 404 pages for a proper e-commerce storefront.

Working directory: d:\Sai techno solutions\ANR Hospital garments\Client
Integrity mode: [OPEN: Integrity restrictions]

## Requirements

### R1. Animation Performance & Navigation Routing
Eliminate animation lag across the storefront so animations and transitions operate smoothly. Update navbar category and subcategory links to route to a dedicated Product Listing Page (PLP) rather than scrolling to `#id` hash anchors on the homepage. [OPEN: Navigation routing structure] [OPEN: Animation optimization approach]

### R2. Runtime Error Fixes
Fix all runtime errors in the storefront:
- `ProductCard.jsx:41 Uncaught TypeError: setWishlistCount is not a function at handleWishlist`.
- `react-dom_client.js:3716 Uncaught Error: Objects are not valid as a React child (found: object with keys {name, hex, image})`.
- Ensure color objects (`{ name, hex, image }`) are handled properly and never rendered directly as React children.
- Resolve Vite HMR / WebSocket Back-Forward cache issues if occurring.

### R3. Cart, Product Listing Page, and 404 Page
Ensure that navigating to the cart properly displays the cart interface. Implement a full Product Listing Page (PLP) supporting category/subcategory views and product browsing, and implement a proper 404 Not Found page for invalid routes. Ensure `Admin/` is not modified. [OPEN: Cart display preference]

## Acceptance Criteria

### Performance & Navigation
- [ ] Animations run smoothly without perceptible lag or stutter.
- [ ] Clicking categories and subcategories in the navbar navigates to a dedicated product listing page instead of hash scrolling on the home page.

### Runtime Errors
- [ ] Adding/removing items to wishlist on ProductCard functions without throwing `TypeError: setWishlistCount is not a function`.
- [ ] No `Objects are not valid as a React child` errors when rendering products, color swatches, or product cards.
- [ ] Navigating to the cart shows the cart contents cleanly.

### Pages & Routing
- [ ] Product listing page renders product items corresponding to selected categories/subcategories.
- [ ] Invalid routes display a dedicated 404 page.
- [ ] The storefront builds and runs without errors.
