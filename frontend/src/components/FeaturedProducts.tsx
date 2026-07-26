// src/components/FeaturedProducts.tsx
import { useProducts } from '../hooks/useProducts';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';

const FeaturedProducts = () => {
  const { data: products, isLoading } = useProducts({ featured: true, limit: 4 });

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bridal-maroon mx-auto mb-4"></div>
            <p>Loading featured products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-playfair font-bold text-gray-800 mb-2">
              Featured Collection
            </h2>
            <p className="text-gray-600">Handpicked selections for the discerning bride</p>
          </div>
          <Link
            to="/products"
            className="text-bridal-maroon hover:text-bridal-maroon/80 font-semibold"
          >
            View All →
          </Link>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products&&products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No featured products available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;