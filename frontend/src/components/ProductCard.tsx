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
<<<<<<< HEAD
      className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-bridal-lg hover:border-bridal-gold/45 transition-all duration-300"
    >
      {/* Clickable Image Container - Links to product page */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-[4/5] bg-gray-50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x375?text=No+Image';
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {product.featured && (
            <span className="bg-bridal-maroon text-white px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase shadow-md animate-pulse">
=======
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
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
              Featured
            </span>
          )}
          {product.original_price && (product.original_price > product.price) && (
<<<<<<< HEAD
            <span className="bg-bridal-gold text-black px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-md uppercase tracking-wider">
=======
            <span className="bg-bridal-gold text-white px-3 py-1 rounded-full text-xs font-bold">
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
              {Math.round((1 - product.price / product.original_price) * 100)}% OFF
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
<<<<<<< HEAD
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
=======
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
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
          {product.description}
        </p>

        {/* Price & Stock */}
<<<<<<< HEAD
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-bridal-maroon">
              ₹{product.price.toLocaleString()}
            </span>
            {product.original_price  && (product.original_price > product.price) && (
              <span className="text-gray-400 line-through text-xs">
=======
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-bridal-maroon">
              ₹{product.price.toLocaleString()}
            </span>
            {product.original_price  && (product.original_price > product.price) && (
              <span className="text-gray-400 line-through">
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
                ₹{product.original_price.toLocaleString()}
              </span>
            )}
          </div>
<<<<<<< HEAD
          <div className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
            product.stock > 10
              ? 'bg-green-50 text-green-700 border border-green-200'
              : product.stock > 0
              ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {product.stock > 0 ? `${product.stock} Left` : 'Out of Stock'}
=======
          <div className={`text-sm px-3 py-1 rounded-full ${
            product.stock > 10
              ? 'bg-green-100 text-green-800'
              : product.stock > 0
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
          </div>
        </div>

        {/* Action Buttons */}
<<<<<<< HEAD
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 bg-bridal-maroon hover:bg-[#660000] text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
          >
            <FaShoppingCart size={14} />
=======
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 bg-bridal-maroon hover:bg-bridal-maroon/90 text-white py-3 rounded-xl flex items-center justify-center gap-3 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaShoppingCart />
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
            Add to Cart
          </button>
          
          <button
            onClick={handleWishlistToggle}
<<<<<<< HEAD
            className={`p-2.5 rounded-xl transition-all duration-300 border text-sm ${
              isWishlisted
                ? 'bg-red-500 border-red-500 text-white shadow-md'
                : 'bg-white border-gray-200 text-bridal-maroon hover:bg-red-50 hover:text-red-500 hover:border-red-200'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FaHeart size={16} />
=======
            className={`p-3 rounded-xl transition-colors border ${
              isWishlisted
                ? 'bg-red-500 border-red-500 text-white'
                : 'bg-white border-gray-300 text-bridal-maroon hover:bg-bridal-maroon hover:text-white hover:border-bridal-maroon'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FaHeart size={20} />
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;