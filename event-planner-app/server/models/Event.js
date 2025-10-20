const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['formal', 'casual', 'diy'],
    index: true
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  details: {
    location: String,
    date: Date,
    guestCount: Number,
    budget: {
      min: Number,
      max: Number
    },
    duration: String,
    specialRequirements: [String]
  },
  services: [{
    name: String,
    description: String,
    included: Boolean
  }],
  testimonial: {
    clientName: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    date: Date
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
eventSchema.index({ category: 1, isActive: 1 });
eventSchema.index({ isFeatured: 1, isActive: 1 });
eventSchema.index({ tags: 1 });
eventSchema.index({ 'details.date': 1 });

// Text search index
eventSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text'
});

module.exports = mongoose.model('Event', eventSchema);
