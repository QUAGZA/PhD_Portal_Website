/**
 * Jest Test Setup
 * Common setup for all tests
 */

// Set test environment
process.env.NODE_ENV = "test";
process.env.PORT = "9998";
process.env.MONGO_URI = "mongodb://127.0.0.1:27017/PhDPortalTest";
process.env.SESSION_SECRET = "test-session-secret";
process.env.CORS_ORIGIN = "http://localhost:5173";
process.env.FRONTEND_URL = "http://localhost:5173";

// Increase timeout for async operations
jest.setTimeout(30000);

// Global afterAll to ensure clean exit
afterAll(async () => {
  // Allow time for any pending operations
  await new Promise((resolve) => setTimeout(resolve, 500));
});
