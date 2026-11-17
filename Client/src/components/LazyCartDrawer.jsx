import React from 'react';
import CartDrawer from './CartDrawer';

/**
 * Direct smooth CartDrawer mount so enter/exit slide transitions
 * execute immediately with zero chunk-fetching lag or Suspense flicker.
 */
const LazyCartDrawer = () => {
  return <CartDrawer />;
};

export default LazyCartDrawer;
