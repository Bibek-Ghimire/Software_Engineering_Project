/**
 * COURSE CHAT SOCKET.IO INTEGRATION
 * Real-time chat between teachers and approved students for specific courses
 *
 * Usage:
 * - Teacher joins a course chat room: socket.emit('join_course_chat', { courseId, role: 'teacher' })
 * - Student joins a course chat room: socket.emit('join_course_chat', { courseId, role: 'student' })
 * - User sends message: socket.emit('send_message', { courseId, message: 'text' })
 * - Listen for messages: socket.on('receive_message', (data) => { ... })
 * - Listen for notifications: socket.on('new_notification', (data) => { ... })
 */

import Course from "../models/Course.js";
import EnrollmentRequest from "../models/EnrollmentRequest.js";

export const initCourseChat = (io) => {
  const courseNamespace = io.of("/course-chat");

  courseNamespace.on("connection", (socket) => {
    console.log(`[Course Chat] User connected: ${socket.id}`);

    /**
     * User joins a specific course chat room
     */
    socket.on("join_course_chat", ({ courseId, role, userId, userName }) => {
      const roomId = `course_${courseId}`;
      socket.join(roomId);

      console.log(`[Course Chat] ${userName} (${role}) joined room: ${roomId}`);

      // Notify others in the room
      courseNamespace.to(roomId).emit("user_joined", {
        userId,
        userName,
        role,
        message: `${userName} joined the chat`,
        timestamp: new Date(),
      });
    });

    /**
     * User sends a message
     * Also triggers notification emission to relevant parties
     */
    socket.on(
      "send_message",
      async ({ courseId, message, userId, userName, role }) => {
        const roomId = `course_${courseId}`;

        if (!message || message.trim() === "") {
          return;
        }

        // Broadcast message to all users in the room
        courseNamespace.to(roomId).emit("receive_message", {
          courseId,
          sender: {
            _id: userId,
            name: userName,
            role,
          },
          message: message.trim(),
          timestamp: new Date(),
        });

        // Also send to the sender for confirmation
        socket.emit("message_sent", {
          courseId,
          sender: {
            _id: userId,
            name: userName,
            role,
          },
          message: message.trim(),
          timestamp: new Date(),
        });

        // ========================================
        // EMIT NOTIFICATIONS TO RELEVANT USERS
        // ========================================
        try {
          const course = await Course.findById(courseId);
          if (!course) {
            console.error(`[Course Chat] Course not found: ${courseId}`);
            return;
          }

          const messageSummary = message.trim().substring(0, 50);
          const truncatedMessage =
            messageSummary.length < message.trim().length
              ? messageSummary + "..."
              : messageSummary;

          if (role === "teacher") {
            // Teacher sent a message - notify all approved students
            const approvedStudents = await EnrollmentRequest.find({
              course: courseId,
              status: "approved",
            }).select("student");

            approvedStudents.forEach((enrollment) => {
              const studentId = enrollment.student._id.toString();
              // Send notification to each student via socket if they're connected
              courseNamespace.to(studentId).emit("new_notification", {
                type: "message",
                title: `New message from ${course.title}`,
                message: `${userName}: ${truncatedMessage}`,
                courseId,
                senderId: userId,
                senderName: userName,
                senderRole: role,
                actionUrl: `/course/${courseId}/chat`,
                timestamp: new Date(),
              });
            });
          } else if (role === "student") {
            // Student sent a message - notify teacher and other students
            const teacherId = course.teacher._id.toString();

            // Notify teacher
            courseNamespace.to(teacherId).emit("new_notification", {
              type: "message",
              title: `New message from ${userName} in ${course.title}`,
              message: `${userName}: ${truncatedMessage}`,
              courseId,
              senderId: userId,
              senderName: userName,
              senderRole: role,
              actionUrl: `/course/${courseId}/chat`,
              timestamp: new Date(),
            });

            // Notify other enrolled students
            const approvedStudents = await EnrollmentRequest.find({
              course: courseId,
              status: "approved",
            }).select("student");

            approvedStudents.forEach((enrollment) => {
              const studentId = enrollment.student._id.toString();
              if (studentId !== userId) {
                courseNamespace.to(studentId).emit("new_notification", {
                  type: "message",
                  title: `New message from ${userName} in ${course.title}`,
                  message: `${userName}: ${truncatedMessage}`,
                  courseId,
                  senderId: userId,
                  senderName: userName,
                  senderRole: role,
                  actionUrl: `/course/${courseId}/chat`,
                  timestamp: new Date(),
                });
              }
            });
          }
        } catch (notificationError) {
          // Log the error but don't stop message flow
          console.error(
            "[Course Chat] Error emitting notifications:",
            notificationError,
          );
        }

        console.log(
          `[Course Chat] Message in ${roomId} from ${userName}: ${message}`,
        );
      },
    );

    /**
     * User leaves a course chat room
     */
    socket.on("leave_course_chat", ({ courseId, userId, userName, role }) => {
      const roomId = `course_${courseId}`;
      socket.leave(roomId);

      console.log(`[Course Chat] ${userName} left room: ${roomId}`);

      // Notify others in the room
      courseNamespace.to(roomId).emit("user_left", {
        userId,
        userName,
        role,
        message: `${userName} left the chat`,
        timestamp: new Date(),
      });
    });

    /**
     * User is typing indicator
     */
    socket.on("typing", ({ courseId, userId, userName, role }) => {
      const roomId = `course_${courseId}`;
      socket.to(roomId).emit("user_typing", {
        userId,
        userName,
        role,
        timestamp: new Date(),
      });
    });

    /**
     * User stopped typing
     */
    socket.on("stop_typing", ({ courseId, userId }) => {
      const roomId = `course_${courseId}`;
      socket.to(roomId).emit("user_stopped_typing", {
        userId,
        timestamp: new Date(),
      });
    });

    /**
     * Handle disconnection
     */
    socket.on("disconnect", () => {
      console.log(`[Course Chat] User disconnected: ${socket.id}`);
    });
  });
};
