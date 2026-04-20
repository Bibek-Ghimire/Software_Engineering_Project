import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getCourseChat,
  getCourseApprovedStudents,
  getStudentEnrolledCourses,
  saveMessage,
  markMessagesAsRead,
} from "../controllers/chatController.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * Get chat messages for a specific course
 * GET /api/chat/course/:courseId
 */
router.get("/course/:courseId", getCourseChat);

/**
 * Get approved students for a course (teacher only)
 * GET /api/chat/course/:courseId/approved-students
 */
router.get("/course/:courseId/approved-students", getCourseApprovedStudents);

/**
 * Get enrolled courses for a student
 * GET /api/chat/student/enrolled-courses
 */
router.get("/student/enrolled-courses", getStudentEnrolledCourses);

/**
 * Send a message to a course chat
 * POST /api/chat/course/:courseId/send
 * Body: { message: "text message" }
 */
router.post("/course/:courseId/send", saveMessage);

/**
 * Mark messages as read
 * PUT /api/chat/course/:courseId/mark-read
 */
router.put("/course/:courseId/mark-read", markMessagesAsRead);

export default router;
