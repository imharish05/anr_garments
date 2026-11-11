# Animation Performance Optimization (R2) & Development/Build Setup Survey Report

**Author**: `explorer_survey_3` (teamwork_explorer)  
**Date**: 2026-11-11  
**Target Milestone**: Survey & Investigation (R2 & Dev Environment)  
**Workspace**: `d:\Sai techno solutions\ANR Hospital garments`

---

## Executive Summary

This investigation analyzed the UI animation architecture, performance bottlenecks, and development/build infrastructure of the ANR Hospital Garments storefront.

1. **Animation Implementations**: The application features custom zero-dependency motion primitives ("Brisko-inspired" Web Animations API engine) for circular clip-path wipe transitions, split-text masked typography, and staggered scroll reveals. It also includes CSS keyframe marquees (`marquee`, `marquee-topbar`), shimmer loading overlays, and hover lift/zoom transitions.
2. **Key Bottlenecks**:
   - **Forced Synchronous Layouts & Layout Thrashing**: Pointer hover over navbar items triggers synchronous `getBoundingClientRect()` and `window.getComputedStyle(overlay).clipPath` style recalculations while immediately writing inline `clipPath` styles and calling dropdown geometry calculations.
   - **CSS `transition-all` vs WAAPI Conflict**: `ProductCard` has `transition-all duration-300`, which actively fights the inline transform/opacity mutations dispatched by `animateStaggerElements` during scroll reveal, causing jitter and dropped frames.
   - **Compositor Layer Thrashing**: Global `.brisko-ch` has `will-change: transform, opacity`, creating dozens of isolated GPU texture layers per character across all heading elements, spiking VRAM usage.
   - **Unthrottled Scroll Listeners**: Category scroll rails in `Navbar.jsx` and `ShopByCategory.jsx` execute unthrottled DOM measurements (`scrollWidth`, `clientWidth`, `scrollLeft`) and trigger multiple synchronous React state updates on every scroll pixel.
3. **Development & Build Setup**: Both storefront (Vite, port 5173) and backend API (Express/Sequelize, port 5000) are running and responsive. `oxlint` passes with 0 errors, and `vite build` succeeds cleanly in ~14 seconds with zero build errors.

---

## 1. Animation Inventory & Technical Implementations

### 1.1 Scoped Circular Clip-Path Wipe Transitions
- **Location**: `Client/src/components/NavbarCircularItem.jsx` (lines 10–186)
- **Engine**: Native Web Animations API (`Element.prototype.animate`) with `getElementCircleMetrics` from `Client/src/utils/motion.js` (lines 17–48).
- **Mechanism**:
  - Renders two identical content branches: a base dark layer (`#1A175A` navy) and an absolute positioned light layer (`bg-white text-[#1A175A] shadow-sm`).
  - The light overlay is clipped using `circle(0px at x y)` (collapsed) to `circle(maxRadius at x y)` (expanded), where `(x, y)` are cursor-relative pointer coordinates and `maxRadius` is the Pythagorean distance to the furthest bounding corner.
  - WAAPI config: `duration: expand ? 430 : 340`, `easing: 'cubic-bezier(.65, 0, .35, 1)'`, `fill: 'forwards'`.
- **Applied Surfaces**:
  - All desktop category links in the navbar (`Navbar.jsx:312`).
  - All category subcategory cards in the desktop dropdown menu (`Navbar.jsx:480`).
  - Action buttons: "Bulk Orders" (`Navbar.jsx:371`), Search (`Navbar.jsx:384`), Account (`Navbar.jsx:400`), Wishlist (`Navbar.jsx:416`), and Cart (`Navbar.jsx:438`).

### 1.2 Polygon & SVG Clip-Path Implementations
- **Hexagon Category Cards**: `Client/src/components/ShopByCategory.jsx` (lines 154, 202, 206)
  - Uses `clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'` applied to outer badge wrapper and inner image container.
  - Paired with CSS scale hover transitions: `hover:scale-[1.06]` on the card and `group-hover:scale-110` on the image.
- **Shop by Color Scrub SVG**: `Client/src/components/ShopByColor.jsx` (lines 23–50)
  - Uses `<clipPath id="clip-${uid}">` with SVG path data applied via `<g clipPath="url(#clip-...)">`.

### 1.3 Scroll Reveal & Stagger Choreography
- **Location**: `Client/src/components/MotionPrimitives.jsx` (`ScrollReveal`) and `Client/src/utils/motion.js` (`animateStaggerElements`).
- **Mechanism**:
  - Elements observed via `IntersectionObserver` (`threshold: 0.08`, `rootMargin: '0px 0px -30px 0px'`).
  - For single elements: WAAPI animation from `translateY(28px) scale(0.985)` / `opacity: 0` to `translate3d(0, 0, 0) scale(1)` / `opacity: 1` over `760ms` with `cubic-bezier(0.16, 1, 0.3, 1)`.
  - For staggered lists: `animateStaggerElements` sets inline `el.style.opacity = '0'` and `el.style.transform = translateY(...)` and iterates over child elements with an incremental delay of `60ms` per item.
- **Applied Components**: `HeroBanner.jsx`, `ShopByCategory.jsx`, `ShopByColor.jsx`, `ProductCollectionSection.jsx` (`ProductListClassic`, `ProductListLabCoats`, `ProductListEcoflex`, `ProductListPatientWear`), `SeenInANR.jsx`, `FabricTechSection.jsx`, and `FaqShippingPerks.jsx`.

### 1.4 Masked Split-Text Typography Reveal
- **Location**: `Client/src/components/MotionPrimitives.jsx` (`AnimatedText`) and `Client/src/utils/motion.js` (`animateSplitElement`).
- **Mechanism**:
  - Splits text into words (`.brisko-word`) and characters (`.brisko-ch`).
  - Each `.brisko-ch` is animated with `translateY(115%) rotate(6deg) opacity: 0` -> `translateY(0%) rotate(0deg) opacity: 1` over `820ms`.
  - Stagger defaults to `mode='chars'` with `10–20ms` delay per character.
- **Applied Headings**: Section headings across `HeroBanner.jsx`, `ShopByCategory.jsx`, `ProductCollectionSection.jsx`, and `SeenInANR.jsx`.

### 1.5 CSS Keyframe Marquees & Shimmers
- **`@keyframes marquee`** (`Client/src/index.css:18–27`): 28s continuous 2D horizontal scroll (`translateX(0%)` to `translateX(-50%)`) used in `FeaturesMarquee.jsx`.
- **`@keyframes marquee-topbar`** (`Client/src/index.css:35–45`): 50s continuous 3D horizontal scroll (`translate3d(0,0,0)` to `translate3d(-50%,0,0)`) with `will-change: transform` used in `TopAnnouncementBar.jsx`.
- **`@keyframes shimmer`** (`Client/src/index.css:83–90`): 1.5s–1.6s 2D sweep (`translateX(-100%)` to `translateX(100%)`) used in `SkeletonLoaders.jsx` and `LazySection.jsx`.
- **`@keyframes colorFade`** (`Client/src/components/ShopByColor.jsx:345`): 0.45s fade and translate (`translateY(8px)` to `translateY(0)`).

### 1.6 Card Hover & Tactile Lift Transitions
- `ProductCard.jsx` (line 45): `transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1A175A]/10`.
- Dual-image swap: Primary image fades out `group-hover:opacity-0` while secondary image scales and fades in `scale-105 -> scale-100 opacity-100 group-hover:scale-100 group-hover:opacity-100` over `500ms`.
- `SeenInANR.jsx` (line 84): `transition-all duration-300 hover:shadow-xl`.
- `FabricTechSection.jsx` (line 94): `transition-all duration-300 hover:shadow-xl hover:border-[#1A175A]/40`.

---

## 2. Performance Bottlenecks Profiled

| # | Bottleneck | Location | Root Cause | Impact |
|---|---|---|---|---|
| 1 | **Layout Thrashing on Hover / Scrubbing** | `NavbarCircularItem.jsx:36-40, 57-61`, `Navbar.jsx:215-224` | Interrupted hover calls `window.getComputedStyle(overlay).clipPath` and `root.getBoundingClientRect()`, immediately writes `style.clipPath`, followed by `containerEl.getBoundingClientRect()` in parent | 15–30ms main thread spikes; dropped frames during rapid navigation across navbar items |
| 2 | **CSS `transition-all` vs WAAPI Conflict** | `ProductCard.jsx:45`, `motion.js:104-124` | `ProductCard` has `transition-all duration-300`. `animateStaggerElements` sets `el.style.transform` and `el.style.opacity` directly. The CSS transition engine fights WAAPI interpolation | Visual stuttering and jerky animation during initial scroll into product grids |
| 3 | **Excessive GPU Compositor Layers** | `Client/src/index.css:105-108`, `MotionPrimitives.jsx:92-108` | Global `.brisko-ch` has `display: inline-block; will-change: transform, opacity;`. In `mode='chars'`, every letter in every title is allocated a distinct GPU texture | GPU memory bloat; composite layer synchronization overhead; subpixel text rasterization blur |
| 4 | **Unthrottled Scroll Listeners with Synchronous State Updates** | `Navbar.jsx:182-187`, `ShopByCategory.jsx:63-75` | `handleScroll` and `updateArrows` execute on every scroll event without `requestAnimationFrame`. They synchronously read `scrollWidth`, `clientWidth`, `scrollLeft` and invoke React state setters (`setIsOverflowing`, `setCanScrollLeft`, `setCanScrollRight`) | High CPU usage and frame stuttering during touch scroll or horizontal swipe |
| 5 | **Unaccelerated 2D Keyframe Transforms** | `Client/src/index.css:18-21, 83-90` | `marquee` and `shimmer` use 2D `translateX(...)` without 3D z-axis translation or `will-change: transform` | Runs on software raster threads instead of GPU compositor; continuous repaints during page load |
| 6 | **Heavy Polygon Re-rasterization** | `ShopByCategory.jsx:197-215` | Hexagonal `clip-path: polygon(...)` elements scale on hover (`scale-[1.06]` on wrapper, `scale-110` on image) without layer isolation | Software re-rasterization of 6-point clip boundary on every hover frame |

---

## 3. Exact Optimizations Needed to Achieve 60 FPS Transitions

### 3.1 Optimize Circular Clip-Path Wipe Transitions
1. **Eliminate `window.getComputedStyle().clipPath` Reflow**:
   - Instead of reading the computed style from the DOM to check the mid-flight radius of an interrupted animation, track animation progress algebraically:
     ```javascript
     const elapsed = performance.now() - startTimeRef.current;
     const progress = Math.min(1, Math.max(0, elapsed / currentDurationRef.current));
     // Interpolate radius mathematically without touching DOM
     const currentRadius = startRadius + (endRadius - startRadius) * progress;
     ```
2. **Eliminate Layout Invalidation Before Animation**:
   - Do NOT set `overlay.style.clipPath = startClip;` right before calling `overlay.animate(...)`. Pass `startClip` directly as the first keyframe:
     ```javascript
     const anim = overlay.animate(
       [{ clipPath: startClip }, { clipPath: endClip }],
       { duration, easing, fill: 'forwards' }
     );
     ```
3. **Decouple Geometry Reads in Navbar**:
   - In `Navbar.jsx:handleCategoryMouseEnter`, replace `getBoundingClientRect()` with cached element dimensions or relative offset properties (`itemEl.offsetLeft` and `itemEl.offsetWidth`), which do not require viewport-relative reflow calculations.
4. **Hardware Compositing Layer Isolation**:
   - Add `transform: translateZ(0)` to the overlay element to isolate it on its own GPU compositor layer:
     ```css
     will-change: clip-path;
     transform: translateZ(0);
     ```
   - Remove `shadow-sm` from the overlay inside `lightClassName`; apply the shadow to the parent container so the clipping polygon does not need to clip blur shadows.

### 3.2 Resolve `ProductCard` Scroll Stagger Conflict
1. **Replace `transition-all` on Cards**:
   - In `Client/src/components/ProductCard.jsx:45`, replace:
     ```jsx
     // BEFORE:
     className="... transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ..."
     // AFTER:
     className="... transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-xl ..."
     ```
2. **Upgrade Transforms to 3D in `motion.js`**:
   - In `animateStaggerElements`:
     ```javascript
     // BEFORE:
     { opacity: 0, transform: `translateY(${y}px) scale(${scale})` },
     { opacity: 1, transform: 'translateY(0px) scale(1)' }

     // AFTER:
     { opacity: 0, transform: `translate3d(0, ${y}px, 0) scale(${scale})` },
     { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' }
     ```

### 3.3 Optimize Split-Text Typography
1. **Switch Default Mode to Words**:
   - In `MotionPrimitives.jsx:17`, change `mode = 'chars'` to `mode = 'words'`. An 8-word heading generates 8 elements instead of 45, reducing layer count by over 80% while retaining the masked typographic reveal.
2. **Remove Global `will-change` on Dormant Characters**:
   - In `Client/src/index.css:105-108`, remove `will-change: transform, opacity;` from `.brisko-ch`. Let the WAAPI engine manage compositor promotion during active animation, or apply `will-change` only while `.brisko-text-pending` is attached.

### 3.4 Throttle Scroll Event Handlers
1. **RAF-Guarded Scroll Handlers in `Navbar.jsx` and `ShopByCategory.jsx`**:
   - Wrap `handleScroll` in a `requestAnimationFrame` flag to ensure layout properties are read at most once per display frame (16.6ms).
   - Only trigger React state updates if the calculated boolean value has actually changed:
     ```javascript
     const updateArrows = useCallback(() => {
       const el = railRef.current;
       if (!el) return;
       const max = el.scrollWidth - el.clientWidth;
       const nextPrev = el.scrollLeft > 4;
       const nextNext = max > 4 && el.scrollLeft < max - 4;
       setCanPrev(prev => prev !== nextPrev ? nextPrev : prev);
       setCanNext(prev => prev !== nextNext ? nextNext : prev);
     }, []);
     ```

### 3.5 Hardware-Accelerate Keyframes
- **Features Marquee (`index.css:18–27`)**:
  ```css
  @keyframes marquee {
    0% { transform: translate3d(0, 0, 0); }
    100% { transform: translate3d(-50%, 0, 0); }
  }
  .animate-marquee {
    will-change: transform;
  }
  ```
- **Shimmer (`index.css:83–90`)**:
  ```css
  @keyframes shimmer {
    0% { transform: translate3d(-100%, 0, 0); }
    100% { transform: translate3d(100%, 0, 0); }
  }
  ```

---

## 4. Development and Build Setup Analysis

### 4.1 Project Architecture
The project is structured as a multi-tier workspace:
- `Client/`: React 19 storefront application powered by Vite.
- `Server/`: Express 5 REST API with Sequelize ORM and MySQL database.
- `Admin/`: React 18 admin management panel powered by Vite.

### 4.2 Frontend Toolchain (`Client/package.json`)
- **Framework & Libraries**:
  - `react`: `^19.3.1`
  - `react-dom`: `^19.3.1`
  - `react-router-dom`: `^7.18.5`
  - `lucide-react`: `^1.70.0`
- **Build & Linting**:
  - `vite`: `^8.3.6`
  - `@vitejs/plugin-react`: `^6.1.2`
  - `tailwindcss`: `^3.4.19`
  - `postcss`: `^8.5.32`
  - `autoprefixer`: `^10.6.2`
  - `oxlint`: `^1.90.0`
- **Vite Configuration (`Client/vite.config.js`)**:
  - Standard React plugin integration via `@vitejs/plugin-react`.
  - Serves by default on port `5173`.

### 4.3 Build & Lint Verification
- **Linter (`npm run lint` / `oxlint`)**:
  - Command: `cd Client; npm run lint`
  - Result: **0 errors**, 14 warnings (standard React compiler hints on setState in useEffect, no blocking syntax or dependency errors).
- **Production Build (`npm run build` / `vite build`)**:
  - Command: `cd Client; npm run build`
  - Result: **Built successfully in 14.29s** with 2,115 modules transformed.
  - Output: `dist/index.html` (1.19 kB), CSS bundle (64 kB / 11.2 kB gzip), and JS bundles (332 kB main bundle / 102 kB gzip). Zero build errors.

### 4.4 Development Servers Status
- **Storefront (Port 5173)**:
  - Process: PID `11900` (`node`).
  - Status: Active, listening, returns `200 OK` on HTTP `HEAD` and `GET`.
- **Backend API (Port 5000)**:
  - Process: PID `13784` (`node`).
  - Status: Active, database authenticated via Sequelize, returns live JSON responses (e.g. `GET /api/categories` returns active category catalog).
- **Playwright / Browser Automation**:
  - Browser instance navigates cleanly to `http://localhost:5173/`, captures DOM snapshot, and confirms zero unhandled runtime console errors on initial load.

---

## 5. Summary Matrix & Actionable Roadmap for Implementer

| Task / Area | Target Files | Recommended Action |
|---|---|---|
| **Circular Clip-Path Wipe** | `Client/src/components/NavbarCircularItem.jsx`, `Client/src/components/Navbar.jsx` | 1) Remove `window.getComputedStyle(overlay).clipPath`<br>2) Calculate progress via elapsed time<br>3) Pass `startClip` into WAAPI keyframes rather than writing inline before animate<br>4) Cache offset coordinates in `handleCategoryMouseEnter` |
| **Scroll Stagger Conflict** | `Client/src/components/ProductCard.jsx`, `Client/src/utils/motion.js` | 1) Scope `ProductCard` transition from `all` to `transform, box-shadow`<br>2) Upgrade WAAPI transforms in `animateStaggerElements` to `translate3d(0, y, 0)` |
| **Compositor Layer Overhead** | `Client/src/index.css`, `Client/src/components/MotionPrimitives.jsx` | 1) Remove static `will-change: transform, opacity` from `.brisko-ch`<br>2) Set default mode to `'words'` in `AnimatedText` |
| **Scroll & Resize Throttling** | `Client/src/components/Navbar.jsx`, `Client/src/components/ShopByCategory.jsx` | 1) Wrap scroll handlers in `requestAnimationFrame`<br>2) Avoid state updates if boolean state hasn't changed |
| **CSS Keyframes Acceleration** | `Client/src/index.css` | 1) Upgrade `@keyframes marquee` and `@keyframes shimmer` to `translate3d`<br>2) Add `will-change: transform` to marquee containers |
