const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['consultation', 'full-planning', 'partial-planning', 'diy-assistance']
  },
  eventCategory: {
    type: String,
    required: true,
    enum: ['formal', 'casual', 'diy']
  },
  eventDetails: {
    title: String,
    date: Date,
    location: String,
    guestCount: Number,
    budget: {
      min: Number,
      max: Number
    },
    description: String,
    specialRequirements: [String]
  },
  consultationDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  payment: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    stripePaymentIntentId: String,
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: Date
  },
  assignedPlanner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    client: String,
    planner: String,
    admin: String
  },
  followUp: {
    required: { type: Boolean, default: true },
    date: Date,
    completed: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Indexes
bookingSchema.index({ client: 1, status: 1 });
bookingSchema.index({ consultationDate: 1 });
bookingSchema.index({ assignedPlanner: 1, status: 1 });
bookingSchema.index({ 'payment.status': 1 });

module.exports = mongoose.model('Booking', bookingSchema);
