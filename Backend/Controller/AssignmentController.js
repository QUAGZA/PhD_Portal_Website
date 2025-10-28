const Assignment = require("../Model/Assignment");
const Submission = require("../Model/Submission");
const User = require("../Model/User");

async function createAssignment(req, res) {
  try {
    const { title, description, deadline } = req.body;

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

    const assignment = await Assignment.create({
      title,
      description,
      deadline,
      attachments,
      createdBy: req.user._id,
    });

    return res.status(201).json({ success: true, data: assignment });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getAllAssignmentsByTheGuide(req, res) {
  try {
    const student = await User.findById(req.user._id).populate(
      "programDetails.guideId",
    );

    if (!student || !student.programDetails?.guideId) {
      return res
        .status(404)
        .json({ success: false, message: "Guide not assigned" });
    }

    const assignments = await Assignment.find({
      createdBy: student.programDetails.guideId._id,
    }).populate("createdBy", "name email");

    return res.json({ success: true, data: assignments });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

//for guide
async function getAssignedAssignmentsBySelf(req, res) {
  try {
    const user = await User.findById(req.user._id);
    const assignments = await Assignment.find({ createdBy: user._id }).populate(
      "createdBy",
      "name email",
    );

    return res.json({ success: true, data: assignments });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getAssignmentById(req, res) {
  try {
    const assignment = await Assignment.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );
    if (!assignment)
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found" });

    res.json({ success: true, data: assignment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function submitAssignment(req, res) {
  try {
    const { assignmentId, comments } = req.body;

    // Check if assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    // Check if already submitted
    const existing = await Submission.findOne({
      assignment: assignmentId,
      student: req.user._id,
    });
    if (existing) {
      return res.status(400).json({ success: false, message: "Already submitted" });
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

    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.user._id,
      status: "submitted",
      comments: comments || "",
      attachments,
      submittedAt: new Date(),
    });

    // Populate student details for response
    await submission.populate("student", "personalDetails email");
    await submission.populate("assignment", "title description deadline");

    res.status(201).json({ success: true, data: submission, message: "Assignment submitted successfully" });
  } catch (err) {
    console.error("Error submitting assignment:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

async function gradeSubmission(req, res) {
  try {
    const { submissionId, grade, comments } = req.body;

    const submission = await Submission.findByIdAndUpdate(
      submissionId,
      { grade, comments, status: "graded" },
      { new: true },
    );

    if (!submission)
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });

    res.json({ success: true, data: submission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getSubmissionsForAssignment(req, res) {
  try {
    const submissions = await Submission.find({
      assignment: req.params.id,
    }).populate("student", "name email");

    res.json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getListOfNonSubmissions(req, res) {
  try {
    const assignmentId = req.params.id;

    const user = await User.findById(req.user._id);

    const allStudents = await User.find({
      roles: "Student",
      guideId: req.user._id,
    }).select("_id personalDetails.firstName personalDetails.lastName email");

    const submitted = await Submission.find({
      assignment: assignmentId,
    }).select("student");

    const submittedIds = submitted.map((s) => s.student.toString());

    const nonSubmitted = allStudents.filter(
      (s) => !submittedIds.includes(s._id.toString()),
    );

    res.json({ success: true, data: nonSubmitted });
  } catch (err) {
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
