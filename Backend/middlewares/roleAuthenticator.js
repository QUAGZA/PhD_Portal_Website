const { verifyUserAuth } = require("../Service/authService");
const { hasRole } = require("../utility/roleUtils");

const authorizedRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    console.log("=== Role Authorization Check ===", {
      requestPath: req.path,
      requestUrl: req.originalUrl,
      allowedRoles: allowedRoles,
      isAuthenticated: req.isAuthenticated ? req.isAuthenticated() : false,
      hasSession: !!req.session,
      sessionID: req.sessionID,
      hasUser: !!req.user,
      cookies: req.headers.cookie ? "present" : "missing",
    });

    const user = await verifyUserAuth(req);

    console.log("Role Authorization Debug:", {
      requestPath: req.path,
      allowedRoles: allowedRoles,
      user: user
        ? {
            id: user._id,
            email: user.email,
            roles: user.roles,
            isAuthenticated: !!user,
          }
        : null,
    });

    try {
      if (!user) {
        console.log("Authorization failed: No user found");
        return res.status(403).json({
          message: "Forbidden: Access denied",
          debug: "User not authenticated",
        });
      }

      // Check if user has at least one of the allowed roles
      console.log("About to check hasRole with:", {
        userRoles: user.roles,
        allowedRoles: allowedRoles,
        allowedRolesType: typeof allowedRoles,
        allowedRolesIsArray: Array.isArray(allowedRoles),
      });

      if (!hasRole(user, allowedRoles)) {
        console.log("Authorization failed: User roles don't match", {
          userRoles: user.roles,
          requiredRoles: allowedRoles,
        });
        return res.status(403).json({
          message: "Forbidden: Access denied",
          debug: `User roles [${user.roles?.join(", ")}] don't include any of [${allowedRoles.join(", ")}]`,
        });
      }

      console.log("Authorization successful for user:", user.email);
      next();
    } catch (err) {
      console.error("Role authorization error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  };
};

module.exports = authorizedRoles;
