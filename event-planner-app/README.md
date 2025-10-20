# Event Planner MERN Application

A full-stack event planning application built with MongoDB, Express.js, React, and Node.js, featuring real-time chat, Stripe payments, and comprehensive event management.

## Features

### Frontend (React + Vite)
- **Modern UI**: Responsive design with Tailwind CSS
- **Event Categories**: Formal & Elegant, Casual & Social, DIY Events
- **Portfolio Gallery**: Filterable event showcase with modal views
- **Real-time Chat**: Live customer support with Socket.io
- **Booking System**: Multi-step booking flow with Stripe integration
- **Authentication**: JWT-based user authentication
- **Admin Dashboard**: Protected routes for event and booking management
- **User Dashboard**: Client booking management and profile settings

### Backend (Node.js + Express)
- **RESTful API**: Comprehensive endpoints for all features
- **Authentication**: JWT tokens with role-based access control
- **Real-time Communication**: Socket.io for live chat functionality
- **Payment Processing**: Stripe integration for secure payments
- **Database**: MongoDB with Mongoose ODM
- **File Upload**: Support for event images and attachments

### Core Features
- Event browsing with category filters
- Inquiry & live chat system
- Booking & payment flow (Stripe)
- Showcase of past events with images and descriptions
- Admin dashboard for managing events, bookings, and messages
- User roles: clients, admins, planners

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Payments**: Stripe
- **Real-time**: Socket.io
- **Styling**: Tailwind CSS with custom components

## Project Structure

```
event-planner-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth, Chat)
│   │   ├── pages/          # Page components
│   │   └── App.jsx         # Main app component
│   ├── public/             # Static assets
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/             # Database configuration
│   ├── middleware/         # Custom middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── server.js           # Main server file
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Stripe account for payments

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/event-planner

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

5. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
VITE_NODE_ENV=development
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Events
- `GET /api/events` - Get all events (with filtering)
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (Admin/Planner)
- `PUT /api/events/:id` - Update event (Admin/Planner)
- `DELETE /api/events/:id` - Delete event (Admin/Planner)

### Bookings
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `PUT /api/bookings/:id/status` - Update booking status (Admin)

### Payments
- `POST /api/payments/create-payment-intent` - Create Stripe payment intent
- `POST /api/payments/confirm-payment` - Confirm payment
- `POST /api/payments/webhook` - Stripe webhook handler

### Chat
- `GET /api/chat/:chatId` - Get chat messages
- `POST /api/chat/:chatId/messages` - Send message
- `GET /api/chat/active` - Get active chats (Admin)

## Database Models

### User
- Personal information (name, email, phone)
- Authentication (password, role)
- Preferences (event types, budget, notifications)

### Event
- Event details (title, description, category)
- Images and media
- Services and pricing
- Testimonials and reviews

### Booking
- Client and service information
- Event details and requirements
- Payment status and history
- Assigned planner

### Message
- Chat functionality
- Real-time messaging
- Message history and status

## User Roles

### Client
- Browse events and services
- Book consultations
- Manage bookings
- Chat with support

### Admin/Planner
- Manage all bookings
- Create and edit events
- Handle customer support
- View analytics and reports

## Development

### Running Tests
```bash
# Backend tests
cd server && npm test

# Frontend tests
cd client && npm test
```

### Building for Production
```bash
# Build frontend
cd client && npm run build

# Start production server
cd server && npm start
```

## Deployment

### Environment Setup
1. Set up MongoDB Atlas or production database
2. Configure Stripe production keys
3. Set production environment variables
4. Configure CORS for production domains

### Recommended Platforms
- **Frontend**: Vercel, Netlify
- **Backend**: Render, Heroku, Railway
- **Database**: MongoDB Atlas

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact:
- Email: support@elegantevents.com
- Phone: (555) 123-4567

## Acknowledgments

- Built with modern web technologies
- Designed for scalability and performance
- Focused on user experience and accessibility
