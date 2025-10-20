import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Star, ArrowRight, Calendar, Users, Palette } from 'lucide-react';

const Services = () => {
  const [activeTab, setActiveTab] = useState('formal');

  const services = {
    formal: {
      title: 'Formal & Elegant Events',
      subtitle: 'Sophisticated celebrations with luxury touches',
      description: 'Transform your special occasion into an unforgettable experience with our comprehensive formal event planning services. We specialize in creating sophisticated atmospheres with attention to every detail.',
      features: [
        'Custom table layouts and seating arrangements',
        'Premium linens, china, and glassware selection',
        'Professional floral design and arrangements',
        'Multi-course menu planning and wine pairings',
        'Lighting design and ambiance creation',
        'Professional photography coordination',
        'Day-of coordination and timeline management',
        'Vendor management and quality assurance'
      ],
      pricing: {
        consultation: 150,
        planning: 'Starting at $5,000',
        description: 'Full-service planning for events of 50+ guests'
      },
      image: '/api/placeholder/600/400'
    },
    casual: {
      title: 'Casual & Social Events',
      subtitle: 'Relaxed gatherings that bring people together',
      description: 'Create memorable moments with our casual event planning services. Perfect for birthdays, bachelor/bachelorette parties, retirement celebrations, and social gatherings that prioritize fun and connection.',
      features: [
        'Theme development and decoration',
        'Venue selection and booking assistance',
        'Catering coordination for casual dining',
        'Entertainment and activity planning',
        'Photography and videography arrangements',
        'Party favors and gift coordination',
        'Timeline creation and day-of support',
        'Budget management and cost optimization'
      ],
      pricing: {
        consultation: 100,
        planning: 'Starting at $2,500',
        description: 'Flexible planning for events of 20+ guests'
      },
      image: '/api/placeholder/600/400'
    },
    diy: {
      title: 'DIY Events',
      subtitle: 'Guidance and support for your home celebrations',
      description: 'Get professional expertise while maintaining control over your event. Our DIY services provide you with the tools, guidance, and partial support needed to create beautiful celebrations at your chosen venue.',
      features: [
        'Custom invitation design and printing',
        'Layout planning and space optimization',
        'Vendor recommendations and referrals',
        'Shopping lists and timeline creation',
        'Setup guidance and instructions',
        'Day-of consultation calls',
        'Emergency support hotline',
        'Post-event cleanup coordination'
      ],
      pricing: {
        consultation: 75,
        planning: 'Starting at $800',
        description: 'Consultation and planning support packages'
      },
      image: '/api/placeholder/600/400'
    }
  };

  const processSteps = [
    {
      step: 1,
      title: 'Initial Consultation',
      description: 'We discuss your vision, budget, and requirements in detail.',
      icon: <Calendar className="h-8 w-8" />
    },
    {
      step: 2,
      title: 'Proposal & Planning',
      description: 'Receive a detailed proposal with timeline and vendor recommendations.',
      icon: <Palette className="h-8 w-8" />
    },
    {
      step: 3,
      title: 'Coordination & Execution',
      description: 'We handle all details while keeping you informed throughout the process.',
      icon: <Users className="h-8 w-8" />
    }
  ];

  const currentService = services[activeTab];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Our Event Planning Services
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            From intimate gatherings to grand celebrations, we offer comprehensive 
            event planning services tailored to your unique vision and budget.
          </p>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row justify-center mb-12">
            <div className="bg-gray-100 rounded-lg p-1 inline-flex">
              {Object.entries(services).map(([key, service]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    activeTab === key
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  {service.title.split(' & ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Service Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {currentService.title}
              </h2>
              <p className="text-xl text-primary-600 mb-6">
                {currentService.subtitle}
              </p>
              <p className="text-gray-600 mb-8">
                {currentService.description}
              </p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {currentService.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h4 className="font-semibold text-gray-900 mb-2">Investment</h4>
                <div className="flex items-baseline space-x-4 mb-2">
                  <span className="text-2xl font-bold text-primary-600">
                    ${currentService.pricing.consultation}
                  </span>
                  <span className="text-gray-600">consultation fee</span>
                </div>
                <div className="flex items-baseline space-x-4 mb-2">
                  <span className="text-lg font-semibold text-gray-900">
                    {currentService.pricing.planning}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {currentService.pricing.description}
                </p>
              </div>

              <Link
                to="/book"
                className="btn-primary inline-flex items-center"
              >
                Book Consultation
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>

            <div>
              <img
                src={currentService.image}
                alt={currentService.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Planning Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We follow a proven process to ensure your event exceeds expectations 
              while staying within budget and timeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <div className="text-primary-600">
                    {step.icon}
                  </div>
                </div>
                <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Client Success Stories
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Jennifer & Mark',
                event: 'Wedding Reception - Formal',
                text: 'Every detail was absolutely perfect. The team made our dream wedding come true!',
                rating: 5
              },
              {
                name: 'Corporate Client',
                event: 'Annual Gala - Formal',
                text: 'Professional, creative, and flawless execution. Our guests were impressed!',
                rating: 5
              },
              {
                name: 'Lisa M.',
                event: 'Birthday Party - Casual',
                text: 'Fun, stress-free planning that resulted in the perfect celebration!',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.event}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Planning?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Let's discuss your vision and create a customized plan for your perfect event.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book" className="btn-primary bg-white text-primary-600 hover:bg-primary-50">
              Book Free Consultation
            </Link>
            <Link to="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
