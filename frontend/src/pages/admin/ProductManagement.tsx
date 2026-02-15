// src/pages/admin/ProductManagement.tsx
import { useState/*, useEffect*/ } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, /*FaUpload, FaExternalLinkAlt,*/ FaEllipsisV, FaImage } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Product } from '../../types';
import ProductForm from '../../components/admin/ProductForm';
import SingleImageUpload from '../../components/admin/SingleImageUpload';

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  const { data: productsData, isLoading, refetch } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/products/?skip=0&limit=100`);
        return response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
        return { products: [] };
      }
    },
  });

  const products = productsData?.products || productsData || [];
  
  const filteredProducts = Array.isArray(products) 
    ? products.filter(product =>
        product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_URL}/products/${id}`);
        refetch();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleImageUploaded = (url: string) => {
    setUploadedImageUrl(url);
    setShowImageUpload(false);
    setShowForm(true);
  };

  const handleAddProductClick = () => {
    setUploadedImageUrl(null);
    setEditingProduct(null);
    setShowForm(true);
  };

  return (
    <div className="p-4 md:p-6">
      {/* Mobile Header */}
      <div className="md:hidden mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Products</h2>
            <p className="text-gray-600 text-sm">Manage your inventory</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 bg-gray-100 rounded-lg"
              aria-label="Toggle search"
            >
              <FaSearch size={18} />
            </button>
            <button
              onClick={() => setIsActionsOpen(!isActionsOpen)}
              className="p-2 bg-gray-100 rounded-lg"
              aria-label="Toggle actions"
            >
              <FaEllipsisV size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Search (Collapsible) */}
        {isSearchOpen && (
          <div className="mb-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Mobile Action Buttons (Collapsible) - Simplified */}
        {isActionsOpen && (
          <div className="mb-4 grid grid-cols-1 gap-2">
            <button
              onClick={() => {
                setUploadedImageUrl(null);
                setShowImageUpload(true);
                setIsActionsOpen(false);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg flex items-center justify-center gap-2 text-sm"
            >
              <FaImage /> Upload Image to ImgBB
            </button>
            <button
              onClick={() => {
                setUploadedImageUrl(null);
                setEditingProduct(null);
                setShowForm(true);
                setIsActionsOpen(false);
              }}
              className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg flex items-center justify-center gap-2 text-sm"
            >
              <FaPlus /> Add Product (Without Image)
            </button>
          </div>
        )}
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold">Product Management</h2>
          <p className="text-gray-600">Manage your product inventory and listings</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setUploadedImageUrl(null);
                setShowImageUpload(true);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm md:text-base"
            >
              <FaImage /> Upload to ImgBB
            </button>
            <button
              onClick={handleAddProductClick}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm md:text-base"
            >
              <FaPlus /> Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Simplified Upload Info Card */}
      <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 md:p-6 border border-purple-100">
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <FaImage className="text-purple-600" />
          <span className="text-sm md:text-lg">Simple Image Upload</span>
        </h3>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="font-semibold text-purple-600 text-base md:text-lg mb-2">
                Upload to ImgBB
              </div>
              <p className="text-sm md:text-base text-gray-600 mb-3">
                Select one image from your computer. It will be automatically uploaded to ImgBB and the link will be saved to your product.
              </p>
              <button
                onClick={() => {
                  setUploadedImageUrl(null);
                  setShowImageUpload(true);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm md:text-base inline-flex"
              >
                <FaImage /> Upload Single Image
              </button>
            </div>
            <div className="hidden sm:block w-24 h-24 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaImage className="text-purple-600 text-4xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Table/List */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bridal-maroon mx-auto mb-4"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <>
            {/* Mobile View - Card List */}
            <div className="md:hidden">
              {filteredProducts.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <div className="relative flex-shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-16 w-16 rounded-lg object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
                              <FaImage className="text-gray-400 text-2xl" />
                            </div>
                          )}
                          {product.images && product.images[0]?.includes('imgbb') && (
                            <div className="absolute bottom-0 right-0 bg-purple-600 text-white text-xs px-1 rounded-tl">
                              ImgBB
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-900 truncate pr-2">
                              {product.name}
                            </h3>
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  setEditingProduct(product);
                                  setUploadedImageUrl(null);
                                  setShowForm(true);
                                }}
                                className="text-blue-600 p-1"
                                title="Edit"
                              >
                                <FaEdit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="text-red-600 p-1"
                                title="Delete"
                              >
                                <FaTrash size={16} />
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                            {product.description}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 capitalize">
                              {product.category}
                            </span>
                            <div className="text-sm font-bold text-bridal-maroon">
                              ₹{product.price.toLocaleString()}
                            </div>
                            {product.originalPrice  && (product.original_price > product.price) && (
                              <div className="text-xs text-gray-500 line-through">
                                ₹{product.originalPrice.toLocaleString()}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.stock > 10 
                                ? 'bg-green-100 text-green-800' 
                                : product.stock > 0 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.stock} units
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              product.featured 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {product.featured ? 'Featured' : 'Regular'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No products found.</p>
                  <button
                    onClick={handleAddProductClick}
                    className="mt-4 bg-bridal-maroon text-white px-6 py-2 rounded-lg hover:bg-bridal-maroon/90 text-sm"
                  >
                    Add Your First Product
                  </button>
                </div>
              )}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="relative h-12 w-12 rounded-lg overflow-hidden mr-4">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-12 w-12 object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48x48?text=No+Image';
                                }}
                              />
                            ) : (
                              <div className="h-12 w-12 bg-gray-100 flex items-center justify-center">
                                <FaImage className="text-gray-400 text-xl" />
                              </div>
                            )}
                            {product.images && product.images[0]?.includes('imgbb') && (
                              <div className="absolute bottom-0 right-0 bg-purple-600 text-white text-xs px-1 rounded-tl">
                                ImgBB
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-gray-500 text-sm">
                              {product.description?.substring(0, 50)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-800 capitalize">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-lg font-bold text-bridal-maroon">
                          ₹{product.price.toLocaleString()}
                        </div>
                        {product.originalPrice  && (product.original_price > product.price) && (
                          <div className="text-sm text-gray-500 line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          product.stock > 10 
                            ? 'bg-green-100 text-green-800' 
                            : product.stock > 0 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock} units
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.featured 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.featured ? 'Featured' : 'Regular'}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            product.stock > 0 
                              ? 'bg-green-50 text-green-700' 
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setUploadedImageUrl(null);
                              setShowForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-2"
                            title="Edit Product"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900 p-2"
                            title="Delete Product"
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 md:block hidden">
                <p className="text-gray-500">No products found.</p>
                <button
                  onClick={handleAddProductClick}
                  className="mt-4 bg-bridal-maroon text-white px-6 py-2 rounded-lg hover:bg-bridal-maroon/90"
                >
                  Add Your First Product
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Stats Summary */}
      {products && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6">
          <div className="bg-white p-3 md:p-4 rounded-xl shadow">
            <div className="text-xl md:text-2xl font-bold text-bridal-maroon">{products.length}</div>
            <div className="text-xs md:text-sm text-gray-600">Total Products</div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-xl shadow">
            <div className="text-xl md:text-2xl font-bold text-green-600">
              {products.filter((p: Product) => p.stock > 0).length}
            </div>
            <div className="text-xs md:text-sm text-gray-600">In Stock</div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-xl shadow">
            <div className="text-xl md:text-2xl font-bold text-blue-600">
              {products.filter((p: Product) => p.featured).length}
            </div>
            <div className="text-xs md:text-sm text-gray-600">Featured</div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-xl shadow">
            <div className="text-xl md:text-2xl font-bold text-purple-600">
              {Array.from(new Set(products.map((p: Product) => p.category))).length}
            </div>
            <div className="text-xs md:text-sm text-gray-600">Categories</div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          initialImage={uploadedImageUrl}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
            setUploadedImageUrl(null);
          }}
          onSuccess={() => {
            refetch();
            setShowForm(false);
            setEditingProduct(null);
            setUploadedImageUrl(null);
          }}
        />
      )}

      {showImageUpload && (
        <SingleImageUpload
          onImageUploaded={handleImageUploaded}
          onClose={() => setShowImageUpload(false)}
        />
      )}
    </div>
  );
};

export default ProductManagement;