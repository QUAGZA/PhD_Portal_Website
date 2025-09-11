const {
  assignGuideToStudent,
  unassignGuideFromStudent,
  getStudentsByGuide,
  getAllGuides,
  getGuideForStudent,
  getGuideAssignmentStats,
  changeGuideForStudent
} = require("../utility/guideUtils");
const User = require("../Model/User");

/**
 * Assign a guide to a student
 */
const assignGuide = async (req, res) => {
  try {
    const { studentId, guideId } = req.body;

    if (!studentId || !guideId) {
      return res.status(400).json({
        success: false,
        message: "Student ID and Guide ID are required"
      });
    }

    const result = await assignGuideToStudent(studentId, guideId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Error in assignGuide:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Unassign a guide from a student
 */
const unassignGuide = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required"
      });
    }

    const result = await unassignGuideFromStudent(studentId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Error in unassignGuide:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Change guide for a student
 */
const changeGuide = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { newGuideId } = req.body;

    if (!studentId || !newGuideId) {
      return res.status(400).json({
        success: false,
        message: "Student ID and new Guide ID are required"
      });
    }

    const result = await changeGuideForStudent(studentId, newGuideId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Error in changeGuide:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Get all available guides
 */
const getGuides = async (req, res) => {
  try {
    const result = await getAllGuides();

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Error in getGuides:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Get students assigned to a specific guide
 */
const getStudentsForGuide = async (req, res) => {
  try {
    const { guideId } = req.params;

    if (!guideId) {
      return res.status(400).json({
        success: false,
        message: "Guide ID is required"
      });
    }

    const result = await getStudentsByGuide(guideId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Error in getStudentsForGuide:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Get guide details for a specific student
 */
const getGuideForSpecificStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required"
      });
    }

    const result = await getGuideForStudent(studentId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Error in getGuideForSpecificStudent:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Get assignment statistics
 */
const getAssignmentStats = async (req, res) => {
  try {
    const result = await getGuideAssignmentStats();

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Error in getAssignmentStats:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Get all students with their guide assignment status
 */
const getAllStudentsWithGuideStatus = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count
    const totalStudents = await User.countDocuments({ roles: "Student" });

    // Get students with pagination and populate guide details
    const students = await User.find({ roles: "Student" })
      .populate('programDetails.guideId', '_id email personalDetails')
      .select('_id email personalDetails programDetails roles createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Format the response
    const formattedStudents = students.map(student => ({
      _id: student._id,
      email: student.email,
      name: `${student.personalDetails?.firstName || ""} ${student.personalDetails?.lastName || ""}`.trim(),
      rollNumber: student.programDetails?.rollNumber,
      department: student.programDetails?.department,
      guide: student.programDetails?.guideId ? {
        _id: student.programDetails.guideId._id,
        email: student.programDetails.guideId.email,
        name: `${student.programDetails.guideId.personalDetails?.firstName || ""} ${student.programDetails.guideId.personalDetails?.lastName || ""}`.trim()
      } : null,
      guideAssignmentStatus: student.programDetails?.guideAssignmentStatus || "Unassigned",
      guideAssignmentDate: student.programDetails?.guideAssignmentDate,
      createdAt: student.createdAt
    }));

    res.json({
      success: true,
      students: formattedStudents,
      pagination: {
        total: totalStudents,
        page,
        pages: Math.ceil(totalStudents / limit),
        limit
      }
    });
  } catch (error) {
    console.error("Error in getAllStudentsWithGuideStatus:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Get current user's assigned students (for guides)
 */
const getMyStudents = async (req, res) => {
  try {
    const guideId = req.user._id;

    const result = await getStudentsByGuide(guideId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Format the response to include more details
    const formattedStudents = result.students.map(student => ({
      _id: student._id,
      email: student.email,
      name: `${student.personalDetails?.firstName || ""} ${student.personalDetails?.lastName || ""}`.trim(),
      rollNumber: student.programDetails?.rollNumber,
      department: student.programDetails?.department,
      enrollmentYear: student.programDetails?.enrollmentYear,
      semester: student.programDetails?.semester,
      domain: student.programDetails?.domain,
      topic: student.programDetails?.topic,
      guideAssignmentDate: student.programDetails?.guideAssignmentDate,
      status: student.programDetails?.status
    }));

    res.json({
      success: true,
      students: formattedStudents,
      count: formattedStudents.length
    });
  } catch (error) {
    console.error("Error in getMyStudents:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Get my guide (for students)
 */
const getMyGuide = async (req, res) => {
  try {
    const studentId = req.user._id;

    const result = await getGuideForStudent(studentId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Error in getMyGuide:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  assignGuide,
  unassignGuide,
  changeGuide,
  getGuides,
  getStudentsForGuide,
  getGuideForSpecificStudent,
  getAssignmentStats,
  getAllStudentsWithGuideStatus,
  getMyStudents,
  getMyGuide
};
