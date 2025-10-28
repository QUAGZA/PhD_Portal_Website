const express = require("express");
const router = express.Router();
const {
  getAssignedStudents,
  getGuideAssignments,
  getGuideSchedule,
  getDashboardSummary,
  getGuideProfile,
  getStudentProfile,
} = require("../Controller/GuideDashboardController");
const isLoggedIn = require("../middlewares/OAuth2IsLoggedIn");
const authorizedRoles = require("../middlewares/roleAuthenticator");

// All routes require authentication and Guide role
router.use(isLoggedIn);

// Get guide's assigned students
router.get("/students", authorizedRoles("Guide"), getAssignedStudents);

// Get guide's assignments with statistics
router.get("/assignments", authorizedRoles("Guide"), getGuideAssignments);

// Get guide's schedule events
router.get("/schedule", authorizedRoles("Guide"), getGuideSchedule);

// Get dashboard summary statistics
router.get("/summary", authorizedRoles("Guide"), getDashboardSummary);

// Get guide profile info
router.get("/profile", authorizedRoles("Guide"), getGuideProfile);

// Get detailed student profile by ID
router.get("/students/:studentId", authorizedRoles("Guide"), getStudentProfile);

module.exports = router;
