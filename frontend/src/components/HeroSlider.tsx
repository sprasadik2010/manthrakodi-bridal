// src/components/HeroSlider.tsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
=======
// import { Link } from 'react-router-dom';
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const slides = [
  {
    id: 1,
    image: 'https://i.ibb.co/nq1PK8F6/Whats-App-Image-2026-02-10-at-12-09-16-AM.jpg',
<<<<<<< HEAD
    title: 'Timeless Bridal Elegance',
    subtitle: 'Exquisite handcrafted sarees woven for your once-in-a-lifetime moments.',
    cta: 'Explore Sarees',
=======
    title: '',
    subtitle: '',
    cta: 'Explore Collection',
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
    link: '/products?category=saree'
  },
  {
    id: 2,
    image: 'https://i.ibb.co/m5mSxxVL/Whats-App-Image-2026-02-10-at-11-07-51-PM.jpg',
<<<<<<< HEAD
    title: 'Exquisite Gold Ornaments',
    subtitle: 'Radiant handcrafted jewelry collections designed to complete your bridal glow.',
=======
    title: '',
    subtitle: '',
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
    cta: 'View Ornaments',
    link: '/products?category=ornament'
   },
  {
    id: 3,
    image: 'https://i.ibb.co/7d2QkrwL/Whats-App-Image-2026-02-11-at-4-15-01-PM.jpg',
    title: 'Custom Bridal Collections',
<<<<<<< HEAD
    subtitle: 'Step into tradition with garments tailored specifically to your unique vision.',
=======
    subtitle: 'Tailored to Perfection',
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
    cta: 'Design Yours',
    link: '/contact'
  },
  {
    id: 4,
    image: 'https://i.ibb.co/nsYN59Qk/Whats-App-Image-2026-02-11-at-3-56-18-PM.jpg',
<<<<<<< HEAD
    title: 'Royal Heritage Drapes',
    subtitle: 'Experience the premium luxury of traditional patterns and intricate embroidery.',
    cta: 'Browse Collection',
    link: '/products?category=bridal-collections'
=======
    title: 'Custom Bridal Collections',
    subtitle: 'Tailored to Perfection',
    cta: 'Design Yours',
    link: '/contact'
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
  },
  {
    id: 5,
    image: 'https://i.ibb.co/PZ7KWCs2/Whats-App-Image-2026-02-10-at-11-07-52-PM.jpg',
<<<<<<< HEAD
    title: 'Modern Bridal Aesthetics',
    subtitle: 'Sophisticated contemporary wedding fashion designed to turn heads.',
    cta: 'Book Consultation',
=======
    title: 'Custom Bridal Collections',
    subtitle: 'Tailored to Perfection',
    cta: 'Design Yours',
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
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
<<<<<<< HEAD
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
=======
                // className="w-full h-full object-cover"
                // className="w-100 h-full object-cover md:object-center lg:object-cover"
                className="w-full h-full object-contain"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
              
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-6 lg:px-12">
                  <motion.div
<<<<<<< HEAD
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-2xl text-white"
                  >
                    <span className="text-bridal-gold font-semibold tracking-widest uppercase text-xs md:text-sm mb-3 block">
                      Manthrakodi Bridal
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold mb-4 leading-tight drop-shadow-md">
                      {slide.title}
                    </h1>
                    <p className="text-base md:text-xl font-montserrat mb-8 opacity-90 leading-relaxed max-w-lg drop-shadow-sm">
=======
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl text-white"
                  >
                    {/* <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold mb-6">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl font-montserrat mb-8 opacity-90">
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
                      {slide.subtitle}
                    </p>
                    <Link
                      to={slide.link}
<<<<<<< HEAD
                      className="inline-flex items-center gap-3 bg-bridal-maroon hover:bg-[#660000] text-white border-2 border-bridal-maroon hover:border-[#660000] px-6 py-3.5 md:px-8 md:py-4 rounded-full text-sm md:text-base font-semibold shadow-lg hover:shadow-bridal transition-all duration-300 hover:scale-105"
=======
                      className="inline-flex items-center gap-3 bg-bridal-maroon hover:bg-bridal-maroon/90 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
                    >
                      {slide.cta}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
<<<<<<< HEAD
                    </Link>
=======
                    </Link> */}
>>>>>>> 0208261eee44a97280e1d98d8ef143e66a50934e
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