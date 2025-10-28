const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getFacultyCoordinators,
  getRecentActivities,
  getSystemHealth,
  getUsers,
} = require("../Controller/AdminController");
const isLoggedIn = require("../middlewares/OAuth2IsLoggedIn");
const authorizedRoles = require("../middlewares/roleAuthenticator");

// Apply authentication middleware for all routes
router.use(isLoggedIn);
// Admin-only routes

router.get("/dashboard/stats", authorizedRoles("Admin"), getDashboardStats);
router.get(
  "/faculty-coordinators",
  authorizedRoles("Admin"),
  getFacultyCoordinators,
);
router.get("/activities", authorizedRoles("Admin"), getRecentActivities);
router.get("/system/health", authorizedRoles("Admin"), getSystemHealth);
router.get("/users", authorizedRoles("Admin"), getUsers);

// // Admin and FacultyCoordinator routes (temporary fix for 403 errors)
// router.get(
//   "/dashboard/stats",
//   authorizedRoles("Admin", "FacultyCoordinator"),
//   getDashboardStats,
// );
// router.get(
//   "/faculty-coordinators",
//   authorizedRoles("Admin", "FacultyCoordinator"),
//   getFacultyCoordinators,
// );
// router.get(
//   "/activities",
//   authorizedRoles("Admin", "FacultyCoordinator"),
//   getRecentActivities,
// );
// router.get(
//   "/system/health",
//   authorizedRoles("Admin", "FacultyCoordinator"),
//   getSystemHealth,
// );
// router.get("/users", authorizedRoles("Admin", "FacultyCoordinator"), getUsers);

module.exports = router;
