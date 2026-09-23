// src/components/admin/ImageUpload.tsx
import { useState/*, useCallback*/ } from 'react';
import { FaUpload, FaTimes, FaCloudUploadAlt } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onClose: () => void;
  onSuccess: () => void;
}
const API_URL = import.meta.env.VITE_API_URL || '/api';

const ImageUpload = ({ onClose, onSuccess }: ImageUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('saree');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    );
    
    if (validFiles.length !== selectedFiles.length) {
      toast.error('Some files were skipped (max 5MB, images only)');
    }
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('category', category);

      await axios.post(`${API_URL}/upload/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(`Successfully uploaded ${files.length} images`);
      setFiles([]);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Upload failed. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 pb-16 sm:pb-4 pb-[max(4rem,calc(env(safe-area-inset-bottom,0px)+1.5rem))]">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[min(88dvh,calc(100dvh-5rem))] sm:max-h-[calc(100dvh-3rem)] overflow-y-auto overscroll-contain shadow-2xl border border-gray-100">
        <div className="sticky top-0 bg-white/95 backdrop-blur-xs border-b p-4 sm:p-6 z-10">
          <div className="flex justify-between items-center">
            <h3 className="text-xl sm:text-2xl font-bold">Upload Images</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors touch-manipulation"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
            >
              <option value="saree">Sarees</option>
              <option value="ornament">Ornaments</option>
              <option value="bridal-collections">Bridal Collections</option>
              <option value="slider">Slider Images</option>
            </select>
          </div>

          {/* File Drop Zone */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-bridal-maroon transition-colors">
              <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Drag & drop images here, or click to browse
              </p>
              <p className="text-gray-500 text-sm mb-4">
                Supports JPG, PNG, WEBP up to 5MB each
              </p>
              <input
                type="file"
                id="file-upload"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="inline-block bg-bridal-maroon text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-bridal-maroon/90 transition-colors"
              >
                <FaUpload className="inline mr-2" />
                Browse Files
              </label>
            </div>
          </div>

          {/* Selected Files Preview */}
          {files.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">
                  Selected Files ({files.length})
                </h4>
                <button
                  onClick={() => setFiles([])}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear All
                </button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {files&&files.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <button
                        onClick={() => removeFile(index)}
                        className="text-white hover:text-red-300"
                      >
                        <FaTimes size={20} />
                      </button>
                    </div>
                    <p className="text-xs truncate mt-1">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress & Actions */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div>
              <p className="text-sm text-gray-600">
                Total: {files.length} files selected
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || files.length === 0}
                className="px-6 py-2 bg-bridal-maroon text-white rounded-lg hover:bg-bridal-maroon/90 disabled:opacity-50 flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <FaUpload />
                    Upload {files.length} Images
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;