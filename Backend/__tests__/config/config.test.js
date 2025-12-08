/**
 * Configuration Tests
 */

describe("Config", () => {
  let originalEnv;

  beforeAll(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    // Reset environment
    process.env = { ...originalEnv };
    // Clear require cache to reload config
    jest.resetModules();
  });

  describe("Server Configuration", () => {
    it("should use PORT from environment", () => {
      process.env.PORT = "3000";
      const config = require("../../config/config");

      expect(config.server.port).toBe(3000);
    });

    it("should default to port 9999", () => {
      delete process.env.PORT;
      const config = require("../../config/config");

      expect(config.server.port).toBe(9999);
    });

    it("should detect development environment", () => {
      process.env.NODE_ENV = "development";
      const config = require("../../config/config");

      expect(config.server.isDevelopment).toBe(true);
      expect(config.server.isProduction).toBe(false);
    });

    it("should detect production environment", () => {
      process.env.NODE_ENV = "production";
      const config = require("../../config/config");

      expect(config.server.isDevelopment).toBe(false);
      expect(config.server.isProduction).toBe(true);
    });
  });

  describe("Database Configuration", () => {
    it("should use MONGO_URI from environment", () => {
      process.env.MONGO_URI = "mongodb://custom-host:27017/testdb";
      const config = require("../../config/config");

      expect(config.database.mongoUri).toBe("mongodb://custom-host:27017/testdb");
    });

    it("should have default MongoDB URI", () => {
      delete process.env.MONGO_URI;
      const config = require("../../config/config");

      expect(config.database.mongoUri).toBe("mongodb://127.0.0.1:27017/PhDPortal");
    });
  });

  describe("CORS Configuration", () => {
    it("should use CORS_ORIGIN from environment", () => {
      process.env.CORS_ORIGIN = "https://example.com";
      const config = require("../../config/config");

      expect(config.cors.origin).toBe("https://example.com");
    });

    it("should have credentials enabled", () => {
      const config = require("../../config/config");

      expect(config.cors.credentials).toBe(true);
    });
  });

  describe("Frontend URL Helper", () => {
    it("should build frontend URL with path", () => {
      process.env.FRONTEND_URL = "http://localhost:3000";
      const config = require("../../config/config");

      const url = config.getFrontendUrl("/dashboard");

      expect(url).toBe("http://localhost:3000/dashboard");
    });

    it("should return base URL without path", () => {
      process.env.FRONTEND_URL = "http://localhost:3000";
      const config = require("../../config/config");

      const url = config.getFrontendUrl();

      expect(url).toBe("http://localhost:3000");
    });
  });

  describe("Dashboard URL Helper", () => {
    beforeEach(() => {
      process.env.FRONTEND_URL = "http://localhost:5173";
    });

    it("should return student dashboard URL", () => {
      const config = require("../../config/config");

      const url = config.getDashboardUrl("Student");

      expect(url).toBe("http://localhost:5173/student/dashboard");
    });

    it("should return guide dashboard URL", () => {
      const config = require("../../config/config");

      const url = config.getDashboardUrl("Guide");

      expect(url).toBe("http://localhost:5173/guide/dashboard");
    });

    it("should return faculty coordinator dashboard URL", () => {
      const config = require("../../config/config");

      const url = config.getDashboardUrl("FacultyCoordinator");

      expect(url).toBe("http://localhost:5173/faculty-coordinator/dashboard");
    });

    it("should return admin dashboard URL", () => {
      const config = require("../../config/config");

      const url = config.getDashboardUrl("Admin");

      expect(url).toBe("http://localhost:5173/admin/dashboard");
    });

    it("should default to student dashboard for unknown role", () => {
      const config = require("../../config/config");

      const url = config.getDashboardUrl("Unknown");

      expect(url).toBe("http://localhost:5173/student/dashboard");
    });
  });

  describe("Validation", () => {
    it("should return true when required environment variables are set", () => {
      // These are set in the test setup
      const config = require("../../config/config");

      const isValid = config.validate();

      // Should return true because MONGO_URI and SESSION_SECRET are set in setup.js
      expect(isValid).toBe(true);
    });

    it("should have validate function that returns boolean", () => {
      const config = require("../../config/config");
      
      expect(typeof config.validate).toBe("function");
      expect(typeof config.validate()).toBe("boolean");
    });

    it("should check for required vars MONGO_URI and SESSION_SECRET", () => {
      // This test verifies the validate function checks the expected vars
      // by checking that it returns true when they're set (in setup.js)
      const config = require("../../config/config");
      
      // Verify the required vars are set in our test environment
      expect(process.env.MONGO_URI).toBeDefined();
      expect(process.env.SESSION_SECRET).toBeDefined();
      
      expect(config.validate()).toBe(true);
    });
  });

  describe("Valid Roles", () => {
    it("should have all valid roles defined", () => {
      const config = require("../../config/config");

      expect(config.roles.valid).toContain("Student");
      expect(config.roles.valid).toContain("Guide");
      expect(config.roles.valid).toContain("FacultyCoordinator");
      expect(config.roles.valid).toContain("Admin");
    });

    it("should have Student as default role", () => {
      const config = require("../../config/config");

      expect(config.roles.default).toBe("Student");
    });
  });
});
