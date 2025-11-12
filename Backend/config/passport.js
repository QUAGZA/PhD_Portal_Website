const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
require("dotenv").config();
const User = require("../Model/User");
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

// Local Strategy for username/password authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        // Find user by email and include password field
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }

        // Check if user has a password (local auth enabled)
        if (!user.password) {
          return done(null, false, {
            message: "This account uses Google authentication",
          });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password" });
        }

        // Return user without password field
        const userObject = user.toObject();
        delete userObject.password;

        return done(null, userObject);
      } catch (error) {
        console.error("Error in local authentication:", error);
        return done(error);
      }
    },
  ),
);

// Google Strategy
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
            authMethod: "google",
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
