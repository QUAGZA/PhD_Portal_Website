// Auth middleware to check if user is authenticated via session
const isAuthenticated = (req, res, next) => {
  // Check if authenticated via Passport session
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Authentication required" });
};

module.exports = { isAuthenticated };
