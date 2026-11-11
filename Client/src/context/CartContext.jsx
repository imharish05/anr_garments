import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const formatColorLabel = (color, fallback = 'Navy Blue') => {
  if (!color) return fallback;
  if (typeof color === 'object' && color !== null) {
    return String(color.name || color.hex || fallback);
  }
  return String(color);
};

export const CartProvider = ({ children }) => {
  // Load Cart from localStorage (never pre-populate with mock products)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('anr_cart');
      const parsed = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((item) => item && typeof item === 'object')
        .map((item) => ({
          ...item,
          color: formatColorLabel(item.color),
          size: item.size ? String(item.size) : 'M',
          quantity: Math.max(1, Number(item.quantity) || 1),
        }));
    } catch {
      return [];
    }
  });

  // Load Wishlist from localStorage
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('anr_wishlist');
      const parsed = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item) => item && typeof item === 'object' && item.id != null);
    } catch {
      return [];
    }
  });

  // Current logged in customer state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('anr_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('anr_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Cart persistence error:', e);
    }
  }, [cartItems]);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem('anr_wishlist', JSON.stringify(wishlistItems));
    } catch (e) {
      console.warn('Wishlist persistence error:', e);
    }
  }, [wishlistItems]);

  const loginUser = (userData) => {
    setCurrentUser(userData);
    try {
      localStorage.setItem('anr_user', JSON.stringify(userData));
    } catch (e) {
      console.warn('User storage error:', e);
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('anr_user');
    } catch (e) {
      console.warn('User storage removal error:', e);
    }
  };

  const addToCart = (product, selectedColor = "Navy Blue", selectedSize = "M", quantity = 1, embroidery = null) => {
    const safeColor = formatColorLabel(selectedColor);

    setCartItems(prev => {
      // If embroidery is attached, treat as unique customized item
      const existing = prev.find(item =>
        String(item.id) === String(product.id) &&
        item.color === safeColor &&
        item.size === selectedSize &&
        JSON.stringify(item.embroidery || null) === JSON.stringify(embroidery || null)
      );

      const itemBasePrice = Number(product.price || 1299);
      const embAddon = embroidery?.price || 0;
      const finalItemPrice = itemBasePrice + embAddon;

      if (existing) {
        return prev.map(item =>
          String(item.id) === String(product.id) &&
          item.color === safeColor &&
          item.size === selectedSize &&
          JSON.stringify(item.embroidery || null) === JSON.stringify(embroidery || null)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, {
        id: product.id,
        slug: product.slug || String(product.id),
        name: product.name,
        price: finalItemPrice,
        basePrice: itemBasePrice,
        originalPrice: product.originalPrice,
        color: safeColor,
        size: selectedSize,
        quantity: quantity,
        image: product.image,
        embroidery: embroidery || null
      }];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (id, color, size, embroidery = null) => {
    const safeColor = formatColorLabel(color);

    setCartItems(prev => prev.filter(item => !(
      String(item.id) === String(id) &&
      item.color === safeColor &&
      item.size === size &&
      JSON.stringify(item.embroidery || null) === JSON.stringify(embroidery || null)
    )));
  };

  const updateQuantity = (id, color, size, delta, embroidery = null) => {
    const safeColor = formatColorLabel(color);

    setCartItems(prev => prev.map(item => {
      if (
        String(item.id) === String(id) &&
        item.color === safeColor &&
        item.size === size &&
        JSON.stringify(item.embroidery || null) === JSON.stringify(embroidery || null)
      ) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Wishlist actions
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
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const wishlistCount = wishlistItems.length;

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      isCartOpen,
      setIsCartOpen,
      wishlistItems,
      wishlistCount,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      currentUser,
      loginUser,
      logoutUser,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);