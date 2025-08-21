const express = require("express");
const RegistrationController = require("../Controller/RegistrationController");
const isLoggedIn = require("../middlewares/OAuth2IsLoggedIn");
const router = express.Router();

router.use(isLoggedIn);
// router.get("/status", RegistrationController.getRegistrationStatus);
router.post("/register", RegistrationController.registerUser);

module.exports = router;
