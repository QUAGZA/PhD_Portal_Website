const User = require("../Model/User");
const { normalizeUserRoles } = require("../utility/roleUtils");

/**
 * Get comprehensive dashboard statistics
 */
const getDashboardStats = async (req, res) => {
  try {
    // Get user counts by role
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ roles: "Student" });
    const totalGuides = await User.countDocuments({ roles: "Guide" });
    const totalFacultyCoordinators = await User.countDocuments({ roles: "FacultyCoordinator" });
    const totalAdmins = await User.countDocuments({ roles: "Admin" });

    // Get guide assignment statistics
    const assignedStudents = await User.countDocuments({
      roles: "Student",
      "programDetails.guideId": { $exists: true, $ne: null }
    });
    const unassignedStudents = totalStudents - assignedStudents;

    // Get registration completion statistics
    const completedRegistrations = await User.countDocuments({
      registrationComplete: true
    });
    const incompleteRegistrations = totalUsers - completedRegistrations;

    // Get users by department (for students)
    const departmentDistribution = await User.aggregate([
      { $match: { roles: "Student", "programDetails.department": { $exists: true, $ne: "" } } },
      { $group: { _id: "$programDetails.department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

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
          department: "$guide.programDetails.department",
          studentCount: 1
        }
      },
      { $sort: { studentCount: -1 } },
      { $limit: 10 }
    ]);

    const stats = {
      totalUsers,
      totalStudents,
      totalGuides,
      totalFacultyCoordinators,
      totalAdmins,
      assignedStudents,
      unassignedStudents,
      completedRegistrations,
      incompleteRegistrations,
      recentRegistrations,
      assignmentPercentage: totalStudents > 0 ? ((assignedStudents / totalStudents) * 100).toFixed(1) : 0,
      registrationPercentage: totalUsers > 0 ? ((completedRegistrations / totalUsers) * 100).toFixed(1) : 0,
      departmentDistribution,
      guideWorkload
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard statistics",
      error: error.message
    });
  }
};

/**
 * Get faculty coordinators with detailed information
 */
const getFacultyCoordinators = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const department = req.query.department || "";

    const skip = (page - 1) * limit;

    // Build search query
    let searchQuery = { roles: "FacultyCoordinator" };

    if (search) {
      searchQuery.$or = [
        { email: { $regex: search, $options: "i" } },
        { "personalDetails.firstName": { $regex: search, $options: "i" } },
        { "personalDetails.lastName": { $regex: search, $options: "i" } }
      ];
    }

    if (department) {
      searchQuery["programDetails.department"] = { $regex: department, $options: "i" };
    }

    // Get total count for pagination
    const totalFacultyCoordinators = await User.countDocuments(searchQuery);

    // Get faculty coordinators with pagination
    const facultyCoordinators = await User.find(searchQuery)
      .select("-__v -employmentDetails -academicQualifications")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get student counts for each faculty coordinator (if they are also guides)
    const facultyCoordinatorIds = facultyCoordinators.map(fc => fc._id);
    const studentCounts = await User.aggregate([
      {
        $match: {
          roles: "Student",
          "programDetails.guideId": { $in: facultyCoordinatorIds }
        }
      },
      { $group: { _id: "$programDetails.guideId", studentCount: { $sum: 1 } } }
    ]);

    const studentCountMap = {};
    studentCounts.forEach(sc => {
      studentCountMap[sc._id.toString()] = sc.studentCount;
    });

    // Format the response
    const formattedFacultyCoordinators = facultyCoordinators.map(fc => {
      const normalized = normalizeUserRoles(fc);
      return {
        ...normalized,
        studentCount: studentCountMap[fc._id.toString()] || 0,
        isAlsoGuide: normalized.roles.includes("Guide"),
        fullName: `${normalized.personalDetails?.firstName || ""} ${normalized.personalDetails?.lastName || ""}`.trim(),
        status: normalized.registrationComplete ? "Active" : "Pending"
      };
    });

    res.json({
      success: true,
      facultyCoordinators: formattedFacultyCoordinators,
      pagination: {
        total: totalFacultyCoordinators,
        page,
        pages: Math.ceil(totalFacultyCoordinators / limit),
        limit
      }
    });
  } catch (error) {
    console.error("Error fetching faculty coordinators:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching faculty coordinators",
      error: error.message
    });
  }
};

/**
 * Get recent activities/logs
 */
const getRecentActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get recent user registrations
    const recentUsers = await User.find()
      .select("email personalDetails roles createdAt registrationComplete")
      .sort({ createdAt: -1 })
      .limit(limit);

    // Get recent guide assignments
    const recentAssignments = await User.find({
      roles: "Student",
      "programDetails.guideId": { $exists: true, $ne: null },
      "programDetails.guideAssignmentDate": { $exists: true }
    })
      .populate("programDetails.guideId", "personalDetails email")
      .select("personalDetails programDetails")
      .sort({ "programDetails.guideAssignmentDate": -1 })
      .limit(limit);

    // Format activities
    const activities = [];

    // Add user registration activities
    recentUsers.forEach(user => {
      activities.push({
        id: `user_${user._id}`,
        type: "user_registration",
        title: "New User Registration",
        description: `${user.personalDetails?.firstName || "User"} ${user.personalDetails?.lastName || ""} registered as ${user.roles.join(", ")}`,
        timestamp: user.createdAt,
        status: user.registrationComplete ? "completed" : "pending",
        user: {
          name: `${user.personalDetails?.firstName || ""} ${user.personalDetails?.lastName || ""}`.trim(),
          email: user.email,
          roles: user.roles
        }
      });
    });

    // Add guide assignment activities
    recentAssignments.forEach(assignment => {
      if (assignment.programDetails?.guideId) {
        activities.push({
          id: `assignment_${assignment._id}`,
          type: "guide_assignment",
          title: "Guide Assignment",
          description: `${assignment.personalDetails?.firstName || "Student"} assigned to ${assignment.programDetails.guideId.personalDetails?.firstName || "Guide"}`,
          timestamp: assignment.programDetails.guideAssignmentDate,
          status: assignment.programDetails.guideAssignmentStatus?.toLowerCase() || "assigned",
          student: {
            name: `${assignment.personalDetails?.firstName || ""} ${assignment.personalDetails?.lastName || ""}`.trim(),
            rollNumber: assignment.programDetails?.rollNumber
          },
          guide: {
            name: `${assignment.programDetails.guideId.personalDetails?.firstName || ""} ${assignment.programDetails.guideId.personalDetails?.lastName || ""}`.trim(),
            email: assignment.programDetails.guideId.email
          }
        });
      }
    });

    // Sort all activities by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      activities: activities.slice(0, limit)
    });
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching recent activities",
      error: error.message
    });
  }
};

/**
 * Get system health and performance metrics
 */
const getSystemHealth = async (req, res) => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get registration trends
    const dailyRegistrations = await User.countDocuments({
      createdAt: { $gte: oneDayAgo }
    });

    const weeklyRegistrations = await User.countDocuments({
      createdAt: { $gte: oneWeekAgo }
    });

    const monthlyRegistrations = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    });

    // Get completion rates
    const totalUsers = await User.countDocuments();
    const completedProfiles = await User.countDocuments({
      registrationComplete: true
    });

    // Get assignment trends
    const recentAssignments = await User.countDocuments({
      roles: "Student",
      "programDetails.guideAssignmentDate": { $gte: oneWeekAgo }
    });

    // Database size estimation (approximate)
    const avgDocSize = 2000; // Approximate bytes per user document
    const estimatedDbSize = totalUsers * avgDocSize;

    const health = {
      status: "healthy",
      uptime: process.uptime(),
      registrationTrends: {
        daily: dailyRegistrations,
        weekly: weeklyRegistrations,
        monthly: monthlyRegistrations
      },
      completionRate: totalUsers > 0 ? ((completedProfiles / totalUsers) * 100).toFixed(1) : 0,
      recentAssignments,
      systemMetrics: {
        totalUsers,
        estimatedDbSize: Math.round(estimatedDbSize / 1024 / 1024), // MB
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version,
        platform: process.platform
      }
    };

    res.json({
      success: true,
      health
    });
  } catch (error) {
    console.error("Error fetching system health:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching system health",
      error: error.message
    });
  }
};

/**
 * Get users with advanced filtering and search
 */
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const role = req.query.role || "";
    const department = req.query.department || "";
    const status = req.query.status || "";

    const skip = (page - 1) * limit;

    // Build search query
    let searchQuery = {};

    if (search) {
      searchQuery.$or = [
        { email: { $regex: search, $options: "i" } },
        { "personalDetails.firstName": { $regex: search, $options: "i" } },
        { "personalDetails.lastName": { $regex: search, $options: "i" } },
        { "programDetails.rollNumber": { $regex: search, $options: "i" } }
      ];
    }

    if (role) {
      searchQuery.roles = role;
    }

    if (department) {
      searchQuery["programDetails.department"] = { $regex: department, $options: "i" };
    }

    if (status === "completed") {
      searchQuery.registrationComplete = true;
    } else if (status === "pending") {
      searchQuery.registrationComplete = false;
    }

    // Get total count for pagination
    const totalUsers = await User.countDocuments(searchQuery);

    // Get users with pagination
    const users = await User.find(searchQuery)
      .populate("programDetails.guideId", "personalDetails email")
      .select("-__v -employmentDetails -academicQualifications")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Format the response
    const formattedUsers = users.map(user => {
      const normalized = normalizeUserRoles(user);
      return {
        ...normalized,
        fullName: `${normalized.personalDetails?.firstName || ""} ${normalized.personalDetails?.lastName || ""}`.trim(),
        status: normalized.registrationComplete ? "Completed" : "Pending",
        primaryRole: normalized.roles[0],
        guide: normalized.programDetails?.guideId ? {
          name: `${normalized.programDetails.guideId.personalDetails?.firstName || ""} ${normalized.programDetails.guideId.personalDetails?.lastName || ""}`.trim(),
          email: normalized.programDetails.guideId.email
        } : null
      };
    });

    res.json({
      success: true,
      users: formattedUsers,
      pagination: {
        total: totalUsers,
        page,
        pages: Math.ceil(totalUsers / limit),
        limit
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getFacultyCoordinators,
  getRecentActivities,
  getSystemHealth,
  getUsers
};
