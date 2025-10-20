import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Search
} from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, eventsRes, chatsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/bookings`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/events`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/chat/active`)
      ]);

      setBookings(bookingsRes.data.bookings);
      setEvents(eventsRes.data.events);
      setActiveChats(chatsRes.data.chats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/status`, { status });
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const assignPlanner = async (bookingId, plannerId) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/assign`, { plannerId });
      fetchDashboardData();
    } catch (error) {
      console.error('Error assigning planner:', error);
    }
  };

  const deleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/events/${eventId}`);
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
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

  const stats = [
    {
      title: 'Total Bookings',
      value: bookings.length,
      icon: <Calendar className="h-6 w-6" />,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Active Events',
      value: events.filter(e => e.isActive).length,
      icon: <Users className="h-6 w-6" />,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Revenue (Month)',
      value: `$${bookings.reduce((sum, b) => sum + (b.payment.status === 'paid' ? b.payment.amount : 0), 0).toLocaleString()}`,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-purple-500',
      change: '+23%'
    },
    {
      title: 'Active Chats',
      value: activeChats.length,
      icon: <MessageSquare className="h-6 w-6" />,
      color: 'bg-orange-500',
      change: '+5%'
    }
  ];

  const filteredBookings = bookings.filter(booking => {
    if (filters.status !== 'all' && booking.status !== filters.status) return false;
    if (filters.category !== 'all' && booking.eventCategory !== filters.category) return false;
    if (filters.search && !booking.eventDetails.title?.toLowerCase().includes(filters.search.toLowerCase()) &&
        !booking.client.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

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
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage bookings, events, and client communications.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change} from last month</p>
                </div>
                <div className={`${stat.color} text-white p-3 rounded-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {[
                { id: 'overview', name: 'Overview' },
                { id: 'bookings', name: 'Bookings' },
                { id: 'events', name: 'Events' },
                { id: 'chats', name: 'Live Chats' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Recent Bookings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {booking.eventDetails.title || `${booking.serviceType} - ${booking.eventCategory}`}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Client: {booking.client.name} • {new Date(booking.consultationDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Chats Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Conversations</h3>
                  <div className="space-y-3">
                    {activeChats.slice(0, 3).map((chat, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Chat #{chat._id.slice(-6)}</p>
                          <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {new Date(chat.lastMessageTime).toLocaleTimeString()}
                          </p>
                          {chat.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex items-center space-x-4">
                    <Filter className="h-5 w-5 text-gray-400" />
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                      className="input w-auto"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({...filters, category: e.target.value})}
                      className="input w-auto"
                    >
                      <option value="all">All Categories</option>
                      <option value="formal">Formal</option>
                      <option value="casual">Casual</option>
                      <option value="diy">DIY</option>
                    </select>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      value={filters.search}
                      onChange={(e) => setFilters({...filters, search: e.target.value})}
                      className="input pl-10"
                    />
                  </div>
                </div>

                {/* Bookings Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client & Event
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredBookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {booking.client.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {booking.eventDetails.title || `${booking.serviceType} - ${booking.eventCategory}`}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(booking.consultationDate).toLocaleDateString()}
                            <br />
                            {new Date(booking.consultationDate).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={booking.status}
                              onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                              className={`text-xs font-medium rounded-full px-2 py-1 ${getStatusColor(booking.status)}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${booking.payment.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-primary-600 hover:text-primary-900">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-blue-600 hover:text-blue-900">
                                <Edit className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Portfolio Events</h3>
                  <button className="btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <div key={event._id} className="card">
                      <div className="aspect-w-16 aspect-h-9 mb-4">
                        <img
                          src={event.images?.[0]?.url || '/api/placeholder/400/200'}
                          alt={event.title}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.category === 'formal' ? 'bg-purple-100 text-purple-800' :
                          event.category === 'casual' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {event.category}
                        </span>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => deleteEvent(event._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'chats' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Live Chat Management</h3>
                <div className="space-y-4">
                  {activeChats.map((chat, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Chat #{chat._id.slice(-6)}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {chat.messageCount} messages • Last active: {new Date(chat.lastMessageTime).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {chat.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                              {chat.unreadCount} unread
                            </span>
                          )}
                          <button className="btn-primary text-sm">
                            Join Chat
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">
                        Last message: "{chat.lastMessage}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
