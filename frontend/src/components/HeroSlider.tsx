// src/components/HeroSlider.tsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1600',
    title: 'Exclusive Bridal Collections',
    subtitle: 'Traditional & Contemporary Designs',
    cta: 'Explore Collection',
    link: '/products?category=saree'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1600',
    title: 'Handcrafted Ornaments',
    subtitle: 'Timeless Elegance',
    cta: 'View Ornaments',
    link: '/products?category=ornament'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1585487000160-6eb9ce6b5aae?auto=format&fit=crop&w=1600',
    title: 'Custom Bridal Sets',
    subtitle: 'Tailored to Perfection',
    cta: 'Design Yours',
    link: '/contact'
  }
];

const HeroSlider = () => {
  return (
    <div className="relative h-[90vh]">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={1000}
        loop={true}
        navigation
        pagination={{ clickable: true }}
        className="h-full"
      >
        {slides&&slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
              
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-6 lg:px-12">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl text-white"
                  >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold mb-6">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl font-montserrat mb-8 opacity-90">
                      {slide.subtitle}
                    </p>
                    <Link
                      to={slide.link}
                      className="inline-flex items-center gap-3 bg-bridal-maroon hover:bg-bridal-maroon/90 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
                    >
                      {slide.cta}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom pagination styling */}
      <style>{`
        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: var(--color-bridal-maroon);
          transform: scale(1.2);
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          width: 60px;
          height: 60px;
          background: rgba(128, 0, 0, 0.7);
          border-radius: 50%;
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 24px;
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;