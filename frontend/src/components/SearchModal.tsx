// src/components/SearchModal.tsx
import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Product } from '../types';
import { Link } from 'react-router-dom';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query.trim()) return [];
      const response = await axios.get(`/api/products/search?q=${query}`);
      return response.data as Product[];
    },
    enabled: query.length > 1,
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="p-6 border-b">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search sarees, ornaments, bridal sets..."
                  className="w-full pl-12 pr-10 py-4 text-lg border-0 focus:ring-0 focus:outline-none"
                />
                <button
                  onClick={onClose}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center text-gray-500">
                  Searching...
                </div>
              ) : products && products.length > 0 ? (
                <div className="divide-y">
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={onClose}
                      className="flex items-center p-4 hover:bg-gray-50 transition-colors group"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 group-hover:text-bridal-maroon">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {product.description}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className="font-bold text-bridal-maroon">
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <FaArrowRight className="text-gray-400 group-hover:text-bridal-maroon ml-4" />
                    </Link>
                  ))}
                </div>
              ) : query.length > 1 ? (
                <div className="p-8 text-center text-gray-500">
                  No products found for "{query}"
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  Start typing to search products
                </div>
              )}
            </div>

            {/* Recent Searches */}
            {!query && (
              <div className="p-6 border-t">
                <h4 className="font-semibold text-gray-700 mb-3">Recent Searches</h4>
                <div className="flex flex-wrap gap-2">
                  {['Silk Sarees', 'Gold Necklace', 'Bridal Set', 'Wedding Jewelry'].map(
                    (term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                      >
                        {term}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;