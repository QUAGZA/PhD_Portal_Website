const User = require("../Model/User");
const Assignment = require("../Model/Assignment");
const Submission = require("../Model/Submission");
const Schedule = require("../Model/Schedule");
const Announcement = require("../Model/Announcement");

/**
 * Get student's enrolled courses with progress
 * @route GET /api/student/dashboard/courses
 */
const getStudentCourses = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get student data
    const student = await User.findById(studentId)
      .select("programDetails personalDetails")
      .lean();

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get all assignments for this student to calculate course progress
    const assignments = await Assignment.find({ createdBy: req.user.guideId })
      .select("title courseCode courseName credits")
      .lean();

    // Get submissions for progress tracking
    const submissions = await Submission.find({ studentId })
      .select("assignmentId status")
      .lean();

    // Group assignments by course
    const courseMap = new Map();

    assignments.forEach((assignment) => {
      const courseKey = assignment.courseCode || assignment.courseName;
      if (!courseMap.has(courseKey)) {
        courseMap.set(courseKey, {
          courseCode: assignment.courseCode,
          courseName: assignment.courseName,
          credits: assignment.credits || 3,
          totalAssignments: 0,
          completedAssignments: 0,
          progress: 0,
        });
      }
      const course = courseMap.get(courseKey);
      course.totalAssignments++;
    });

    // Calculate completed assignments per course
    submissions.forEach((submission) => {
      const assignment = assignments.find(
        (a) => a._id.toString() === submission.assignmentId.toString()
      );
      if (assignment && submission.status === "submitted") {
        const courseKey = assignment.courseCode || assignment.courseName;
        const course = courseMap.get(courseKey);
        if (course) {
          course.completedAssignments++;
        }
      }
    });

    // Calculate progress percentages
    const courses = Array.from(courseMap.values()).map((course) => ({
      ...course,
      progress: course.totalAssignments
        ? Math.round((course.completedAssignments / course.totalAssignments) * 100)
        : 0,
      semester: student.programDetails?.semester || "Current Semester",
      faculty: student.programDetails?.department || "Department",
    }));

    res.json({ courses });
  } catch (error) {
    console.error("Error fetching student courses:", error);
    res.status(500).json({ message: "Failed to fetch courses", error: error.message });
  }
};

/**
 * Get student's assignments with status
 * @route GET /api/student/dashboard/assignments
 */
const getStudentAssignments = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get student's guide - guideId is nested in programDetails
    const student = await User.findById(studentId).select("programDetails.guideId").lean();

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get all assignments from the student's guide
    const guideId = student.programDetails?.guideId;
    const assignments = guideId
      ? await Assignment.find({ createdBy: guideId })
          .select("title description courseName deadline createdBy")
          .populate("createdBy", "personalDetails.firstName personalDetails.lastName")
          .sort({ deadline: 1 })
          .lean()
      : [];

    // Get student's submissions
    const submissions = await Submission.find({ studentId })
      .select("assignmentId status submittedAt grade")
      .lean();

    // Create submission map for quick lookup
    const submissionMap = new Map(
      submissions.map((sub) => [sub.assignmentId.toString(), sub])
    );

    // Combine assignments with submission status
    const assignmentsWithStatus = assignments.map((assignment) => {
      const submission = submissionMap.get(assignment._id.toString());
      const isPastDeadline = new Date(assignment.deadline) < new Date();

      return {
        id: assignment._id,
        title: assignment.title,
        course: assignment.courseName || "Course",
        dueDate: new Date(assignment.deadline).toISOString().split("T")[0],
        faculty: assignment.createdBy
          ? `${assignment.createdBy.personalDetails?.firstName || ""} ${
              assignment.createdBy.personalDetails?.lastName || ""
            }`.trim()
          : "Faculty",
        status: submission ? submission.status : isPastDeadline ? "overdue" : "pending",
        submittedAt: submission?.submittedAt,
        grade: submission?.grade,
      };
    });

    res.json({ assignments: assignmentsWithStatus });
  } catch (error) {
    console.error("Error fetching student assignments:", error);
    res.status(500).json({ message: "Failed to fetch assignments", error: error.message });
  }
};

/**
 * Get student's announcements
 * @route GET /api/student/dashboard/announcements
 */
const getStudentAnnouncements = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("roles programDetails");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userDepartment = user.programDetails?.department;

    // Build query for student announcements
    const query = {
      isActive: true,
      $or: [
        { targetAudience: "All" },
        { targetAudience: "Student" },
      ],
      $and: [
        {
          $or: [
            { expiryDate: null },
            { expiryDate: { $gte: new Date() } },
          ],
        },
      ],
    };

    // Add department filter if user has a department
    if (userDepartment) {
      query.$or.push({ department: userDepartment });
      query.$or.push({ department: null });
    }

    const announcements = await Announcement.find(query)
      .select("title content type priority createdAt")
      .sort({ priority: -1, createdAt: -1 })
      .limit(10)
      .lean();

    res.json({ announcements });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ message: "Failed to fetch announcements", error: error.message });
  }
};

/**
 * Get student's course progress overview
 * @route GET /api/student/dashboard/progress
 */
const getStudentProgress = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get student's guide - guideId is nested in programDetails
    const student = await User.findById(studentId).select("programDetails.guideId").lean();

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get all assignments
    const guideId = student.programDetails?.guideId;
    const assignments = guideId
      ? await Assignment.find({ createdBy: guideId })
          .select("courseName courseCode")
          .lean()
      : [];

    // Get submissions
    const submissions = await Submission.find({ studentId })
      .select("assignmentId status")
      .lean();

    // Group by course
    const courseProgress = new Map();

    assignments.forEach((assignment) => {
      const courseName = assignment.courseName || assignment.courseCode || "General";
      if (!courseProgress.has(courseName)) {
        courseProgress.set(courseName, {
          subject: courseName,
          total: 0,
          completed: 0,
          progress: 0,
        });
      }
      courseProgress.get(courseName).total++;
    });

    // Count completed assignments
    submissions.forEach((submission) => {
      const assignment = assignments.find(
        (a) => a._id.toString() === submission.assignmentId.toString()
      );
      if (assignment && submission.status === "submitted") {
        const courseName = assignment.courseName || assignment.courseCode || "General";
        const course = courseProgress.get(courseName);
        if (course) {
          course.completed++;
        }
      }
    });

    // Calculate progress percentages
    const progressData = Array.from(courseProgress.values()).map((course) => ({
      subject: course.subject,
      progress: course.total ? Math.round((course.completed / course.total) * 100) : 0,
    }));

    res.json({ progressData });
  } catch (error) {
    console.error("Error fetching student progress:", error);
    res.status(500).json({ message: "Failed to fetch progress", error: error.message });
  }
};

/**
 * Get student resources
 * @route GET /api/student/dashboard/resources
 */
const getStudentResources = async (req, res) => {
  try {
    // For now, return static resources
    // TODO: Create Resource model and fetch from database
    const resources = [
      {
        id: 1,
        title: "Visit E-library",
        type: "link",
        url: "/elibrary",
      },
      {
        id: 2,
        title: "Updated Syllabus",
        type: "document",
        url: "/syllabus",
      },
      {
        id: 3,
        title: "Course Resources",
        type: "folder",
        url: "/resources",
      },
      {
        id: 4,
        title: "Past Question Papers",
        type: "folder",
        url: "/question-papers",
      },
    ];

    res.json({ resources });
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ message: "Failed to fetch resources", error: error.message });
  }
};

/**
 * Get student dashboard summary
 * @route GET /api/student/dashboard/summary
 */
const getStudentDashboardSummary = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get student with guide info - guideId is nested in programDetails
    const student = await User.findById(studentId)
      .select("personalDetails programDetails")
      .populate("programDetails.guideId", "personalDetails")
      .lean();

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get all assignments from the guide
    const guideId = student.programDetails?.guideId;
    const totalAssignments = guideId
      ? await Assignment.countDocuments({ createdBy: guideId })
      : 0;

    // Get submissions
    const submissions = await Submission.find({ studentId }).lean();
    const submittedCount = submissions.filter((s) => s.status === "submitted").length;
    const pendingCount = totalAssignments - submittedCount;

    // Get upcoming schedule events
    const upcomingEvents = await Schedule.countDocuments({
      date: { $gte: new Date() },
      $or: [{ attendees: studentId }, { studentId }],
    });

    // Calculate overall progress
    const overallProgress = totalAssignments
      ? Math.round((submittedCount / totalAssignments) * 100)
      : 0;

    res.json({
      summary: {
        studentName: `${student.personalDetails?.firstName || ""} ${
          student.personalDetails?.lastName || ""
        }`.trim(),
        guideName: student.programDetails?.guideId
          ? `${student.programDetails.guideId.personalDetails?.firstName || ""} ${
              student.programDetails.guideId.personalDetails?.lastName || ""
            }`.trim()
          : "Not Assigned",
        totalAssignments,
        submittedAssignments: submittedCount,
        pendingAssignments: pendingCount,
        upcomingEvents,
        overallProgress,
        department: student.programDetails?.department || "N/A",
        program: student.programDetails?.program || "PhD",
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({ message: "Failed to fetch summary", error: error.message });
  }
};

module.exports = {
  getStudentCourses,
  getStudentAssignments,
  getStudentAnnouncements,
  getStudentProgress,
  getStudentResources,
  getStudentDashboardSummary,
};
