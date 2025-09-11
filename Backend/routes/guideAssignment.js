const express = require("express");
const router = express.Router();
const {
  assignGuide,
  unassignGuide,
  changeGuide,
  getGuides,
  getStudentsForGuide,
  getGuideForSpecificStudent,
  getAssignmentStats,
  getAllStudentsWithGuideStatus,
  getMyStudents,
  getMyGuide,
} = require("../Controller/GuideAssignmentController");
const isLoggedIn = require("../middlewares/OAuth2IsLoggedIn");
const authorizedRoles = require("../middlewares/roleAuthenticator");

// Apply authentication middleware for all routes
router.use(isLoggedIn);

// Admin and FacultyCoordinator routes for managing guide assignments
router.post(
  "/assign",
  authorizedRoles("Admin", "FacultyCoordinator"),
  assignGuide,
);
router.delete(
  "/unassign/:studentId",
  authorizedRoles("Admin", "FacultyCoordinator"),
  unassignGuide,
);
router.put(
  "/change/:studentId",
  authorizedRoles("Admin", "FacultyCoordinator"),
  changeGuide,
);
router.get(
  "/students",
  authorizedRoles("Admin", "FacultyCoordinator"),
  getAllStudentsWithGuideStatus,
);
router.get(
  "/stats",
  authorizedRoles("Admin", "FacultyCoordinator"),
  getAssignmentStats,
);

// Routes for getting guides and students (accessible by Admin, FacultyCoordinator and Guide)
router.get(
  "/guides",
  authorizedRoles("Admin", "FacultyCoordinator", "Guide"),
  getGuides,
);
router.get(
  "/guide/:guideId/students",
  authorizedRoles("Admin", "FacultyCoordinator", "Guide"),
  getStudentsForGuide,
);
router.get(
  "/student/:studentId/guide",
  authorizedRoles("Admin", "FacultyCoordinator", "Guide"),
  getGuideForSpecificStudent,
);

// Routes for current user (based on their role)
router.get("/my-students", authorizedRoles("Guide"), getMyStudents);
router.get("/my-guide", authorizedRoles("Student"), getMyGuide);

module.exports = router;
