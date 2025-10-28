const Schedule = require("../Model/Schedule");
const User = require("../Model/User");

/**
 * Create a new schedule event
 * @route POST /api/schedule/create
 */
async function createScheduleEvent(req, res) {
  try {
    const {
      title,
      description,
      date,
      time,
      duration,
      location,
      type,
      attendees,
      studentId,
      department,
    } = req.body;

    // Validate required fields
    if (!title || !date) {
      return res.status(400).json({
        success: false,
        message: "Title and date are required",
      });
    }

    // Create schedule event
    const scheduleEvent = await Schedule.create({
      title,
      description,
      date: new Date(date),
      time: time || "TBD",
      duration: duration || "1 hour",
      location: location || "TBD",
      type: type || "Meeting",
      status: "Scheduled",
      attendees: attendees || [],
      studentId: studentId || null,
      department: department || null,
      createdBy: req.user._id,
    });

    await scheduleEvent.populate("createdBy", "personalDetails email");
    await scheduleEvent.populate("attendees", "personalDetails email");
    if (studentId) {
      await scheduleEvent.populate("studentId", "personalDetails email");
    }

    res.status(201).json({
      success: true,
      data: scheduleEvent,
      message: "Schedule event created successfully",
    });
  } catch (err) {
    console.error("Error creating schedule event:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Get all schedule events for the logged-in user
 * @route GET /api/schedule/my-events
 */
async function getMyScheduleEvents(req, res) {
  try {
    const userId = req.user._id;

    // Find events where user is creator, attendee, or the student
    const events = await Schedule.find({
      $or: [
        { createdBy: userId },
        { attendees: userId },
        { studentId: userId },
      ],
    })
      .populate("createdBy", "personalDetails email")
      .populate("attendees", "personalDetails email")
      .populate("studentId", "personalDetails email")
      .sort({ date: 1 });

    res.json({ success: true, data: events });
  } catch (err) {
    console.error("Error fetching schedule events:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Get schedule events by date range
 * @route GET /api/schedule/range
 */
async function getScheduleByDateRange(req, res) {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }

    const userId = req.user._id;

    const events = await Schedule.find({
      $or: [
        { createdBy: userId },
        { attendees: userId },
        { studentId: userId },
      ],
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
      .populate("createdBy", "personalDetails email")
      .populate("attendees", "personalDetails email")
      .populate("studentId", "personalDetails email")
      .sort({ date: 1 });

    res.json({ success: true, data: events });
  } catch (err) {
    console.error("Error fetching schedule by date range:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Get a specific schedule event by ID
 * @route GET /api/schedule/:id
 */
async function getScheduleEventById(req, res) {
  try {
    const { id } = req.params;

    const event = await Schedule.findById(id)
      .populate("createdBy", "personalDetails email")
      .populate("attendees", "personalDetails email")
      .populate("studentId", "personalDetails email");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Schedule event not found",
      });
    }

    res.json({ success: true, data: event });
  } catch (err) {
    console.error("Error fetching schedule event:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Update a schedule event
 * @route PUT /api/schedule/:id
 */
async function updateScheduleEvent(req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      date,
      time,
      duration,
      location,
      type,
      status,
      attendees,
      attendance,
    } = req.body;

    // Find event and verify user has permission
    const event = await Schedule.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Schedule event not found",
      });
    }

    // Only creator can update
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this event",
      });
    }

    // Update fields
    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = new Date(date);
    if (time) event.time = time;
    if (duration) event.duration = duration;
    if (location) event.location = location;
    if (type) event.type = type;
    if (status) event.status = status;
    if (attendees) event.attendees = attendees;
    if (attendance) event.attendance = attendance;

    await event.save();

    await event.populate("createdBy", "personalDetails email");
    await event.populate("attendees", "personalDetails email");
    if (event.studentId) {
      await event.populate("studentId", "personalDetails email");
    }

    res.json({
      success: true,
      data: event,
      message: "Schedule event updated successfully",
    });
  } catch (err) {
    console.error("Error updating schedule event:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Delete a schedule event
 * @route DELETE /api/schedule/:id
 */
async function deleteScheduleEvent(req, res) {
  try {
    const { id } = req.params;

    // Find event and verify user has permission
    const event = await Schedule.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Schedule event not found",
      });
    }

    // Only creator can delete
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this event",
      });
    }

    await Schedule.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Schedule event deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting schedule event:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Mark attendance for a schedule event
 * @route PUT /api/schedule/:id/attendance
 */
async function markAttendance(req, res) {
  try {
    const { id } = req.params;
    const { attendance } = req.body;

    if (!attendance || !["present", "absent"].includes(attendance)) {
      return res.status(400).json({
        success: false,
        message: "Valid attendance status (present/absent) is required",
      });
    }

    const event = await Schedule.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Schedule event not found",
      });
    }

    // Update attendance
    event.attendance = attendance;
    await event.save();

    res.json({
      success: true,
      data: event,
      message: "Attendance marked successfully",
    });
  } catch (err) {
    console.error("Error marking attendance:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Get upcoming events (for dashboard)
 * @route GET /api/schedule/upcoming
 */
async function getUpcomingEvents(req, res) {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 5;

    const events = await Schedule.find({
      $or: [
        { createdBy: userId },
        { attendees: userId },
        { studentId: userId },
      ],
      date: { $gte: new Date() },
    })
      .populate("createdBy", "personalDetails email")
      .populate("attendees", "personalDetails email")
      .populate("studentId", "personalDetails email")
      .sort({ date: 1 })
      .limit(limit);

    res.json({ success: true, data: events });
  } catch (err) {
    console.error("Error fetching upcoming events:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  createScheduleEvent,
  getMyScheduleEvents,
  getScheduleByDateRange,
  getScheduleEventById,
  updateScheduleEvent,
  deleteScheduleEvent,
  markAttendance,
  getUpcomingEvents,
};
