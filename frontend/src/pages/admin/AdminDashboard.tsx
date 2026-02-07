// src/pages/admin/AdminDashboard.tsx
import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingCart,
  FaChartBar,
  FaUsers,
  FaImage,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';
import DashboardHome from './DashboardHome';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';

const AdminDashboard = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/admin', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/admin/products', icon: <FaBox />, label: 'Products' },
    { path: '/admin/orders', icon: <FaShoppingCart />, label: 'Orders' },
    { path: '/admin/analytics', icon: <FaChartBar />, label: 'Analytics' },
    { path: '/admin/customers', icon: <FaUsers />, label: 'Customers' },
    { path: '/admin/media', icon: <FaImage />, label: 'Media' },
    { path: '/admin/settings', icon: <FaCog />, label: 'Settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/';
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-bridal-maroon text-white transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex justify-between items-center">
          <h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>
            Admin Panel
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-2xl hover:text-gray-200"
          >
            ☰
          </button>
        </div>
        
        <nav className="flex-1 px-4">
          {menuItems&&menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg mb-2 transition-colors ${
                location.pathname === item.path 
                  ? 'bg-white/20' 
                  : 'hover:bg-white/10'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`ml-4 ${!sidebarOpen && 'hidden'}`}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-3 rounded-lg hover:bg-white/10 w-full transition-colors"
          >
            <FaSignOutAlt className="text-xl" />
            <span className={`ml-4 ${!sidebarOpen && 'hidden'}`}>
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/analytics" element={<div className="p-8">Analytics Page (Coming Soon)</div>} />
            <Route path="/customers" element={<div className="p-8">Customers Page (Coming Soon)</div>} />
            <Route path="/media" element={<div className="p-8">Media Page (Coming Soon)</div>} />
            <Route path="/settings" element={<div className="p-8">Settings Page (Coming Soon)</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;