// src/pages/Home.tsx
import HeroSlider from '../components/HeroSlider';
import CategoryShowcase from '../components/CategoryShowcase';
import FeaturedProducts from '../components/FeaturedProducts';

const Home = () => {
  return (
    <div>
      <HeroSlider />
      <CategoryShowcase />
      <FeaturedProducts />
      
      {/* Store Location Map Section */}
      <div className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-playfair font-bold text-gray-800 mb-4">
              Visit Our Store
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto font-medium">
              First floor, Bengachery Complex, Opposite Vyapar Bhavan, Kanhangad, Kasaragod Dt, Kerala, India
            </p>
          </div>
          
          <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-bridal border border-gray-100 bg-white p-2">
            <iframe
              title="Manthrakodi Location Map"
              src="https://maps.google.com/maps?q=Manthrakodi+Bridal,+Bengachery+Complex,+Kanhangad&t=&z=17&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-xl"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;