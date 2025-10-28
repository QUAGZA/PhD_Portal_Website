const express = require("express");
const router = express.Router();
const {
  getStudentCourses,
  getStudentAssignments,
  getStudentAnnouncements,
  getStudentProgress,
  getStudentResources,
  getStudentDashboardSummary,
} = require("../Controller/StudentDashboardController");
const isLoggedIn = require("../middlewares/OAuth2IsLoggedIn");
const authorizedRoles = require("../middlewares/roleAuthenticator");

// All routes require authentication and Student role
router.use(isLoggedIn);

// Get student's courses with progress
router.get("/courses", authorizedRoles("Student"), getStudentCourses);

// Get student's assignments
router.get("/assignments", authorizedRoles("Student"), getStudentAssignments);

// Get announcements
router.get("/announcements", authorizedRoles("Student"), getStudentAnnouncements);

// Get course progress overview
router.get("/progress", authorizedRoles("Student"), getStudentProgress);

// Get resources
router.get("/resources", authorizedRoles("Student"), getStudentResources);

// Get dashboard summary
router.get("/summary", authorizedRoles("Student"), getStudentDashboardSummary);

module.exports = router;
