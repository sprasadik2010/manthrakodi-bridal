// src/pages/admin/ProductManagement.tsx
import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaUpload, FaPlus, FaSearch, FaExternalLinkAlt } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Product } from '../../types';
import ProductForm from '../../components/admin/ProductForm';
import ImageUpload from '../../components/admin/ImageUpload';
import ExternalImageUpload from '../../components/admin/ExternalImageUpload';

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showExternalUpload, setShowExternalUpload] = useState(false);
  const [formDataWithImages, setFormDataWithImages] = useState<{
    images: string[];
    [key: string]: any;
  } | null>(null);

  const { data: productsData, isLoading, refetch } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/products');
        console.log('API Response:', response.data); // Debug log
        return response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
        return { products: [] }; // Return a safe default
      }
    },
  });

  // Safely extract products array from response
  const products = productsData?.products || productsData || [];
  
  // Ensure products is an array before filtering
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
        await axios.delete(`/api/products/${id}`);
        refetch();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleExternalImagesGenerated = (urls: string[]) => {
    // Store the image URLs and open the product form
    setFormDataWithImages({ images: urls });
    setShowExternalUpload(false);
    setShowForm(true);
  };

  useEffect(() => {
  console.log('Products data structure:', productsData);
  console.log('Products array:', products);
  console.log('Is array?', Array.isArray(products));
}, [productsData, products]);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold">Product Management</h2>
          <p className="text-gray-600">Manage your product inventory and listings</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowUpload(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaUpload /> Server Upload
            </button>
            <button
              onClick={() => setShowExternalUpload(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaExternalLinkAlt /> External Images
            </button>
            <button
              onClick={() => {
                setFormDataWithImages(null);
                setShowForm(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaPlus /> Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Upload Options Info Card */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <FaExternalLinkAlt className="text-purple-600" />
          Image Upload Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="font-semibold text-blue-600 mb-2">Server Upload</div>
            <p className="text-sm text-gray-600 mb-2">Upload images directly to your server</p>
            <button
              onClick={() => setShowUpload(true)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Choose this option →
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="font-semibold text-purple-600 mb-2">External Hosting</div>
            <p className="text-sm text-gray-600 mb-2">Use free services like ImgBB, PostImage</p>
            <button
              onClick={() => setShowExternalUpload(true)}
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              Choose this option →
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="font-semibold text-green-600 mb-2">Facebook/URL</div>
            <p className="text-sm text-gray-600 mb-2">Paste Facebook or direct image URLs</p>
            <button
              onClick={() => {
                setFormDataWithImages(null);
                setShowForm(true);
              }}
              className="text-sm text-green-600 hover:text-green-800"
            >
              Choose this option →
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bridal-maroon mx-auto mb-4"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
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
                  {filteredProducts&& filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="relative h-12 w-12 rounded-lg overflow-hidden mr-4">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-12 w-12 object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48x48?text=Image+Error';
                              }}
                            />
                            {/* Image source indicator */}
                            <div className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-1 rounded-tl">
                              {product.images[0]?.includes('imgbb.co') ? 'ImgBB' : 
                               product.images[0]?.includes('postimg.cc') ? 'PostImg' :
                               product.images[0]?.includes('facebook.com') ? 'FB' : 'URL'}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-gray-500 text-sm">
                              {product.description.substring(0, 50)}...
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {product.images.length} image{product.images.length !== 1 ? 's' : ''}
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
                        {product.originalPrice && (
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
                              setFormDataWithImages(null);
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
              <div className="text-center py-12">
                <p className="text-gray-500">No products found.</p>
                <button
                  onClick={() => {
                    setFormDataWithImages(null);
                    setShowForm(true);
                  }}
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
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="text-2xl font-bold text-bridal-maroon">{products.length}</div>
      <div className="text-gray-600">Total Products</div>
    </div>
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="text-2xl font-bold text-green-600">
        {products.filter((p: Product) => p.stock > 0).length}
      </div>
      <div className="text-gray-600">In Stock</div>
    </div>
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="text-2xl font-bold text-blue-600">
        {products.filter((p: Product) => p.featured).length}
      </div>
      <div className="text-gray-600">Featured</div>
    </div>
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="text-2xl font-bold text-purple-600">
        {Array.from(new Set(products.map((p: Product) => p.category))).length}
      </div>
      <div className="text-gray-600">Categories</div>
    </div>
  </div>
)}

      {/* Modals */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          initialImages={formDataWithImages?.images}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
            setFormDataWithImages(null);
          }}
          onSuccess={() => {
            refetch();
            setShowForm(false);
            setEditingProduct(null);
            setFormDataWithImages(null);
          }}
        />
      )}

      {showUpload && (
        <ImageUpload
          onClose={() => setShowUpload(false)}
          onSuccess={() => {
            refetch();
            setShowUpload(false);
          }}
        />
      )}

      {showExternalUpload && (
        <ExternalImageUpload
          onImageUrlsGenerated={handleExternalImagesGenerated}
          onClose={() => setShowExternalUpload(false)}
        />
      )}
    </div>
  );
};

export default ProductManagement;