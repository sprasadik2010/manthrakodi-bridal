// src/components/Testimonials.tsx
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Bride',
    content: 'The bridal set I purchased was absolutely stunning! The craftsmanship exceeded my expectations.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150'
  },
  {
    id: 2,
    name: 'Anjali Reddy',
    role: 'Bride',
    content: 'Custom saree service was amazing. They perfectly captured my vision for my wedding day.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w150'
  },
  {
    id: 3,
    name: 'Meera Patel',
    role: 'Mother of the Bride',
    content: 'Excellent quality and timely delivery. The ornaments were the highlight of the wedding.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150'
  }
];

const Testimonials = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-playfair font-bold text-gray-800 mb-4">
            What Our Brides Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real experiences from brides who made their special day even more memorable with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials&&testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold text-lg">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>

              <FaQuoteLeft className="text-bridal-maroon/30 text-2xl mb-4" />
              
              <p className="text-gray-700 mb-4 italic">{testimonial.content}</p>
              
              <div className="flex text-yellow-500">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;