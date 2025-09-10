const verifyUserAuth = async (req) => {
  try {
    // Check if user is authenticated via Passport session
    if (req.isAuthenticated && req.isAuthenticated() && req.user) {
      return req.user;
    }
    return null;
  } catch (error) {
    console.error("Error verifying user authentication:", error);
    return null;
  }
};

module.exports = { verifyUserAuth };
