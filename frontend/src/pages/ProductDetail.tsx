// src/pages/ProductDetail.tsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaShare, FaArrowLeft } from 'react-icons/fa';
// import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import toast from 'react-hot-toast';
import { useProduct } from '../hooks/useProducts';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  
  const { data: product, isLoading, error } = useProduct(id || '');
  const addToCart = useCartStore((state) => state.addToCart);
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlistStore();

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
        {/* Image Gallery */}
        <div>
          {/* Main Image */}
          <div className="mb-4">
            <Swiper
              spaceBetween={10}
              navigation
              thumbs={{ swiper: thumbsSwiper }}
              modules={[Navigation, Thumbs]}
              className="rounded-2xl overflow-hidden"
            >
              {product&&product.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={image}
                    alt={`${product.name} - View ${index + 1}`}
                    className="w-full h-[500px] object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Thumbnails */}
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            freeMode
            watchSlidesProgress
            modules={[FreeMode, Thumbs]}
            className="thumbnail-swiper"
          >
            {product&&product.images.map((image, index) => (
              <SwiperSlide key={index}>
                <button
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-bridal-maroon'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Product Info */}
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
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      Save ₹{(product.originalPrice - product.price).toLocaleString()}
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
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                product.stock > 10
                  ? 'bg-green-100 text-green-800'
                  : product.stock > 0
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  product.stock > 10 ? 'bg-green-600' : product.stock > 0 ? 'bg-yellow-600' : 'bg-red-600'
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
                    className={`p-4 rounded-xl border flex items-center justify-center ${
                      isWishlisted
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
                <div className="text-center">
                  <div className="text-2xl font-bold text-bridal-maroon mb-2">✓</div>
                  <div className="font-medium">Free Shipping</div>
                  <div className="text-sm text-gray-500">All over India</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-bridal-maroon mb-2">✓</div>
                  <div className="font-medium">Easy Returns</div>
                  <div className="text-sm text-gray-500">7 Days Return Policy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-bridal-maroon mb-2">✓</div>
                  <div className="font-medium">Secure Payment</div>
                  <div className="text-sm text-gray-500">100% Secure</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;