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
    category?: string[];
    priceRange?: { min: number; max: number };
    material?: string[];
    sortBy?: string;
    q?: string;
  }>({
    sortBy: 'newest'
  });

  // Get category and search query from URL
  const urlCategory = searchParams.get('category') || undefined;
  const urlQuery = searchParams.get('q') || undefined;

  // Fetch all products to allow full client-side filtering and sorting
  const { data: rawProducts, isLoading, error } = useProducts();

  // Initialize filters from URL parameters
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: urlCategory ? [urlCategory] : [],
      q: urlQuery || undefined
    }));
  }, [urlCategory, urlQuery]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Derive filtered and sorted products
  const filteredAndSortedProducts = (() => {
    if (!rawProducts) return [];

    let result = [...rawProducts];

    // 1. Search Query Filter
    if (filters.q) {
      const query = filters.q.toLowerCase().trim();
      result = result.filter(product => 
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.subCategory?.toLowerCase().includes(query) ||
        product.price?.toString().includes(query)
      );
    }

    // 2. Category Checkbox Filter
    if (filters.category && filters.category.length > 0) {
      result = result.filter(product => 
        filters.category!.includes(product.category)
      );
    }

    // 3. Price Range Filter
    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      result = result.filter(product => 
        product.price >= min && product.price <= max
      );
    }

    // 4. Material Filter
    if (filters.material && filters.material.length > 0) {
      result = result.filter(product => {
        const productText = `${product.name} ${product.description || ''} ${product.attributes?.material || ''}`.toLowerCase();
        return filters.material!.some(mat => productText.includes(mat.toLowerCase()));
      });
    }

    // 5. Sorting
    const sortBy = filters.sortBy || 'newest';
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        const validA = !isNaN(timeA) ? timeA : 0;
        const validB = !isNaN(timeB) ? timeB : 0;
        if (validA !== validB) return validB - validA;
        return (b.id || '').localeCompare(a.id || '');
      });
    }

    return result;
  })();

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
      <SearchFilter onFilterChange={handleFilterChange} initialCategory={urlCategory} initialQuery={urlQuery} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-playfair font-bold text-gray-800">
            {urlCategory ? `${urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1)} Collection` : 'All Products'}
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
            {filteredAndSortedProducts.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">
                    Showing {filteredAndSortedProducts.length} products
                  </p>
                  <select
                    value={filters.sortBy || 'newest'}
                    onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                    className="border rounded-lg px-4 py-2 bg-white"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAndSortedProducts.map((product: Product) => (
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