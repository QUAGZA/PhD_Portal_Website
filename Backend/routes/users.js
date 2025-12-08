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
const { validateBody, validateParams, validateQuery } = require("../middlewares/validateRequest");
const { userSchemas, idParamSchema, paginationSchema } = require("../middlewares/validation");

// Apply auth middleware for all routes
router.use(isLoggedIn);

// Only admins can access these routes
router.get("/", authorizedRoles("Admin"), validateQuery(paginationSchema), getAllUsers);
router.get("/:id", authorizedRoles("Admin"), validateParams(idParamSchema), getUserById);
router.post("/:id/roles", authorizedRoles("Admin"), validateParams(idParamSchema), validateBody(userSchemas.addRole), addRoleToUser);
router.delete("/:id/roles", authorizedRoles("Admin"), validateParams(idParamSchema), validateBody(userSchemas.removeRole), removeRoleFromUser);
router.put("/:id/primary-role", authorizedRoles("Admin"), validateParams(idParamSchema), validateBody(userSchemas.updatePrimaryRole), updatePrimaryRole);
router.get(
  "/faculty-coordinators",
  authorizedRoles("Admin"),
  validateQuery(paginationSchema),
  getFacultyCoordinators,
);

module.exports = router;
