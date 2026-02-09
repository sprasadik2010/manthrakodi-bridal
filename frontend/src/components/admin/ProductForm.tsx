// src/components/admin/ProductForm.tsx
import { useState, useEffect } from 'react';
import { FaTimes, FaFacebook, /*FaUpload,*/ FaExternalLinkAlt } from 'react-icons/fa';
import { Product } from '../../types';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ProductFormProps {
  product?: Product | null;
  initialImages?: string[];
  onClose: () => void;
  onSuccess: () => void;
}
const API_URL = import.meta.env.VITE_API_URL || '/api';
const ProductForm = ({ product, initialImages, onClose, onSuccess }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'saree',
    subCategory: '',
    images: initialImages || [''],
    stock: '0',
    featured: false,
    attributes: {
      material: '',
      color: '',
      work: '',
      weight: '',
      occasion: [] as string[],
    },
  });

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || '',
        category: product.category,
        subCategory: product.subCategory || '',
        images: product.images,
        stock: product.stock.toString(),
        featured: product.featured,
        attributes: {
          material: product.attributes?.material || '',
          color: product.attributes?.color || '',
          work: product.attributes?.work || '',
          weight: product.attributes?.weight || '',
          occasion: product.attributes?.occasion || [],
        },
      });
    } else if (initialImages && initialImages.length > 0) {
      // If we have initial images from external upload, use them
      setFormData(prev => ({
        ...prev,
        images: initialImages,
      }));
    }
  }, [product, initialImages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        stock: parseInt(formData.stock),
        images: formData.images.filter(img => img.trim() !== ''),
      };

      if (product) {
        await axios.put(`/api/products/${product.id}`, productData);
        toast.success('Product updated successfully!');
      } else {
        await axios.post(`${API_URL}/products`, productData);
        toast.success('Product created successfully!');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Error saving product');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ''],
    }));
  };

  const updateImage = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => (i === index ? value : img)),
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateImageURL = (url: string): boolean => {
    const urlPatterns = [
      // ImgBB
      /^https:\/\/(i\.)?ibb\.co\/.*/,
      /^https:\/\/(www\.)?imgbb\.com\/.*/,
      // PostImage
      /^https:\/\/(i\.)?postimg\.cc\/.*/,
      /^https:\/\/(www\.)?postimages\.org\/.*/,
      // FreeImage.Host
      /^https:\/\/(www\.)?freeimage\.host\/.*/,
      // Facebook
      /^https:\/\/(www\.)?facebook\.com\/.*\/photos\/.*/,
      /^https:\/\/(www\.)?facebook\.com\/photo\/.*/,
      // General image URLs
      /^https?:\/\/.*\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i,
    ];
    
    return urlPatterns.some(pattern => pattern.test(url));
  };

  const handleImageURL = async (index: number, url: string) => {
    if (!url.trim()) {
      updateImage(index, url);
      return;
    }

    setImageLoading(true);
    try {
      // Validate URL
      if (!validateImageURL(url)) {
        toast.error('Please enter a valid image URL (jpg, png, webp, gif)');
        return;
      }

      updateImage(index, url);
      toast.success('Image URL added successfully!');
    } catch (error) {
      toast.error('Error processing image URL');
      console.error(error);
    } finally {
      setImageLoading(false);
    }
  };

  const toggleOccasion = (occasion: string) => {
    setFormData(prev => {
      const occasions = prev.attributes.occasion.includes(occasion)
        ? prev.attributes.occasion.filter(o => o !== occasion)
        : [...prev.attributes.occasion, occasion];
      
      return {
        ...prev,
        attributes: { ...prev.attributes, occasion: occasions },
      };
    });
  };

  const occasions = ['Wedding', 'Reception', 'Engagement', 'Festival', 'Casual', 'Party'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">
              {product ? 'Edit Product' : 'Add New Product'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
                >
                  <option value="saree">Saree</option>
                  <option value="ornament">Ornament</option>
                  <option value="bridal-set">Bridal Set</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub Category
                </label>
                <input
                  type="text"
                  value={formData.subCategory}
                  onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
                  placeholder="e.g., Silk Saree, Gold Necklace"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
                    placeholder="For discount display"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="h-4 w-4 text-bridal-maroon focus:ring-bridal-maroon border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                  Mark as Featured Product
                </label>
              </div>
            </div>

            {/* Attributes */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material
                </label>
                <input
                  type="text"
                  value={formData.attributes.material}
                  onChange={(e) => setFormData({
                    ...formData,
                    attributes: {...formData.attributes, material: e.target.value}
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
                  placeholder="e.g., Silk, Cotton, Gold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  value={formData.attributes.color}
                  onChange={(e) => setFormData({
                    ...formData,
                    attributes: {...formData.attributes, color: e.target.value}
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
                  placeholder="e.g., Red, Gold, Multi-color"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work/Design
                </label>
                <input
                  type="text"
                  value={formData.attributes.work}
                  onChange={(e) => setFormData({
                    ...formData,
                    attributes: {...formData.attributes, work: e.target.value}
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
                  placeholder="e.g., Zari, Embroidery, Stone"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight
                </label>
                <input
                  type="text"
                  value={formData.attributes.weight}
                  onChange={(e) => setFormData({
                    ...formData,
                    attributes: {...formData.attributes, weight: e.target.value}
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
                  placeholder="e.g., 500g, 1kg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suitable Occasions
                </label>
                <div className="flex flex-wrap gap-2">
                  {occasions&&occasions.map((occasion) => (
                    <button
                      key={occasion}
                      type="button"
                      onClick={() => toggleOccasion(occasion)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        formData.attributes.occasion.includes(occasion)
                          ? 'bg-bridal-maroon text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {occasion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
              required
            />
          </div>

          {/* Image URLs */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image URLs *
                </label>
                <p className="text-sm text-gray-500">
                  Paste image URLs from Facebook, ImgBB, PostImage, or any hosting service
                </p>
              </div>
              <button
                type="button"
                onClick={addImageField}
                className="text-sm text-bridal-maroon hover:text-bridal-maroon/80"
              >
                + Add Image URL
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.images.map((url, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      {url.includes('facebook.com') ? (
                        <FaFacebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
                      ) : (
                        <FaExternalLinkAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      )}
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateImage(index, e.target.value)}
                        placeholder="https://i.ibb.co/... or https://facebook.com/..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
                        onBlur={() => url && handleImageURL(index, url)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="px-4 py-2 text-red-600 hover:text-red-800"
                      disabled={formData.images.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                  
                  {url && (
                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                      <strong>Source:</strong>{' '}
                      {url.includes('imgbb.co') ? 'ImgBB' :
                       url.includes('postimg.cc') ? 'PostImage' :
                       url.includes('facebook.com') ? 'Facebook' :
                       url.includes('i.') ? 'Image Hosting' : 'External URL'}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Supported Services:</h4>
              <div className="text-sm text-gray-600 grid grid-cols-2 md:grid-cols-4 gap-2">
                <span className="flex items-center gap-1">
                  <FaFacebook className="text-blue-600" /> Facebook
                </span>
                <span>ImgBB</span>
                <span>PostImage</span>
                <span>Any image URL</span>
              </div>
            </div>
          </div>

          {/* Preview */}
          {formData.images.some(url => url.trim() !== '') && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Preview
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.filter(url => url.trim() !== '').map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                        (e.target as HTMLImageElement).className = 'w-full h-48 object-contain rounded-lg border bg-gray-100 p-4';
                      }}
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading || imageLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-bridal-maroon text-white rounded-lg hover:bg-bridal-maroon/90 disabled:opacity-50 flex items-center gap-2"
              disabled={loading || imageLoading}
            >
              {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
              {imageLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;