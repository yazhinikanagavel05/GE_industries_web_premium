import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

// Common Components
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { DemoNoticeBanner } from './components/common/DemoNoticeBanner';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { ScrollToTop } from './components/common/ScrollToTop';

// Premium motion layer
import { Preloader } from './components/motion/Preloader';
import { PageTransition } from './components/motion/PageTransition';
import { AutoReveal } from './components/motion/AutoReveal';
import { SpotlightProvider } from './components/motion/SpotlightProvider';
import { BackToTop } from './components/motion/BackToTop';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AboutPage } from './pages/AboutPage';
import { HomeGymPage } from './pages/HomeGymPage';
import { CommercialPage } from './pages/CommercialPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { ShippingPolicyPage } from './pages/ShippingPolicyPage';
import { ReturnsPolicyPage } from './pages/ReturnsPolicyPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminAccessDeniedPage } from './pages/admin/AdminAccessDeniedPage';
import { RequireAdminAuth } from './components/admin/RequireAdminAuth';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <DemoNoticeBanner />
      <Navbar />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <CartDrawer />
      <AutoReveal />
      <SpotlightProvider />
      <BackToTop />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AdminAuthProvider>
      <StoreProvider>
        <CartProvider>
          <BrowserRouter>
            <Preloader />
            <ScrollToTop />
            <Layout>
              <Routes>
                {/* Storefront Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/home-gym" element={<HomeGymPage />} />
                <Route path="/commercial" element={<CommercialPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
                <Route path="/returns-policy" element={<ReturnsPolicyPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-conditions" element={<TermsPage />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/access-denied" element={<AdminAccessDeniedPage />} />
                <Route
                  path="/admin"
                  element={
                    <RequireAdminAuth>
                      <AdminDashboardPage />
                    </RequireAdminAuth>
                  }
                />

                {/* Fallback route */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </CartProvider>
      </StoreProvider>
    </AdminAuthProvider>
  );
};

export default App;
