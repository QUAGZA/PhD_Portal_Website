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
const { validateBody, validateParams, validateQuery } = require("../middlewares/validateRequest");
const { guideAssignmentSchemas, studentIdParamSchema, guideIdParamSchema, paginationSchema } = require("../middlewares/validation");

// Apply authentication middleware for all routes
router.use(isLoggedIn);

// Admin and FacultyCoordinator routes for managing guide assignments
router.post(
  "/assign",
  authorizedRoles("Admin", "FacultyCoordinator"),
  validateBody(guideAssignmentSchemas.assign),
  assignGuide,
);
router.delete(
  "/unassign/:studentId",
  authorizedRoles("Admin", "FacultyCoordinator"),
  validateParams(studentIdParamSchema),
  unassignGuide,
);
router.put(
  "/change/:studentId",
  authorizedRoles("Admin", "FacultyCoordinator"),
  validateParams(studentIdParamSchema),
  validateBody(guideAssignmentSchemas.changeGuide),
  changeGuide,
);
router.get(
  "/students",
  authorizedRoles("Admin", "FacultyCoordinator"),
  validateQuery(paginationSchema),
  getAllStudentsWithGuideStatus,
);
router.get(
  "/stats",
  authorizedRoles("Admin", "FacultyCoordinator"),
  getAssignmentStats,
);

// Routes for getting guides and students (accessible by Admin, FacultyCoordinator, Guide, and Student)
router.get(
  "/guides",
  authorizedRoles("Admin", "FacultyCoordinator", "Guide", "Student"),
  getGuides,
);
router.get(
  "/guide/:guideId/students",
  authorizedRoles("Admin", "FacultyCoordinator", "Guide"),
  validateParams(guideIdParamSchema),
  getStudentsForGuide,
);
router.get(
  "/student/:studentId/guide",
  authorizedRoles("Admin", "FacultyCoordinator", "Guide"),
  validateParams(studentIdParamSchema),
  getGuideForSpecificStudent,
);

// Routes for current user (based on their role)
router.get("/my-students", authorizedRoles("Guide"), getMyStudents);
router.get("/my-guide", authorizedRoles("Student"), getMyGuide);

module.exports = router;
