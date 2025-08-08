const User = require('../Model/User');

function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) res.status(401).json({ message: 'Unauthorized' });
    const user = User
}

module.exports = isLoggedIn;