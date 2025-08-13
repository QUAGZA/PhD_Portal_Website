import jwt from "jsonwebtoken";
import User from "../models/User.js";

const requireAuth = (allowedRoles = []) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);

      if (!user || !user.roles.some(role => allowedRoles.includes(role))) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

export default requireAuth;
