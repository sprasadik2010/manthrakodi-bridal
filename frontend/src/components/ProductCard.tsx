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
      className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-bridal-lg hover:border-bridal-gold/45 transition-all duration-300"
    >
      {/* Clickable Image Container - Links to product page */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-[4/5] bg-gray-50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain bg-white group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x375?text=No+Image';
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {product.featured && (
            <span className="bg-bridal-maroon text-white px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase shadow-md animate-pulse">
              Featured
            </span>
          )}
          {product.original_price && (product.original_price > product.price) && (
            <span className="bg-bridal-gold text-black px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-md uppercase tracking-wider">
              {Math.round((1 - product.price / product.original_price) * 100)}% OFF
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        <div className="mb-2">
          <span className="text-[10px] text-bridal-gold font-bold tracking-widest uppercase block mb-1">
            {product.category}
          </span>
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="text-lg font-playfair font-bold text-gray-900 group-hover:text-bridal-maroon transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        <p className="text-gray-500 text-xs mb-4 line-clamp-2 min-h-[32px] leading-relaxed">
          {product.description}
        </p>

        {/* Price & Stock */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-bridal-maroon">
              ₹{product.price.toLocaleString()}
            </span>
            {product.original_price  && (product.original_price > product.price) && (
              <span className="text-gray-400 line-through text-xs">
                ₹{product.original_price.toLocaleString()}
              </span>
            )}
          </div>
          <div className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
            product.stock > 10
              ? 'bg-green-50 text-green-700 border border-green-200'
              : product.stock > 0
              ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {product.stock > 0 ? `${product.stock} Left` : 'Out of Stock'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 bg-bridal-maroon hover:bg-[#660000] text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
          >
            <FaShoppingCart size={14} />
            Add to Cart
          </button>
          
          <button
            onClick={handleWishlistToggle}
            className={`p-2.5 rounded-xl transition-all duration-300 border text-sm ${
              isWishlisted
                ? 'bg-red-500 border-red-500 text-white shadow-md'
                : 'bg-white border-gray-200 text-bridal-maroon hover:bg-red-50 hover:text-red-500 hover:border-red-200'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FaHeart size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;