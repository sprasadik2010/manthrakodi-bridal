import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  FaBox,
  FaShoppingCart,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome
} from 'react-icons/fa';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';

const AdminDashboard = () => {
  const location = useLocation();
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

  const menuItems = [
    { path: '/admin/products', icon: <FaBox />, label: 'Products' },
    { path: '/admin/orders', icon: <FaShoppingCart />, label: 'Orders' },
    { path: '/', icon: <FaHome />, label: 'Back to Shop' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/';
  };

  return (
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
            const isActive = item.path !== '/' && (location.pathname === item.path || 
              (item.path !== '/admin' && location.pathname.startsWith(item.path)));
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
                Logout
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
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
          <Routes>
            <Route index element={<Navigate to="/admin/products" replace />} />
            <Route path="products/*" element={<ProductManagement />} />
            <Route path="orders/*" element={<OrderManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;