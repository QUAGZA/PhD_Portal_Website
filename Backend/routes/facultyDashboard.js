const express = require("express");
const router = express.Router();
const {
  getFacultyStudents,
  getFacultyGuides,
  getFacultySchedule,
  getFacultyDashboardSummary,
} = require("../Controller/FacultyDashboardController");
const isLoggedIn = require("../middlewares/OAuth2IsLoggedIn");
const authorizedRoles = require("../middlewares/roleAuthenticator");

// All routes require authentication and FacultyCoordinator role
router.use(isLoggedIn);

// Get all students in faculty's department
router.get(
  "/students",
  authorizedRoles("FacultyCoordinator"),
  getFacultyStudents
);

// Get all guides in faculty's department
router.get("/guides", authorizedRoles("FacultyCoordinator"), getFacultyGuides);

// Get faculty schedule
router.get(
  "/schedule",
  authorizedRoles("FacultyCoordinator"),
  getFacultySchedule
);

// Get dashboard summary
router.get(
  "/summary",
  authorizedRoles("FacultyCoordinator"),
  getFacultyDashboardSummary
);

module.exports = router;
