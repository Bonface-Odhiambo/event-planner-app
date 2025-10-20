const express = require('express');
const Booking = require('../models/Booking');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/bookings
// @desc    Get user's bookings or all bookings (admin)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    
    // If not admin, only show user's bookings
    if (req.user.role === 'client') {
      query.client = req.user.id;
    } else if (req.user.role === 'planner') {
      query.assignedPlanner = req.user.id;
    }
    
    const { status, page = 1, limit = 10 } = req.query;
    
    if (status) {
      query.status = status;
    }
    
    const bookings = await Booking.find(query)
      .populate('client', 'name email phone')
      .populate('assignedPlanner', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Booking.countDocuments(query);
    
    res.json({
      success: true,
      bookings,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('client', 'name email phone')
      .populate('assignedPlanner', 'name email');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check authorization
    if (req.user.role === 'client' && booking.client._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (req.user.role === 'planner' && booking.assignedPlanner?._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      client: req.user.id
    };
    
    const booking = new Booking(bookingData);
    await booking.save();
    
    await booking.populate('client', 'name email phone');
    
    res.status(201).json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id
// @desc    Update booking
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check authorization
    if (req.user.role === 'client' && booking.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Clients can only update certain fields
    let updateData = req.body;
    if (req.user.role === 'client') {
      const allowedFields = ['eventDetails', 'notes.client'];
      updateData = {};
      allowedFields.forEach(field => {
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          if (req.body[parent] && req.body[parent][child]) {
            updateData[`${parent}.${child}`] = req.body[parent][child];
          }
        } else if (req.body[field]) {
          updateData[field] = req.body[field];
        }
      });
    }
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('client', 'name email phone')
     .populate('assignedPlanner', 'name email');
    
    res.json({
      success: true,
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/assign
// @desc    Assign planner to booking
// @access  Private (Admin)
router.put('/:id/assign', adminAuth, async (req, res) => {
  try {
    const { plannerId } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { assignedPlanner: plannerId },
      { new: true }
    ).populate('client', 'name email phone')
     .populate('assignedPlanner', 'name email');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Assign planner error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Private (Admin/Planner)
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('client', 'name email phone')
     .populate('assignedPlanner', 'name email');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
