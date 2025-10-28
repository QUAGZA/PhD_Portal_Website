const mongoose = require("mongoose");
const User = require("../Model/User");
require("dotenv").config();

/**
 * Utility script to add Admin role to a user
 * Usage: node utility/addAdminRole.js <email>
 */

const addAdminRole = async (userEmail) => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/PhDPortal";
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    if (!userEmail) {
      console.error("Please provide a user email");
      console.log("Usage: node utility/addAdminRole.js <email>");
      process.exit(1);
    }

    // Find the user
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      console.error(`User with email ${userEmail} not found`);
      process.exit(1);
    }

    console.log("Found user:", {
      email: user.email,
      currentRoles: user.roles || user.role || "None",
      registrationComplete: user.registrationComplete,
    });

    // Handle migration from old role structure
    if (user.role && !user.roles) {
      user.roles = [user.role];
      console.log(`Migrated old role "${user.role}" to roles array`);
    }

    // Ensure roles array exists
    if (!user.roles || !Array.isArray(user.roles)) {
      user.roles = ["Student"]; // Default role
    }

    // Add Admin role if not already present
    if (!user.roles.includes("Admin")) {
      user.roles.push("Admin");
      console.log("Added Admin role to user");
    } else {
      console.log("User already has Admin role");
    }

    // Remove old role field if it exists
    if (user.role) {
      user.role = undefined;
    }

    // Save the user
    await user.save();

    console.log("✅ User updated successfully!");
    console.log("Updated user roles:", user.roles);

    // Verify the update
    const updatedUser = await User.findOne({ email: userEmail });
    console.log("Verification - User roles:", updatedUser.roles);

  } catch (error) {
    console.error("Error adding admin role:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
};

// Get email from command line arguments
const userEmail = process.argv[2];

// Run the script
addAdminRole(userEmail);
