import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Users, DollarSign, CreditCard, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BookingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceType: '',
    eventCategory: '',
    eventDetails: {
      title: '',
      date: '',
      location: '',
      guestCount: '',
      budget: { min: '', max: '' },
      description: '',
      specialRequirements: []
    },
    consultationDate: '',
    duration: 60
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const steps = [
    { number: 1, title: 'Service Selection', icon: <Users className="h-5 w-5" /> },
    { number: 2, title: 'Event Details', icon: <Calendar className="h-5 w-5" /> },
    { number: 3, title: 'Consultation Booking', icon: <DollarSign className="h-5 w-5" /> },
    { number: 4, title: 'Payment', icon: <CreditCard className="h-5 w-5" /> }
  ];

  const serviceTypes = [
    {
      id: 'consultation',
      name: 'Initial Consultation',
      price: 150,
      description: 'One-on-one consultation to discuss your vision and requirements',
      duration: '90 minutes'
    },
    {
      id: 'full-planning',
      name: 'Full Event Planning',
      price: 300,
      description: 'Comprehensive planning consultation with detailed proposal',
      duration: '2 hours'
    },
    {
      id: 'partial-planning',
      name: 'Partial Planning',
      price: 200,
      description: 'Focused consultation for specific aspects of your event',
      duration: '90 minutes'
    },
    {
      id: 'diy-assistance',
      name: 'DIY Guidance',
      price: 100,
      description: 'Expert guidance for your self-planned event',
      duration: '60 minutes'
    }
  ];

  const eventCategories = [
    { id: 'formal', name: 'Formal & Elegant', description: 'Sophisticated events with luxury touches' },
    { id: 'casual', name: 'Casual & Social', description: 'Relaxed gatherings and celebrations' },
    { id: 'diy', name: 'DIY Events', description: 'Home-based events with professional guidance' }
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const createBooking = async () => {
    try {
      const selectedService = serviceTypes.find(s => s.id === formData.serviceType);
      const bookingData = {
        ...formData,
        payment: {
          amount: selectedService.price,
          currency: 'USD',
          status: 'pending'
        }
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/bookings`, bookingData);
      setBookingId(response.data.booking._id);
      return response.data.booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  };

  const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentError, setPaymentError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handlePayment = async (e) => {
      e.preventDefault();
      
      if (!stripe || !elements) return;

      setIsSubmitting(true);
      setPaymentError(null);

      try {
        // Create booking first
        const booking = await createBooking();
        
        // Create payment intent
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/create-payment-intent`, {
          bookingId: booking._id,
          amount: booking.payment.amount
        });

        // Confirm payment
        const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user?.name || 'Guest',
              email: user?.email
            }
          }
        });

        if (error) {
          setPaymentError(error.message);
        } else if (paymentIntent.status === 'succeeded') {
          // Confirm payment on backend
          await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/confirm-payment`, {
            paymentIntentId: paymentIntent.id
          });
          
          setPaymentSuccess(true);
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        }
      } catch (error) {
        setPaymentError(error.response?.data?.message || 'Payment failed');
      } finally {
        setIsSubmitting(false);
      }
    };

    if (paymentSuccess) {
      return (
        <div className="text-center py-12">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h3>
          <p className="text-gray-600 mb-6">
            Your consultation has been booked. We'll send you a confirmation email shortly.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to your dashboard...
          </p>
        </div>
      );
    }

    return (
      <form onSubmit={handlePayment} className="space-y-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Details
            </label>
            <div className="border border-gray-300 rounded-lg p-3">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {paymentError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              {paymentError}
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount:</span>
              <span className="text-2xl font-bold text-primary-600">
                ${serviceTypes.find(s => s.id === formData.serviceType)?.price}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!stripe || isSubmitting}
            className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing Payment...' : 'Complete Booking'}
          </button>
        </div>
      </form>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Service Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceTypes.map((service) => (
                  <div
                    key={service.id}
                    className={`card cursor-pointer transition-all ${
                      formData.serviceType === service.id
                        ? 'ring-2 ring-primary-500 bg-primary-50'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleInputChange('serviceType', service.id)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-gray-900">{service.name}</h4>
                      <span className="text-lg font-bold text-primary-600">${service.price}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                    <p className="text-xs text-gray-500">Duration: {service.duration}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {eventCategories.map((category) => (
                  <div
                    key={category.id}
                    className={`card cursor-pointer transition-all ${
                      formData.eventCategory === category.id
                        ? 'ring-2 ring-primary-500 bg-primary-50'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleInputChange('eventCategory', category.id)}
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">{category.name}</h4>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  value={formData.eventDetails.title}
                  onChange={(e) => handleInputChange('eventDetails.title', e.target.value)}
                  className="input"
                  placeholder="My Special Event"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date (if known)
                </label>
                <input
                  type="date"
                  value={formData.eventDetails.date}
                  onChange={(e) => handleInputChange('eventDetails.date', e.target.value)}
                  className="input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location/Venue
                </label>
                <input
                  type="text"
                  value={formData.eventDetails.location}
                  onChange={(e) => handleInputChange('eventDetails.location', e.target.value)}
                  className="input"
                  placeholder="Venue name or city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Guest Count
                </label>
                <input
                  type="number"
                  value={formData.eventDetails.guestCount}
                  onChange={(e) => handleInputChange('eventDetails.guestCount', e.target.value)}
                  className="input"
                  placeholder="50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range (Min)
                </label>
                <input
                  type="number"
                  value={formData.eventDetails.budget.min}
                  onChange={(e) => handleInputChange('eventDetails.budget.min', e.target.value)}
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
                  value={formData.eventDetails.budget.max}
                  onChange={(e) => handleInputChange('eventDetails.budget.max', e.target.value)}
                  className="input"
                  placeholder="15000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Description & Vision
              </label>
              <textarea
                rows={4}
                value={formData.eventDetails.description}
                onChange={(e) => handleInputChange('eventDetails.description', e.target.value)}
                className="textarea"
                placeholder="Describe your vision, theme, style preferences, and any specific requirements..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Consultation</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Consultation Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.consultationDate}
                onChange={(e) => handleInputChange('consultationDate', e.target.value)}
                className="input"
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="text-sm text-gray-500 mt-1">
                We'll confirm availability and may suggest alternative times if needed.
              </p>
            </div>

            <div className="card bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-4">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span>{serviceTypes.find(s => s.id === formData.serviceType)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span>{eventCategories.find(c => c.id === formData.eventCategory)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{serviceTypes.find(s => s.id === formData.serviceType)?.duration}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span>${serviceTypes.find(s => s.id === formData.serviceType)?.price}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return <PaymentForm />;

      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">
            Please sign in to your account to book a consultation.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="btn-primary w-full"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="btn-outline w-full"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      currentStep >= step.number
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-primary-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden sm:block w-16 h-0.5 ml-4 ${
                      currentStep > step.number ? 'bg-primary-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="card">
            {renderStepContent()}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </button>

              {currentStep < 4 && (
                <button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && (!formData.serviceType || !formData.eventCategory)) ||
                    (currentStep === 3 && !formData.consultationDate)
                  }
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Elements>
  );
};

export default BookingFlow;
