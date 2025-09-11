const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  addRoleToUser,
  removeRoleFromUser,
  updatePrimaryRole,
  getFacultyCoordinators,
} = require("../Controller/UserController");
const isLoggedIn = require("../middlewares/OAuth2IsLoggedIn");
const authorizedRoles = require("../middlewares/roleAuthenticator");

// Apply auth middleware for all routes
router.use(isLoggedIn);

// Only admins can access these routes
router.get("/", authorizedRoles("Admin"), getAllUsers);
router.get("/:id", authorizedRoles("Admin"), getUserById);
router.post("/:id/roles", authorizedRoles("Admin"), addRoleToUser);
router.delete("/:id/roles", authorizedRoles("Admin"), removeRoleFromUser);
router.put("/:id/primary-role", authorizedRoles("Admin"), updatePrimaryRole);
router.get(
  "/faculty-coordinators",
  authorizedRoles("Admin"),
  getFacultyCoordinators,
);

module.exports = router;
