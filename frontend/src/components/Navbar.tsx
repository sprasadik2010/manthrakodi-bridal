// src/components/Navbar.tsx - UPDATED
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../store/cartStore';
import SearchModal from './SearchModal';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();
  const { getCartCount } = useCartStore();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/products?category=saree', label: 'Sarees' },
    { path: '/products?category=ornament', label: 'Ornaments' },
    { path: '/products?category=bridal-set', label: 'Bridal Sets' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-lg w-full overflow-x-hidden">
        <div className="px-3 sm:px-4 lg:px-8 w-full">
          <div className="flex justify-between items-center h-20 w-full">
            {/* Logo - Made responsive for small screens */}
            <Link to="/" className="flex items-center shrink-0 min-w-0">
              <div className="text-2xl xs:text-3xl font-playfair font-bold text-bridal-maroon truncate">
                Manthrakodi
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                Bridal
              </span>
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8 mx-auto px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`whitespace-nowrap font-medium transition-colors ${
                    location.pathname === link.path.split('?')[0]
                      ? 'text-bridal-maroon border-b-2 border-bridal-maroon'
                      : 'text-gray-700 hover:text-bridal-maroon'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Action Buttons - Optimized for small screens */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-4 shrink-0">
              <button
                onClick={() => setShowSearch(true)}
                className="p-1 sm:p-2 text-gray-600 hover:text-bridal-maroon"
                aria-label="Search"
              >
                <FaSearch size={18} className="sm:w-5 sm:h-5" />
              </button>

              <Link
                to="/cart"
                className="relative p-1 sm:p-2 text-gray-600 hover:text-bridal-maroon"
              >
                <FaShoppingCart size={20} className="sm:w-[22px] sm:h-[22px]" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-bridal-maroon text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              <Link
                to="/admin"
                className="p-1 sm:p-2 text-gray-600 hover:text-bridal-maroon"
                aria-label="Admin"
              >
                <FaUser size={18} className="sm:w-5 sm:h-5" />
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-1 sm:p-2 text-gray-600 hover:text-bridal-maroon ml-1"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FaTimes size={22} className="sm:w-6 sm:h-6" /> : <FaBars size={22} className="sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t w-full overflow-hidden"
            >
              <div className="px-3 sm:px-4 py-3 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block w-full px-3 py-2 rounded-lg font-medium whitespace-nowrap ${
                      location.pathname === link.path.split('?')[0]
                        ? 'bg-bridal-maroon text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Search Modal */}
      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
};

export default Navbar;