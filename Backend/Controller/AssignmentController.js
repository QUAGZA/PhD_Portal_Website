const Assignment = require("../Model/Assignment");
const Submission = require("../Model/Submission");
const User = require("../Model/User");

/**
 * Create assignment (Guide only)
 * Assignment is automatically visible to all students of this guide
 */
async function createAssignment(req, res) {
  try {
    const { title, description, deadline, assignedTo } = req.body;
    const guideId = req.user._id;

    // Get guide details to extract department
    const guide = await User.findById(guideId);
    if (!guide || !guide.roles.includes("Guide")) {
      return res
        .status(403)
        .json({ success: false, message: "Only guides can create assignments" });
    }

    // Handle file attachments
    const attachments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        attachments.push({
          filename: file.originalname,
          path: file.filename,
          mimetype: file.mimetype,
          size: file.size,
        });
      });
    }

    // Create assignment
    const assignment = await Assignment.create({
      title,
      description,
      deadline,
      attachments,
      createdBy: guideId,
      department: guide.programDetails?.department,
      assignedTo: assignedTo || [], // Empty array means visible to all students
    });

    // Populate guide info
    await assignment.populate("createdBy", "personalDetails email");

    return res.status(201).json({
      success: true,
      data: assignment,
      message: "Assignment created successfully"
    });
  } catch (err) {
    console.error("Error creating assignment:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Get all assignments by student's guide (Student only)
 * Returns assignments created by the student's assigned guide
 */
async function getAllAssignmentsByTheGuide(req, res) {
  try {
    const studentId = req.user._id;

    // Find student and get their guide
    const student = await User.findById(studentId);

    if (!student || !student.roles.includes("Student")) {
      return res
        .status(403)
        .json({ success: false, message: "Only students can access this" });
    }

    if (!student.programDetails?.guideId) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No guide assigned yet. Please contact your faculty coordinator."
        });
    }

    const guideId = student.programDetails.guideId;

    // Get all active assignments created by the guide
    // Either not specifically assigned OR assigned to this student
    const assignments = await Assignment.find({
      createdBy: guideId,
      status: "active",
      $or: [
        { assignedTo: { $size: 0 } }, // No specific students = visible to all
        { assignedTo: studentId }, // Specifically assigned to this student
      ],
    })
      .populate("createdBy", "personalDetails email programDetails")
      .sort({ deadline: 1 });

    // For each assignment, check if student has submitted
    const assignmentsWithStatus = await Promise.all(
      assignments.map(async (assignment) => {
        const submission = await Submission.findOne({
          assignment: assignment._id,
          student: studentId,
        });

        return {
          ...assignment.toObject(),
          submissionStatus: submission ? submission.status : "not_submitted",
          submissionId: submission ? submission._id : null,
          submittedAt: submission ? submission.submittedAt : null,
          grade: submission ? submission.grade : null,
        };
      })
    );

    return res.json({
      success: true,
      data: assignmentsWithStatus,
      count: assignmentsWithStatus.length
    });
  } catch (err) {
    console.error("Error fetching student assignments:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Get assignments created by the guide (Guide only)
 * Returns all assignments created by the logged-in guide
 */
async function getAssignedAssignmentsBySelf(req, res) {
  try {
    const guideId = req.user._id;

    // Verify user is a guide
    const user = await User.findById(guideId);
    if (!user || !user.roles.includes("Guide")) {
      return res
        .status(403)
        .json({ success: false, message: "Only guides can access this" });
    }

    // Get all assignments created by this guide
    const assignments = await Assignment.find({ createdBy: guideId })
      .populate("createdBy", "personalDetails email programDetails")
      .populate("assignedTo", "personalDetails email programDetails")
      .sort({ createdAt: -1 });

    // Get submission statistics for each assignment
    const assignmentsWithStats = await Promise.all(
      assignments.map(async (assignment) => {
        // Count total submissions
        const totalSubmissions = await Submission.countDocuments({
          assignment: assignment._id,
          status: { $in: ["submitted", "graded"] },
        });

        // Count graded submissions
        const gradedSubmissions = await Submission.countDocuments({
          assignment: assignment._id,
          status: "graded",
        });

        // Get total students who should submit
        let totalStudents;
        if (assignment.assignedTo && assignment.assignedTo.length > 0) {
          totalStudents = assignment.assignedTo.length;
        } else {
          // Assignment is for all students of this guide
          totalStudents = await User.countDocuments({
            "programDetails.guideId": guideId,
            roles: "Student",
          });
        }

        return {
          ...assignment.toObject(),
          stats: {
            totalStudents,
            totalSubmissions,
            gradedSubmissions,
            pendingSubmissions: totalStudents - totalSubmissions,
            pendingGrading: totalSubmissions - gradedSubmissions,
          },
        };
      })
    );

    return res.json({
      success: true,
      data: assignmentsWithStats,
      count: assignmentsWithStats.length
    });
  } catch (err) {
    console.error("Error fetching guide assignments:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Get assignment by ID
 * Accessible by guides, students, faculty coordinators, and admins
 */
async function getAssignmentById(req, res) {
  try {
    const assignmentId = req.params.id;
    const userId = req.user._id;
    const userRoles = req.user.roles;

    const assignment = await Assignment.findById(assignmentId)
      .populate("createdBy", "personalDetails email programDetails")
      .populate("assignedTo", "personalDetails email");

    if (!assignment) {
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found" });
    }

    // Authorization checks
    if (userRoles.includes("Student")) {
      // Student can only see if it's from their guide
      const student = await User.findById(userId);
      if (
        assignment.createdBy._id.toString() !==
        student.programDetails?.guideId?.toString()
      ) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied" });
      }

      // Check if student has submitted
      const submission = await Submission.findOne({
        assignment: assignmentId,
        student: userId,
      });

      return res.json({
        success: true,
        data: {
          ...assignment.toObject(),
          submissionStatus: submission ? submission.status : "not_submitted",
          submission: submission || null,
        },
      });
    } else if (userRoles.includes("Guide")) {
      // Guide can only see their own assignments
      if (assignment.createdBy._id.toString() !== userId.toString()) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied" });
      }

      // Get submission count
      const submissionCount = await Submission.countDocuments({
        assignment: assignmentId,
      });

      return res.json({
        success: true,
        data: {
          ...assignment.toObject(),
          submissionCount,
        },
      });
    } else if (
      userRoles.includes("FacultyCoordinator") ||
      userRoles.includes("Admin")
    ) {
      // Faculty and Admin can see all assignments in their scope
      return res.json({ success: true, data: assignment });
    }

    res.json({ success: true, data: assignment });
  } catch (err) {
    console.error("Error fetching assignment:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Submit assignment (Student only)
 * Student submits their work for an assignment
 */
async function submitAssignment(req, res) {
  try {
    const { assignmentId, comments } = req.body;
    const studentId = req.user._id;

    // Verify user is a student
    const student = await User.findById(studentId);
    if (!student || !student.roles.includes("Student")) {
      return res
        .status(403)
        .json({ success: false, message: "Only students can submit assignments" });
    }

    // Check if assignment exists
    const assignment = await Assignment.findById(assignmentId).populate("createdBy");
    if (!assignment) {
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found" });
    }

    // Verify assignment is from student's guide
    if (
      assignment.createdBy._id.toString() !==
      student.programDetails?.guideId?.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only submit assignments from your assigned guide",
      });
    }

    // Check if already submitted
    const existing = await Submission.findOne({
      assignment: assignmentId,
      student: studentId,
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Assignment already submitted. Use resubmit if you need to update.",
      });
    }

    // Handle file attachments
    const attachments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        attachments.push({
          filename: file.originalname,
          path: file.filename,
          mimetype: file.mimetype,
          size: file.size,
        });
      });
    }

    // Determine if submission is late
    const isLate = new Date() > new Date(assignment.deadline);

    // Create submission
    const submission = await Submission.create({
      assignment: assignmentId,
      student: studentId,
      status: isLate ? "late" : "submitted",
      comments: comments || "",
      attachments,
      submittedAt: new Date(),
    });

    // Populate related data
    await submission.populate("student", "personalDetails email programDetails");
    await submission.populate("assignment", "title description deadline createdBy");
    await submission.populate({
      path: "assignment",
      populate: {
        path: "createdBy",
        select: "personalDetails email",
      },
    });

    res.status(201).json({
      success: true,
      data: submission,
      message: isLate
        ? "Assignment submitted successfully (late submission)"
        : "Assignment submitted successfully",
    });
  } catch (err) {
    console.error("Error submitting assignment:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Grade submission (Guide only)
 * Guide grades a student's submission
 */
async function gradeSubmission(req, res) {
  try {
    const { submissionId, grade, comments, feedback } = req.body;
    const guideId = req.user._id;

    // Find submission and verify it belongs to guide's assignment
    const submission = await Submission.findById(submissionId)
      .populate("assignment")
      .populate("student", "personalDetails email");

    if (!submission) {
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });
    }

    // Verify assignment was created by this guide
    if (submission.assignment.createdBy.toString() !== guideId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only grade submissions for your own assignments",
      });
    }

    // Update submission
    submission.grade = grade;
    submission.comments = comments || submission.comments;
    submission.feedback = feedback || "";
    submission.status = "graded";
    submission.gradedAt = new Date();
    submission.gradedBy = guideId;

    await submission.save();

    // Populate guide info
    await submission.populate("gradedBy", "personalDetails email");

    res.json({
      success: true,
      data: submission,
      message: "Submission graded successfully",
    });
  } catch (err) {
    console.error("Error grading submission:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Get submissions for an assignment (Guide/Faculty/Admin)
 * Returns all submissions for a specific assignment
 */
async function getSubmissionsForAssignment(req, res) {
  try {
    const assignmentId = req.params.id;
    const userId = req.user._id;
    const userRoles = req.user.roles;

    // Find assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found" });
    }

    // Authorization: only guide who created it, faculty in same dept, or admin
    if (userRoles.includes("Guide")) {
      if (assignment.createdBy.toString() !== userId.toString()) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied" });
      }
    } else if (userRoles.includes("FacultyCoordinator")) {
      const faculty = await User.findById(userId);
      if (assignment.department !== faculty.programDetails?.department) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied" });
      }
    } else if (!userRoles.includes("Admin")) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied" });
    }

    // Get all submissions
    const submissions = await Submission.find({ assignment: assignmentId })
      .populate("student", "personalDetails email programDetails")
      .populate("gradedBy", "personalDetails email")
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      data: submissions,
      count: submissions.length,
    });
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Get list of students who haven't submitted (Guide only)
 * Returns students assigned to the guide who haven't submitted
 */
async function getListOfNonSubmissions(req, res) {
  try {
    const assignmentId = req.params.id;
    const guideId = req.user._id;

    // Verify assignment belongs to this guide
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found" });
    }

    if (assignment.createdBy.toString() !== guideId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only view submissions for your own assignments",
      });
    }

    // Get all students assigned to this guide
    const allStudents = await User.find({
      roles: "Student",
      "programDetails.guideId": guideId,
    }).select("_id personalDetails email programDetails");

    // If assignment is specifically assigned, filter those students
    let targetStudents = allStudents;
    if (assignment.assignedTo && assignment.assignedTo.length > 0) {
      const assignedIds = assignment.assignedTo.map((id) => id.toString());
      targetStudents = allStudents.filter((s) =>
        assignedIds.includes(s._id.toString())
      );
    }

    // Get students who have submitted
    const submitted = await Submission.find({
      assignment: assignmentId,
    }).select("student");

    const submittedIds = submitted.map((s) => s.student.toString());

    // Filter out students who have submitted
    const nonSubmitted = targetStudents.filter(
      (s) => !submittedIds.includes(s._id.toString())
    );

    // Format response
    const formattedNonSubmitted = nonSubmitted.map((student) => ({
      _id: student._id,
      name: `${student.personalDetails?.firstName || ""} ${student.personalDetails?.lastName || ""}`.trim(),
      email: student.email,
      rollNumber: student.programDetails?.rollNumber || "N/A",
      department: student.programDetails?.department || "N/A",
    }));

    res.json({
      success: true,
      data: formattedNonSubmitted,
      count: formattedNonSubmitted.length,
      totalStudents: targetStudents.length,
    });
  } catch (err) {
    console.error("Error fetching non-submissions:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Get student's own submissions
 * @route GET /api/assignments/my-submissions
 */
async function getMySubmissions(req, res) {
  try {
    const submissions = await Submission.find({ student: req.user._id })
      .populate("assignment", "title description deadline createdBy")
      .populate({
        path: "assignment",
        populate: { path: "createdBy", select: "personalDetails" },
      })
      .sort({ submittedAt: -1 });

    res.json({ success: true, data: submissions });
  } catch (err) {
    console.error("Error fetching student submissions:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Update assignment
 * @route PUT /api/assignments/:id
 */
async function updateAssignment(req, res) {
  try {
    const { id } = req.params;
    const { title, description, deadline, courseName, courseCode, credits } = req.body;

    // Verify assignment belongs to the guide
    const assignment = await Assignment.findOne({ _id: id, createdBy: req.user._id });
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found or unauthorized" });
    }

    // Update fields
    if (title) assignment.title = title;
    if (description) assignment.description = description;
    if (deadline) assignment.deadline = deadline;
    if (courseName) assignment.courseName = courseName;
    if (courseCode) assignment.courseCode = courseCode;
    if (credits !== undefined) assignment.credits = credits;

    // Handle new file attachments
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        assignment.attachments.push({
          filename: file.originalname,
          path: file.filename,
          mimetype: file.mimetype,
          size: file.size,
        });
      });
    }

    await assignment.save();

    res.json({ success: true, data: assignment, message: "Assignment updated successfully" });
  } catch (err) {
    console.error("Error updating assignment:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Delete assignment
 * @route DELETE /api/assignments/:id
 */
async function deleteAssignment(req, res) {
  try {
    const { id } = req.params;

    // Verify assignment belongs to the guide
    const assignment = await Assignment.findOne({ _id: id, createdBy: req.user._id });
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found or unauthorized" });
    }

    // Delete all submissions for this assignment
    await Submission.deleteMany({ assignment: id });

    // Delete the assignment
    await Assignment.findByIdAndDelete(id);

    res.json({ success: true, message: "Assignment and related submissions deleted successfully" });
  } catch (err) {
    console.error("Error deleting assignment:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Resubmit assignment (for students who need to revise)
 * @route PUT /api/assignments/resubmit/:submissionId
 */
async function resubmitAssignment(req, res) {
  try {
    const { submissionId } = req.params;
    const { comments } = req.body;

    // Find submission and verify it belongs to the student
    const submission = await Submission.findOne({
      _id: submissionId,
      student: req.user._id,
    });

    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found or unauthorized" });
    }

    // Handle new file attachments
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        submission.attachments.push({
          filename: file.originalname,
          path: file.filename,
          mimetype: file.mimetype,
          size: file.size,
        });
      });
    }

    // Update submission
    submission.comments = comments || submission.comments;
    submission.status = "submitted";
    submission.submittedAt = new Date();
    submission.grade = undefined; // Reset grade on resubmission

    await submission.save();

    await submission.populate("student", "personalDetails email");
    await submission.populate("assignment", "title description deadline");

    res.json({ success: true, data: submission, message: "Assignment resubmitted successfully" });
  } catch (err) {
    console.error("Error resubmitting assignment:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getSubmissionsForAssignment,
  getAllAssignmentsByTheGuide,
  createAssignment,
  gradeSubmission,
  submitAssignment,
  getAssignmentById,
  getAssignedAssignmentsBySelf,
  getListOfNonSubmissions,
  getMySubmissions,
  updateAssignment,
  deleteAssignment,
  resubmitAssignment,
};
