// src/components/admin/ExternalImageUpload.tsx
import { useState/*, useCallback*/ } from 'react';
import { /*FaUpload, */FaTimes, FaExternalLinkAlt, FaCopy, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface ExternalImageUploadProps {
  onImageUrlsGenerated: (urls: string[]) => void;
  onClose: () => void;
}

const ExternalImageUpload = ({ onImageUrlsGenerated, onClose }: ExternalImageUploadProps) => {
  const [step, setStep] = useState(1);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [copied, setCopied] = useState(false);

  const services = [
    {
      name: 'ImgBB',
      url: 'https://imgbb.com',
      description: 'Free, no registration needed',
      steps: [
        'Go to imgbb.com',
        'Click "Start Uploading"',
        'Select your images',
        'Copy the "Direct Link" URL',
        'Paste below'
      ]
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
      ]
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
      ]
    }
  ];

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

  const handleSubmit = () => {
    const validUrls = imageUrls.filter(url => url.trim() !== '');
    if (validUrls.length === 0) {
      toast.error('Please add at least one image URL');
      return;
    }
    onImageUrlsGenerated(validUrls);
    onClose();
  };

  const copyInstructions = () => {
    const instructions = `
How to upload images to external hosting:

1. Choose a service (ImgBB recommended)
2. Upload your product images
3. Copy the "Direct Link" URL
4. Paste the URLs in the form

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Upload Images to External Hosting</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Choose Service */}
          {step === 1 && (
            <div>
              <h4 className="text-lg font-semibold mb-4">Step 1: Choose an Image Hosting Service</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {services&&services.map((service, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:border-bridal-maroon cursor-pointer transition-colors"
                    onClick={() => setStep(2)}
                  >
                    <h5 className="font-bold text-lg mb-2">{service.name}</h5>
                    <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                    <a
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-bridal-maroon hover:underline text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Visit {service.name} →
                    </a>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2 flex items-center gap-2">
                  <FaExternalLinkAlt /> Why use external hosting?
                </h5>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li>Free unlimited storage</li>
                  <li>No server costs</li>
                  <li>Fast CDN delivery</li>
                  <li>Easy to manage</li>
                  <li>Works with free hosting plans</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 2: Add URLs */}
          {step === 2 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold">Step 2: Add Image URLs</h4>
                <button
                  onClick={copyInstructions}
                  className="text-sm text-bridal-maroon hover:text-bridal-maroon/80 flex items-center gap-2"
                >
                  {copied ? <FaCheck /> : <FaCopy />}
                  {copied ? 'Copied!' : 'Copy Instructions'}
                </button>
              </div>

              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-4">
                  <strong>Instructions:</strong>
                  <ol className="list-decimal list-inside ml-2 mt-2 space-y-1">
                    <li>Upload your images to any hosting service</li>
                    <li>Copy the <strong>Direct Image URL</strong> (ends with .jpg/.png/.webp)</li>
                    <li>Paste each URL in the fields below</li>
                    <li>Click "Use These Images" when done</li>
                  </ol>
                </div>

                <div className="space-y-4">
                  {imageUrls&&imageUrls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateImageUrl(index, e.target.value)}
                        placeholder="https://i.ibb.co/abc123/product-image.jpg"
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-bridal-maroon focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeImageUrl(index)}
                        className="px-4 py-2 text-red-600 hover:text-red-800"
                        disabled={imageUrls.length === 1}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addImageField}
                  className="mt-4 text-bridal-maroon hover:text-bridal-maroon/80"
                >
                  + Add Another Image URL
                </button>
              </div>

              {/* URL Examples */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h5 className="font-semibold mb-2">Example URLs:</h5>
                <div className="text-sm text-gray-600 space-y-1">
                  <code className="block bg-white p-2 rounded border">
                    https://i.ibb.co/abc123/product-image.jpg
                  </code>
                  <code className="block bg-white p-2 rounded border">
                    https://postimg.cc/abc123/product-image.png
                  </code>
                  <code className="block bg-white p-2 rounded border">
                    https://freeimage.host/i/product-image.webp
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          {imageUrls&&imageUrls.some(url => url.trim() !== '') && (
            <div className="mt-6">
              <h5 className="font-semibold mb-4">Preview:</h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imageUrls&&imageUrls.filter(url => url.trim() !== '').map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Invalid+URL';
                        (e.target as HTMLImageElement).className = 'w-full h-32 object-contain rounded-lg border bg-gray-100 p-4';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800"
              >
                ← Back
              </button>
            )}
            
            <div className="flex gap-4 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 bg-bridal-maroon text-white rounded-lg hover:bg-bridal-maroon/90"
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