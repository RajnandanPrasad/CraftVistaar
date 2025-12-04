import React from "react";
import OrderConfirm from "./pages/OrderConfirm";
import Checkout from "./pages/Checkout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";
import MyOrders from "./pages/MyOrders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import BuyPage from "./pages/BuyPage";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import ProductDetails from "./pages/ProductDetails";

// ✅ Admin Pages
import SellerAnalytics from "./pages/admin/SellerAnalytics";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminUsers from "./pages/admin/Users";

// ✅ Seller Pages
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProfile from "./pages/seller/SellerProfile";
import SellerProducts from "./pages/seller/SellerProducts";
import SellerOrders from "./pages/seller/SellerOrders";
import LearnPage from "./pages/seller/LearnPage";
import LearnVideos from "./pages/seller/LearnVideos";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/category/:categoryName" element={<Products />} />
              <Route path="/products/search" element={<Products />} />

              {/* ✅ Checkout + Order Confirm Routes */}
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order/confirm" element={<OrderConfirm />} />

              {/* ⭐️ MY ORDERS ROUTE */}
              <Route
                path="/orders"
                element={
                  <ProtectedRoute requiredRole="customer">
                    <MyOrders />
                  </ProtectedRoute>
                }
              />

              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/buy" element={<BuyPage />} />

              {/* Seller Routes */}
              <Route
                path="/seller"
                element={
                  <ProtectedRoute requiredRole="seller">
                    <SellerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/dashboard"
                element={
                  <ProtectedRoute requiredRole="seller">
                    <SellerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/profile"
                element={
                  <ProtectedRoute requiredRole="seller">
                    <SellerProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/learn"
                element={
                  <ProtectedRoute requiredRole="seller">
                    <LearnPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/learn/:categoryId"
                element={
                  <ProtectedRoute requiredRole="seller">
                    <LearnVideos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/products"
                element={
                  <ProtectedRoute requiredRole="seller">
                    <SellerProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/orders"
                element={
                  <ProtectedRoute requiredRole="seller">
                    <SellerOrders />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/profile"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminProfile />
                  </ProtectedRoute>
                }
              />

              {/* Admin - Users Page */}
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />

              {/* ✅ Admin - Seller Analytics Page */}
              <Route
                path="/admin/seller-analytics"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <SellerAnalytics />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          <Footer />
          <Toaster position="top-center" reverseOrder={false} />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}
