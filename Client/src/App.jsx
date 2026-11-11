import React, { Component, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { RouteFallback } from './components/LazySection';
import ScrollToTopButton from './components/ScrollToTopButton';

import HomePage from './pages/HomePage';

const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BulkOrderPage = lazy(() => import('./pages/BulkOrderPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const ShippingPolicyPage = lazy(() => import('./pages/ShippingPolicyPage'));
const CancellationRefundPolicyPage = lazy(() => import('./pages/CancellationRefundPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));

const ScrollManager = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.slice(1);
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
      return () => clearTimeout(timer);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search, hash]);

  return null;
};

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-sm space-y-4">
            <h1 className="text-xl font-black text-[#1A175A]">Something went wrong</h1>
            <p className="text-xs text-slate-600">
              Please reload the page to restore a fresh session.
            </p>
            <button
              type="button"
              onClick={() => {
                window.location.href = '/';
              }}
              className="px-6 py-2.5 rounded-xl bg-[#1A175A] text-white text-xs font-bold"
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <AppErrorBoundary>
      <CartProvider>
        <BrowserRouter>
          <ScrollManager />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
            {/* 1. Core Storefront */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* 2. Institutional & Informational Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/bulk-order" element={<BulkOrderPage />} />
            <Route path="/bulk-inquiry" element={<BulkOrderPage />} />

            {/* 3. Product Listing & Detail Catalog */}
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:categorySlug" element={<ProductsPage />} />
            <Route path="/products/:categorySlug/:subCategorySlug" element={<ProductsPage />} />
            <Route path="/category/:categorySlug" element={<ProductsPage />} />
            <Route path="/category/:categorySlug/:subCategorySlug" element={<ProductsPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />

            {/* 4. Customer Shopping & Checkout Flow */}
            <Route path="/cart" element={<CartPage />} />
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

            {/* 6. 404 Not Found */}
            <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <ScrollToTopButton />
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </AppErrorBoundary>
  );
}

export default App;