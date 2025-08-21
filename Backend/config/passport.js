const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();
const User = require("../Model/User");
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: "http://localhost:9999/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);

      // Here you can store user in DB
      // For now, just pass the profile through
      // return done(null, profile);
      try {
        // Extract email from Google profile
        const email =
          profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        if (!email) {
          return done(new Error("No email found in Google profile"), null);
        }

        // Check if user exists in our database

        const user = await User.findOne({ email });
        if (user) {
          return done(null, user);
        } else {
          const newUser = await User.create({
            email,
            registrationComplete: false,
          });
          return done(null, newUser);
        }
      } catch (error) {
        console.error("Error in Google authentication:", error);
        return done(error, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id || user._id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user || null);
  } catch (error) {
    console.error("Error deserializing user:", error);
    done(error, null);
  }
});
