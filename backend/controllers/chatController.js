import ChatMessage from "../models/ChatMessage.js";
import Course from "../models/Course.js";
import EnrollmentRequest from "../models/EnrollmentRequest.js";
import Payment from "../models/Payment.js";
import Notification from "../models/Notification.js";

/**
 * Get chat messages for a specific course
 */
export const getCourseChat = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    const userId = req.user._id;
    const userRole = req.user.role;

    // Verify access - teachers can always access, students need payment
    if (userRole === "student") {
      // Check if student has completed payment
      const payment = await Payment.findOne({
        student: userId,
        course: courseId,
        status: "completed",
      });

      if (!payment) {
        return res.status(403).json({
          success: false,
          message:
            "Payment not completed. Please complete payment to access course chat.",
        });
      }
    }

    // Get messages for the course, sorted by timestamp (newest first)
    const messages = await ChatMessage.find({ course: courseId })
      .populate("sender", "name email role")
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .exec();

    // Reverse to get chronological order
    const orderedMessages = messages.reverse();

    res.json({
      success: true,
      messages: orderedMessages,
    });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching chat messages",
      error: error.message,
    });
  }
};

/**
 * Get approved students for a specific course (for teacher)
 * Returns students who have completed payment
 */
export const getCourseApprovedStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user._id;

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

    // Get all payments with completed status for this course
    const completedPayments = await Payment.find({
      course: courseId,
      status: "completed",
    }).populate("student", "name email college _id");

    // Filter out any payments where student didn't populate
    const students = completedPayments
      .filter((payment) => payment.student)
      .map((payment) => ({
        _id: payment.student._id,
        name: payment.student.name,
        email: payment.student.email,
        college: payment.student.college,
      }));

    res.json({
      success: true,
      students,
    });
  } catch (error) {
    console.error("Error fetching approved students:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching approved students",
      error: error.message,
    });
  }
};

/**
 * Get enrolled courses for a student (to see which courses they can chat in)
 */
export const getStudentEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get all courses where payment is completed
    // Populate course and teacher details
    const payments = await Payment.find({
      student: studentId,
      status: "completed",
    }).populate({
      path: "course",
      select: "title description teacher _id",
      populate: {
        path: "teacher",
        select: "name email _id",
      },
    });

    // Filter out any requests where course or teacher didn't populate
    const courses = payments
      .filter((payment) => payment.course && payment.course.teacher)
      .map((payment) => ({
        _id: payment.course._id,
        title: payment.course.title,
        description: payment.course.description,
        teacher: {
          _id: payment.course.teacher._id,
          name: payment.course.teacher.name,
          email: payment.course.teacher.email,
        },
      }));

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching enrolled courses",
      error: error.message,
    });
  }
};

/**
 * Save a chat message and create notifications for other participants
 */
export const saveMessage = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { message } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;
    const userName = req.user.name;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });
    }

    // Verify the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Verify the user is allowed to chat in this course
    if (userRole === "teacher") {
      if (course.teacher.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized - Not your course",
        });
      }
    } else if (userRole === "student") {
      // Check if student has completed payment
      const payment = await Payment.findOne({
        student: userId,
        course: courseId,
        status: "completed",
      });

      if (!payment) {
        return res.status(403).json({
          success: false,
          message:
            "Payment not completed. Please complete payment to access course chat.",
        });
      }
    }

    // Create the message
    const chatMessage = new ChatMessage({
      course: courseId,
      sender: userId,
      senderName: userName,
      senderRole: userRole,
      message: message.trim(),
    });

    await chatMessage.save();

    // Populate sender info
    await chatMessage.populate("sender", "name email role");

    // ========================================
    // CREATE NOTIFICATIONS FOR OTHER PARTICIPANTS
    // ========================================
    try {
      if (userRole === "teacher") {
        // Teacher sent a message - notify all approved students in this course
        const approvedStudents = await EnrollmentRequest.find({
          course: courseId,
          status: "approved",
        }).select("student");

        const studentIds = approvedStudents.map((req) => req.student._id);

        // Create notifications for all approved students except sender (if they're a student)
        if (studentIds.length > 0) {
          await Notification.insertMany(
            studentIds.map((studentId) => ({
              recipient: studentId,
              title: `New message from ${course.title}`,
              message: `${userName}: ${message.trim().substring(0, 50)}${
                message.trim().length > 50 ? "..." : ""
              }`,
              type: "message",
              relatedCourse: courseId,
              isRead: false,
              actionUrl: `/course/${courseId}/chat`,
            })),
          );
        }
      } else if (userRole === "student") {
        // Student sent a message - notify the teacher and other approved students
        const approvedEnrollments = await EnrollmentRequest.find({
          course: courseId,
          status: "approved",
        }).select("student");

        const otherStudentIds = approvedEnrollments
          .map((req) => req.student._id)
          .filter((id) => id.toString() !== userId.toString());

        // Notify the teacher
        await Notification.create({
          recipient: course.teacher,
          title: `New message from ${userName} in ${course.title}`,
          message: `${userName}: ${message.trim().substring(0, 50)}${
            message.trim().length > 50 ? "..." : ""
          }`,
          type: "message",
          relatedCourse: courseId,
          isRead: false,
          actionUrl: `/course/${courseId}/chat`,
        });

        // Notify other enrolled students
        if (otherStudentIds.length > 0) {
          await Notification.insertMany(
            otherStudentIds.map((studentId) => ({
              recipient: studentId,
              title: `New message from ${userName} in ${course.title}`,
              message: `${userName}: ${message.trim().substring(0, 50)}${
                message.trim().length > 50 ? "..." : ""
              }`,
              type: "message",
              relatedCourse: courseId,
              isRead: false,
              actionUrl: `/course/${courseId}/chat`,
            })),
          );
        }
      }
    } catch (notificationError) {
      // Log the error but don't fail the message send if notification creation fails
      console.error("Error creating notifications:", notificationError);
    }

    res.json({
      success: true,
      message: chatMessage,
    });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({
      success: false,
      message: "Error saving message",
      error: error.message,
    });
  }
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    // Mark all unread messages for this course as read by the user
    await ChatMessage.updateMany(
      {
        course: courseId,
        "readBy.userId": { $ne: userId },
      },
      {
        $push: {
          readBy: {
            userId,
            readAt: new Date(),
          },
        },
      },
    );

    res.json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({
      success: false,
      message: "Error marking messages as read",
      error: error.message,
    });
  }
};
