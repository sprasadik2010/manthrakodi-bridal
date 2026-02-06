// src/components/SearchFilter.tsx
import React, { useState } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

interface FilterOptions {
  category: string[];
  priceRange: { min: number; max: number };
  material: string[];
  occasion: string[];
  sortBy: 'newest' | 'price-low' | 'price-high' | 'name';
}

const SearchFilter: React.FC<{
  onFilterChange: (filters: Partial<FilterOptions>) => void;
}> = ({ onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Partial<FilterOptions>>({
    sortBy: 'newest'
  });

  const categories = ['saree', 'ornament', 'bridal-set'];
  const materials = ['Silk', 'Cotton', 'Georgette', 'Chiffon', 'Gold', 'Silver', 'Pearl'];
  // const occasions = ['Wedding', 'Reception', 'Engagement', 'Festival', 'Casual'];

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="sticky top-0 z-40 bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search sarees, ornaments, bridal sets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 border rounded-lg flex items-center gap-2 hover:bg-gray-50"
          >
            <FaFilter /> Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border rounded-lg p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Filter Products</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div>
                <h4 className="font-semibold mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.category?.includes(cat)}
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...(filters.category || []), cat]
                            : (filters.category || []).filter(c => c !== cat);
                          handleFilterChange({ category: newCategories });
                        }}
                        className="mr-2"
                      />
                      <span className="capitalize">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold mb-3">Price Range</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">Min: ₹{filters.priceRange?.min || 0}</label>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={filters.priceRange?.min || 0}
                      onChange={(e) => handleFilterChange({
                        priceRange: {
                          min: parseInt(e.target.value),
                          max: filters.priceRange?.max || 100000
                        }
                      })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Max: ₹{filters.priceRange?.max || 100000}</label>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={filters.priceRange?.max || 100000}
                      onChange={(e) => handleFilterChange({
                        priceRange: {
                          min: filters.priceRange?.min || 0,
                          max: parseInt(e.target.value)
                        }
                      })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Material Filter */}
              <div>
                <h4 className="font-semibold mb-3">Material</h4>
                <div className="space-y-2">
                  {materials.map((material) => (
                    <label key={material} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.material?.includes(material)}
                        onChange={(e) => {
                          const newMaterials = e.target.checked
                            ? [...(filters.material || []), material]
                            : (filters.material || []).filter(m => m !== material);
                          handleFilterChange({ material: newMaterials });
                        }}
                        className="mr-2"
                      />
                      {material}
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h4 className="font-semibold mb-3">Sort By</h4>
                <div className="space-y-2">
                  {[
                    { value: 'newest', label: 'Newest First' },
                    { value: 'price-low', label: 'Price: Low to High' },
                    { value: 'price-high', label: 'Price: High to Low' },
                    { value: 'name', label: 'Name A-Z' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="sortBy"
                        value={option.value}
                        checked={filters.sortBy === option.value}
                        onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
                        className="mr-2"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setFilters({ sortBy: 'newest' });
                  onFilterChange({ sortBy: 'newest' });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-6 py-2 bg-bridal-maroon text-white rounded-lg hover:bg-bridal-maroon/90"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;