// src/pages/ProductDetail.tsx
import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaShare, FaArrowLeft, FaSearchPlus, FaSearchMinus, FaUndo } from 'react-icons/fa';
// import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import toast from 'react-hot-toast';
import { useProduct } from '../hooks/useProducts';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  // Zoom and pan states
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: product, isLoading, error } = useProduct(id || '');
  const addToCart = useCartStore((state) => state.addToCart);
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlistStore();

  // Reset zoom when changing images
  useEffect(() => {
    console.log(thumbsSwiper);
    resetZoom();
  }, [selectedImage]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant' // Use 'smooth' for smooth scrolling, 'instant' for immediate
    });
  }, []);

  const resetZoom = () => {
    setIsZoomed(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomToggle = () => {
    if (isZoomed) {
      resetZoom();
    } else {
      setIsZoomed(true);
      setScale(2);
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 3));
    setIsZoomed(true);
  };

  const handleZoomOut = () => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.5, 1);
      if (newScale === 1) {
        setIsZoomed(false);
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZoomed) return;
    e.preventDefault();
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isZoomed || !containerRef.current) return;
    e.preventDefault();

    const container = containerRef.current;
    const maxX = (container.offsetWidth * (scale - 1)) / 2;
    const maxY = (container.offsetHeight * (scale - 1)) / 2;

    let newX = e.clientX - startPos.x;
    let newY = e.clientY - startPos.y;

    // Constrain movement
    newX = Math.max(Math.min(newX, maxX), -maxX);
    newY = Math.max(Math.min(newY, maxY), -maxY);

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!isZoomed) return;
    e.preventDefault();

    if (e.deltaY < 0) {
      // Zoom in
      setScale(prev => {
        const newScale = Math.min(prev + 0.1, 3);
        setIsZoomed(true);
        return newScale;
      });
    } else {
      // Zoom out
      setScale(prev => {
        const newScale = Math.max(prev - 0.1, 1);
        if (newScale === 1) {
          setIsZoomed(false);
          setPosition({ x: 0, y: 0 });
        }
        return newScale;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="bg-gray-300 h-96 rounded-lg"></div>
              <div className="flex gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-300 h-20 w-20 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              <div className="h-6 bg-gray-300 rounded w-1/4 mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl text-red-600 mb-4">Product not found</h2>
        <Link to="/products" className="text-bridal-maroon hover:underline">
          ← Back to Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success('Added to cart!');
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist!');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing failed:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-bridal-maroon mb-6"
      >
        <FaArrowLeft /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery with Zoom */}
        <div>
          {/* Main Image with Zoom Controls */}
          <div className="mb-4">
            <div
              ref={containerRef}
              className="relative rounded-2xl overflow-hidden bg-gray-50"
              style={{ height: '500px' }}
            >
              {/* Zoom Controls */}
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                  title="Zoom In"
                >
                  <FaSearchPlus size={20} />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                  title="Zoom Out"
                >
                  <FaSearchMinus size={20} />
                </button>
                {isZoomed && (
                  <button
                    onClick={resetZoom}
                    className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                    title="Reset Zoom"
                  >
                    <FaUndo size={20} />
                  </button>
                )}
              </div>

              {/* Zoom Status */}
              {isZoomed && (
                <div className="absolute bottom-4 left-4 z-10 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
                  {Math.round(scale * 100)}% • Drag to move
                </div>
              )}

              {/* Image Container */}
              <div
                className={`relative w-full h-full ${isZoomed ? 'cursor-move' : 'cursor-zoom-in'}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onWheel={handleWheel}
                onClick={!isZoomed ? handleZoomToggle : undefined}
              >
                <img
                  ref={imageRef}
                  src={product.images[selectedImage]}
                  alt={`${product.name} - View ${selectedImage + 1}`}
                  className="absolute top-0 left-0 w-full h-full object-contain transition-transform duration-100"
                  style={{
                    transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                    transformOrigin: '0 0',
                  }}
                  draggable={false}
                />
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            freeMode
            watchSlidesProgress
            modules={[FreeMode, Navigation]}
            navigation
            className="thumbnail-swiper"
          >
            {product.images.map((image, index) => (
              <SwiperSlide key={index}>
                <button
                  onClick={() => {
                    setSelectedImage(index);
                    resetZoom();
                  }}
                  className={`w-full rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                      ? 'border-bridal-maroon'
                      : 'border-transparent hover:border-gray-300'
                    }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Product Info - Rest remains exactly the same */}
        <div>
          <div className="mb-6">
            <span className="inline-block px-4 py-1 bg-gray-100 text-gray-600 rounded-full text-sm mb-3">
              {product.category}
            </span>
            <h1 className="text-4xl font-playfair font-bold text-gray-800 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-bridal-maroon">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.original_price  && (product.original_price > product.price) && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{product.original_price.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      Save ₹{(product.original_price - product.price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Attributes */}
            {product.attributes && (
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-4">Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.attributes.material && (
                    <div>
                      <span className="text-gray-500">Material:</span>
                      <span className="ml-2 font-medium">{product.attributes.material}</span>
                    </div>
                  )}
                  {product.attributes.color && (
                    <div>
                      <span className="text-gray-500">Color:</span>
                      <span className="ml-2 font-medium">{product.attributes.color}</span>
                    </div>
                  )}
                  {product.attributes.work && (
                    <div>
                      <span className="text-gray-500">Work:</span>
                      <span className="ml-2 font-medium">{product.attributes.work}</span>
                    </div>
                  )}
                  {product.attributes.weight && (
                    <div>
                      <span className="text-gray-500">Weight:</span>
                      <span className="ml-2 font-medium">{product.attributes.weight}</span>
                    </div>
                  )}
                  {product.attributes.occasion && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Occasion:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {product.attributes.occasion.map((occ) => (
                          <span
                            key={occ}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {occ}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-8">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${product.stock > 10
                  ? 'bg-green-100 text-green-800'
                  : product.stock > 0
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-600' : product.stock > 0 ? 'bg-yellow-600' : 'bg-red-600'
                  }`} />
                {product.stock > 0
                  ? `In Stock (${product.stock} available)`
                  : 'Out of Stock'}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Max: {product.stock}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-bridal-maroon hover:bg-bridal-maroon/90 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaShoppingCart />
                  Add to Cart
                </button>

                <div className="flex gap-4">
                  <button
                    onClick={handleWishlistToggle}
                    className={`p-4 rounded-xl border flex items-center justify-center ${isWishlisted
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-white border-gray-300 text-gray-600 hover:border-bridal-maroon hover:text-bridal-maroon'
                      } transition-colors`}
                  >
                    <FaHeart size={20} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-4 rounded-xl border border-gray-300 bg-white text-gray-600 hover:border-bridal-maroon hover:text-bridal-maroon transition-colors flex items-center justify-center"
                  >
                    <FaShare size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-12 pt-8 border-t">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* <div className="text-center">
                  <div className="text-2xl font-bold text-bridal-maroon mb-2">✓</div>
                  <div className="font-medium">Free Shipping</div>
                  <div className="text-sm text-gray-500">All over India</div>
                </div> */}
                {/* <div className="text-center">
                  <div className="text-2xl font-bold text-bridal-maroon mb-2">✓</div>
                  <div className="font-medium">Easy Returns</div>
                  <div className="text-sm text-gray-500">7 Days Return Policy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-bridal-maroon mb-2">✓</div>
                  <div className="font-medium">Secure Payment</div>
                  <div className="text-sm text-gray-500">100% Secure</div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;