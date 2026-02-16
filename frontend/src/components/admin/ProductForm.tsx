// src/components/admin/ProductForm.tsx
import { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaImage } from 'react-icons/fa';
import axios from 'axios';
import { Product } from '../../types';

interface ProductFormProps {
  product?: Product | null;
  initialImage?: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductForm = ({ product, initialImage, onClose, onSuccess }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'saree',
    stock: '',
    featured: false,
    // Don't include images in form data for editing
  });
  
  // Separate state for images
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    if (product) {
      // For editing: load all product data except images
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        originalPrice: product.original_price?.toString() || '',
        category: product.category || 'other',
        stock: product.stock?.toString() || '',
        featured: product.featured || false,
      });
      // Store images separately
      setImages(product.images || []);
    } else if (initialImage) {
      // For new product with initial image from upload
      setImages([initialImage]);
    }
  }, [product, initialImage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked,
      }));
    } else if (type === 'number' || (e.target as HTMLInputElement).inputMode === 'decimal' || (e.target as HTMLInputElement).inputMode === 'numeric') {
      // Allow empty string or valid numbers
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Transform form data to match backend expected format (snake_case)
      const productData = {
        name: formData.name,
        description: formData.description || null,
        price: formData.price === '' ? 0 : parseFloat(formData.price),
        original_price: formData.originalPrice === '' ? null : parseFloat(formData.originalPrice),
        category: formData.category,
        stock: formData.stock === '' ? 0 : parseInt(formData.stock, 10),
        featured: formData.featured,
      };

      // Only include images for new products or if explicitly changed
      // For existing products, don't send images array to avoid overwriting
      if (!product) {
        // New product: include images
        Object.assign(productData, { images: images.length > 0 ? images : [] });
      }

      console.log('Sending to backend:', productData); // For debugging

      if (product) {
        // Update existing product - don't send images
        await axios.put(`${API_URL}/products/${product.id}`, productData);
      } else {
        // Create new product - include images
        await axios.post(`${API_URL}/products/`, productData);
      }

      onSuccess();
    } catch (err) {
      setError('Failed to save product. Please try again.');
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-2xl my-8">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            disabled={loading}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Image Preview - Read Only for Edit Mode */}
          {images.length > 0 && (
            <div className="mb-6 p-4 bg-purple-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-purple-800 flex items-center gap-1">
                  <FaImage /> Product Image
                </p>
                {product && (
                  <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                    Image cannot be edited here
                  </span>
                )}
              </div>
              <div className="relative w-32 h-32">
                <img
                  src={images[0]}
                  alt="Product"
                  className="w-full h-full object-cover rounded-lg border-2 border-purple-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128x128?text=Image+Error';
                  }}
                />
                {!product && (
                  <div className="absolute bottom-1 right-1 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                    ImgBB
                  </div>
                )}
              </div>
              {!product && images.length > 1 && (
                <p className="text-xs text-gray-500 mt-2">
                  + {images.length - 1} more image(s)
                </p>
              )}
            </div>
          )}

          {/* Message for products without images */}
          {product && images.length === 0 && (
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                This product has no images. Images can only be added during product creation.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                inputMode="decimal"
                pattern="[0-9]*\.?[0-9]*"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Original Price (₹)
              </label>
              <input
                type="text"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                inputMode="decimal"
                pattern="[0-9]*\.?[0-9]*"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
              >
                <option value="saree">Sarees</option>
                <option value="ornament">Ornaments</option>
                <option value="bridal-set">Bridal Sets</option>
              </select>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity *
              </label>
              <input
                type="text"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
                placeholder="0"
              />
            </div>

            {/* Featured Checkbox */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-bridal-maroon focus:ring-bridal-maroon border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Featured Product</span>
              </label>
            </div>
          </div>

          {/* Note about image editing */}
          {product && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600">
                <strong>Note:</strong> To change product images, please delete this product and create a new one with the updated images.
              </p>
            </div>
          )}

          <div className="flex gap-3 mt-6 pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (
                <>
                  <FaSave />
                  {product ? 'Update Product' : 'Create Product'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;