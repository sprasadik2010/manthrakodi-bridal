// src/pages/Products.tsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SearchFilter from '../components/SearchFilter';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<{
    category?: string;
    priceRange?: { min: number; max: number };
    material?: string[];
    sortBy?: string;
  }>({});

  // Get category from URL
  const category = searchParams.get('category') || undefined;

  const { data: products, isLoading, error } = useProducts({
    category,
    ...filters,
  });

  // Initialize filters from URL
  useEffect(() => {
    if (category) {
      setFilters(prev => ({ ...prev, category }));
    }
  }, [category]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl text-red-600">Error loading products</h2>
        <p className="text-gray-600 mt-2">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SearchFilter onFilterChange={handleFilterChange} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-playfair font-bold text-gray-800">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Collection` : 'All Products'}
          </h1>
          <p className="text-gray-600 mt-2">
            Discover our exquisite collection of bridal wear and ornaments
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2 w-2/3"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2 mt-4"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {products && products.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">
                    Showing {products.length} products
                  </p>
                  <select
                    value={filters.sortBy || 'newest'}
                    onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                    className="border rounded-lg px-4 py-2"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products && products.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                  No products found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or check back later
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;