const express = require("express");
const router = express.Router();
const {
  createAnnouncement,
  getMyAnnouncements,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  markAnnouncementAsViewed,
  toggleAnnouncementStatus,
} = require("../Controller/AnnouncementController");
const isLoggedIn = require("../middlewares/OAuth2IsLoggedIn");
const authorizedRoles = require("../middlewares/roleAuthenticator");
const { uploadDocuments } = require("../middlewares/upload");

// All routes require authentication
router.use(isLoggedIn);

// Create announcement (Guide, Faculty Coordinator, Admin)
router.post(
  "/create",
  authorizedRoles("Guide", "FacultyCoordinator", "Admin"),
  uploadDocuments,
  createAnnouncement
);

// Get user's relevant announcements
router.get("/my-announcements", getMyAnnouncements);

// Get all announcements (Admin, Faculty Coordinator)
router.get(
  "/all",
  authorizedRoles("Admin", "FacultyCoordinator"),
  getAllAnnouncements
);

// Get specific announcement
router.get("/:id", getAnnouncementById);

// Update announcement
router.put(
  "/:id",
  authorizedRoles("Guide", "FacultyCoordinator", "Admin"),
  uploadDocuments,
  updateAnnouncement
);

// Delete announcement
router.delete(
  "/:id",
  authorizedRoles("Guide", "FacultyCoordinator", "Admin"),
  deleteAnnouncement
);

// Mark announcement as viewed
router.post("/:id/view", markAnnouncementAsViewed);

// Toggle announcement active status
router.put(
  "/:id/toggle-active",
  authorizedRoles("Guide", "FacultyCoordinator", "Admin"),
  toggleAnnouncementStatus
);

module.exports = router;
