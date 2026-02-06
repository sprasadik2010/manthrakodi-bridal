// src/components/admin/ProductForm.tsx
import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Product } from '../../types';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductForm = ({ product, onClose, onSuccess }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'saree',
    subCategory: '',
    images: [''],
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
    }
  }, [product]);

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
        await axios.post('/api/products', productData);
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
                  {occasions.map((occasion) => (
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
              <label className="block text-sm font-medium text-gray-700">
                Image URLs *
              </label>
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
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateImage(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="px-4 py-2 text-red-600 hover:text-red-800"
                    disabled={formData.images.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            
            <p className="text-sm text-gray-500 mt-2">
              Add image URLs (first image will be the main display image)
            </p>
          </div>

          {/* Preview */}
          {formData.images[0] && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {formData.images.filter(url => url.trim() !== '').map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-32 w-32 object-cover rounded-lg border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Image+Error';
                    }}
                  />
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
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-bridal-maroon text-white rounded-lg hover:bg-bridal-maroon/90 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;