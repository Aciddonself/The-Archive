import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import UserLayout from "./components/Layout/UserLayout"; 
import AdminLayout from "./components/Layout/AdminLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import OAuthCallback from "./pages/OAuthCallback";
import UserProfile from "./pages/UserProfile";
import ShopPage from "./pages/ShopPage";
import MenPage from "./pages/MenPage"; 
import WomenPage from "./pages/WomenPage";
import KidsPage from "./pages/KidsPage";
import UnisexPage from "./pages/UnisexPage";
import TopwearPage from "./pages/TopwearPage";
import BottomsPage from "./pages/BottomsPage";
import AfricanBeads from "./components/Products/AfricanBeads";
import SearchPage from "./pages/SearchPage";
import CheckoutPage from "./pages/CheckoutPage";
import Navbar from "./components/Common/Navbar";
import Footer from "./components/Layout/Footer";
import ErrorBoundary from "./components/Common/ErrorBoundary";
import FloatingChat from "./components/Common/FloatingChat";
import { useState, createContext, useContext } from "react";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Products from "./pages/admin/Products";
import Customers from "./pages/admin/Customers";
import Payments from "./pages/admin/Payments";
import Categories from "./pages/admin/Categories";
import Settings from "./pages/admin/Settings";
import SubAdmins from "./pages/admin/SubAdmins";
import Chat from "./pages/admin/Chat";
import Reviews from "./pages/admin/Reviews";
import PromoCodes from "./pages/admin/PromoCodes";
import UserChat from "./pages/Chat";
import WishlistPage from "./pages/WishlistPage";
import OrderTracking from "./pages/OrderTracking";

// Auth & Protection
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { EmailNotificationProvider } from "./context/EmailNotificationContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";

// Create notification context
const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      {/* Custom Notification - Top Right */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white ${
          notification.type === "success" ? "bg-green-600" : notification.type === "error" ? "bg-red-600" : "bg-blue-600"
        }`}>
          {notification.type === "success" && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {notification.type === "error" && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

// Layout for pages with Navbar and Footer using Outlet
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

// Page wrapper with Navbar and Footer
const PageWrapper = ({ component: Component }) => {
  return (
    <>
      <Navbar />
      <Component />
      <Footer />
    </>
  )
}

// Wrapper for protected shop pages
const ProtectedShopWrapper = ({ component: Component }) => {
  const { isAuthenticated } = useAuth()
  
  return (
    <>
      <Navbar />
      {isAuthenticated ? (
        <Component />
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900">
          <div className="max-w-lg p-10 mx-4 text-center shadow-2xl bg-white/10 backdrop-blur-md rounded-2xl">
            <h1 className="mb-4 text-4xl font-bold text-white">Welcome to Aromomit-Fashions</h1>
            <p className="mb-2 text-xl text-gray-200">Discover Authentic African Fashion</p>
            <p className="mb-8 text-gray-300">Please login or sign up to explore our collection and make purchases.</p>
            <a href="/login" className="inline-block px-8 py-4 text-lg font-semibold text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700">
              Login / Sign Up
            </a>
          </div>
        </div>
      )}
      <Footer />
    </>
  )
}

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ChatProvider>
          <EmailNotificationProvider>
            <NotificationProvider>
              <CartProvider>
                <WishlistProvider>
                <Routes>
                {/* Home page - requires login to view full content */}
                <Route path="/" element={<ProtectedShopWrapper component={Home} />} />
                
                {/* Shop with filters - requires login */}
                <Route path="/shop" element={<ProtectedShopWrapper component={ShopPage} />} />
                
                {/* Men */}
                <Route path="/men" element={<ProtectedShopWrapper component={MenPage} />} />
                
                {/* Women */}
                <Route path="/women" element={<ProtectedShopWrapper component={WomenPage} />} />
                
                {/* Kids */}
                <Route path="/kids" element={<ProtectedShopWrapper component={KidsPage} />} />
                
                {/* Unisex */}
                <Route path="/unisex" element={<ProtectedShopWrapper component={UnisexPage} />} />
                
                {/* Kids Sub-categories */}
                <Route path="/kids/dresses" element={<ProtectedShopWrapper component={KidsPage} />} />
                <Route path="/kids/tops" element={<ProtectedShopWrapper component={KidsPage} />} />
                <Route path="/kids/bottoms" element={<ProtectedShopWrapper component={KidsPage} />} />
                <Route path="/kids/shoes" element={<ProtectedShopWrapper component={KidsPage} />} />
                
                {/* Women Sub-categories */}
                <Route path="/women/handbags" element={<ProtectedShopWrapper component={WomenPage} />} />
                <Route path="/women/earrings" element={<ProtectedShopWrapper component={WomenPage} />} />
                <Route path="/women/braces" element={<ProtectedShopWrapper component={WomenPage} />} />
                <Route path="/women/shoes" element={<ProtectedShopWrapper component={WomenPage} />} />
                <Route path="/women/dresses" element={<ProtectedShopWrapper component={WomenPage} />} />
                <Route path="/women/tops" element={<ProtectedShopWrapper component={WomenPage} />} />
                <Route path="/women/bottoms" element={<ProtectedShopWrapper component={WomenPage} />} />
                
                {/* Men Sub-categories */}
                <Route path="/men/braces" element={<ProtectedShopWrapper component={MenPage} />} />
                <Route path="/men/shoes" element={<ProtectedShopWrapper component={MenPage} />} />
                <Route path="/men/tops" element={<ProtectedShopWrapper component={MenPage} />} />
                <Route path="/men/bottoms" element={<ProtectedShopWrapper component={MenPage} />} />
                
                {/* Topwear */}
                <Route path="/topwear" element={<ProtectedShopWrapper component={TopwearPage} />} />
                
                {/* Bottoms */}
                <Route path="/bottoms" element={<ProtectedShopWrapper component={BottomsPage} />} />
                
                {/* African Beads */}
                <Route path="/beads" element={<ProtectedShopWrapper component={AfricanBeads} />} />
                
                {/* Search Page */}
                <Route path="/search" element={<ProtectedShopWrapper component={SearchPage} />} />
                
                {/* Checkout Page - requires login */}
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <PageWrapper component={CheckoutPage} />
                  </ProtectedRoute>
                } />
                
                {/* Login - public but redirects if logged in */}
                <Route path="/login" element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } />

                {/* OAuth Callback */}
                <Route path="/oauth/callback" element={<OAuthCallback />} />
                
                {/* Register redirects to login (registration is in login page) */}
                <Route path="/register" element={<Navigate to="/login" replace />} />
                
                {/* Order Tracking - public route */}
                <Route path="/track-order" element={<PageWrapper component={OrderTracking} />} />
                
                {/* User Profile - requires login */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <PageWrapper component={UserProfile} />
                  </ProtectedRoute>
                } />
                
                {/* User Chat - requires login */}
                <Route path="/chat" element={
                  <ProtectedRoute>
                    <UserChat />
                  </ProtectedRoute>
                } />
                
                {/* Wishlist - accessible to all */}
                <Route path="/wishlist" element={<PageWrapper component={WishlistPage} />} />
                
                {/* Admin Routes - requires admin role */}
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="products" element={<Products />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="payments" element={<Payments />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="subadmins" element={<SubAdmins />} />
                  <Route path="chat" element={<Chat />} />
                  <Route path="reviews" element={<Reviews />} />
                  <Route path="promocodes" element={<PromoCodes />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
              
              {/* Floating AI Chat Button - Visible on all pages */}
              <FloatingChat />
              </WishlistProvider>
            </CartProvider>
            </NotificationProvider>
          </EmailNotificationProvider>
        </ChatProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
