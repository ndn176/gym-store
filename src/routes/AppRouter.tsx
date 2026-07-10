import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import StorefrontLayout from '../layouts/StorefrontLayout';
import AdminShell from '../layouts/AdminShell';

// ---- Storefront pages: split into their own chunk group ----
const HomePage = lazy(() => import('../pages/HomePage'));
const ShopPage = lazy(() => import('../pages/ShopPage'));
const ProductDetailPage = lazy(() => import('../pages/ProductDetailPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const SuccessPage = lazy(() => import('../pages/SuccessPage'));
const AccountPage = lazy(() => import('../pages/AccountPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'));
const CollectionsPage = lazy(() => import('../pages/CollectionsPage'));
const OurStoryPage = lazy(() => import('../pages/OurStoryPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const InfoPage = lazy(() => import('../pages/InfoPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// ---- Admin pages: separate chunk group, customers never download this code ----
const AdminLoginPage = lazy(() => import('../pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('../pages/admin/AdminProductsPage'));
const AdminProductFormPage = lazy(() => import('../pages/admin/AdminProductFormPage'));
const AdminOrdersPage = lazy(() => import('../pages/admin/AdminOrdersPage'));
const AdminInventoryPage = lazy(() => import('../pages/admin/AdminInventoryPage'));
const AdminDesignSystemPage = lazy(() => import('../pages/admin/AdminDesignSystemPage'));

function PageFallback() {
  // Intentionally no spinner — a plain matching background avoids a white
  // flash while the next route's JS chunk loads (usually near-instant).
  return <div className="min-h-[60vh] bg-black" />;
}

export default function AppRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Customer-facing storefront: Header + Footer layout */}
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/our-story" element={<OurStoryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/info/:slug" element={<InfoPage />} />
        </Route>

        {/* Admin back-office: separate layout + separate JS chunk, protected by RequireAdminAuth */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminShell />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/new" element={<AdminProductFormPage />} />
          <Route path="products/:id/edit" element={<AdminProductFormPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="inventory" element={<AdminInventoryPage />} />
          <Route path="design-system" element={<AdminDesignSystemPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
