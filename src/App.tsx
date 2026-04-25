import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout.tsx";
import { HomePage } from "./pages/home.tsx";
import { CategoryPage } from "./pages/category.tsx";
import { ProductDetailPage } from "./pages/product-detail.tsx";
import { LoginPage } from "./pages/login.tsx";
import { RegisterPage } from "./pages/register.tsx";
import { VendorDashboard } from "./pages/vendor-dashboard.tsx";
import { AdminDashboard } from "./pages/admin/dashboard";
import { Cart } from "./pages/cart.tsx";
import { CustomerDashboard } from "./pages/customer-dashboard.tsx";
import { OrderTracking } from "./pages/order-tracking.tsx";
import { Checkout } from "./pages/checkout.tsx";
import { AuthProvider, useAuth } from "./context/AuthContext.tsx";
import { Toaster } from "sonner";
import { seedDatabase } from "./lib/seed.ts";

function AppRoutes() {
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    seedDatabase();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-ojo-cream flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-ojo-mustard border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <Layout user={user} onLogout={logout}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-tracking/:id" element={<OrderTracking />} />
        
        <Route 
          path="/dashboard/*" 
          element={user ? <CustomerDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/vendor/*" 
          element={user?.role === "VENDOR" ? <VendorDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin/*" 
          element={user?.role === "ADMIN" ? <AdminDashboard /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" expand={true} richColors />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
