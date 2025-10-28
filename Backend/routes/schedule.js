const express = require("express");
const router = express.Router();
const {
  createScheduleEvent,
  getMyScheduleEvents,
  getScheduleByDateRange,
  getScheduleEventById,
  updateScheduleEvent,
  deleteScheduleEvent,
  markAttendance,
  getUpcomingEvents,
} = require("../Controller/ScheduleController");
const isLoggedIn = require("../middlewares/OAuth2IsLoggedIn");
const authorizedRoles = require("../middlewares/roleAuthenticator");

// All routes require authentication
router.use(isLoggedIn);

// Create schedule event (Guide and Faculty Coordinator)
router.post(
  "/create",
  authorizedRoles("Guide", "FacultyCoordinator", "Admin"),
  createScheduleEvent
);

// Get user's schedule events
router.get("/my-events", getMyScheduleEvents);

// Get events by date range
router.get("/range", getScheduleByDateRange);

// Get upcoming events
router.get("/upcoming", getUpcomingEvents);

// Get specific event by ID
router.get("/:id", getScheduleEventById);

// Update schedule event (only creator)
router.put(
  "/:id",
  authorizedRoles("Guide", "FacultyCoordinator", "Admin"),
  updateScheduleEvent
);

// Delete schedule event (only creator)
router.delete(
  "/:id",
  authorizedRoles("Guide", "FacultyCoordinator", "Admin"),
  deleteScheduleEvent
);

// Mark attendance
router.put(
  "/:id/attendance",
  authorizedRoles("Guide", "FacultyCoordinator", "Student"),
  markAttendance
);

module.exports = router;
