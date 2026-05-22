import express from "express";
import { protectTeacher, authorize } from "../middleware/authMiddleware.js"; // using merged middlewares
import {
  getTeacherProfile,
  updateTeacherProfile,
} from "../controllers/teacherController.js";
import { protect } from "../middleware/authMiddleware.js";
import Course from "../models/Course.js";

const router = express.Router();

// Teacher routes
// GET teacher profile
router.get("/profile", protectTeacher, authorize("teacher"), getTeacherProfile);

// PUT update teacher profile
router.put(
  "/profile",
  protectTeacher,
  authorize("teacher"),
  updateTeacherProfile,
);

// GET teacher's courses for chat
router.get("/courses", protect, async (req, res) => {
  try {
    const teacherId = req.user._id || req.user.id;

    if (!teacherId) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const courses = await Course.find({ teacher: teacherId })
      .populate("teacher", "name email _id")
      .sort({ createdAt: -1 });

    console.log(`Fetched ${courses.length} courses for teacher ${teacherId}`);

    res.json({
      success: true,
      courses: courses || [],
    });
  } catch (err) {
    console.error("Error fetching teacher courses:", err);
    res.status(500).json({
      success: false,
      message: "Server error fetching courses",
      error: err.message,
    });
  }
});

export default router;
