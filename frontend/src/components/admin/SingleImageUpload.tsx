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
  const [converting, setConverting] = useState(false);

  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY; // Replace with your actual ImgBB API key

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Check file size (max 10MB for original - after WebP it will be smaller)
      // if (file.size > 10 * 1024 * 1024) {
      //   setError('Image size should be less than 10MB');
      //   return;
      // }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertToWebP = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          // Calculate new dimensions (maintain aspect ratio, max 1200px width)
          let width = img.width;
          let height = img.height;
          const maxWidth = 1200;
          
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          // Create canvas and draw image
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          // Draw image with white background (for transparent PNGs)
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to WebP with quality setting
          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Create new File from blob
                const webpFile = new File(
                  [blob], 
                  file.name.replace(/\.[^/.]+$/, '') + '.webp', 
                  { type: 'image/webp' }
                );
                resolve(webpFile);
              } else {
                reject(new Error('Failed to convert to WebP'));
              }
            },
            'image/webp',
            0.85 // Quality setting (0.85 = 85%)
          );
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image for conversion'));
        };
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
    });
  };

  const uploadToImgBB = async () => {
    if (!selectedFile) {
      setError('Please select an image');
      return;
    }

    setConverting(true);
    setError(null);

    try {
      // Convert to WebP first
      const webpFile = await convertToWebP(selectedFile);
      setConverting(false);
      setUploading(true);

      // Update preview to show conversion completed
      const webpPreviewReader = new FileReader();
      webpPreviewReader.onloadend = () => {
        setPreview(webpPreviewReader.result as string);
      };
      webpPreviewReader.readAsDataURL(webpFile);

      // Upload to ImgBB
      const formData = new FormData();
      formData.append('image', webpFile);
      
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
      setError('Error converting or uploading image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setConverting(false);
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
      // if (file.size > 10 * 1024 * 1024) {
      //   setError('Image size should be less than 10MB');
      //   return;
      // }
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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
            disabled={uploading || converting}
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
                Your WebP image has been uploaded to ImgBB
              </p>
            </div>
          ) : (
            <>
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center
                  ${preview ? 'border-purple-300 bg-purple-50' : 'border-gray-300 hover:border-purple-400'}
                  ${uploading || converting ? 'opacity-50 pointer-events-none' : ''}`}
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
                    {!uploading && !converting && (
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
                    {selectedFile && (
                      <div className="mt-2 text-xs text-gray-500">
                        Original: {formatFileSize(selectedFile.size)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <FaUpload className="text-4xl text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">
                      Drag & drop an image here, or click to select
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports: JPG, PNG, GIF (Auto-converted to WebP)
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-upload"
                      disabled={uploading || converting}
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

              {/* Status Messages */}
              {converting && (
                <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Converting image to WebP format...
                </div>
              )}

              {/* Info Message */}
              <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-lg text-sm">
                <p className="font-medium mb-1">✨ WebP Optimization</p>
                <p>Your image will be converted to WebP format for:</p>
                <ul className="list-disc list-inside mt-1 text-xs">
                  <li>Smaller file size (25-35% reduction)</li>
                  <li>Faster page loading</li>
                  <li>Better performance</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={uploadToImgBB}
                  disabled={!selectedFile || uploading || converting}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {converting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Converting...
                    </>
                  ) : uploading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FaUpload />
                      Convert & Upload to ImgBB
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  disabled={uploading || converting}
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