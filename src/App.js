import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Homepage from './pages/Homepage';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import DeliveryCharges from './pages/DeliveryCharges';
import Gallery from './pages/Gallery';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import OrderSuccess from './pages/OrderSuccess';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main>
              <Routes>
              <Route path="/order-success" element={<OrderSuccess/>}/>
                <Route path="/" element={<Homepage />} />
                <Route path="/products" element={<ProductListing />} />
                <Route path="/category/:category" element={<ProductListing />} />
                <Route path="/new-arrivals" element={<ProductListing type="new-arrivals" />} />
                <Route path="/sales" element={<ProductListing type="sales" />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/delivery-charges" element={<DeliveryCharges />} />
                {/* <Route path="/gallery" element={<Gallery />} /> */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
