import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout.tsx";
import { HomePage } from "./pages/home.tsx";
import { CategoryPage } from "./pages/category.tsx";
import { ProductDetailPage } from "./pages/product-detail.tsx";
import { LoginPage } from "./pages/login.tsx";
import { RegisterPage } from "./pages/register.tsx";
import { ForgotPasswordPage } from "./pages/forgot-password.tsx";
import { VendorDashboard } from "./pages/vendor-dashboard.tsx";
import { AdminDashboard } from "./pages/admin/dashboard";
import { Cart } from "./pages/cart.tsx";
import { CustomerDashboard } from "./pages/customer-dashboard.tsx";
import { OrderTracking } from "./pages/order-tracking.tsx";
import { Checkout } from "./pages/checkout.tsx";
import { AuthProvider, useAuth } from "./context/AuthContext.tsx";
import { Toaster } from "sonner";
import { PageLoader } from "./components/PageLoader.tsx";
import { CustomCursor } from "./components/CustomCursor.tsx";
import { BottomTabBar } from "./components/BottomTabBar.tsx";
import { WhatsAppButton } from "./components/WhatsAppButton.tsx";
import { seedDatabase } from "./lib/seed.ts";

import { GeneralSkeleton } from "./components/GeneralSkeleton";

function AppRoutes() {
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    seedDatabase();
  }, []);

  if (loading) return <GeneralSkeleton />;

  return (
    <Layout user={user} onLogout={logout}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-tracking/:id" element={<OrderTracking />} />
        
        <Route 
          path="/dashboard/*" 
          element={user ? <CustomerDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/vendor/*" 
          element={user?.role?.toLowerCase() === "vendor" ? <VendorDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin/*" 
          element={user?.role?.toLowerCase() === "admin" ? <AdminDashboard /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <PageLoader />
        <CustomCursor />
        <BottomTabBar />
        <WhatsAppButton />
        <Toaster position="top-center" expand={true} richColors />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
