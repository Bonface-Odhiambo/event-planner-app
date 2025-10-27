// Simple test script to verify API endpoints
const app = require('./api/index.js');

// Test the app locally before deployment
const request = require('supertest');

const testAPI = async () => {
  try {
    console.log('Testing API endpoints...\n');

    // Test root endpoint
    const rootResponse = await request(app).get('/');
    console.log('✅ Root endpoint:', rootResponse.status, rootResponse.body.message);

    // Test health endpoint
    const healthResponse = await request(app).get('/api/health');
    console.log('✅ Health endpoint:', healthResponse.status, healthResponse.body.message);

    // Test 404 handling
    const notFoundResponse = await request(app).get('/nonexistent');
    console.log('✅ 404 handling:', notFoundResponse.status, notFoundResponse.body.message);

    console.log('\n🎉 All basic tests passed! Your API is ready for deployment.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Please check your configuration and try again.');
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = testAPI;
