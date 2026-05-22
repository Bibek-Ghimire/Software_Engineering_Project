// backend/routes/courseRoutes.js
import express from "express";
import Course from "../models/Course.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import EnrollmentRequest from "../models/EnrollmentRequest.js";
import Payment from "../models/Payment.js";
import { protect } from "../middleware/authMiddleware.js";
import { sendEnrollmentNotificationEmail } from "../services/emailService.js";

const router = express.Router();

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    // Populate teacher's name, email, and role
    const courses = await Course.find().populate("teacher", "name email role");
    res.status(200).json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "teacher",
      "name email role",
    );
    if (!course) return res.status(404).json({ message: "Course not found" });

    const userId = req.user.id || req.user._id;

    // Strictly check if current authenticated user is enrolled
    // Use req.user.id (from JWT token) for authoritative user identification
    const isCurrentUserEnrolled = course.students.some(
      (studentId) => studentId.toString() === userId,
    );

    // Check if there's a pending enrollment request
    const pendingRequest = await EnrollmentRequest.findOne({
      student: userId,
      course: req.params.id,
      status: "pending",
    });

    // Check if there's a pending or completed payment
    const payment = await Payment.findOne({
      student: userId,
      course: req.params.id,
      status: { $in: ["pending", "completed"] },
    });

    console.log(
      `Course Check - User: ${req.user.name} (${userId}), Course: ${course.title}, Enrolled: ${isCurrentUserEnrolled}, Pending Request: ${!!pendingRequest}, Payment Status: ${payment?.status || null}`,
    );

    // Return course with enrollment and request status for current user
    const courseResponse = {
      ...course.toObject(),
      isCurrentUserEnrolled,
      enrollmentRequestStatus: pendingRequest ? "pending" : null,
      paymentStatus: payment ? payment.status : null,
    };

    res.status(200).json(courseResponse);
  } catch (err) {
    console.error("Error fetching course:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (teacher only)
router.post("/", protect, async (req, res) => {
  const { title, description, level, duration, price } = req.body;
  if (!title || !description || !level || !duration || !price)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const course = new Course({
      title,
      description,
      level,
      duration,
      price,
      teacher: req.user.id, // Ensure authMiddleware sets req.user.id
    });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (teacher only)
router.put("/:id", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Only the teacher who created can update
    if (course.teacher.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const { title, description, level, duration, price } = req.body;
    course.title = title || course.title;
    course.description = description || course.description;
    course.level = level || course.level;
    course.duration = duration || course.duration;
    course.price = price || course.price;

    await course.save();
    res.status(200).json(course);
  } catch (err) {
    console.error("Error updating course:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (teacher only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Only the teacher who created can delete
    if (!course.teacher || course.teacher.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await Course.findByIdAndDelete(course._id);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Request enrollment in a course
// @route   POST /api/courses/:id/enroll
// @access  Private (student)
router.post("/:id/enroll", protect, async (req, res) => {
  try {
    // STRICT VALIDATION: Verify authenticated user ID
    const authenticatedUserId = req.user.id || req.user._id;
    const authenticatedUserName = req.user.name;

    console.log(
      `Enrollment Request - Authenticated User: ${authenticatedUserName} (${authenticatedUserId})`,
    );

    // Verify the authenticated user is a student
    console.log(
      `Role Check - User: ${authenticatedUserName}, Role: ${req.user.role}, Role Type: ${typeof req.user.role}`,
    );

    if (!req.user.role || req.user.role.toLowerCase() !== "student") {
      console.warn(
        `Non-student attempted enrollment: ${authenticatedUserName} (Role: ${req.user.role || "undefined"})`,
      );
      return res.status(403).json({
        message: `Only students can enroll in courses. Your role is: ${req.user.role || "undefined"}`,
      });
    }

    const courseId = req.params.id;
    console.log(`Attempting enrollment request for course: ${courseId}`);

    const course = await Course.findById(courseId).populate(
      "teacher",
      "name email",
    );
    if (!course) {
      console.error(`Course not found: ${courseId}`);
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.teacher) {
      console.error(`Course has no teacher assigned: ${courseId}`);
      return res
        .status(400)
        .json({ message: "Course has no teacher assigned" });
    }

    // STRICT CHECK: Check if already enrolled
    const studentIdString = authenticatedUserId.toString();
    const isAlreadyEnrolled = course.students.some(
      (studentId) => studentId.toString() === studentIdString,
    );

    if (isAlreadyEnrolled) {
      console.warn(
        `Student ${authenticatedUserName} already enrolled in ${course.title}`,
      );
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }

    // Check for existing enrollment request
    const existingRequest = await EnrollmentRequest.findOne({
      student: authenticatedUserId,
      course: courseId,
      status: "pending",
    });

    if (existingRequest) {
      console.warn(
        `Student ${authenticatedUserName} already has a pending request for ${course.title}`,
      );
      return res.status(400).json({
        message:
          "You already have a pending enrollment request for this course",
      });
    }

    // Create enrollment request
    const enrollmentRequest = new EnrollmentRequest({
      student: authenticatedUserId,
      course: courseId,
      teacher: course.teacher._id,
      status: "pending",
    });
    await enrollmentRequest.save();

    console.log(
      `Enrollment request created - Student: ${authenticatedUserName}, Course: ${course.title}`,
    );

    // Create notification for teacher
    const notification = new Notification({
      recipient: course.teacher._id,
      title: "New Enrollment Request",
      message: `${authenticatedUserName} has requested to enroll in your course "${course.title}"`,
      type: "enrollment",
      relatedCourse: course._id,
      relatedStudent: authenticatedUserId,
      actionUrl: `/teacher/enrollment-requests`,
      actionData: { enrollmentRequestId: enrollmentRequest._id },
    });
    await notification.save();
    console.log(`Notification created for teacher ${course.teacher.name}`);

    // Send email notification to teacher
    await sendEnrollmentNotificationEmail(
      course.teacher.email,
      course.teacher.name,
      authenticatedUserName,
      course.title,
    );
    console.log(`Email sent to ${course.teacher.email}`);

    res.status(201).json({
      message: "Enrollment request sent to teacher",
      enrollmentRequest,
      status: "requested",
    });
  } catch (err) {
    console.error("Error requesting enrollment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
