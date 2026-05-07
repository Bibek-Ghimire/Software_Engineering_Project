import express from "express";
import Payment from "../models/Payment.js";
import Course from "../models/Course.js";
import EnrollmentRequest from "../models/EnrollmentRequest.js";
import Notification from "../models/Notification.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Get all pending payments for a student
// @route   GET /api/payments
// @access  Private (student)
router.get("/", protect, async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;

    console.log(`🔍 Getting payments for student: ${req.user.name}`);

    const payments = await Payment.find({
      student: studentId,
    })
      .populate("course", "title price")
      .populate("enrollmentRequest")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Payments retrieved",
      payments,
    });
  } catch (err) {
    console.error("Error getting payments:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @desc    Get a specific payment
// @route   GET /api/payments/:id
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id)
      .populate("student", "-password")
      .populate("course", "title price")
      .populate("enrollmentRequest");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Verify user is student associated with this payment
    const userId = req.user.id || req.user._id;
    const isStudent = payment.student._id.toString() === userId.toString();

    if (!isStudent) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this payment" });
    }

    res.status(200).json({
      message: "Payment retrieved",
      payment,
    });
  } catch (err) {
    console.error("Error getting payment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @desc    Process payment completion (simulate payment gateway)
// @route   PUT /api/payments/:id/complete
// @access  Private (student)
router.put("/:id/complete", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod, transactionId } = req.body;
    const studentId = req.user.id || req.user._id;

    console.log(`💳 Processing payment: ${id} by student: ${req.user.name}`);

    // Get the payment
    const payment = await Payment.findById(id)
      .populate("student", "name email")
      .populate("course", "title students enrollmentCount teacher")
      .populate("enrollmentRequest");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Verify the student owns this payment
    if (payment.student._id.toString() !== studentId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to process this payment" });
    }

    // Check if payment is already completed
    console.log(`DEBUG: Payment ${id} status is: "${payment.status}"`);
    if (payment.status === "completed") {
      return res.status(400).json({
        message: "This payment has already been completed.",
      });
    }

    // Update payment status
    payment.status = "completed";
    payment.paymentDate = new Date();
    payment.paymentMethod = paymentMethod || "credit_card";
    payment.transactionId = transactionId || `TXN-${Date.now()}`;
    await payment.save();

    console.log(
      `✅ Payment processed for student ${payment.student.name}, Amount: ${payment.amount}`,
    );

    // Now enroll the student in the course
    const course = await Course.findById(payment.course._id);
    if (course) {
      const studentIdString = payment.student._id.toString();
      const isAlreadyEnrolled = course.students.some(
        (id) => id.toString() === studentIdString,
      );

      if (!isAlreadyEnrolled) {
        course.students.push(payment.student._id);
        course.enrollmentCount = course.students.length;
        await course.save();

        console.log(
          `✅ Student ${payment.student.name} enrolled in course ${course.title} after payment`,
        );
      }
    }

    // Send notification to student about enrollment completion
    const studentNotification = new Notification({
      recipient: payment.student._id,
      title: "Payment Successful - Enrollment Complete",
      message: `Your payment for "${payment.course.title}" has been processed successfully! You are now enrolled in the course.`,
      type: "enrollment",
      relatedCourse: payment.course._id,
      actionUrl: `/course/${payment.course._id}`,
    });
    await studentNotification.save();

    console.log(
      `📬 Enrollment completion notification sent to student ${payment.student.name}`,
    );

    res.status(200).json({
      message: "Payment completed and student enrolled successfully",
      payment,
    });
  } catch (err) {
    console.error("Error processing payment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @desc    Mark payment as failed
// @route   PUT /api/payments/:id/fail
// @access  Private (student)
router.put("/:id/fail", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { failureReason } = req.body;
    const studentId = req.user.id || req.user._id;

    console.log(
      `❌ Marking payment as failed: ${id} by student: ${req.user.name}`,
    );

    // Get the payment
    const payment = await Payment.findById(id)
      .populate("student", "name email")
      .populate("course", "title");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Verify the student owns this payment
    if (payment.student._id.toString() !== studentId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to process this payment" });
    }

    if (payment.status === "completed") {
      return res.status(400).json({
        message: `Cannot fail a payment that is already completed.`,
      });
    }

    // Update payment status
    payment.status = "failed";
    payment.failureReason = failureReason || "Payment declined";
    await payment.save();

    console.log(
      `❌ Payment marked as failed for student ${payment.student.name}`,
    );

    // Send notification to student
    const studentNotification = new Notification({
      recipient: payment.student._id,
      title: "Payment Failed",
      message: `Your payment for "${payment.course.title}" failed. Reason: ${payment.failureReason}. Please try again.`,
      type: "announcement",
      relatedCourse: payment.course._id,
      actionUrl: `/payments`,
    });
    await studentNotification.save();

    res.status(200).json({
      message: "Payment marked as failed",
      payment,
    });
  } catch (err) {
    console.error("Error failing payment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @desc    Get students by payment status for a course (for teacher)
// @route   GET /api/payments/teacher/course/:courseId
// @access  Private (teacher)
router.get("/teacher/course/:courseId", protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id || req.user._id;

    // Verify the course belongs to the teacher
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.teacher.toString() !== teacherId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized - Not your course",
      });
    }

    // Get students grouped by payment status
    const completedPayments = await Payment.find({
      course: courseId,
      status: "completed",
    })
      .populate("student", "name email college _id")
      .sort({ paymentDate: -1 });

    const pendingPayments = await Payment.find({
      course: courseId,
      status: "pending",
    })
      .populate("student", "name email college _id")
      .sort({ createdAt: -1 });

    const failedPayments = await Payment.find({
      course: courseId,
      status: "failed",
    })
      .populate("student", "name email college _id")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      enrolled: completedPayments
        .filter((p) => p.student)
        .map((p) => ({
          _id: p.student._id,
          name: p.student.name,
          email: p.student.email,
          college: p.student.college,
          status: "enrolled",
          paymentDate: p.paymentDate,
        })),
      pending: pendingPayments
        .filter((p) => p.student)
        .map((p) => ({
          _id: p.student._id,
          name: p.student.name,
          email: p.student.email,
          college: p.student.college,
          status: "pending",
          createdAt: p.createdAt,
        })),
      failed: failedPayments
        .filter((p) => p.student)
        .map((p) => ({
          _id: p.student._id,
          name: p.student.name,
          email: p.student.email,
          college: p.student.college,
          status: "failed",
          reason: p.failureReason,
        })),
    });
  } catch (error) {
    console.error("Error fetching students by payment status:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching students",
      error: error.message,
    });
  }
});

// @desc    Retry a failed payment
// @route   PUT /api/payments/:id/retry
// @access  Private (student)
router.put("/:id/retry", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id || req.user._id;

    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.student.toString() !== studentId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    payment.status = "pending";
    payment.failureReason = "";
    await payment.save();

    res.status(200).json({
      message: "Payment reset to pending",
      payment,
    });
  } catch (err) {
    console.error("Error retrying payment:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
