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
} = require("../Controller/AssignmentController");
const isLoggedIn = require("../middlewares/OAuth2IsLoggedIn");
const { uploadAssignments } = require("../middlewares/upload");

router.use(isLoggedIn);

router.get("/assignedByGuide", getAllAssignmentsByTheGuide);
router.get("/nonSubmissions/:id", getListOfNonSubmissions);
router.get("/assignment/:id", getAssignmentById);
router.post("/submit", uploadAssignments, submitAssignment);
router.post("/grade", gradeSubmission);
router.post("/create", uploadAssignments, createAssignment);
router.get("/submissions/:id", getSubmissionsForAssignment);
router.get("/assignedBySelf", getAssignedAssignmentsBySelf);

module.exports = router;
