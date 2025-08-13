import express from "express";
import { getStudentProfile } from "../../controllers/studentControllers/studentProfileController.js";
import requireAuth from "../../middlewares/requireAuth.js"; // auth middleware
const router = express.Router();

router.get("/profile", requireAuth(["student"]), getStudentProfile);

export default router;
