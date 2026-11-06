import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([
    {
      id: "cs-01",
      name: "ANR Classic 5-Pocket Scrub Suit (Unisex)",
      price: 1399,
      originalPrice: 1899,
      color: "Navy Blue",
      size: "M",
      quantity: 1,
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80"
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");

  const addToCart = (product, selectedColor = "Navy Blue", selectedSize = "M") => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.color === selectedColor && item.size === selectedSize);
      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.color === selectedColor && item.size === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        color: selectedColor,
        size: selectedSize,
        quantity: 1,
        image: product.image
      }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id, color, size) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.color === color && item.size === size)));
  };

  const updateQuantity = (id, color, size, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id && item.color === color && item.size === size) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      totalItems,
      subtotal,
      isCartOpen,
      setIsCartOpen,
      wishlistCount,
      setWishlistCount,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
