const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
    successRedirect: "/auth/success",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 🕒 1 day
    },
  }),
);

// Check authentication status
router.get("/status", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      isAuthenticated: true,
      user: req.user,
      needsRegistration: !req.user.registrationComplete,
    });
  } else {
    return res.json({
      isAuthenticated: false,
      user: null,
      needsRegistration: false,
    });
  }
});

// Get current user profile
router.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json({ user: req.user });
});

// Success endpoint
router.get("/success", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  const needsRegistration = !req.user.registrationComplete;

  res.redirect(
    needsRegistration
      ? "http://localhost:5173/register"
      : "http://localhost:5173/student/dashboard",
  );
});

// Failure endpoint
router.get("/failure", (req, res) => {
  res.status(401).json({ message: "Authentication failed" });
});

// Logout
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Session destruction failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });
});

module.exports = router;
