const express = require("express");
const router = express.Router();
const {
  getAllAssignmentsByTheGuide,
  getListOfNonSubmissions,
  getAssignmentById,
  submitAssignment,
  gradeSubmission,
  createAssignment,
  getSubmissionsForAssignment,
  getAssignedAssignmentsBySelf,
  getMySubmissions,
  updateAssignment,
  deleteAssignment,
  resubmitAssignment,
} = require("../Controller/AssignmentController");
const isLoggedIn = require("../middlewares/OAuth2IsLoggedIn");
const { uploadAssignments } = require("../middlewares/upload");
const authorizedRoles = require("../middlewares/roleAuthenticator");

router.use(isLoggedIn);

// Student routes
router.get("/assignedByGuide", authorizedRoles("Student"), getAllAssignmentsByTheGuide);
router.post("/submit", authorizedRoles("Student"), uploadAssignments, submitAssignment);
router.get("/my-submissions", authorizedRoles("Student"), getMySubmissions);
router.put("/resubmit/:submissionId", authorizedRoles("Student"), uploadAssignments, resubmitAssignment);

// Guide routes
router.get("/assignedBySelf", authorizedRoles("Guide"), getAssignedAssignmentsBySelf);
router.post("/create", authorizedRoles("Guide"), uploadAssignments, createAssignment);
router.put("/:id", authorizedRoles("Guide"), uploadAssignments, updateAssignment);
router.delete("/:id", authorizedRoles("Guide"), deleteAssignment);
router.get("/nonSubmissions/:id", authorizedRoles("Guide"), getListOfNonSubmissions);
router.get("/submissions/:id", authorizedRoles("Guide", "FacultyCoordinator"), getSubmissionsForAssignment);
router.post("/grade", authorizedRoles("Guide"), gradeSubmission);

// Shared routes
router.get("/assignment/:id", getAssignmentById);

module.exports = router;
