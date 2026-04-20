/**
 * COURSE CHAT SOCKET.IO INTEGRATION
 * Real-time chat between teachers and approved students for specific courses
 *
 * Usage:
 * - Teacher joins a course chat room: socket.emit('join_course_chat', { courseId, role: 'teacher' })
 * - Student joins a course chat room: socket.emit('join_course_chat', { courseId, role: 'student' })
 * - User sends message: socket.emit('send_message', { courseId, message: 'text' })
 * - Listen for messages: socket.on('receive_message', (data) => { ... })
 */

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
     */
    socket.on(
      "send_message",
      ({ courseId, message, userId, userName, role }) => {
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
