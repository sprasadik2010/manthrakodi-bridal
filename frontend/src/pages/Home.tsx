// src/pages/Home.tsx
// import HeroSlider from '../components/HeroSlider';
import CategoryShowcase from '../components/CategoryShowcase';
import FeaturedProducts from '../components/FeaturedProducts';
import Testimonials from '../components/Testimonials';

const Home = () => {
  return (
    <div>
      {/* <HeroSlider /> */}
      <CategoryShowcase />
      <FeaturedProducts />
      <Testimonials />
    </div>
  );
};

export default Home;