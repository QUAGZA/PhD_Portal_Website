const express = require("express");
const router = express.Router();
const guidePreferencesController = require("../Controller/GuidePreferencesController");

// Simple authentication middleware for session auth
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Authentication required" });
};

// Add test route to check authentication
router.get("/test", isAuthenticated, (req, res) => {
  res.json({ message: "Authentication works!", user: req.user });
});

// Submit guide preferences (creates PDF)
router.post(
  "/submit",
  isAuthenticated,
  guidePreferencesController.submitGuidePreferences,
);

// Get guide preferences PDF
router.get(
  "/pdf",
  isAuthenticated,
  guidePreferencesController.getGuidePreferencesPdf,
);

module.exports = router;
