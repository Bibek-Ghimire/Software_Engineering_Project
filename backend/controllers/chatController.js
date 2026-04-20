import ChatMessage from "../models/ChatMessage.js";
import Course from "../models/Course.js";
import EnrollmentRequest from "../models/EnrollmentRequest.js";

/**
 * Get chat messages for a specific course
 */
export const getCourseChat = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

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

    // Get all approved enrollment requests for this course
    const approvedRequests = await EnrollmentRequest.find({
      course: courseId,
      status: "approved",
    })
      .populate("student", "name email college")
      .select("-__v");

    res.json({
      success: true,
      students: approvedRequests.map((req) => ({
        _id: req.student._id,
        name: req.student.name,
        email: req.student.email,
        college: req.student.college,
      })),
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

    // Get all approved enrollment requests for this student
    const enrolledRequests = await EnrollmentRequest.find({
      student: studentId,
      status: "approved",
    })
      .populate("course", "title description")
      .populate("teacher", "name email")
      .select("-__v");

    const courses = enrolledRequests.map((req) => ({
      _id: req.course._id,
      title: req.course.title,
      description: req.course.description,
      teacher: {
        _id: req.teacher._id,
        name: req.teacher.name,
        email: req.teacher.email,
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
 * Save a chat message
 */
export const saveMessage = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { message } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

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
      const enrollmentRequest = await EnrollmentRequest.findOne({
        student: userId,
        course: courseId,
        status: "approved",
      });

      if (!enrollmentRequest) {
        return res.status(403).json({
          success: false,
          message: "Not enrolled in this course",
        });
      }
    }

    // Create the message
    const chatMessage = new ChatMessage({
      course: courseId,
      sender: userId,
      senderName: req.user.name,
      senderRole: userRole,
      message: message.trim(),
    });

    await chatMessage.save();

    // Populate sender info
    await chatMessage.populate("sender", "name email role");

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
