const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Event = require('../models/Event');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/event-planner-test';

describe('Events Routes', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    await mongoose.connect(MONGODB_URI);
    
    // Create admin user
    const adminResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        phone: '1234567890',
        role: 'admin'
      });
    adminToken = adminResponse.body.data.token;

    // Create regular user
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Regular User',
        email: 'user@example.com',
        password: 'password123',
        phone: '1234567890'
      });
    userToken = userResponse.body.data.token;
  });

  beforeEach(async () => {
    await Event.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Event.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/events', () => {
    it('should get all events', async () => {
      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/events', () => {
    it('should create event with admin token', async () => {
      const eventData = {
        title: 'Test Event',
        description: 'Test Description',
        category: 'wedding',
        services: ['planning', 'decoration'],
        pricing: {
          basePrice: 1000,
          currency: 'USD'
        }
      };

      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(eventData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(eventData.title);
    });

    it('should not create event without admin token', async () => {
      const eventData = {
        title: 'Test Event',
        description: 'Test Description',
        category: 'wedding'
      };

      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${userToken}`)
        .send(eventData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});
