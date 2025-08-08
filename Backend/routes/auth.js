const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/failure',
        successRedirect: '/auth/success',
        cookie: {
            maxAge: 24 * 60 * 60 * 1000  // 🕒 1 day
        }
    })
);

router.get('/success', (req, res) => {
    res.send('Login successful..');
});

router.get('/failure', (req, res) => {
    res.send('Login failed..');
});

module.exports = router;