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
    // Handle backwards compatibility for users that might not have been migrated yet
    const user = req.user;
    if (user.role && !user.roles) {
      user.roles = [user.role];
    }

    return res.json({
      isAuthenticated: true,
      user: user,
      needsRegistration: !user.registrationComplete,
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

  // Handle backwards compatibility for users that might not have been migrated yet
  const user = req.user;
  if (user.role && !user.roles) {
    user.roles = [user.role];
  }

  res.json({ user: user });
});

// Success endpoint
router.get("/success", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  const needsRegistration = !req.user.registrationComplete;

  if (needsRegistration) {
    return res.redirect("http://localhost:5173/register");
  }

  // Redirect based on user's primary role (first role in the array)
  const primaryRole =
    req.user.roles && req.user.roles.length > 0 ? req.user.roles[0] : "Student";
  const redirectPath = (() => {
    switch (primaryRole) {
      case "Student":
        return "http://localhost:5173/student/dashboard";
      case "Guide":
        return "http://localhost:5173/guide/dashboard";
      case "FacultyCoordinator":
        return "http://localhost:5173/faculty-coordinator/dashboard";
      case "Admin":
        return "http://localhost:5173/admin/dashboard";
      default:
        return "http://localhost:5173/student/dashboard";
    }
  })();

  res.redirect(redirectPath);
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
