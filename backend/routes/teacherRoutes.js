import express from "express";
import { protectTeacher, authorize } from "../middleware/authMiddleware.js"; // using merged middlewares
import { getTeacherProfile, updateTeacherProfile } from "../controllers/teacherController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Teacher routes
// GET teacher profile
router.get("/profile", protectTeacher, authorize("teacher"), getTeacherProfile);

// PUT update teacher profile
router.put("/profile", protectTeacher, authorize("teacher"), updateTeacherProfile);

// backend/routes/teacherRoutes.js
router.get("/courses", protect, async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user._id }); // fetch courses for this teacher
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
