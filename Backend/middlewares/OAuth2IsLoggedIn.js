const User = require("../Model/User");

function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // const user = User;
  next();
}

module.exports = isLoggedIn;
