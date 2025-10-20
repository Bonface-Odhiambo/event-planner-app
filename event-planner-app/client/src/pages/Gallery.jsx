import { useState, useEffect } from 'react';
import { Filter, Search, Eye } from 'lucide-react';

const Gallery = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, this would come from API
  const mockEvents = [
    {
      id: 1,
      title: 'Elegant Garden Wedding',
      category: 'formal',
      description: 'A sophisticated outdoor wedding with luxury touches and floral arrangements.',
      images: [
        { url: '/api/placeholder/600/400', alt: 'Wedding ceremony setup', isPrimary: true },
        { url: '/api/placeholder/600/400', alt: 'Reception tables' },
        { url: '/api/placeholder/600/400', alt: 'Floral centerpieces' }
      ],
      details: {
        guestCount: 150,
        location: 'Private Estate Garden',
        date: '2024-06-15'
      },
      tags: ['wedding', 'outdoor', 'elegant', 'floral']
    },
    {
      id: 2,
      title: 'Corporate Annual Gala',
      category: 'formal',
      description: 'A black-tie corporate event with premium dining and entertainment.',
      images: [
        { url: '/api/placeholder/600/400', alt: 'Gala ballroom setup', isPrimary: true },
        { url: '/api/placeholder/600/400', alt: 'Stage and lighting' },
        { url: '/api/placeholder/600/400', alt: 'Cocktail reception' }
      ],
      details: {
        guestCount: 300,
        location: 'Grand Ballroom',
        date: '2024-03-20'
      },
      tags: ['corporate', 'gala', 'formal', 'entertainment']
    },
    {
      id: 3,
      title: 'Birthday Celebration',
      category: 'casual',
      description: 'A fun and vibrant 30th birthday party with themed decorations.',
      images: [
        { url: '/api/placeholder/600/400', alt: 'Birthday party setup', isPrimary: true },
        { url: '/api/placeholder/600/400', alt: 'Themed decorations' },
        { url: '/api/placeholder/600/400', alt: 'Dessert table' }
      ],
      details: {
        guestCount: 50,
        location: 'Private Residence',
        date: '2024-08-10'
      },
      tags: ['birthday', 'casual', 'themed', 'celebration']
    },
    {
      id: 4,
      title: 'Backyard BBQ Wedding',
      category: 'diy',
      description: 'A relaxed DIY wedding with rustic charm and personal touches.',
      images: [
        { url: '/api/placeholder/600/400', alt: 'Backyard wedding setup', isPrimary: true },
        { url: '/api/placeholder/600/400', alt: 'DIY decorations' },
        { url: '/api/placeholder/600/400', alt: 'Casual dining setup' }
      ],
      details: {
        guestCount: 75,
        location: 'Family Backyard',
        date: '2024-07-22'
      },
      tags: ['wedding', 'diy', 'rustic', 'backyard']
    },
    {
      id: 5,
      title: 'Retirement Party',
      category: 'casual',
      description: 'A heartwarming retirement celebration with colleagues and family.',
      images: [
        { url: '/api/placeholder/600/400', alt: 'Retirement party', isPrimary: true },
        { url: '/api/placeholder/600/400', alt: 'Memory wall' },
        { url: '/api/placeholder/600/400', alt: 'Celebration cake' }
      ],
      details: {
        guestCount: 80,
        location: 'Community Center',
        date: '2024-05-18'
      },
      tags: ['retirement', 'celebration', 'family', 'memories']
    },
    {
      id: 6,
      title: 'Home Anniversary Dinner',
      category: 'diy',
      description: 'An intimate 25th anniversary celebration planned with our DIY guidance.',
      images: [
        { url: '/api/placeholder/600/400', alt: 'Anniversary dinner setup', isPrimary: true },
        { url: '/api/placeholder/600/400', alt: 'Romantic table setting' },
        { url: '/api/placeholder/600/400', alt: 'Anniversary cake' }
      ],
      details: {
        guestCount: 20,
        location: 'Private Home',
        date: '2024-04-12'
      },
      tags: ['anniversary', 'intimate', 'romantic', 'diy']
    }
  ];

  const categories = [
    { value: 'all', label: 'All Events' },
    { value: 'formal', label: 'Formal & Elegant' },
    { value: 'casual', label: 'Casual & Social' },
    { value: 'diy', label: 'DIY Events' }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = events;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredEvents(filtered);
  }, [events, selectedCategory, searchTerm]);

  const openModal = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Our Event Portfolio
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Explore our collection of beautifully planned events across all categories. 
            Each celebration tells a unique story of joy, elegance, and unforgettable moments.
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-gray-50 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category Filter */}
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => {
                const primaryImage = event.images.find(img => img.isPrimary) || event.images[0];
                return (
                  <div
                    key={event.id}
                    className="card hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => openModal(event)}
                  >
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img
                        src={primaryImage.url}
                        alt={primaryImage.alt}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                        <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          event.category === 'formal' ? 'bg-purple-100 text-purple-800' :
                          event.category === 'casual' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {categories.find(c => c.value === event.category)?.label}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{event.details.guestCount} guests</span>
                      <span>{new Date(event.details.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedEvent.title}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedEvent.category === 'formal' ? 'bg-purple-100 text-purple-800' :
                    selectedEvent.category === 'casual' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {categories.find(c => c.value === selectedEvent.category)?.label}
                  </span>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {selectedEvent.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600 mb-4">{selectedEvent.description}</p>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Details</h3>
                  <div className="space-y-2 text-gray-600">
                    <div><strong>Guest Count:</strong> {selectedEvent.details.guestCount}</div>
                    <div><strong>Location:</strong> {selectedEvent.details.location}</div>
                    <div><strong>Date:</strong> {new Date(selectedEvent.details.date).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
