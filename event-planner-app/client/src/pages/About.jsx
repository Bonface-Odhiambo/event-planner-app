import { Award, Users, Calendar, Heart } from 'lucide-react';

const About = () => {
  const team = [
    {
      name: 'Sarah Mitchell',
      role: 'Founder & Lead Planner',
      image: '/api/placeholder/300/300',
      bio: 'With over 15 years in luxury event planning, Sarah brings creativity and precision to every celebration.',
      specialties: ['Luxury Weddings', 'Corporate Events', 'Destination Planning']
    },
    {
      name: 'Michael Chen',
      role: 'Creative Director',
      image: '/api/placeholder/300/300',
      bio: 'Michael\'s background in design and hospitality ensures every event is visually stunning and memorable.',
      specialties: ['Design & Styling', 'Vendor Relations', 'Budget Management']
    },
    {
      name: 'Emily Rodriguez',
      role: 'Operations Manager',
      image: '/api/placeholder/300/300',
      bio: 'Emily coordinates all logistics with military precision, ensuring flawless execution on event day.',
      specialties: ['Timeline Management', 'Vendor Coordination', 'Day-of Execution']
    }
  ];

  const values = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Passion for Perfection',
      description: 'We pour our hearts into every detail, treating each event as if it were our own special celebration.'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Client-Centered Approach',
      description: 'Your vision guides everything we do. We listen, understand, and bring your dreams to life.'
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Excellence in Execution',
      description: 'From initial concept to final cleanup, we maintain the highest standards of quality and professionalism.'
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: 'Stress-Free Planning',
      description: 'We handle the complexities so you can focus on what matters most - enjoying your special moment.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Events Planned', description: 'Successfully executed celebrations' },
    { number: '10+', label: 'Years Experience', description: 'In luxury event planning' },
    { number: '98%', label: 'Client Satisfaction', description: 'Based on post-event surveys' },
    { number: '50+', label: 'Vendor Partners', description: 'Trusted professionals in our network' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Elegant Events
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              We are passionate event planners dedicated to creating unforgettable experiences 
              that reflect your unique style and vision.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2014, Elegant Events began with a simple mission: to transform 
                  ordinary celebrations into extraordinary memories. What started as a passion 
                  project has grown into a full-service event planning company trusted by 
                  hundreds of clients.
                </p>
                <p>
                  Our founder, Sarah Mitchell, recognized that every celebration deserves the 
                  same level of attention and care, whether it's an intimate dinner party or 
                  a grand wedding. This philosophy continues to guide our work today.
                </p>
                <p>
                  We believe that the best events happen when creativity meets meticulous 
                  planning. Our team combines artistic vision with practical expertise to 
                  deliver celebrations that exceed expectations while staying true to your 
                  personal style and budget.
                </p>
              </div>
            </div>
            <div>
              <img
                src="/api/placeholder/600/400"
                alt="Our team planning an event"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core principles guide every decision we make and every event we plan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <div className="text-primary-600">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our experienced professionals bring creativity, expertise, and passion to every event.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 mb-4">
                  {member.bio}
                </p>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">Specialties:</p>
                  {member.specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full mr-2 mb-1"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Numbers that reflect our commitment to excellence and client satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-xl font-semibold text-primary-100 mb-2">
                  {stat.label}
                </div>
                <div className="text-primary-200 text-sm">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission</h2>
          <blockquote className="text-2xl text-gray-600 italic leading-relaxed">
            "To create extraordinary celebrations that reflect the unique personality and 
            vision of each client, while providing a stress-free planning experience that 
            allows them to fully enjoy their special moments."
          </blockquote>
          <div className="mt-8">
            <p className="text-lg text-gray-700">
              — Sarah Mitchell, Founder
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Work Together?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's discuss your vision and create something beautiful together. 
            We'd love to be part of your special celebration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/book" className="btn-primary">
              Book Consultation
            </a>
            <a href="/contact" className="btn-outline">
              Get In Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
