import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, DollarSign, User, Edit, Eye } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/bookings`);
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = [
    {
      title: 'Total Bookings',
      value: bookings.length,
      icon: <Calendar className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Upcoming Events',
      value: bookings.filter(b => new Date(b.consultationDate) > new Date()).length,
      icon: <Clock className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      title: 'Total Spent',
      value: `$${bookings.reduce((sum, b) => sum + (b.payment.status === 'paid' ? b.payment.amount : 0), 0).toLocaleString()}`,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-purple-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your event bookings and account settings.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center">
                <div className={`${stat.color} text-white p-3 rounded-lg mr-4`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'bookings'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Bookings
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'profile'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile Settings
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'bookings' && (
              <div>
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No bookings yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Ready to plan your perfect event? Book a consultation to get started.
                    </p>
                    <a href="/book" className="btn-primary">
                      Book Consultation
                    </a>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {booking.eventDetails.title || `${booking.serviceType} - ${booking.eventCategory}`}
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.payment.status)}`}>
                                Payment: {booking.payment.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="btn-secondary text-sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </button>
                            {booking.status === 'pending' && (
                              <button className="btn-outline text-sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Consultation Date:</span>
                            <br />
                            {new Date(booking.consultationDate).toLocaleDateString()} at{' '}
                            {new Date(booking.consultationDate).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <div>
                            <span className="font-medium">Event Date:</span>
                            <br />
                            {booking.eventDetails.date 
                              ? new Date(booking.eventDetails.date).toLocaleDateString()
                              : 'TBD'
                            }
                          </div>
                          <div>
                            <span className="font-medium">Investment:</span>
                            <br />
                            ${booking.payment.amount.toLocaleString()}
                          </div>
                        </div>

                        {booking.eventDetails.description && (
                          <div className="mt-4">
                            <span className="font-medium text-gray-700">Description:</span>
                            <p className="text-gray-600 mt-1">{booking.eventDetails.description}</p>
                          </div>
                        )}

                        {booking.assignedPlanner && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-700">Assigned Planner:</span>
                            <p className="text-gray-600">{booking.assignedPlanner.name}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="max-w-2xl">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h3>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.name}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email}
                        className="input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue={user?.phone}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Event Types
                    </label>
                    <div className="space-y-2">
                      {['formal', 'casual', 'diy'].map((type) => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked={user?.preferences?.eventTypes?.includes(type)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700 capitalize">
                            {type === 'diy' ? 'DIY Events' : `${type} Events`}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range (Min)
                      </label>
                      <input
                        type="number"
                        defaultValue={user?.preferences?.budget?.min}
                        className="input"
                        placeholder="5000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range (Max)
                      </label>
                      <input
                        type="number"
                        defaultValue={user?.preferences?.budget?.max}
                        className="input"
                        placeholder="25000"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button type="submit" className="btn-primary">
                      <User className="h-4 w-4 mr-2" />
                      Update Profile
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
