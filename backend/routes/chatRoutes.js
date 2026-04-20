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
 * Get enrolled courses for a student (MUST come before generic /course/:courseId route)
 * GET /api/chat/student/enrolled-courses
 */
router.get("/student/enrolled-courses", getStudentEnrolledCourses);

/**
 * Get approved students for a course (teacher only) (MUST come before generic /course/:courseId route)
 * GET /api/chat/course/:courseId/approved-students
 */
router.get("/course/:courseId/approved-students", getCourseApprovedStudents);

/**
 * Get chat messages for a specific course
 * GET /api/chat/course/:courseId
 */
router.get("/course/:courseId", getCourseChat);

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
