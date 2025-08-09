const User = require("../Model/User");
const AcademicQualification = require("../Model/AcademicQualifications");
const EmploymentRecord = require("../Model/EmploymentRecords");
const mongoose = require("mongoose");

class RegistrationController {
  static async getRegistrationStatus(req, res) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
          registrationComplete: false,
        });
      }

      // Simple logic: if user exists in DB, registration is complete
      const isRegistrationComplete = !!user;

      res.json({
        registrationComplete: isRegistrationComplete,
        user: user,
        message: isRegistrationComplete
          ? "User is registered"
          : "Registration required",
      });
    } catch (error) {
      console.error("Get registration status error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Your existing legacy method - unchanged
  static async registerUser(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Debug: log incoming data
      console.log(
        "Registration request body:",
        JSON.stringify(req.body, null, 2),
      );

      const {
        personalDetails,
        academicQualifications,
        employmentDetails,
        courseDetails,
      } = req.body;

      // Find the existing user from the session
      const existingUser = await User.findById(req.user._id);
      if (!existingUser) {
        return res
          .status(404)
          .json({ message: "User not found. Please login again." });
      }

      // Update user fields if provided
      if (personalDetails) existingUser.personalDetails = personalDetails;
      if (academicQualifications)
        existingUser.academicQualifications = academicQualifications;
      if (employmentDetails) existingUser.employmentDetails = employmentDetails;
      if (courseDetails) existingUser.courseDetails = courseDetails;

      existingUser.registrationComplete = true;

      await existingUser.save();

      res.status(201).json({ user: existingUser });
    } catch (err) {
      console.error("Error during user registration:", err);
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  }
}

module.exports = RegistrationController;
