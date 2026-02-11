// src/components/admin/ExternalImageUpload.tsx
import { useState, useRef, ChangeEvent } from 'react';
import { FaTimes, FaExternalLinkAlt, FaUpload, FaCopy, FaCheck, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface ExternalImageUploadProps {
  onImageUrlsGenerated: (urls: string[]) => void;
  onClose: () => void;
}

interface UploadedImage {
  url: string;
  file: File;
  uploading: boolean;
  error?: string;
  id: string;
}

const ExternalImageUpload = ({ onImageUrlsGenerated, onClose }: ExternalImageUploadProps) => {
  const [step, setStep] = useState(1);
  const [uploadMethod, setUploadMethod] = useState<'direct' | 'manual'>('direct');
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [copied, setCopied] = useState(false);
  const [uploadingAll, setUploadingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Vite uses import.meta.env
  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
  const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

  const services = [
    {
      name: 'ImgBB',
      url: 'https://imgbb.com',
      description: 'Free, direct upload available',
      steps: [
        'Upload directly from your computer',
        'Or copy "Direct Link" URL from ImgBB',
        'Supports multiple images at once'
      ],
      supportsDirectUpload: true
    },
    {
      name: 'PostImage',
      url: 'https://postimages.org',
      description: 'Simple and fast',
      steps: [
        'Go to postimages.org',
        'Click "Choose Images"',
        'Select your images',
        'Copy the "Direct Link" URL',
        'Paste below'
      ],
      supportsDirectUpload: false
    },
    {
      name: 'FreeImage.Host',
      url: 'https://freeimage.host',
      description: 'No limits, free hosting',
      steps: [
        'Go to freeimage.host',
        'Click "Upload"',
        'Select your images',
        'Copy the "Direct Link" URL',
        'Paste below'
      ],
      supportsDirectUpload: false
    }
  ];

  // Check if ImgBB API key is configured
  const checkApiKey = () => {
    if (!IMGBB_API_KEY || IMGBB_API_KEY === 'your_imgbb_api_key_here') {
      toast.error(
        <div>
          ImgBB API key not configured. Please:
          <ol className="list-decimal list-inside ml-4 mt-2">
            <li>Get free API key from <a href="https://api.imgbb.com" target="_blank" className="underline">api.imgbb.com</a></li>
            <li>Add <code>VITE_IMGBB_API_KEY=your_key_here</code> to .env file</li>
            <li>Restart your development server</li>
          </ol>
        </div>,
        { duration: 8000 }
      );
      return false;
    }
    return true;
  };

  // Handle file selection
  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    if (uploadMethod === 'direct' && !checkApiKey()) {
      return;
    }

    const files = e.target.files;
    if (!files) return;

    const newImages: UploadedImage[] = [];
    
    // Add selected files to the upload queue
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`${file.name} is too large (max 10MB)`);
        return;
      }

      newImages.push({
        url: '',
        file,
        uploading: false,
        id: Math.random().toString(36).substring(2) + Date.now().toString(36)
      });
    });

    setUploadedImages(prev => [...prev, ...newImages]);
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Auto-upload if Direct method is selected
    if (uploadMethod === 'direct') {
      await uploadImages(newImages);
    }
  };

  // Upload single image to ImgBB
  const uploadImageToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', IMGBB_API_KEY);

    try {
      const response = await fetch(IMGBB_API_URL, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Upload failed');
      }

      // Return the direct image URL
      return data.data.url;
    } catch (error) {
      console.error('ImgBB upload error:', error);
      throw error;
    }
  };

  // Upload multiple images
  const uploadImages = async (images: UploadedImage[] = uploadedImages) => {
    if (!checkApiKey()) return;
    
    setUploadingAll(true);
    
    const uploadPromises = images.map(async (img) => {
      if (img.url || img.uploading || img.error) return img;
      
      const imageIndex = uploadedImages.findIndex(i => i.id === img.id);
      setUploadedImages(prev => 
        prev.map((item, idx) => 
          idx === imageIndex ? { ...item, uploading: true, error: undefined } : item
        )
      );

      try {
        const url = await uploadImageToImgBB(img.file);
        
        setUploadedImages(prev => 
          prev.map((item, idx) => 
            idx === imageIndex ? { ...item, url, uploading: false } : item
          )
        );
        
        toast.success(`Uploaded: ${img.file.name}`);
        return { ...img, url, uploading: false };
      } catch (error) {
        setUploadedImages(prev => 
          prev.map((item, idx) => 
            idx === imageIndex ? { 
              ...item, 
              uploading: false, 
              error: 'Upload failed' 
            } : item
          )
        );
        toast.error(`Failed to upload ${img.file.name}`);
        return img;
      }
    });

    await Promise.all(uploadPromises);
    setUploadingAll(false);
  };

  // Manual URL management functions
  const addImageField = () => {
    setImageUrls([...imageUrls, '']);
  };

  const updateImageUrl = (index: number, url: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = url;
    setImageUrls(newUrls);
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const removeUploadedImage = (id: string) => {
    setUploadedImages(uploadedImages.filter(img => img.id !== id));
  };

  const handleSubmit = () => {
    let urls: string[] = [];

    if (uploadMethod === 'direct') {
      urls = uploadedImages
        .filter(img => img.url && !img.uploading && !img.error)
        .map(img => img.url);
    } else {
      urls = imageUrls.filter(url => url.trim() !== '');
    }

    if (urls.length === 0) {
      toast.error('Please add at least one valid image');
      return;
    }

    // Validate URLs if manual method
    if (uploadMethod === 'manual') {
      const invalidUrls = urls.filter(url => {
        try {
          const urlObj = new URL(url);
          return !urlObj.protocol.startsWith('http');
        } catch {
          return true;
        }
      });
      
      if (invalidUrls.length > 0) {
        toast.error('Please enter valid image URLs starting with http:// or https://');
        return;
      }
    }

    onImageUrlsGenerated(urls);
    onClose();
    toast.success(`Added ${urls.length} image${urls.length > 1 ? 's' : ''}`);
  };

  const copyInstructions = () => {
    const instructions = `
How to upload images:

Option 1: Direct Upload (Recommended)
1. Click "Select Images"
2. Images will automatically upload to ImgBB
3. Click "Use These Images" when done

Option 2: Manual URL Entry
1. Choose a hosting service
2. Upload your images
3. Copy the "Direct Link" URL
4. Paste below

Get FREE ImgBB API Key:
1. Go to https://api.imgbb.com
2. Click "Get API Key"
3. Add to .env file: VITE_IMGBB_API_KEY=your_key_here

Recommended services:
- ImgBB: https://imgbb.com
- PostImage: https://postimages.org
- FreeImage.Host: https://freeimage.host
    `.trim();
    
    navigator.clipboard.writeText(instructions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Instructions copied to clipboard!');
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (uploadMethod === 'direct' && !checkApiKey()) {
      return;
    }

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    // Convert FileList to array and simulate file input
    const dataTransfer = new DataTransfer();
    Array.from(files).forEach(file => dataTransfer.items.add(file));
    
    // if (fileInputRef.current) {
    //   fileInputRef.current.files = dataTransfer.files;
    //   handleFileSelect({ target: fileInputRef } as ChangeEvent<HTMLInputElement>);
    // }
  };

  // Get API configuration status
  const getApiStatus = () => {
    if (!IMGBB_API_KEY || IMGBB_API_KEY === 'your_imgbb_api_key_here') {
      return {
        status: 'not-configured',
        message: 'API key not configured. Click "Copy Instructions" for setup guide.'
      };
    }
    return {
      status: 'configured',
      message: 'API key configured ✓'
    };
  };

  const apiStatus = getApiStatus();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Upload Images</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Choose Method */}
          {step === 1 && (
            <div>
              <h4 className="text-lg font-semibold mb-6">Choose Upload Method</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Direct Upload Card */}
                <div
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                    uploadMethod === 'direct' 
                      ? 'border-bridal-maroon bg-bridal-maroon/5 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => setUploadMethod('direct')}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      uploadMethod === 'direct' 
                        ? 'border-bridal-maroon bg-bridal-maroon' 
                        : 'border-gray-300'
                    }`}>
                      {uploadMethod === 'direct' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div>
                      <h5 className="font-bold text-xl">Direct Upload</h5>
                      <p className="text-sm text-gray-500">To ImgBB</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Upload directly from your computer. Images auto-upload to ImgBB.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-4">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>No manual copy/paste needed</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>Automatic URL generation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>Drag & drop support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>Free unlimited hosting</span>
                    </li>
                  </ul>
                  <div className={`text-sm font-semibold p-2 rounded-lg mt-4 ${
                    apiStatus.status === 'configured' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {apiStatus.status === 'configured' ? '✓ Ready to upload' : '⚠ Setup required'}
                  </div>
                </div>

                {/* Manual URL Card */}
                <div
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                    uploadMethod === 'manual' 
                      ? 'border-bridal-maroon bg-bridal-maroon/5 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => setUploadMethod('manual')}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      uploadMethod === 'manual' 
                        ? 'border-bridal-maroon bg-bridal-maroon' 
                        : 'border-gray-300'
                    }`}>
                      {uploadMethod === 'manual' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div>
                      <h5 className="font-bold text-xl">Manual URL</h5>
                      <p className="text-sm text-gray-500">Any hosting service</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Upload to any service and paste the image URLs manually.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-4">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span>Use any hosting service</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span>Works without API key</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span>Existing image URLs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span>Flexible but slower</span>
                    </li>
                  </ul>
                  <div className="text-sm font-semibold p-2 rounded-lg mt-4 bg-gray-100 text-gray-700">
                    No setup required
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl mb-6">
                <h5 className="font-semibold mb-2 flex items-center gap-2">
                  <FaExternalLinkAlt /> Why use external hosting?
                </h5>
                <ul className="text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Free unlimited storage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>No server costs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Fast CDN delivery</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Easy to manage</span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-between items-center mt-8">
                <div className="text-sm text-gray-600">
                  {uploadMethod === 'direct' && apiStatus.status === 'not-configured' && (
                    <span className="text-yellow-600">{apiStatus.message}</span>
                  )}
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={uploadMethod === 'direct' && apiStatus.status === 'not-configured'}
                  className="px-6 py-3 bg-bridal-maroon text-white rounded-lg hover:bg-bridal-maroon/90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Upload/Add URLs */}
          {step === 2 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-semibold">
                    {uploadMethod === 'direct' ? 'Direct Upload to ImgBB' : 'Add Image URLs'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {uploadMethod === 'direct' 
                      ? 'Select images from your computer' 
                      : 'Paste direct image URLs from any hosting service'}
                  </p>
                </div>
                <button
                  onClick={copyInstructions}
                  className="text-sm text-bridal-maroon hover:text-bridal-maroon/80 flex items-center gap-2 transition-colors"
                >
                  {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
                  {copied ? 'Copied!' : 'Copy Instructions'}
                </button>
              </div>

              {/* API Key Warning */}
              {uploadMethod === 'direct' && apiStatus.status === 'not-configured' && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="text-yellow-600 mt-0.5">⚠</div>
                    <div>
                      <h5 className="font-semibold text-yellow-800">API Key Required</h5>
                      <p className="text-sm text-yellow-700 mt-1">
                        You need to configure ImgBB API key for direct uploads.
                      </p>
                      <ol className="list-decimal list-inside ml-4 mt-2 text-sm text-yellow-700 space-y-1">
                        <li>Get free API key from <a href="https://api.imgbb.com" target="_blank" className="underline font-semibold">api.imgbb.com</a></li>
                        <li>Add <code className="bg-yellow-100 px-1 py-0.5 rounded">VITE_IMGBB_API_KEY=your_key_here</code> to .env file</li>
                        <li>Restart development server</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* Direct Upload Section */}
              {uploadMethod === 'direct' && (
                <div className="mb-8">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <div
                    className={`border-2 border-dashed rounded-2xl p-8 text-center mb-6 transition-all duration-200 ${
                      apiStatus.status === 'configured'
                        ? 'border-gray-300 hover:border-bridal-maroon hover:bg-gray-50 cursor-pointer'
                        : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => apiStatus.status === 'configured' && fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={apiStatus.status === 'configured' ? handleDrop : undefined}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                        apiStatus.status === 'configured'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <FaUpload className="text-2xl" />
                      </div>
                      <h5 className="font-semibold text-lg mb-2">
                        {apiStatus.status === 'configured' ? 'Click to Select Images' : 'API Key Required'}
                      </h5>
                      <p className="text-gray-600 mb-4 max-w-md">
                        {apiStatus.status === 'configured'
                          ? 'Drag & drop images here or click to browse. Images will automatically upload to ImgBB.'
                          : 'Configure API key to enable direct uploads.'}
                      </p>
                      {apiStatus.status === 'configured' && (
                        <>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-6 py-3 bg-bridal-maroon text-white rounded-lg hover:bg-bridal-maroon/90 font-semibold transition-colors"
                          >
                            Browse Files
                          </button>
                          <p className="text-sm text-gray-500 mt-4">
                            Supports JPG, PNG, WebP, GIF • Max 10MB each
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {uploadingAll && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-xl flex items-center gap-3">
                      <FaSpinner className="animate-spin text-bridal-maroon" />
                      <span className="text-sm font-medium">Uploading images to ImgBB...</span>
                    </div>
                  )}

                  {/* Uploaded Images Preview */}
                  {uploadedImages.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h5 className="font-semibold">
                          Selected Images ({uploadedImages.filter(img => img.url).length}/{uploadedImages.length})
                        </h5>
                        {uploadedImages.some(img => !img.url && !img.uploading && !img.error) && (
                          <button
                            type="button"
                            onClick={() => uploadImages()}
                            disabled={uploadingAll || apiStatus.status !== 'configured'}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Upload All
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {uploadedImages.map((img) => (
                          <div key={img.id} className="relative group">
                            <div className={`border rounded-xl overflow-hidden bg-gray-50 aspect-square transition-transform duration-200 group-hover:shadow-md ${
                              img.error ? 'border-red-200' : img.url ? 'border-green-200' : 'border-gray-200'
                            }`}>
                              {img.uploading ? (
                                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                  <FaSpinner className="animate-spin text-bridal-maroon text-2xl mb-2" />
                                  <span className="text-xs text-gray-600 text-center">Uploading...</span>
                                </div>
                              ) : img.url ? (
                                <img
                                  src={img.url}
                                  alt={img.file.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Image+Error';
                                  }}
                                />
                              ) : img.error ? (
                                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                  <div className="text-red-500 text-2xl mb-2">!</div>
                                  <span className="text-xs text-red-600 text-center">Failed</span>
                                  <button
                                    onClick={() => uploadImages([img])}
                                    className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                                  >
                                    Retry
                                  </button>
                                </div>
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                  <div className="text-gray-400 text-2xl mb-2">📷</div>
                                  <span className="text-xs text-gray-500 text-center">Ready</span>
                                  <button
                                    onClick={() => uploadImages([img])}
                                    className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                                  >
                                    Upload
                                  </button>
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-2 px-1">
                              <p className="text-xs text-gray-600 truncate" title={img.file.name}>
                                {img.file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(img.file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => removeUploadedImage(img.id)}
                              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-op duration-200 shadow-lg"
                              title="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Manual URL Section */}
              {uploadMethod === 'manual' && (
                <div>
                  <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-4">
                      <strong>Instructions:</strong>
                      <ol className="list-decimal list-inside ml-4 mt-2 space-y-2">
                        <li>Upload your images to any hosting service</li>
                        <li>Copy the <strong className="text-bridal-maroon">Direct Image URL</strong> (ends with .jpg/.png/.webp)</li>
                        <li>Paste each URL in the fields below</li>
                        <li>Click "Use These Images" when done</li>
                      </ol>
                    </div>

                    <div className="space-y-4">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                          <input
                            type="url"
                            value={url}
                            onChange={(e) => updateImageUrl(index, e.target.value)}
                            placeholder="https://i.ibb.co/abc123/product-image.jpg"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => removeImageUrl(index)}
                            className="px-4 py-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={imageUrls.length === 1}
                            title="Remove URL"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={addImageField}
                      className="mt-4 px-4 py-2 text-bridal-maroon hover:text-bridal-maroon/80 font-semibold flex items-center gap-2 transition-colors"
                    >
                      <span className="text-lg">+</span>
                      Add Another Image URL
                    </button>
                  </div>

                  {/* URL Examples */}
                  <div className="bg-gray-50 p-4 rounded-xl mb-6">
                    <h5 className="font-semibold mb-3">Example URLs:</h5>
                    <div className="space-y-2">
                      <code className="block bg-white p-3 rounded-lg border border-gray-200 text-sm text-gray-700 font-mono break-all">
                        https://i.ibb.co/abc123/product-image.jpg
                      </code>
                      <code className="block bg-white p-3 rounded-lg border border-gray-200 text-sm text-gray-700 font-mono break-all">
                        https://postimg.cc/abc123/product-image.png
                      </code>
                      <code className="block bg-white p-3 rounded-lg border border-gray-200 text-sm text-gray-700 font-mono break-all">
                        https://freeimage.host/i/product-image.webp
                      </code>
                    </div>
                  </div>
                </div>
              )}

              {/* Service Options */}
              {uploadMethod === 'manual' && (
                <div className="mb-8">
                  <h5 className="font-semibold mb-3">Recommended Hosting Services:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {services.map((service, index) => (
                      <a
                        key={index}
                        href={service.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-gray-200 rounded-xl p-4 hover:border-bridal-maroon hover:shadow transition-all duration-200 group"
                      >
                        <h6 className="font-bold mb-1 group-hover:text-bridal-maroon transition-colors">{service.name}</h6>
                        <p className="text-gray-600 text-xs mb-3">{service.description}</p>
                        <span className="text-bridal-maroon text-sm font-medium flex items-center gap-1">
                          Visit <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-semibold flex items-center gap-2 transition-colors"
            >
              ← Back
            </button>
            
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={
                  uploadMethod === 'direct' 
                    ? uploadedImages.filter(img => img.url).length === 0
                    : imageUrls.filter(url => url.trim() !== '').length === 0
                }
                className="px-6 py-2 bg-bridal-maroon text-white rounded-lg hover:bg-bridal-maroon/90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Use These Images
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalImageUpload;