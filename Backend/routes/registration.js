const express = require("express");
const User = require("../Model/User");
const {
  requireAuth,
  requireIncompleteRegistration,
} = require("../middlewares/sessionAuth");
const { validateRegistrationData } = require("../middlewares/validation");
const router = express.Router();

// Get current user's registration status
router.get("/status", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      registrationComplete: user.registrationComplete || false,
      completedSteps: user.completedSteps || [],
      profile: user.profile || {},
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Complete basic profile information (Step 1)
router.post(
  "/basic-info",
  requireAuth,
  requireIncompleteRegistration,
  async (req, res) => {
    try {
      const { institution, course, enrollmentId, dob, phone } = req.body;

      if (!institution || !course || !enrollmentId) {
        return res.status(400).json({
          message: "Institution, course, and enrollment ID are required",
        });
      }

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update profile
      user.profile = {
        ...user.profile,
        institution,
        course,
        enrollmentId,
        dob,
        phone,
      };

      // Add completed step
      if (!user.completedSteps.includes("basic-info")) {
        user.completedSteps.push("basic-info");
      }

      await user.save();

      // Update session user
      req.user = user;

      res.json({
        message: "Basic information saved successfully",
        user: user,
        nextStep: "personal-details",
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

// Complete personal details (Step 2)
router.post(
  "/personal-details",
  requireAuth,eltf
  requireIncompleteRegistration,
  validateRegistrationData,
  async (req, res) => {
    try {
      const personalData = req.body;

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.personalDetails = { ...user.personalDetails, ...personalData };

      if (!user.completedSteps.includes("personal-details")) {
        user.completedSteps.push("personal-details");
      }

      await user.save();
      req.user = user;

      res.json({
        message: "Personal details saved successfully",
        user: user,
        nextStep: "educational-details",
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

// Complete educational details (Step 3)
router.post(
  "/educational-details",
  requireAuth,
  requireIncompleteRegistration,
  async (req, res) => {
    try {
      const educationalData = req.body;

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.educationalDetails = {
        ...user.educationalDetails,
        ...educationalData,
      };

      if (!user.completedSteps.includes("educational-details")) {
        user.completedSteps.push("educational-details");
      }

      await user.save();
      req.user = user;

      res.json({
        message: "Educational details saved successfully",
        user: user,
        nextStep: "program-details",
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

// Complete program details (Step 4)
router.post(
  "/program-details",
  requireAuth,
  requireIncompleteRegistration,
  async (req, res) => {
    try {
      const programData = req.body;

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.programDetails = { ...user.programDetails, ...programData };

      if (!user.completedSteps.includes("program-details")) {
        user.completedSteps.push("program-details");
      }

      // Mark registration as complete
      user.registrationComplete = true;

      await user.save();
      req.user = user;

      res.json({
        message: "Registration completed successfully!",
        user: user,
        registrationComplete: true,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

module.exports = router;
