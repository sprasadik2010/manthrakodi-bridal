// src/components/ProductCard.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaEye, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Product } from '../types';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlistStore();

  const handleAddToCart = () => {
    addToCart(product, 1);
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

  const isWishlisted = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {product.featured && (
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              Featured
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-bridal-gold text-white px-3 py-1 rounded-full text-xs font-bold">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Quick Actions Overlay - Always visible on mobile */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 opacity-100 md:opacity-0">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-white text-bridal-maroon p-3 rounded-full hover:bg-bridal-maroon hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            aria-label="Add to cart"
          >
            <FaShoppingCart size={20} />
          </button>
          <Link
            to={`/product/${product.id}`}
            className="bg-white text-bridal-maroon p-3 rounded-full hover:bg-bridal-maroon hover:text-white transition-colors shadow-lg"
            aria-label="View details"
          >
            <FaEye size={20} />
          </Link>
          <button
            onClick={handleWishlistToggle}
            className={`p-3 rounded-full transition-colors shadow-lg ${
              isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white text-bridal-maroon hover:bg-bridal-maroon hover:text-white'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FaHeart size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <Link to={`/product/${product.id}`} className="group">
            <h3 className="text-xl font-playfair font-semibold text-gray-800 group-hover:text-bridal-maroon transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <span className="text-sm text-gray-500 capitalize px-3 py-1 bg-gray-100 rounded-full">
            {product.category}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
          {product.description}
        </p>

        {/* Price & Stock */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-bridal-maroon">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <div className={`text-sm px-3 py-1 rounded-full ${
            product.stock > 10
              ? 'bg-green-100 text-green-800'
              : product.stock > 0
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
          </div>
        </div>

        {/* Quick Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-bridal-maroon hover:bg-bridal-maroon/90 text-white py-3 rounded-xl flex items-center justify-center gap-3 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaShoppingCart />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;