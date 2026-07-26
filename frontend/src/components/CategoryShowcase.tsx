// src/components/CategoryShowcase.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 1,
    title: 'Sarees',
    image: 'https://i.ibb.co/r2M2BkKN/hq720-1.png&w=800',
    link: '/products?category=saree',
    count: ''
  },
  {
    id: 2,
    title: 'Ornaments',
    image: 'https://i.ibb.co/7dfL29Dc/Whats-App-Image-2026-02-11-at-4-06-54-PM.jpg',
    link: '/products?category=ornament',
    count: ''
  },
  {
    id: 3,
    title: 'Bridal Collections',
    image: 'https://i.ibb.co/Fq68YpCF/Whats-App-Image-2026-02-10-at-11-04-25-PM.jpg',
    link: '/products?category=bridal-collections',
    count: ''
  }
];

const CategoryShowcase = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-playfair font-bold text-gray-800 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our exclusive collections crafted for your special moments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories&&categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <Link to={category.link} className="group block">
                <div className="relative overflow-hidden rounded-2xl border border-gray-100 shadow-md group-hover:border-bridal-gold/50 group-hover:shadow-bridal transition-all duration-300">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white transform group-hover:translate-y-[-4px] transition-transform duration-300">
                    <span className="text-bridal-gold font-medium uppercase text-xs tracking-wider mb-1 block">Collection</span>
                    <h3 className="text-2xl font-playfair font-bold mb-1">{category.title}</h3>
                    <p className="text-gray-200 text-sm hover:underline flex items-center gap-1">
                      Shop Now <span className="text-xs">→</span>
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryShowcase;