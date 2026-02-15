import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Product } from '../types';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlistStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success('Added to cart!');
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    >
      {/* Clickable Image Container - Links to product page */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-square">
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
          {product.original_price && (product.original_price > product.price) && (
            <span className="bg-bridal-gold text-white px-3 py-1 rounded-full text-xs font-bold">
              {Math.round((1 - product.price / product.original_price) * 100)}% OFF
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <Link to={`/product/${product.id}`} className="group flex-1">
            <h3 className="text-xl font-playfair font-semibold text-gray-800 group-hover:text-bridal-maroon transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <span className="text-sm text-gray-500 capitalize px-3 py-1 bg-gray-100 rounded-full ml-2">
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
            {product.original_price  && (product.original_price > product.price) && (
              <span className="text-gray-400 line-through">
                ₹{product.original_price.toLocaleString()}
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

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 bg-bridal-maroon hover:bg-bridal-maroon/90 text-white py-3 rounded-xl flex items-center justify-center gap-3 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaShoppingCart />
            Add to Cart
          </button>
          
          <button
            onClick={handleWishlistToggle}
            className={`p-3 rounded-xl transition-colors border ${
              isWishlisted
                ? 'bg-red-500 border-red-500 text-white'
                : 'bg-white border-gray-300 text-bridal-maroon hover:bg-bridal-maroon hover:text-white hover:border-bridal-maroon'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FaHeart size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;