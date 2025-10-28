const User = require("../Model/User");
const Assignment = require("../Model/Assignment");
const Submission = require("../Model/Submission");
const Schedule = require("../Model/Schedule");
const { normalizeUserRoles } = require("../utility/roleUtils");

/**
 * Get guide's assigned students with their progress
 */
const getAssignedStudents = async (req, res) => {
  try {
    const guideId = req.user._id;

    // Find all students assigned to this guide
    const students = await User.find({
      "programDetails.guideId": guideId,
      roles: "Student",
    })
      .select(
        "personalDetails programDetails email registrationComplete createdAt"
      )
      .sort({ createdAt: -1 });

    if (!students || students.length === 0) {
      return res.json({
        students: [],
        message: "No students assigned yet",
      });
    }

    // Get all assignments created by this guide
    const assignments = await Assignment.find({ createdBy: guideId });
    const assignmentIds = assignments.map((a) => a._id);

    // Calculate progress and attendance for each student
    const studentsWithProgress = await Promise.all(
      students.map(async (student) => {
        // Get submissions for this student
        const submissions = await Submission.find({
          student: student._id,
          assignment: { $in: assignmentIds },
        });

        // Calculate progress (percentage of assignments submitted)
        const progress =
          assignments.length > 0
            ? Math.round((submissions.length / assignments.length) * 100)
            : 0;

        // Calculate attendance (based on schedule attendance)
        const scheduleEvents = await Schedule.find({
          "attendees.userId": student._id,
          status: { $in: ["Completed"] },
        });

        const attendedEvents = scheduleEvents.filter((event) => {
          const attendee = event.attendees.find(
            (a) => a.userId && a.userId.toString() === student._id.toString()
          );
          return attendee && attendee.attendance === "Present";
        });

        const attendance =
          scheduleEvents.length > 0
            ? Math.round((attendedEvents.length / scheduleEvents.length) * 100)
            : 100; // Default to 100% if no events yet

        return {
          id: student._id,
          name: `${student.personalDetails?.firstName || ""} ${student.personalDetails?.lastName || ""}`.trim() || "Unknown",
          email: student.email,
          batch: student.programDetails?.semester
            ? `Batch-${student.programDetails.semester}`
            : "Batch-Unknown",
          enrollmentYear: student.programDetails?.enrollmentYear || "N/A",
          department: student.programDetails?.department || "N/A",
          progress,
          attendance,
          registrationComplete: student.registrationComplete,
        };
      })
    );

    res.json({
      students: studentsWithProgress,
      count: studentsWithProgress.length,
    });
  } catch (error) {
    console.error("Error fetching assigned students:", error);
    res.status(500).json({
      message: "Error fetching assigned students",
      error: error.message,
    });
  }
};

/**
 * Get guide's assignments with submission statistics
 */
const getGuideAssignments = async (req, res) => {
  try {
    const guideId = req.user._id;

    // Get all assignments created by this guide
    const assignments = await Assignment.find({ createdBy: guideId })
      .select("title description deadline attachments createdAt updatedAt")
      .sort({ createdAt: -1 });

    if (!assignments || assignments.length === 0) {
      return res.json({
        assignments: [],
        message: "No assignments created yet",
      });
    }

    // Get assigned students count
    const studentsCount = await User.countDocuments({
      "programDetails.guideId": guideId,
      roles: "Student",
    });

    // Get submission statistics for each assignment
    const assignmentsWithStats = await Promise.all(
      assignments.map(async (assignment) => {
        const submissions = await Submission.find({
          assignment: assignment._id,
          status: "submitted",
        });

        // Check if deadline has passed
        const isPastDeadline = new Date() > new Date(assignment.deadline);
        const status = isPastDeadline ? "locked" : "unlocked";

        return {
          id: assignment._id,
          title: assignment.title,
          description: assignment.description,
          uploadedDate: assignment.createdAt.toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          deadline: new Date(assignment.deadline).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          status,
          submissions: submissions.length,
          totalStudents: studentsCount,
          attachments: assignment.attachments || [],
        };
      })
    );

    res.json({
      assignments: assignmentsWithStats,
      count: assignmentsWithStats.length,
    });
  } catch (error) {
    console.error("Error fetching guide assignments:", error);
    res.status(500).json({
      message: "Error fetching assignments",
      error: error.message,
    });
  }
};

/**
 * Get guide's schedule events for a specific week
 */
const getGuideSchedule = async (req, res) => {
  try {
    const guideId = req.user._id;

    // Get week start and end from query params or use current week
    const weekStart = req.query.weekStart
      ? new Date(req.query.weekStart)
      : getStartOfWeek(new Date());

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Find all schedule events where guide is organizer or attendee
    const scheduleEvents = await Schedule.find({
      $or: [
        { organizer: guideId },
        { "attendees.userId": guideId }
      ],
      date: {
        $gte: weekStart,
        $lte: weekEnd,
      },
      status: { $ne: "Cancelled" }
    })
      .populate("organizer", "personalDetails email")
      .populate("attendees.userId", "personalDetails email")
      .sort({ date: 1, startTime: 1 });

    // Map events to calendar format
    const eventsByDate = {};

    scheduleEvents.forEach((event) => {
      const dateKey = event.date.toISOString().split("T")[0];

      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = [];
      }

      // Determine event type
      let eventType = "other";
      const title = event.title.toLowerCase();

      if (title.includes("test") || title.includes("exam")) {
        eventType = "test";
      } else if (title.includes("deadline") || title.includes("submission")) {
        eventType = "deadline";
      } else if (title.includes("check") || title.includes("review") || title.includes("progress")) {
        eventType = "check";
      }

      eventsByDate[dateKey].push({
        id: event._id,
        title: event.title,
        type: eventType,
        description: event.description,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event.location,
        status: event.status,
      });
    });

    res.json({
      events: eventsByDate,
      weekStart: weekStart.toISOString().split("T")[0],
      weekEnd: weekEnd.toISOString().split("T")[0],
    });
  } catch (error) {
    console.error("Error fetching guide schedule:", error);
    res.status(500).json({
      message: "Error fetching schedule",
      error: error.message,
    });
  }
};

/**
 * Get dashboard summary statistics
 */
const getDashboardSummary = async (req, res) => {
  try {
    const guideId = req.user._id;

    // Get student count
    const studentCount = await User.countDocuments({
      "programDetails.guideId": guideId,
      roles: "Student",
    });

    // Get assignment count
    const assignmentCount = await Assignment.countDocuments({
      createdBy: guideId,
    });

    // Get upcoming events count
    const upcomingEventsCount = await Schedule.countDocuments({
      $or: [
        { organizer: guideId },
        { "attendees.userId": guideId }
      ],
      date: { $gte: new Date() },
      status: { $in: ["Scheduled", "In Progress"] },
    });

    // Get pending submissions count
    const assignments = await Assignment.find({ createdBy: guideId });
    const assignmentIds = assignments.map((a) => a._id);

    const pendingSubmissionsCount = await Submission.countDocuments({
      assignment: { $in: assignmentIds },
      status: "pending",
    });

    res.json({
      summary: {
        studentCount,
        assignmentCount,
        upcomingEventsCount,
        pendingSubmissionsCount,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({
      message: "Error fetching dashboard summary",
      error: error.message,
    });
  }
};

/**
 * Get guide profile info
 */
const getGuideProfile = async (req, res) => {
  try {
    const guideId = req.user._id;

    const guide = await User.findById(guideId)
      .select("personalDetails email programDetails roles");

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    const normalizedGuide = normalizeUserRoles(guide);

    res.json({
      profile: {
        name: `${guide.personalDetails?.title || ""} ${guide.personalDetails?.firstName || ""} ${guide.personalDetails?.lastName || ""}`.trim() || "Educator",
        email: guide.email,
        department: guide.programDetails?.department || "N/A",
        roles: normalizedGuide.roles,
      },
    });
  } catch (error) {
    console.error("Error fetching guide profile:", error);
    res.status(500).json({
      message: "Error fetching guide profile",
      error: error.message,
    });
  }
};

/**
 * Get detailed student profile by ID
 */
const getStudentProfile = async (req, res) => {
  try {
    const guideId = req.user._id;
    const { studentId } = req.params;

    // Find student and verify they're assigned to this guide
    const student = await User.findOne({
      _id: studentId,
      "programDetails.guideId": guideId,
      roles: "Student",
    }).select("-__v");

    if (!student) {
      return res.status(404).json({
        message: "Student not found or not assigned to you",
      });
    }

    // Get student's assignments submissions
    const assignments = await Assignment.find({ createdBy: guideId });
    const assignmentIds = assignments.map((a) => a._id);

    const submissions = await Submission.find({
      student: studentId,
      assignment: { $in: assignmentIds },
    }).populate("assignment", "title deadline");

    // Calculate progress
    const progress =
      assignments.length > 0
        ? Math.round((submissions.length / assignments.length) * 100)
        : 0;

    // Get attendance from schedule
    const scheduleEvents = await Schedule.find({
      "attendees.userId": studentId,
    });

    const attendedCount = scheduleEvents.filter((event) => {
      const attendee = event.attendees.find(
        (a) => a.userId && a.userId.toString() === studentId
      );
      return attendee && attendee.attendance === "Present";
    }).length;

    // Format assignments with submission status
    const assignmentDetails = assignments.map((assignment) => {
      const submission = submissions.find(
        (s) => s.assignment._id.toString() === assignment._id.toString()
      );

      return {
        id: assignment._id,
        title: assignment.title,
        status: submission ? submission.status : "pending",
        deadline: new Date(assignment.deadline).toLocaleDateString("en-US"),
        submittedAt: submission?.submittedAt
          ? new Date(submission.submittedAt).toLocaleDateString("en-US")
          : null,
        grade: submission?.grade || null,
      };
    });

    const profileData = {
      id: student._id,
      name: `${student.personalDetails?.title || ""} ${student.personalDetails?.firstName || ""} ${student.personalDetails?.middleName || ""} ${student.personalDetails?.lastName || ""}`.trim(),
      email: student.email,
      enrollmentId: student.programDetails?.rollNumber || "N/A",
      dob: student.personalDetails?.contacts?.mobile || "N/A",
      phone: student.personalDetails?.contacts?.mobile || "N/A",
      alternatePhone: student.personalDetails?.contacts?.alternateMobile || "N/A",
      primaryEmail: student.personalDetails?.contacts?.primaryEmail || student.email,
      alternateEmail: student.personalDetails?.contacts?.alternateEmail || "N/A",
      department: student.programDetails?.department || "N/A",
      institute: student.programDetails?.institute || "N/A",
      enrollmentYear: student.programDetails?.enrollmentYear || "N/A",
      semester: student.programDetails?.semester || "N/A",
      domain: student.programDetails?.domain || "N/A",
      topic: student.programDetails?.topic || "N/A",
      researchStatus: student.programDetails?.status || "Ongoing",
      researchDescription: student.programDetails?.researchDescription || "N/A",
      bonds: student.programDetails?.bonds || "N/A",
      scholarship: student.programDetails?.scholarship || "N/A",
      assignments: assignmentDetails,
      progress,
      attendance: {
        total: scheduleEvents.length,
        attended: attendedCount,
        percentage:
          scheduleEvents.length > 0
            ? Math.round((attendedCount / scheduleEvents.length) * 100)
            : 100,
      },
      registrationComplete: student.registrationComplete,
    };

    res.json({ student: profileData });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({
      message: "Error fetching student profile",
      error: error.message,
    });
  }
};

// Helper function to get start of week (Sunday)
function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

module.exports = {
  getAssignedStudents,
  getGuideAssignments,
  getGuideSchedule,
  getDashboardSummary,
  getGuideProfile,
  getStudentProfile,
};
