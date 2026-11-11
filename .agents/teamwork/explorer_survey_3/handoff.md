# Handoff Report — explorer_survey_3

**Author**: `explorer_survey_3` (teamwork_explorer)  
**Date**: 2026-11-11  
**Milestone**: Survey & Investigation (R2 Animation Performance & Dev Setup)  
**Type**: Hard Handoff  

---

## 1. Observation

### 1.1 Circular Clip-Path Wipe Implementation
- **File**: `Client/src/components/NavbarCircularItem.jsx` (lines 55–65):
  ```javascript
  55: if (animRef.current) {
  56:   try {
  57:     const computed = window.getComputedStyle(overlay).clipPath;
  58:     if (computed && computed.startsWith('circle(')) {
  59:       startClip = computed;
  60:     }
  61:   } catch {
  62:     // Ignore computed style lookup errors
  63:   }
  64:   animRef.current.cancel();
  65:   animRef.current = null;
  ```
- **File**: `Client/src/components/NavbarCircularItem.jsx` (line 77 & 80–87):
  ```javascript
  77: overlay.style.clipPath = startClip;
  ...
  80: const anim = overlay.animate(
  81:   [{ clipPath: startClip }, { clipPath: endClip }],
  82:   {
  83:     duration: expand ? 430 : 340,
  84:     easing: 'cubic-bezier(.65, 0, .35, 1)',
  85:     fill: 'forwards',
  86:   }
  87: );
  ```
- **File**: `Client/src/components/Navbar.jsx` (lines 215–224):
  ```javascript
  215: const itemRect = itemEl.getBoundingClientRect();
  216: const containerRect = containerEl.getBoundingClientRect();
  217: 
  218: // Align dropdown card with category link
  219: let left = itemRect.left - containerRect.left;
  220: const maxLeft = containerRect.width - 330;
  221: left = Math.max(8, Math.min(left, maxLeft));
  222: 
  223: setDropdownPos({ left });
  ```

### 1.2 Scroll Reveal vs Card CSS Transition Conflict
- **File**: `Client/src/components/ProductCard.jsx` (line 45):
  ```jsx
  45: <article className="group relative flex h-full flex-col rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1A175A]/10">
  ```
- **File**: `Client/src/utils/motion.js` (lines 104–118):
  ```javascript
  104: el.style.opacity = '0';
  105: el.style.transform = `translateY(${y}px) scale(${scale})`;
  106: 
  107: const anim = el.animate(
  108:   [
  109:     { opacity: 0, transform: `translateY(${y}px) scale(${scale})` },
  110:     { opacity: 1, transform: 'translateY(0px) scale(1)' },
  111:   ],
  ...
  ```

### 1.3 Compositor Layer Allocation
- **File**: `Client/src/index.css` (lines 105–108):
  ```css
  105: .brisko-ch {
  106:   display: inline-block;
  107:   will-change: transform, opacity;
  108: }
  ```
- **File**: `Client/src/components/MotionPrimitives.jsx` (lines 91–108):
  ```jsx
  91: {words.map((word, wIdx) => (
  ...
  99:   <span key={cIdx} className="brisko-ch">
  100:    {ch}
  101:  </span>
  ```

### 1.4 Unthrottled Scroll Listeners
- **File**: `Client/src/components/Navbar.jsx` (lines 182–187):
  ```javascript
  182: const handleScroll = () => {
  183:   checkNavOverflow();
  184:   if (activeDropdown) {
  185:     setActiveDropdown(null);
  186:   }
  187: };
  ```
- **File**: `Client/src/components/Navbar.jsx` (lines 149–159):
  ```javascript
  149: const overflow = el.scrollWidth > el.clientWidth + 4;
  ...
  158: setCanScrollLeft(el.scrollLeft > 6);
  159: setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 6);
  ```

### 1.5 Dev & Build Setup Status
- Dev processes confirmed running via PowerShell:
  - Port 5173: PID 11900 (`node`), HTTP `Invoke-RestMethod -Uri "http://localhost:5173" -Method Head` returns 200.
  - Port 5000: PID 13784 (`node`), HTTP `Invoke-RestMethod -Uri "http://localhost:5000/api/categories"` returns `{ success: true, categories: [...] }`.
- Lint command: `cd Client; npm run lint` -> Exited 0 with 0 errors and 14 warnings.
- Build command: `cd Client; npm run build` -> Exited 0 with all 2,115 modules transformed, producing `Client/dist/` in 14.29s.

---

## 2. Logic Chain

1. **Premise 1**: When `window.getComputedStyle(element)` or `element.getBoundingClientRect()` is called after setting `element.style.clipPath`, the browser layout engine is forced to perform a synchronous reflow and style recalculation (Layout Thrashing).
   - *Supported by Observation 1.1*: `NavbarCircularItem.jsx:57` calls `window.getComputedStyle(overlay).clipPath` when an animation is interrupted, sets `overlay.style.clipPath = startClip` at line 77, and `Navbar.jsx:215` immediately queries `getBoundingClientRect()` on both `itemEl` and `containerEl`. During rapid mouse scrubbing across navbar items, this sequence runs repeatedly, inducing frame drops and jank.

2. **Premise 2**: Applying CSS `transition: all` to an element while a JavaScript animation simultaneously mutates the element's `style.transform` and `style.opacity` creates a conflict between the CSS transition engine and the Web Animations API (WAAPI).
   - *Supported by Observation 1.2*: `ProductCard.jsx:45` specifies `transition-all duration-300`, and `motion.js:104-105` sets `el.style.opacity = '0'` and `el.style.transform = translateY(...)` before launching `el.animate(...)`. The CSS transition engine attempts to transition these mutations over 300ms while WAAPI attempts to interpolate keyframes simultaneously, resulting in visible position jumps and stuttering on scroll reveal.

3. **Premise 3**: Marking hundreds of inline-block character elements with `will-change: transform, opacity` forces the GPU compositor to allocate distinct backing textures for every character, exhausting VRAM and increasing layer tree synchronization time.
   - *Supported by Observation 1.3*: In `index.css:107`, `.brisko-ch` has `will-change: transform, opacity`. In `MotionPrimitives.jsx:99`, every character in every heading is wrapped in `.brisko-ch`. For a page with dozens of headings, hundreds of GPU layers are created and maintained in memory.

4. **Premise 4**: Calling `el.scrollWidth`, `el.clientWidth`, and `el.scrollLeft` synchronously on unthrottled scroll events triggers repeated layout reads and React state updates during scrolling gestures.
   - *Supported by Observation 1.4*: In `Navbar.jsx:182`, `handleScroll` triggers `checkNavOverflow()` on every scroll event, which accesses layout dimensions and immediately fires `setIsOverflowing`, `setCanScrollLeft`, and `setCanScrollRight`.

---

## 3. Caveats

- **Caveat 1**: Hardware acceleration behavior can vary slightly across GPU vendors (e.g., discrete Nvidia/AMD vs integrated Intel/Apple Silicon). The recommendations prioritize cross-platform hardware compositing (Chromium/Gecko/WebKit) using standard 3D transforms (`translate3d`) and layer promotion.
- **Caveat 2**: The Admin portal (`Admin/`) was inspected for package dependencies (`framer-motion`) but not profiled during runtime, as the user dispatch specifically targets storefront UI performance and navigation (ports 5173 and 5000).
- **Caveat 3**: No changes to source code were made during this investigation per the explorer role constraints; all recommendations are documented for implementation.

---

## 4. Conclusion

Achieving a stable 60 FPS across all UI transitions requires four concrete optimizations:
1. **Optimize Circular Clip-Path Wipe**:
   - In `NavbarCircularItem.jsx`, eliminate `window.getComputedStyle(overlay).clipPath` by tracking animation progress algebraically using `performance.now()`.
   - Pass `startClip` directly as keyframe 0 in `overlay.animate(...)` instead of setting `overlay.style.clipPath` beforehand.
   - Replace `getBoundingClientRect()` in `Navbar.jsx:handleCategoryMouseEnter` with `itemEl.offsetLeft` and `itemEl.offsetWidth`.
   - Promote overlay to GPU layer with `transform: translateZ(0)` and remove `shadow-sm` from the clipped overlay.
2. **Resolve Scroll Reveal Conflict on Cards**:
   - In `ProductCard.jsx:45`, scope `transition-all` to `transition-[transform,box-shadow] duration-300 ease-out`.
   - In `motion.js:animateStaggerElements`, use 3D `translate3d(0, y, 0)` and remove inline style mutations prior to animation dispatch.
3. **Reduce Compositor Layer Bloat**:
   - In `MotionPrimitives.jsx:17`, change `AnimatedText` default mode to `'words'`.
   - In `index.css:105-108`, remove `will-change: transform, opacity;` from `.brisko-ch`.
4. **Throttle Scroll Handlers**:
   - In `Navbar.jsx` and `ShopByCategory.jsx`, wrap scroll rail event handlers in `requestAnimationFrame` guards and guard state setters with value inequality checks.
5. **Accelerate Marquee Keyframes**:
   - Upgrade `@keyframes marquee` and `@keyframes shimmer` in `index.css` to `translate3d`.

---

## 5. Verification Method

To verify these findings and validate future implementations:
1. **Linter Check**:
   ```powershell
   cd "d:\Sai techno solutions\ANR Hospital garments\Client"
   npm run lint
   ```
   *Expected output*: 0 errors.
2. **Production Build Check**:
   ```powershell
   cd "d:\Sai techno solutions\ANR Hospital garments\Client"
   npm run build
   ```
   *Expected output*: Vite build completes with code 0 and bundles in `dist/`.
3. **Runtime API & Dev Server Check**:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:5173" -Method Head
   Invoke-RestMethod -Uri "http://localhost:5000/api/categories" -Method Get
   ```
   *Expected output*: 200 OK responses from both servers.
4. **Performance Profiling Check**:
   - In Chrome DevTools Performance panel or Playwright, record a 5-second trace while scrubbing the cursor across the navbar category links and scrolling through product collection sections.
   - *Success criteria*: Frame rates remain at 60 FPS with zero Long Tasks (>50ms) originating from `NavbarCircularItem` or `animateStaggerElements`, and zero forced synchronous layout violations in the Performance Issues tab.
