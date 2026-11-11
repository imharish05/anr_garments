# M1 Exploration Report: Wishlist State Management Fix (R3)

**Author**: `explorer_m1_1`  
**Date**: 2026-11-11  
**Scope**: Exact implementation plan and verification protocol for Requirement R3 (Wishlist State Management Fix / Feature F12) across `Client/src/components/ProductCard.jsx`, `Client/src/context/CartContext.jsx`, and dependent components.

---

## 1. Executive Summary

| Requirement | Root Cause | Primary File & Line | Secondary Files Affected | Fix Strategy |
|---|---|---|---|---|
| **R3**: Wishlist State Management Fix (`setWishlistCount is not a function`) | `ProductCard.jsx` attempts to call `setWishlistCount` (which does not exist in `CartContext`), while managing wishlist state via disconnected local `useState(false)`. Context changes are never dispatched, items are never persisted to `wishlistItems`, and the Navbar counter is never updated. | `Client/src/components/ProductCard.jsx:12, 41` | `Client/src/context/CartContext.jsx:17-25, 147-191`<br>`Client/src/pages/WishlistPage.jsx:11-14` | 1. Replace `setWishlistCount` with `{ addToWishlist, removeFromWishlist, isInWishlist }` in `ProductCard.jsx`.<br>2. Derive `isLiked = Boolean(product?.id != null && isInWishlist(product.id))`.<br>3. Toggle via `isLiked ? removeFromWishlist(product.id) : addToWishlist(product)`.<br>4. Harden `CartContext.jsx` with string/number ID safety, safe `localStorage` hydration, and optional `toggleWishlist(product)`. |

---

## 2. Evidence Chain & Direct Observations

### 2.1 Verbatim Runtime Error Reproduction
Through automated browser execution on `http://localhost:5173`, clicking the heart icon on any `ProductCard` triggers:
```
TypeError: setWishlistCount is not a function
    at handleWishlist (http://localhost:5173/src/components/ProductCard.jsx:49:3)
    at executeDispatch (http://localhost:5173/node_modules/.vite/deps/react-dom_client.js:9903:5)
```

### 2.2 Direct Code Inspection: `Client/src/components/ProductCard.jsx`
- **Lines 11–15**:
  ```javascript
  const ProductCard = ({ product }) => {
    const { addToCart, setWishlistCount } = useCart();
    const [selectedColorIdx, setSelectedColorIdx] = useState(0);
    const [selectedSize, setSelectedSize] = useState("M");
    const [isLiked, setIsLiked] = useState(false);
  ```
  - Observation: `setWishlistCount` is destructured from `useCart()`, but `CartContext` exports no such property.
  - Observation: `isLiked` is initialized to `false` in local state. This means any product already in the user's saved wishlist appears unliked whenever a list renders.

- **Lines 37–42**:
  ```javascript
  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    setWishlistCount((prev) => (isLiked ? Math.max(0, prev - 1) : prev + 1));
  };
  ```
  - Observation: Invoking `setWishlistCount(...)` throws `TypeError: setWishlistCount is not a function`.
  - Observation: The product is NEVER added to or removed from `wishlistItems`.

- **Lines 102–113**:
  ```jsx
  <button
    onClick={handleWishlist}
    aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
    aria-pressed={isLiked}
    className={`absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full shadow-sm backdrop-blur-md transition-all duration-200 ${
      isLiked
        ? 'scale-105 bg-rose-50 text-rose-600'
        : 'bg-white/90 text-slate-600 hover:scale-110 hover:text-rose-500'
    }`}
  >
    <Heart className={`h-4 w-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
  </button>
  ```
  - Observation: Missing `type="button"`, causing potential submit side-effects if nested in a form.

### 2.3 Direct Code Inspection: `Client/src/context/CartContext.jsx`
- **Lines 17–25**:
  ```javascript
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('anr_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  ```
  - Observation: Unlike `cartItems` (line 11) which checks `Array.isArray(parsed)`, `wishlistItems` blindly returns `JSON.parse(saved)`. If corrupted or non-array (e.g. `{}` or `"true"`), subsequent array calls `.some()`, `.filter()`, and `.length` crash.

- **Lines 147–166**:
  ```javascript
  const addToWishlist = (product) => {
    setWishlistItems(prev => {
      if (prev.some(p => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(p => p.id !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(p => p.id === productId);
  };

  const wishlistCount = wishlistItems.length;
  ```
  - Observation: `wishlistCount` is a read-only derived integer, NOT a state setter.
  - Observation: `p.id === productId` uses strict equality. If a product ID from URL params or API is a string while another is a number (e.g. `"1"` vs `1`), `isInWishlist` returns false. Normalizing with `String(p.id) === String(productId)` prevents subtle mismatches.
  - Observation: Null/undefined inputs are not guarded.

### 2.4 Reference Implementations Across the Codebase
- **`Client/src/pages/ProductDetailPage.jsx:54, 210, 250–262`**:
  ```javascript
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist, currentUser, setIsCartOpen } = useCart();
  const isLiked = isInWishlist(product.id);
  // ...
  <button
    type="button"
    onClick={() => isLiked ? removeFromWishlist(product.id) : addToWishlist(product)}
    className={`... ${isLiked ? 'bg-rose-50 text-rose-600 scale-105' : 'bg-white/90 text-slate-600 hover:scale-110 hover:text-rose-500'}`}
    aria-label="Save to Wishlist"
  >
    <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
  </button>
  ```
  - Observation: `ProductDetailPage.jsx` already adheres to the exact contract required by `CartContext`.

- **`Client/src/components/Navbar.jsx:32, 429–433`**:
  ```javascript
  const { totalItems, setIsCartOpen, wishlistCount } = useCart();
  // ...
  {wishlistCount > 0 && (
    <span className="pointer-events-none absolute top-0.5 right-0.5 z-20 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 sm:w-[18px] sm:h-[18px] rounded-full flex items-center justify-center shadow">
      {wishlistCount}
    </span>
  )}
  ```
  - Observation: The Navbar directly displays `wishlistCount`. As soon as `addToWishlist` and `removeFromWishlist` update `wishlistItems`, this badge reacts immediately.

- **`Client/src/pages/WishlistPage.jsx:9–15`**:
  ```javascript
  const { wishlistItems, removeFromWishlist, addToCart } = useCart();
  const handleMoveToCart = (product) => {
    addToCart(product, product.color || 'Navy Blue', product.size || 'M');
    removeFromWishlist(product.id);
  };
  ```
  - Observation: `WishlistPage` iterates over `wishlistItems` and renders each product. When `ProductCard` adds the product object to context, it will seamlessly appear on the Wishlist page.

---

## 3. Worker Implementation Specification

### 3.1 Changes in `Client/src/components/ProductCard.jsx`

#### Modification 1: Hook Destructuring
- **Location**: Line 12
- **Action**: Replace `setWishlistCount` with `addToWishlist, removeFromWishlist, isInWishlist`.
```javascript
// BEFORE (Line 12):
const { addToCart, setWishlistCount } = useCart();

// AFTER:
const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
```

#### Modification 2: Derive `isLiked` from Context
- **Location**: Line 15
- **Action**: Remove disconnected `useState(false)` and compute `isLiked` dynamically.
```javascript
// BEFORE (Line 15):
const [isLiked, setIsLiked] = useState(false);

// AFTER:
const isLiked = Boolean(product?.id != null && isInWishlist(product.id));
```

#### Modification 3: Update `handleWishlist`
- **Location**: Lines 37–42
- **Action**: Toggle wishlist via `CartContext` actions; remove undefined setter.
```javascript
// BEFORE (Lines 37–42):
const handleWishlist = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setIsLiked(!isLiked);
  setWishlistCount((prev) => (isLiked ? Math.max(0, prev - 1) : prev + 1));
};

// AFTER:
const handleWishlist = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (!product?.id) return;
  if (isLiked) {
    removeFromWishlist(product.id);
  } else {
    addToWishlist(product);
  }
};
```

#### Modification 4: Wishlist Button Attributes
- **Location**: Lines 102–113
- **Action**: Ensure `type="button"` is set.
```jsx
// BEFORE (Line 102):
<button
  onClick={handleWishlist}
  aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
// ...

// AFTER:
<button
  type="button"
  onClick={handleWishlist}
  aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
// ...
```

---

### 3.2 Changes in `Client/src/context/CartContext.jsx`

#### Modification 1: Safe `localStorage` Deserialization
- **Location**: Lines 17–25
- **Action**: Validate `Array.isArray` and filter out malformed objects without IDs.
```javascript
// BEFORE (Lines 17–25):
const [wishlistItems, setWishlistItems] = useState(() => {
  try {
    const saved = localStorage.getItem('anr_wishlist');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
});

// AFTER:
const [wishlistItems, setWishlistItems] = useState(() => {
  try {
    const saved = localStorage.getItem('anr_wishlist');
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.filter(item => item && item.id != null) : [];
  } catch {
    return [];
  }
});
```

#### Modification 2: Guarded Wishlist Actions & ID Coercion
- **Location**: Lines 148–162
- **Action**: Guard against nulls, coerce IDs with `String(...)`, and add atomic `toggleWishlist`.
```javascript
// BEFORE (Lines 148–162):
const addToWishlist = (product) => {
  setWishlistItems(prev => {
    if (prev.some(p => p.id === product.id)) return prev;
    return [...prev, product];
  });
};

const removeFromWishlist = (productId) => {
  setWishlistItems(prev => prev.filter(p => p.id !== productId));
};

const isInWishlist = (productId) => {
  return wishlistItems.some(p => p.id === productId);
};

// AFTER:
const addToWishlist = (product) => {
  if (!product || product.id == null) return;
  setWishlistItems(prev => {
    if (prev.some(p => String(p.id) === String(product.id))) return prev;
    return [...prev, product];
  });
};

const removeFromWishlist = (productId) => {
  if (productId == null) return;
  setWishlistItems(prev => prev.filter(p => String(p.id) !== String(productId)));
};

const isInWishlist = (productId) => {
  if (productId == null) return false;
  return wishlistItems.some(p => String(p.id) === String(productId));
};

const toggleWishlist = (product) => {
  if (!product || product.id == null) return;
  setWishlistItems(prev => {
    const exists = prev.some(p => String(p.id) === String(product.id));
    return exists
      ? prev.filter(p => String(p.id) !== String(product.id))
      : [...prev, product];
  });
};
```

#### Modification 3: Export `toggleWishlist` in Provider Value
- **Location**: Lines 180–183
- **Action**: Export `toggleWishlist` alongside existing wishlist helpers.
```javascript
// IN PROVIDER VALUE:
wishlistItems,
wishlistCount,
addToWishlist,
removeFromWishlist,
isInWishlist,
toggleWishlist,
```

---

## 4. Verification & Testing Strategy

The worker must execute and pass the following tests to verify implementation:

### 4.1 Automated Interactive Verification (Playwright / Browser Console)
1. Navigate to `http://localhost:5173`.
2. Scroll to any product collection section.
3. Click the wishlist heart button on the first product card (`button[aria-label="Add to wishlist"] >> nth=0`).
4. **Assertions**:
   - Zero console errors recorded (specifically confirming absence of `TypeError: setWishlistCount is not a function`).
   - Button attribute `aria-pressed` switches to `"true"`.
   - Button class contains `text-rose-600 bg-rose-50`.
   - Heart SVG class contains `fill-rose-500`.
   - Navbar wishlist badge appears and displays `"1"`.
5. Click the heart button a second time (`button[aria-label="Remove from wishlist"] >> nth=0`).
6. **Assertions**:
   - Zero console errors.
   - Button attribute `aria-pressed` switches to `"false"`.
   - Navbar wishlist badge disappears or shows 0.

### 4.2 Cross-View Synchronization Verification
1. Click the wishlist heart button on a product card on the homepage.
2. Navigate to `/wishlist`.
3. **Assertions**:
   - The saved product appears in the wishlist grid with name, image, price, and "Move to Bag" button.
   - The wishlist header indicates `Your Saved Uniforms (1)`.
4. Click the trash icon on `/wishlist` to remove the item.
5. Navigate back to `/`.
6. **Assertions**:
   - The product card's heart icon is unliked (`aria-pressed="false"`).

### 4.3 Persistence Verification
1. Add an item to the wishlist.
2. Inspect `localStorage.getItem('anr_wishlist')` in the browser console.
3. Refresh the page (`Ctrl+R` or browser reload).
4. **Assertions**:
   - Product card still renders with filled rose heart (`isLiked === true`).
   - Navbar wishlist badge persists with value `"1"`.

### 4.4 Static Verification & Build Integrity
Run the following commands in terminal:
```bash
# 1. Lint check (must have 0 errors)
npm --prefix Client run lint

# 2. Production build (must succeed with exit code 0)
npm --prefix Client run build
```
