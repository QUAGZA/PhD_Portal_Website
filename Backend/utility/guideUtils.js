const mongoose = require("mongoose");
const User = require("../Model/User");

/**
 * Assign a guide to a student
 * @param {String} studentId - MongoDB ObjectId of the student
 * @param {String} guideId - MongoDB ObjectId of the guide
 * @returns {Object} - Result object with success status and message
 */
const assignGuideToStudent = async (studentId, guideId) => {
  try {
    // Validate input
    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(guideId)) {
      return {
        success: false,
        message: "Invalid student ID or guide ID format"
      };
    }

    // Find student
    const student = await User.findById(studentId);
    if (!student) {
      return {
        success: false,
        message: "Student not found"
      };
    }

    // Check if user has Student role
    if (!student.roles || !student.roles.includes("Student")) {
      return {
        success: false,
        message: "User is not a student"
      };
    }

    // Find guide
    const guide = await User.findById(guideId);
    if (!guide) {
      return {
        success: false,
        message: "Guide not found"
      };
    }

    // Check if user has Guide role
    if (!guide.roles || !guide.roles.includes("Guide")) {
      return {
        success: false,
        message: "User is not a guide"
      };
    }

    // Update student's program details
    const updateData = {
      "programDetails.guideId": guideId,
      "programDetails.guideName": `${guide.personalDetails?.firstName || ""} ${guide.personalDetails?.lastName || ""}`.trim(),
      "programDetails.guideEmail": guide.email,
      "programDetails.guideAssignmentStatus": "Assigned",
      "programDetails.guideAssignmentDate": new Date()
    };

    await User.findByIdAndUpdate(studentId, updateData, { new: true });

    return {
      success: true,
      message: "Guide assigned successfully",
      assignment: {
        studentId,
        guideId,
        guideName: updateData["programDetails.guideName"],
        guideEmail: updateData["programDetails.guideEmail"],
        assignmentDate: updateData["programDetails.guideAssignmentDate"]
      }
    };

  } catch (error) {
    console.error("Error assigning guide to student:", error);
    return {
      success: false,
      message: "Error assigning guide to student",
      error: error.message
    };
  }
};

/**
 * Unassign a guide from a student
 * @param {String} studentId - MongoDB ObjectId of the student
 * @returns {Object} - Result object with success status and message
 */
const unassignGuideFromStudent = async (studentId) => {
  try {
    // Validate input
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return {
        success: false,
        message: "Invalid student ID format"
      };
    }

    // Find student
    const student = await User.findById(studentId);
    if (!student) {
      return {
        success: false,
        message: "Student not found"
      };
    }

    // Check if user has Student role
    if (!student.roles || !student.roles.includes("Student")) {
      return {
        success: false,
        message: "User is not a student"
      };
    }

    // Update student's program details
    const updateData = {
      "programDetails.guideId": null,
      "programDetails.guideName": "",
      "programDetails.guideEmail": "",
      "programDetails.guideAssignmentStatus": "Unassigned",
      "programDetails.guideAssignmentDate": new Date()
    };

    await User.findByIdAndUpdate(studentId, updateData, { new: true });

    return {
      success: true,
      message: "Guide unassigned successfully",
      studentId
    };

  } catch (error) {
    console.error("Error unassigning guide from student:", error);
    return {
      success: false,
      message: "Error unassigning guide from student",
      error: error.message
    };
  }
};

/**
 * Get all students assigned to a specific guide
 * @param {String} guideId - MongoDB ObjectId of the guide
 * @returns {Object} - Result object with students array
 */
const getStudentsByGuide = async (guideId) => {
  try {
    // Validate input
    if (!mongoose.Types.ObjectId.isValid(guideId)) {
      return {
        success: false,
        message: "Invalid guide ID format"
      };
    }

    // Find all students with this guide
    const students = await User.find({
      "programDetails.guideId": guideId,
      roles: "Student"
    }).select("-__v");

    return {
      success: true,
      students: students,
      count: students.length
    };

  } catch (error) {
    console.error("Error fetching students by guide:", error);
    return {
      success: false,
      message: "Error fetching students by guide",
      error: error.message
    };
  }
};

/**
 * Get all available guides (users with Guide role)
 * @returns {Object} - Result object with guides array
 */
const getAllGuides = async () => {
  try {
    const guides = await User.find({
      roles: "Guide"
    }).select("_id email personalDetails roles programDetails createdAt");

    return {
      success: true,
      guides: guides,
      count: guides.length
    };

  } catch (error) {
    console.error("Error fetching guides:", error);
    return {
      success: false,
      message: "Error fetching guides",
      error: error.message
    };
  }
};

/**
 * Get guide details for a student
 * @param {String} studentId - MongoDB ObjectId of the student
 * @returns {Object} - Result object with guide details
 */
const getGuideForStudent = async (studentId) => {
  try {
    // Validate input
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return {
        success: false,
        message: "Invalid student ID format"
      };
    }

    // Find student and populate guide details
    const student = await User.findById(studentId)
      .populate('programDetails.guideId', '_id email personalDetails roles')
      .select('programDetails');

    if (!student) {
      return {
        success: false,
        message: "Student not found"
      };
    }

    if (!student.programDetails.guideId) {
      return {
        success: true,
        message: "No guide assigned to this student",
        guide: null
      };
    }

    return {
      success: true,
      guide: student.programDetails.guideId,
      assignmentStatus: student.programDetails.guideAssignmentStatus,
      assignmentDate: student.programDetails.guideAssignmentDate
    };

  } catch (error) {
    console.error("Error fetching guide for student:", error);
    return {
      success: false,
      message: "Error fetching guide for student",
      error: error.message
    };
  }
};

/**
 * Get guide assignment statistics
 * @returns {Object} - Statistics about guide assignments
 */
const getGuideAssignmentStats = async () => {
  try {
    const totalStudents = await User.countDocuments({ roles: "Student" });
    const assignedStudents = await User.countDocuments({
      roles: "Student",
      "programDetails.guideId": { $exists: true, $ne: null }
    });
    const unassignedStudents = totalStudents - assignedStudents;
    const totalGuides = await User.countDocuments({ roles: "Guide" });

    // Get guide workload distribution
    const guideWorkload = await User.aggregate([
      { $match: { roles: "Student", "programDetails.guideId": { $exists: true, $ne: null } } },
      { $group: { _id: "$programDetails.guideId", studentCount: { $sum: 1 } } },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "guide" } },
      { $unwind: "$guide" },
      {
        $project: {
          guideId: "$_id",
          guideName: {
            $concat: [
              { $ifNull: ["$guide.personalDetails.firstName", ""] },
              " ",
              { $ifNull: ["$guide.personalDetails.lastName", ""] }
            ]
          },
          guideEmail: "$guide.email",
          studentCount: 1
        }
      },
      { $sort: { studentCount: -1 } }
    ]);

    return {
      success: true,
      stats: {
        totalStudents,
        assignedStudents,
        unassignedStudents,
        totalGuides,
        assignmentPercentage: totalStudents > 0 ? (assignedStudents / totalStudents * 100).toFixed(2) : 0,
        guideWorkload
      }
    };

  } catch (error) {
    console.error("Error fetching guide assignment stats:", error);
    return {
      success: false,
      message: "Error fetching guide assignment stats",
      error: error.message
    };
  }
};

/**
 * Change guide for a student (reassignment)
 * @param {String} studentId - MongoDB ObjectId of the student
 * @param {String} newGuideId - MongoDB ObjectId of the new guide
 * @returns {Object} - Result object with success status and message
 */
const changeGuideForStudent = async (studentId, newGuideId) => {
  try {
    // First unassign current guide
    const unassignResult = await unassignGuideFromStudent(studentId);
    if (!unassignResult.success) {
      return unassignResult;
    }

    // Then assign new guide
    const assignResult = await assignGuideToStudent(studentId, newGuideId);
    if (!assignResult.success) {
      return assignResult;
    }

    // Update assignment status to indicate it was changed
    await User.findByIdAndUpdate(studentId, {
      "programDetails.guideAssignmentStatus": "Changed"
    });

    return {
      success: true,
      message: "Guide changed successfully",
      assignment: assignResult.assignment
    };

  } catch (error) {
    console.error("Error changing guide for student:", error);
    return {
      success: false,
      message: "Error changing guide for student",
      error: error.message
    };
  }
};

module.exports = {
  assignGuideToStudent,
  unassignGuideFromStudent,
  getStudentsByGuide,
  getAllGuides,
  getGuideForStudent,
  getGuideAssignmentStats,
  changeGuideForStudent
};
