const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { connectMongoDB } = require("./utility/connection");
const { jsonParser } = require("./middlewares/index");
require("./config/passport");
const authRoutes = require("./routes/auth");
const registrationRoutes = require("./routes/registration");
const documentsRoutes = require("./routes/documents");
const guidePreferencesRoutes = require("./routes/guidePreferences");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 9999;

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/PhDPortal";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

connectMongoDB(mongoURI)
  .then(() => console.log("MongoDB Connected!!"))
  .catch((err) => console.log("Error, Can't connect to DB", err));

app.use(jsonParser());

app.use(
  session({
    secret: "your-session-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", authRoutes);
app.use("/registration", registrationRoutes);
app.use("/documents", documentsRoutes);
app.use("/guide-preferences", guidePreferencesRoutes);

// fetch('http://localhost:9999/dashboard', {
//     method: 'GET',
//     credentials: 'include' // 💡 this is crucial
// })

app.get((req, res) => {
  if (req.isAuthenticated()) {
    return res.status(201).json({
      message: "Authenticated",
    });
  } else {
    return res.status(404).json({ message: "Not Authenticated" });
  }
});

app.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

app.listen(PORT, () => console.log("Server has been started on Port :" + PORT));
