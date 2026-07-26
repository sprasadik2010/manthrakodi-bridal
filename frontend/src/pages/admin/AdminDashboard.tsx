<<<<<<< HEAD
import { useState, useEffect } from 'react';
=======
// src/pages/admin/AdminDashboard.tsx
import { useState } from 'react';
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
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
<<<<<<< HEAD
  FaBars,
  FaTimes
=======
  FaBars
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
} from 'react-icons/fa';
import DashboardHome from './DashboardHome';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';

const AdminDashboard = () => {
  const location = useLocation();
<<<<<<< HEAD
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  // Auto-close sidebar on mobile on route changes
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
=======
  const [sidebarOpen, setSidebarOpen] = useState(true);
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e

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
<<<<<<< HEAD
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 bottom-0 left-0 z-30 flex flex-col bg-[#120000] text-white transition-all duration-300 border-r border-white/5
        ${sidebarOpen ? 'w-64' : 'w-0 md:w-20 overflow-hidden md:overflow-visible'}
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-5 flex justify-between items-center border-b border-white/10 h-20 shrink-0">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <span className="font-playfair font-bold text-lg text-bridal-gold tracking-wider">
                MKB BRIDAL
              </span>
              <span className="text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded font-mono">
                Admin
              </span>
            </div>
          ) : (
            <span className="font-playfair font-bold text-xl text-bridal-gold mx-auto">M</span>
          )}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white p-1 rounded-lg"
            aria-label="Close sidebar"
          >
            <FaTimes size={18} />
          </button>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-bridal-maroon text-white font-semibold shadow-lg shadow-bridal/20 border-l-4 border-bridal-gold'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className={`text-lg transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-bridal-gold' : ''}`}>
                  {item.icon}
                </span>
                {(sidebarOpen || window.innerWidth <= 768) && (
                  <span className="ml-3 text-sm font-medium tracking-wide">
                    {item.label}
                  </span>
                )}
                
                {/* Tooltip for collapsed sidebar */}
                {!sidebarOpen && (
                  <div className="hidden md:group-hover:block absolute left-full ml-4 bg-gray-900 text-white text-xs px-3 py-2 rounded shadow-md z-50 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-3.5 rounded-xl hover:bg-red-950/30 text-gray-400 hover:text-red-400 w-full transition-colors font-medium text-sm group"
          >
            <FaSignOutAlt className="text-lg transition-transform group-hover:translate-x-0.5" />
            {sidebarOpen && (
              <span className="ml-3">
=======
    <div className="flex min-h-screen bg-purple-500">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-purple-400 text-white transition-all duration-300 fixed h-full flex flex-col z-10`}>
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
                  ? 'bg-white text-lime-900'  // Active state
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
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
                Logout
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
<<<<<<< HEAD
      <div className={`
        flex-1 min-w-0 min-h-screen transition-all duration-300 flex flex-col pt-16 md:pt-0
        ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}
      `}>
        {/* Mobile Header Bar */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#800000] text-white flex items-center justify-between px-4 z-20 shadow-md">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Open sidebar"
          >
            <FaBars size={20} />
          </button>
          <span className="font-playfair font-bold text-lg tracking-wider text-bridal-gold">MKB Admin</span>
          <div className="w-10"></div> {/* alignment helper */}
        </div>

        {/* Main Content Container */}
        <div className="flex-grow p-4 md:p-8 bg-gray-50 max-w-full">
=======
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-6">
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="products/*" element={<ProductManagement />} />
            <Route path="orders/*" element={<OrderManagement />} />
<<<<<<< HEAD
            <Route path="analytics" element={<div className="bg-white p-8 rounded-xl shadow text-center">Analytics Page (Coming Soon)</div>} />
            <Route path="customers" element={<div className="bg-white p-8 rounded-xl shadow text-center">Customers Page (Coming Soon)</div>} />
            <Route path="media" element={<div className="bg-white p-8 rounded-xl shadow text-center">Media Page (Coming Soon)</div>} />
            <Route path="settings" element={<div className="bg-white p-8 rounded-xl shadow text-center">Settings Page (Coming Soon)</div>} />
=======
            <Route path="analytics" element={<div className="p-8">Analytics Page (Coming Soon)</div>} />
            <Route path="customers" element={<div className="p-8">Customers Page (Coming Soon)</div>} />
            <Route path="media" element={<div className="p-8">Media Page (Coming Soon)</div>} />
            <Route path="settings" element={<div className="p-8">Settings Page (Coming Soon)</div>} />
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;