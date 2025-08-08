const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

passport.use(new GoogleStrategy({
    clientID,
    clientSecret,
    callbackURL: "http://localhost:9999/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    console.log(profile);

    // Here you can store user in DB
    // For now, just pass the profile through
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});