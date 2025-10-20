import { Link } from 'react-router-dom';
import { Star, Calendar, Users, Award, ArrowRight } from 'lucide-react';

const Home = () => {
  const eventCategories = [
    {
      title: 'Formal & Elegant Events',
      description: 'Elaborate occasions with detailed planning, luxury touches, and sophisticated styling.',
      image: '/api/placeholder/400/300',
      features: ['Custom table layouts', 'Premium linens', 'Fine dining service', 'Floral arrangements'],
      link: '/services#formal'
    },
    {
      title: 'Casual & Social Events',
      description: 'Relaxed gatherings that bring people together for memorable experiences.',
      image: '/api/placeholder/400/300',
      features: ['Birthday parties', 'Bachelor/Bachelorette', 'Retirement celebrations', 'Social gatherings'],
      link: '/services#casual'
    },
    {
      title: 'DIY Events',
      description: 'Partial planning services and consultation for your home or chosen venue.',
      image: '/api/placeholder/400/300',
      features: ['Invitation design', 'Layout planning', 'Vendor recommendations', 'Day-of coordination'],
      link: '/services#diy'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      event: 'Wedding Reception',
      rating: 5,
      text: 'Absolutely magical! Every detail was perfect, from the floral arrangements to the seamless coordination.',
      image: '/api/placeholder/60/60'
    },
    {
      name: 'Michael Chen',
      event: 'Corporate Gala',
      rating: 5,
      text: 'Professional, creative, and exceeded all expectations. Our guests are still talking about it!',
      image: '/api/placeholder/60/60'
    },
    {
      name: 'Emily Rodriguez',
      event: 'Birthday Celebration',
      rating: 5,
      text: 'Made my dream party come true! The team handled everything so I could enjoy my special day.',
      image: '/api/placeholder/60/60'
    }
  ];

  const stats = [
    { number: '500+', label: 'Events Planned' },
    { number: '98%', label: 'Client Satisfaction' },
    { number: '10+', label: 'Years Experience' },
    { number: '50+', label: 'Vendor Partners' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Creating Unforgettable
              <span className="block text-primary-200">Moments</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-primary-100">
              From intimate gatherings to grand celebrations, we bring your vision to life with 
              exceptional planning and flawless execution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book" className="btn-primary bg-white text-primary-600 hover:bg-primary-50 px-8 py-3 text-lg">
                Book Consultation
              </Link>
              <Link to="/gallery" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg">
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Event Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We specialize in three distinct types of events, each tailored to create 
              the perfect atmosphere for your special occasion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {eventCategories.map((category, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9 mb-6">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {category.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {category.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {category.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 text-primary-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  to={category.link}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600">
              Don't just take our word for it - hear from our satisfied clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.event}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Plan Your Perfect Event?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Let's discuss your vision and create an unforgettable experience together. 
            Book your free consultation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book" className="btn-primary bg-white text-primary-600 hover:bg-primary-50 px-8 py-3 text-lg">
              <Calendar className="h-5 w-5 mr-2 inline" />
              Book Consultation
            </Link>
            <Link to="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg">
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
