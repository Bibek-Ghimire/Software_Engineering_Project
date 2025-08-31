// backend/routes/teacherRoutes.js
import express from "express";
import { getTeacherProfile } from "../controllers/teacherController.js";
const router = express.Router();

router.get("/:id", getTeacherProfile); // fetch teacher by ID

export default router;
