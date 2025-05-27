// Test setup file for Jest
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Set test environment
process.env.NODE_ENV = 'test';
// Use a test database
process.env.MONGODB_URI = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/auth-page-test-db';
// Set a test JWT secret
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_EXPIRES_IN = '1h';

// Function to connect to the test database
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to test database');
  } catch (error) {
    console.error('Error connecting to test database:', error);
    process.exit(1);
  }
}

// Function to disconnect from the test database
async function disconnectDB() {
  try {
    await mongoose.connection.close();
    console.log('Disconnected from test database');
  } catch (error) {
    console.error('Error disconnecting from test database:', error);
    process.exit(1);
  }
}

// Connect to the database before tests
beforeAll(async () => {
  await connectDB();
});

// Clear the database between tests
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Disconnect from the database after tests
afterAll(async () => {
  await disconnectDB();
});