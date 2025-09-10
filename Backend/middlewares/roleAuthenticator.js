const { verifyUserAuth } = require("../Service/authService");
const { hasRole } = require("../utility/roleUtils");

const authorizedRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    const user = await verifyUserAuth(req);
    try {
      if (!user) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      // Check if user has at least one of the allowed roles
      if (!hasRole(user, allowedRoles)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      next();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  };
};

module.exports = authorizedRoles;
