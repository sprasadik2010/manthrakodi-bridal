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
  FaSignOutAlt,
  FaBars
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#8B0000] text-white transition-all duration-300 fixed h-full flex flex-col z-10`}>
        <div className="p-6 flex justify-between items-center border-b border-white/20">
          {sidebarOpen && (
            <h1 className="font-bold text-xl">
              Admin Panel
            </h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-2xl hover:text-gray-200 p-2"
            aria-label="Toggle sidebar"
          >
            <FaBars />
          </button>
        </div>
        
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-3 rounded-lg mb-1 transition-colors ${
                location.pathname === item.path 
                  ? 'bg-white text-[#8B0000]'  // Active state
                  : 'hover:bg-white/20 text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && (
                <span className="ml-3 font-medium">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center px-3 py-3 rounded-lg hover:bg-white/20 w-full transition-colors text-white"
          >
            <FaSignOutAlt className="text-lg" />
            {sidebarOpen && (
              <span className="ml-3 font-medium">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-6">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="products/*" element={<ProductManagement />} />
            <Route path="orders/*" element={<OrderManagement />} />
            <Route path="analytics" element={<div className="p-8">Analytics Page (Coming Soon)</div>} />
            <Route path="customers" element={<div className="p-8">Customers Page (Coming Soon)</div>} />
            <Route path="media" element={<div className="p-8">Media Page (Coming Soon)</div>} />
            <Route path="settings" element={<div className="p-8">Settings Page (Coming Soon)</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;