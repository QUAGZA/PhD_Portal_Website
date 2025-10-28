const User = require("../Model/User");
const Assignment = require("../Model/Assignment");
const Submission = require("../Model/Submission");
const Schedule = require("../Model/Schedule");

/**
 * Get all students in faculty coordinator's department
 * @route GET /api/faculty/dashboard/students
 */
const getFacultyStudents = async (req, res) => {
  try {
    const facultyId = req.user._id;

    // Get faculty coordinator's department
    const faculty = await User.findById(facultyId)
      .select("programDetails")
      .lean();

    if (!faculty) {
      return res.status(404).json({ message: "Faculty coordinator not found" });
    }

    const department = faculty.programDetails?.department;

    // Get all students in the same department
    const students = await User.find({
      roles: "Student",
      "programDetails.department": department,
    })
      .select("personalDetails programDetails createdAt")
      .populate("programDetails.guideId", "personalDetails")
      .lean();

    // Calculate progress and attendance for each student
    const studentsWithMetrics = await Promise.all(
      students.map(async (student) => {
        const guideId = student.programDetails?.guideId;

        // Get total assignments for this student's guide
        const totalAssignments = guideId
          ? await Assignment.countDocuments({ createdBy: guideId })
          : 0;

        // Get submissions
        const submissions = await Submission.countDocuments({
          studentId: student._id,
          status: "submitted",
        });

        // Calculate progress
        const progress = totalAssignments
          ? Math.round((submissions / totalAssignments) * 100)
          : 0;

        // Get attendance from schedule
        const attendedEvents = await Schedule.countDocuments({
          $or: [{ attendees: student._id }, { studentId: student._id }],
          attendance: "present",
        });

        const totalEvents = await Schedule.countDocuments({
          $or: [{ attendees: student._id }, { studentId: student._id }],
        });

        const attendance = totalEvents
          ? Math.round((attendedEvents / totalEvents) * 100)
          : 0;

        return {
          id: student._id,
          name: `${student.personalDetails?.firstName || ""} ${
            student.personalDetails?.lastName || ""
          }`.trim(),
          progress,
          attendance,
          batch: student.programDetails?.batch || "N/A",
          program: student.programDetails?.program || "PhD",
          guideName: student.programDetails?.guideId
            ? `${student.programDetails.guideId.personalDetails?.firstName || ""} ${
                student.programDetails.guideId.personalDetails?.lastName || ""
              }`.trim()
            : "Not Assigned",
          enrollmentDate: student.createdAt,
        };
      })
    );

    res.json({ students: studentsWithMetrics });
  } catch (error) {
    console.error("Error fetching faculty students:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch students", error: error.message });
  }
};

/**
 * Get all guides in faculty coordinator's department
 * @route GET /api/faculty/dashboard/guides
 */
const getFacultyGuides = async (req, res) => {
  try {
    const facultyId = req.user._id;

    // Get faculty coordinator's department
    const faculty = await User.findById(facultyId)
      .select("programDetails")
      .lean();

    if (!faculty) {
      return res.status(404).json({ message: "Faculty coordinator not found" });
    }

    const department = faculty.programDetails?.department;

    // Get all guides in the same department
    const guides = await User.find({
      roles: "Guide",
      "programDetails.department": department,
    })
      .select("personalDetails programDetails")
      .lean();

    // Calculate metrics for each guide
    const guidesWithMetrics = await Promise.all(
      guides.map(async (guide) => {
        // Count assigned students
        const studentCount = await User.countDocuments({
          roles: "Student",
          guideId: guide._id,
        });

        // Get all assignments created by guide
        const totalAssignments = await Assignment.countDocuments({
          createdBy: guide._id,
        });

        // Get average student progress
        const students = await User.find({
          roles: "Student",
          guideId: guide._id,
        }).select("_id");

        let totalProgress = 0;
        if (students.length > 0) {
          for (const student of students) {
            const submissions = await Submission.countDocuments({
              studentId: student._id,
              status: "submitted",
            });
            const studentProgress = totalAssignments
              ? (submissions / totalAssignments) * 100
              : 0;
            totalProgress += studentProgress;
          }
        }

        const averageProgress = students.length
          ? Math.round(totalProgress / students.length)
          : 0;

        return {
          id: guide._id,
          name: `${guide.personalDetails?.firstName || ""} ${
            guide.personalDetails?.lastName || ""
          }`.trim(),
          progress: averageProgress,
          batch: guide.programDetails?.batch || "N/A",
          studentCount,
          totalAssignments,
          department: guide.programDetails?.department || department,
        };
      })
    );

    res.json({ guides: guidesWithMetrics });
  } catch (error) {
    console.error("Error fetching faculty guides:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch guides", error: error.message });
  }
};

/**
 * Get faculty coordinator's schedule
 * @route GET /api/faculty/dashboard/schedule
 */
const getFacultySchedule = async (req, res) => {
  try {
    const facultyId = req.user._id;

    // Get faculty's department to fetch relevant events
    const faculty = await User.findById(facultyId)
      .select("programDetails")
      .lean();

    const department = faculty?.programDetails?.department;

    // Get all schedule events for this faculty or their department
    const events = await Schedule.find({
      $or: [
        { createdBy: facultyId },
        { attendees: facultyId },
        { department: department },
      ],
    })
      .select("title description date time duration location type status")
      .sort({ date: 1 })
      .limit(10)
      .lean();

    const scheduleEvents = events.map((event) => ({
      id: event._id,
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().split("T")[0],
      time: event.time || "TBD",
      duration: event.duration || "1 hour",
      location: event.location || "TBD",
      type: event.type || "Meeting",
      status: event.status || "Scheduled",
    }));

    res.json({ events: scheduleEvents });
  } catch (error) {
    console.error("Error fetching faculty schedule:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch schedule", error: error.message });
  }
};

/**
 * Get faculty dashboard summary
 * @route GET /api/faculty/dashboard/summary
 */
const getFacultyDashboardSummary = async (req, res) => {
  try {
    const facultyId = req.user._id;

    // Get faculty coordinator info
    const faculty = await User.findById(facultyId)
      .select("personalDetails programDetails")
      .lean();

    if (!faculty) {
      return res.status(404).json({ message: "Faculty coordinator not found" });
    }

    const department = faculty.programDetails?.department;

    // Count students in department
    const totalStudents = await User.countDocuments({
      roles: "Student",
      "programDetails.department": department,
    });

    // Count guides in department
    const totalGuides = await User.countDocuments({
      roles: "Guide",
      "programDetails.department": department,
    });

    // Count assigned vs unassigned students
    const assignedStudents = await User.countDocuments({
      roles: "Student",
      "programDetails.department": department,
      guideId: { $exists: true, $ne: null },
    });

    const unassignedStudents = totalStudents - assignedStudents;

    // Get upcoming events count
    const upcomingEvents = await Schedule.countDocuments({
      $or: [
        { createdBy: facultyId },
        { attendees: facultyId },
        { department: department },
      ],
      date: { $gte: new Date() },
    });

    res.json({
      summary: {
        facultyName: `${faculty.personalDetails?.firstName || ""} ${
          faculty.personalDetails?.lastName || ""
        }`.trim(),
        department: department || "N/A",
        totalStudents,
        totalGuides,
        assignedStudents,
        unassignedStudents,
        upcomingEvents,
        assignmentPercentage: totalStudents
          ? Math.round((assignedStudents / totalStudents) * 100)
          : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching faculty dashboard summary:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch summary", error: error.message });
  }
};

module.exports = {
  getFacultyStudents,
  getFacultyGuides,
  getFacultySchedule,
  getFacultyDashboardSummary,
};
