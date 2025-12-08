module.exports = {
  testEnvironment: "node",
  verbose: true,
  testTimeout: 30000,
  collectCoverageFrom: [
    "Controller/**/*.js",
    "middlewares/**/*.js",
    "utility/**/*.js",
    "!**/node_modules/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  testMatch: ["**/__tests__/**/*.test.js", "**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.js"],
  modulePathIgnorePatterns: ["<rootDir>/node_modules/"],
};
