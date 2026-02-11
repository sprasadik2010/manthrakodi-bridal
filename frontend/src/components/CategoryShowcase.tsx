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
    image: 'https://i.ibb.co/fYNfgRC5/Whats-App-Image-2026-02-09-at-12-36-50-PM-1.jpg',
    link: '/products?category=ornament',
    count: ''
  },
  {
    id: 3,
    title: 'Bridal Sets',
    image: 'https://i.ibb.co/Fq68YpCF/Whats-App-Image-2026-02-10-at-11-04-25-PM.jpg',
    link: '/products?category=bridal-set',
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
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={category.image}
                    alt={category.title}
                    // className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    className="w-full h-64 object-scale-down group-hover:scale-110 transition-transform duration-700 bg-white"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                    <p className="text-gray-200">{category.count}</p>
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