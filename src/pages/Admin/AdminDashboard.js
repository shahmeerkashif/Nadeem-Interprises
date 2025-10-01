import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import ProductManagement from '../../components/Admin/ProductManagement';
import GalleryManagement from '../../components/Admin/GalleryManagement';
import OrderManagement from '../../components/Admin/OrderManagement';
import DeliveryManagement from '../../components/Admin/DeliveryManagement';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const tabs = [
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'orders', label: 'Orders', icon: '📋' },
    // { id: 'gallery', label: 'Gallery', icon: '🖼️' },
    { id: 'delivery', label: 'Delivery', icon: '🚚' }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      // case 'gallery':
      //   return <GalleryManagement />;
      case 'delivery':
        return <DeliveryManagement />;
      default:
        return <ProductManagement />;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <h1>Admin Dashboard</h1>
              <p>Welcome back, {user?.email}</p>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="container">
          <div className="dashboard-layout">
            <motion.nav
              className="dashboard-nav"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="nav-tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="tab-icon">{tab.icon}</span>
                    <span className="tab-label">{tab.label}</span>
                  </button>
                ))}
              </div>
            </motion.nav>

            <motion.main
              className="dashboard-main"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              key={activeTab}
            >
              {renderTabContent()}
            </motion.main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
