import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Layout } from "./components/layout.tsx";
import { Home } from "./pages/home.tsx";
import { ProductDetail } from "./pages/product-detail.tsx";
import { Login } from "./pages/login.tsx";
import { Register } from "./pages/register.tsx";
import { VendorDashboard } from "./pages/vendor-dashboard.tsx";
import { AdminDashboard } from "./pages/admin-dashboard.tsx";
import { Cart } from "./pages/cart.tsx";
import { CustomerDashboard } from "./pages/customer-dashboard.tsx";
import { OrderTracking } from "./pages/order-tracking.tsx";
import { Checkout } from "./pages/checkout.tsx";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: any, token: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  if (loading) return null;

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
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
    </Router>
  );
}
