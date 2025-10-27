const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../config/database');
const requestLogger = require('../middleware/requestLogger');
const errorHandler = require('../middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "https://your-frontend-url.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/events', require('../routes/events'));
app.use('/api/bookings', require('../routes/bookings'));
app.use('/api/payments', require('../routes/payments'));
app.use('/api/chat', require('../routes/chat'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Event Planner API is running on Vercel',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Event Planner API',
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/auth',
      '/api/events',
      '/api/bookings',
      '/api/payments',
      '/api/chat'
    ]
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route not found: ${req.method} ${req.path}`,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/events',
      'POST /api/events',
      'GET /api/bookings',
      'POST /api/bookings',
      'POST /api/payments',
      'GET /api/chat'
    ]
  });
});

module.exports = app;
