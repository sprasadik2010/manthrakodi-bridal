// src/components/admin/SingleImageUpload.tsx
import { useState } from 'react';
import { FaTimes, FaUpload, FaSpinner, FaCheckCircle, FaImage } from 'react-icons/fa';

interface SingleImageUploadProps {
  onImageUploaded: (url: string) => void;
  onClose: () => void;
}

const SingleImageUpload = ({ onImageUploaded, onClose }: SingleImageUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;; // Replace with your actual ImgBB API key

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToImgBB = async () => {
    if (!selectedFile) {
      setError('Please select an image');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUploadSuccess(true);
        // Get the direct image URL from ImgBB
        const imageUrl = data.data.url;
        setTimeout(() => {
          onImageUploaded(imageUrl);
        }, 1500);
      } else {
        setError('Failed to upload image to ImgBB');
      }
    } catch (err) {
      setError('Error uploading image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-2">
            <FaImage className="text-purple-600 text-xl" />
            <h2 className="text-xl font-semibold">Upload to ImgBB</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            disabled={uploading}
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6">
          {uploadSuccess ? (
            <div className="text-center py-8">
              <div className="text-green-500 text-5xl mb-4">
                <FaCheckCircle className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Upload Successful!
              </h3>
              <p className="text-gray-600">
                Your image has been uploaded to ImgBB
              </p>
            </div>
          ) : (
            <>
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center
                  ${preview ? 'border-purple-300 bg-purple-50' : 'border-gray-300 hover:border-purple-400'}
                  ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    {!uploading && (
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setPreview(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <FaTimes size={12} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <FaUpload className="text-4xl text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">
                      Drag & drop an image here, or click to select
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports: JPG, PNG, GIF (Max 5MB)
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-upload"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-block mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer"
                    >
                      Select Image
                    </label>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Info Message */}
              <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
                <p className="font-medium mb-1">ℹ️ Single Image Upload</p>
                <p>Only one image will be uploaded to ImgBB and saved to the product.</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={uploadToImgBB}
                  disabled={!selectedFile || uploading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FaUpload />
                      Upload to ImgBB
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  disabled={uploading}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleImageUpload;