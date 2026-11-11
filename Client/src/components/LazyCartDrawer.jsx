import React, { Suspense, lazy, useState } from 'react';
import { useCart } from '../context/CartContext';

const CartDrawer = lazy(() => import('./CartDrawer'));

/**
 * Defers downloading and mounting CartDrawer until the cart is first opened,
 * then keeps it mounted so open/close transitions work smoothly.
 */
const LazyCartDrawer = () => {
  const { isCartOpen } = useCart();
  const [hasOpened, setHasOpened] = useState(isCartOpen);

  if (isCartOpen && !hasOpened) {
    setHasOpened(true);
  }

  if (!hasOpened) return null;

  return (
    <Suspense fallback={null}>
      <CartDrawer />
    </Suspense>
  );
};

export default LazyCartDrawer;
