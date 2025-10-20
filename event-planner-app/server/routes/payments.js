const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payments/create-payment-intent
// @desc    Create Stripe payment intent
// @access  Private
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    
    // Verify booking belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        bookingId: bookingId,
        userId: req.user.id
      }
    });
    
    // Update booking with payment intent ID
    booking.payment.stripePaymentIntentId = paymentIntent.id;
    booking.payment.amount = amount;
    await booking.save();
    
    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/payments/confirm-payment
// @desc    Confirm payment and update booking
// @access  Private
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Update booking payment status
      const booking = await Booking.findOneAndUpdate(
        { 
          'payment.stripePaymentIntentId': paymentIntentId,
          client: req.user.id 
        },
        {
          'payment.status': 'paid',
          'payment.paidAt': new Date(),
          status: 'confirmed'
        },
        { new: true }
      ).populate('client', 'name email phone');
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      res.json({
        success: true,
        booking,
        message: 'Payment confirmed successfully'
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Payment not successful' 
      });
    }
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/payments/webhook
// @desc    Stripe webhook endpoint
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      
      // Update booking status
      await Booking.findOneAndUpdate(
        { 'payment.stripePaymentIntentId': paymentIntent.id },
        {
          'payment.status': 'paid',
          'payment.paidAt': new Date(),
          status: 'confirmed'
        }
      );
      
      console.log('Payment succeeded:', paymentIntent.id);
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      
      // Update booking status
      await Booking.findOneAndUpdate(
        { 'payment.stripePaymentIntentId': failedPayment.id },
        { 'payment.status': 'failed' }
      );
      
      console.log('Payment failed:', failedPayment.id);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  res.json({ received: true });
});

// @route   GET /api/payments/booking/:id
// @desc    Get payment details for booking
// @access  Private
router.get('/booking/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check authorization
    if (req.user.role === 'client' && booking.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json({
      success: true,
      payment: booking.payment
    });
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
