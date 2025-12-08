/**
 * Application Configuration
 * Centralized configuration management using environment variables
 */
require("dotenv").config();

const config = {
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT, 10) || 9999,
    nodeEnv: process.env.NODE_ENV || "development",
    isDevelopment: (process.env.NODE_ENV || "development") === "development",
    isProduction: process.env.NODE_ENV === "production",
  },

  // Database Configuration
  database: {
    mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/PhDPortal",
  },

  // Session Configuration
  session: {
    secret: process.env.SESSION_SECRET || "your-session-secret",
    maxAge: parseInt(process.env.SESSION_MAX_AGE, 10) || 1000 * 60 * 60 * 24, // 24 hours default
    secure: process.env.SESSION_SECURE === "true",
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  },

  // Frontend URLs (for redirects)
  frontend: {
    baseUrl: process.env.FRONTEND_URL || "http://localhost:5173",
    registerPath: "/register",
    studentDashboard: "/student/dashboard",
    guideDashboard: "/guide/dashboard",
    facultyDashboard: "/faculty-coordinator/dashboard",
    adminDashboard: "/admin/dashboard",
  },

  // Google OAuth Configuration
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || "http://localhost:9999/auth/google/callback",
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10 * 1024 * 1024, // 10MB default
    allowedMimeTypes: [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    uploadDir: process.env.UPLOAD_DIR || "uploads",
  },

  // Pagination Defaults
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 100,
  },

  // Valid Roles
  roles: {
    valid: ["Student", "Guide", "FacultyCoordinator", "Admin"],
    default: "Student",
  },
};

/**
 * Get frontend URL with path
 * @param {string} path - Path to append to frontend base URL
 * @returns {string} Full frontend URL
 */
config.getFrontendUrl = (path = "") => {
  return `${config.frontend.baseUrl}${path}`;
};

/**
 * Get dashboard URL based on role
 * @param {string} role - User role
 * @returns {string} Dashboard URL for the role
 */
config.getDashboardUrl = (role) => {
  switch (role) {
    case "Student":
      return config.getFrontendUrl(config.frontend.studentDashboard);
    case "Guide":
      return config.getFrontendUrl(config.frontend.guideDashboard);
    case "FacultyCoordinator":
      return config.getFrontendUrl(config.frontend.facultyDashboard);
    case "Admin":
      return config.getFrontendUrl(config.frontend.adminDashboard);
    default:
      return config.getFrontendUrl(config.frontend.studentDashboard);
  }
};

/**
 * Validate that required environment variables are set
 */
config.validate = () => {
  const requiredVars = ["MONGO_URI", "SESSION_SECRET"];
  const optionalButWarned = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"];

  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.warn(`Warning: Missing required environment variables: ${missing.join(", ")}`);
    console.warn("Using default values where possible.");
  }

  optionalButWarned.forEach((varName) => {
    if (!process.env[varName]) {
      console.warn(`Warning: ${varName} is not set. Google OAuth will not work.`);
    }
  });

  return missing.length === 0;
};

module.exports = config;
