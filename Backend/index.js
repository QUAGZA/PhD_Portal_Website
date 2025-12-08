const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const path = require("path");
const config = require("./config/config");
const { connectMongoDB } = require("./utility/connection");
const { jsonParser } = require("./middlewares/index");
const { errorHandler, notFoundHandler } = require("./middlewares/errorHandler");
require("./config/passport");
const migrateRolesToArray = require("./migrations/migrateRolesToArray");
const migrateGuideAssignments = require("./migrations/migrateGuideAssignments");
const authRoutes = require("./routes/auth");
const registrationRoutes = require("./routes/registration");
const documentsRoutes = require("./routes/documents");
const guidePreferencesRoutes = require("./routes/guidePreferences");
const assignmentRoutes = require("./routes/AssignmentRoutes");
const userRoutes = require("./routes/users");
const guideAssignmentRoutes = require("./routes/guideAssignment");
const adminRoutes = require("./routes/admin");
const guideDashboardRoutes = require("./routes/guideDashboard");
const studentDashboardRoutes = require("./routes/studentDashboard");
const facultyDashboardRoutes = require("./routes/facultyDashboard");
const scheduleRoutes = require("./routes/schedule");
const announcementRoutes = require("./routes/announcements");

// Validate environment configuration
config.validate();

const app = express();
const PORT = config.server.port;

app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  }),
);

connectMongoDB(config.database.mongoUri)
  .then(() => {
    console.log("MongoDB Connected!!");
    // // Run migration to update user roles from string to array
    setTimeout(() => {
      migrateRolesToArray()
        .then(() => {
          console.log("Role migration completed");
          return migrateGuideAssignments();
        })
        .then(() => console.log("Guide assignment migration completed"))
        .catch((err) => console.error("Migration failed:", err));
    }, 1000); // Give MongoDB connection a moment to fully establish
  })
  .catch((err) => console.log("Error, Can't connect to DB", err));

app.use(jsonParser());

app.use(
  session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false, // Changed to false for better security
    cookie: {
      maxAge: config.session.maxAge,
      httpOnly: true,
      secure: config.session.secure,
      sameSite: 'lax' // Changed from undefined to 'lax' for better CORS support
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, config.upload.uploadDir)));

app.use("/auth", authRoutes);
app.use("/registration", registrationRoutes);
app.use("/documents", documentsRoutes);
app.use("/guide-preferences", guidePreferencesRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/users", userRoutes);
app.use("/guide-assignment", guideAssignmentRoutes);
app.use("/admin", adminRoutes);
app.use("/guide/dashboard", guideDashboardRoutes);
app.use("/student/dashboard", studentDashboardRoutes);
app.use("/faculty/dashboard", facultyDashboardRoutes);
app.use("/schedule", scheduleRoutes);
app.use("/announcements", announcementRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({
      message: "Authenticated",
      user: req.user?.email
    });
  } else {
    return res.status(200).json({ message: "Not Authenticated" });
  }
});

app.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

// Handle 404 routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on port ${PORT} in ${config.server.nodeEnv} mode`));
