import express from "express";
import EnrollmentRequest from "../models/EnrollmentRequest.js";
import Notification from "../models/Notification.js";
import Course from "../models/Course.js";
import Payment from "../models/Payment.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Get all enrollment requests for a teacher
// @route   GET /api/enrollment-requests
// @access  Private (teacher)
router.get("/", protect, async (req, res) => {
  try {
    const teacherId = req.user.id || req.user._id;

    console.log(`🔍 Getting enrollment requests for teacher: ${req.user.name}`);

    const requests = await EnrollmentRequest.find({
      teacher: teacherId,
    })
      .populate("student", "-password")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Enrollment requests retrieved",
      requests,
    });
  } catch (err) {
    console.error("Error getting enrollment requests:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @desc    Get a specific enrollment request
// @route   GET /api/enrollment-requests/:id
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    const request = await EnrollmentRequest.findById(id)
      .populate("student", "-password")
      .populate("course", "title")
      .populate("teacher", "name");

    if (!request) {
      return res.status(404).json({ message: "Enrollment request not found" });
    }

    // Verify user is teacher or student
    const userId = req.user.id || req.user._id;
    const isTeacher = request.teacher._id.toString() === userId.toString();
    const isStudent = request.student._id.toString() === userId.toString();

    if (!isTeacher && !isStudent) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this request" });
    }

    res.status(200).json({
      message: "Enrollment request retrieved",
      request,
    });
  } catch (err) {
    console.error("Error getting enrollment request:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @desc    Approve enrollment request
// @route   PUT /api/enrollment-requests/:id/approve
// @access  Private (teacher)
router.put("/:id/approve", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id || req.user._id;

    console.log(
      `✅ Approving enrollment request: ${id} by teacher: ${req.user.name}`,
    );

    // Get the enrollment request
    const enrollmentRequest = await EnrollmentRequest.findById(id)
      .populate("student", "name email")
      .populate("course", "title")
      .populate("teacher", "name");

    if (!enrollmentRequest) {
      return res.status(404).json({ message: "Enrollment request not found" });
    }

    // Verify the teacher owns this request
    if (enrollmentRequest.teacher._id.toString() !== teacherId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to approve this request" });
    }

    if (enrollmentRequest.status !== "pending") {
      return res.status(400).json({
        message: `Cannot approve request with status: ${enrollmentRequest.status}`,
      });
    }

    // Update request status
    enrollmentRequest.status = "approved";
    await enrollmentRequest.save();

    // Get course to retrieve price
    const course = await Course.findById(enrollmentRequest.course).populate(
      "teacher",
      "name",
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Create payment record instead of directly enrolling
    const payment = new Payment({
      student: enrollmentRequest.student._id,
      course: enrollmentRequest.course._id,
      enrollmentRequest: enrollmentRequest._id,
      amount: course.price,
      status: "pending",
    });
    await payment.save();

    console.log(
      `💳 Payment record created for student ${enrollmentRequest.student.name}, Amount: ${course.price}`,
    );

    // Send notification to student with link to payment page
    const studentNotification = new Notification({
      recipient: enrollmentRequest.student._id,
      title: "Enrollment Approved - Payment Required",
      message: `Your enrollment request for "${course.title}" has been approved! Please complete the payment of ₹${course.price} to finalize your enrollment.`,
      type: "enrollment",
      relatedCourse: course._id,
      actionUrl: `/payments`,
    });
    await studentNotification.save();

    console.log(
      `📬 Payment notification sent to student ${enrollmentRequest.student.name}`,
    );

    // Emit real-time notification via socket.io
    if (global.notificationIO) {
      global.notificationIO.emitToUser(
        enrollmentRequest.student._id.toString(),
        "enrollment_approved",
        {
          notificationId: studentNotification._id,
          title: studentNotification.title,
          message: studentNotification.message,
          course: {
            id: course._id,
            title: course.title,
            price: course.price,
          },
          payment: {
            id: payment._id,
            amount: payment.amount,
          },
          studentName: enrollmentRequest.student.name,
          courseName: course.title,
          actionUrl: `/payments`,
          timestamp: new Date(),
        },
      );
      console.log(
        `🔔 Real-time socket notification sent to student ${enrollmentRequest.student._id}`,
      );
    }

    res.status(200).json({
      message: "Enrollment request approved",
      enrollmentRequest,
    });
  } catch (err) {
    console.error("Error approving enrollment request:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @desc    Reject enrollment request
// @route   PUT /api/enrollment-requests/:id/reject
// @access  Private (teacher)
router.put("/:id/reject", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const teacherId = req.user.id || req.user._id;

    console.log(
      `❌ Rejecting enrollment request: ${id} by teacher: ${req.user.name}`,
    );

    // Get the enrollment request
    const enrollmentRequest = await EnrollmentRequest.findById(id)
      .populate("student", "name email")
      .populate("course", "title");

    if (!enrollmentRequest) {
      return res.status(404).json({ message: "Enrollment request not found" });
    }

    // Verify the teacher owns this request
    if (enrollmentRequest.teacher.toString() !== teacherId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to reject this request" });
    }

    if (enrollmentRequest.status !== "pending") {
      return res.status(400).json({
        message: `Cannot reject request with status: ${enrollmentRequest.status}`,
      });
    }

    // Update request status
    enrollmentRequest.status = "rejected";
    enrollmentRequest.rejectionReason = reason || "No reason provided";
    await enrollmentRequest.save();

    // Send notification to student
    const studentNotification = new Notification({
      recipient: enrollmentRequest.student._id,
      title: "Enrollment Request Rejected",
      message: `Your enrollment request for "${enrollmentRequest.course.title}" was rejected.${
        reason ? ` Reason: ${reason}` : ""
      }`,
      type: "announcement",
      relatedCourse: enrollmentRequest.course._id,
      actionUrl: `/courses`,
    });
    await studentNotification.save();

    console.log(
      `📬 Rejection notification sent to student ${enrollmentRequest.student.name}`,
    );

    res.status(200).json({
      message: "Enrollment request rejected",
      enrollmentRequest,
    });
  } catch (err) {
    console.error("Error rejecting enrollment request:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
