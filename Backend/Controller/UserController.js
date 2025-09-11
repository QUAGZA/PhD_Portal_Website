const User = require("../Model/User");
const {
  normalizeUserRoles,
  addRole,
  removeRole,
} = require("../utility/roleUtils");

/**
 * Get all users with pagination
 */
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalUsers = await User.countDocuments();

    // Get users with pagination
    const users = await User.find({})
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Normalize roles for all users
    const normalizedUsers = users.map((user) => normalizeUserRoles(user));

    res.json({
      users: normalizedUsers,
      pagination: {
        total: totalUsers,
        page,
        pages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

/**
 * Get user by ID
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Normalize user roles
    const normalizedUser = normalizeUserRoles(user);

    res.json({ user: normalizedUser });
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

/**
 * Add a role to a user
 */
const addRoleToUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    // Validate role
    const validRoles = ["Student", "Guide", "FacultyCoordinator", "Admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
        validRoles,
      });
    }

    // Find user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get updated roles
    const updatedRoles = addRole(user, role);

    // Update user
    user.roles = updatedRoles;
    await user.save();

    res.json({
      message: `Role "${role}" added to user successfully`,
      user: normalizeUserRoles(user),
    });
  } catch (error) {
    console.error("Error adding role to user:", error);
    res
      .status(500)
      .json({ message: "Error adding role to user", error: error.message });
  }
};

/**
 * Remove a role from a user
 */
const removeRoleFromUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    // Find user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get normalized user with roles array
    const normalizedUser = normalizeUserRoles(user);

    // Check if user has multiple roles - can't remove last role
    if (
      normalizedUser.roles.length <= 1 &&
      normalizedUser.roles.includes(role)
    ) {
      return res.status(400).json({
        message:
          "Cannot remove the user's only role. Add another role before removing this one.",
      });
    }

    // Get updated roles
    const updatedRoles = removeRole(user, role);

    // Update user
    user.roles = updatedRoles;
    await user.save();

    res.json({
      message: `Role "${role}" removed from user successfully`,
      user: normalizeUserRoles(user),
    });
  } catch (error) {
    console.error("Error removing role from user:", error);
    res
      .status(500)
      .json({ message: "Error removing role from user", error: error.message });
  }
};

/**
 * Update user primary role (reorder roles)
 */
const updatePrimaryRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    // Find user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get normalized user with roles array
    const normalizedUser = normalizeUserRoles(user);

    // Check if user has the role
    if (!normalizedUser.roles.includes(role)) {
      return res.status(400).json({
        message: `User doesn't have the role "${role}". Add the role first.`,
        currentRoles: normalizedUser.roles,
      });
    }

    // Reorder roles to make the specified role primary
    const updatedRoles = [
      role,
      ...normalizedUser.roles.filter((r) => r !== role),
    ];

    // Update user
    user.roles = updatedRoles;
    await user.save();

    res.json({
      message: `Role "${role}" set as primary for user successfully`,
      user: normalizeUserRoles(user),
    });
  } catch (error) {
    console.error("Error updating user primary role:", error);
    res.status(500).json({
      message: "Error updating user primary role",
      error: error.message,
    });
  }
};

/**
 * Get all faculty coordinators
 */
const getFacultyCoordinators = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalFacultyCoordinators = await User.countDocuments({
      roles: "FacultyCoordinator",
    });

    // Get faculty coordinators with pagination
    const facultyCoordinators = await User.find({
      roles: "FacultyCoordinator",
    })
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Normalize roles for all users
    const normalizedUsers = facultyCoordinators.map((user) =>
      normalizeUserRoles(user),
    );

    res.json({
      facultyCoordinators: normalizedUsers,
      pagination: {
        total: totalFacultyCoordinators,
        page,
        pages: Math.ceil(totalFacultyCoordinators / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching faculty coordinators:", error);
    res.status(500).json({
      message: "Error fetching faculty coordinators",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  addRoleToUser,
  removeRoleFromUser,
  updatePrimaryRole,
  getFacultyCoordinators,
};
