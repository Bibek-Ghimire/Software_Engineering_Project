import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { Send, Clock, User, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../../components/Sidebar";

const StudentCourseChat = () => {
  const { courseId } = useParams();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [socket, setSocket] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [teacher, setTeacher] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  // Debug: Log user info when component loads
  useEffect(() => {
    console.log("=== STUDENT CHAT COMPONENT LOADED ===");
    console.log("User from sessionStorage:", user);
    console.log("User ID (_id):", user._id);
    console.log("User ID (id):", user.id);
    console.log("User name:", user.name);
  }, []);

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch course chat data
  const fetchChatData = useCallback(async () => {
    try {
      setLoading(true);

      // Get enrolled courses to find course name and teacher
      const coursesResponse = await axios.get(
        "http://localhost:5000/api/chat/student/enrolled-courses",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const course = coursesResponse.data.courses.find(
        (c) => c._id === courseId,
      );
      if (course) {
        setCourseName(course.title);
        setTeacher(course.teacher);
      }

      // Get chat messages
      const messagesResponse = await axios.get(
        `http://localhost:5000/api/chat/course/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMessages(messagesResponse.data.messages);

      // Mark messages as read
      await axios.put(
        `http://localhost:5000/api/chat/course/${courseId}/mark-read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (error) {
      console.error("Error fetching chat data:", error);
      toast.error("Failed to load chat");
    } finally {
      setLoading(false);
    }
  }, [courseId, token]);

  // Initialize socket connection and events
  useEffect(() => {
    fetchChatData();

    const newSocket = io("http://localhost:5000/course-chat");

    newSocket.on("connect", () => {
      console.log("Connected to chat server");
      newSocket.emit("join_course_chat", {
        courseId,
        role: "student",
        userId: user._id || user.id,
        userName: user.name,
      });
    });

    newSocket.on("receive_message", (data) => {
      // Skip if message is from current user (already added via message_sent)
      const currentUserId = user._id || user.id;
      if (String(data.sender._id) !== String(currentUserId)) {
        setMessages((prev) => [...prev, data]);
      }
      // Scroll to bottom after receiving message
      setTimeout(() => scrollToBottom(), 100);
    });

    newSocket.on("message_sent", (data) => {
      setMessages((prev) => [...prev, data]);
      // Scroll to bottom after sending message
      setTimeout(() => scrollToBottom(), 100);
    });

    newSocket.on("user_joined", (data) => {
      if (data.role === "teacher") {
        toast.success(`${data.userName} joined the chat`);
      }
    });

    newSocket.on("user_typing", ({ userId, userName, role }) => {
      if (role === "teacher") {
        setTypingUsers((prev) => ({
          ...prev,
          [userId]: userName,
        }));
      }
    });

    newSocket.on("user_stopped_typing", ({ userId }) => {
      setTypingUsers((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.emit("leave_course_chat", {
          courseId,
          userId: user._id || user.id,
          userName: user.name,
          role: "student",
        });
        newSocket.close();
      }
    };
  }, [courseId, user._id, user.name, fetchChatData]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Handle typing indicator
  const handleInputChange = (e) => {
    setMessageText(e.target.value);

    if (socket) {
      socket.emit("typing", {
        courseId,
        userId: user._id || user.id,
        userName: user.name,
        role: "student",
      });
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (socket) {
        socket.emit("stop_typing", {
          courseId,
          userId: user._id || user.id,
        });
      }
    }, 3000);
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText.trim()) {
      return;
    }

    try {
      setSendingMessage(true);

      // Save message to database
      await axios.post(
        `http://localhost:5000/api/chat/course/${courseId}/send`,
        { message: messageText },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Emit through socket
      if (socket) {
        socket.emit("send_message", {
          courseId,
          message: messageText,
          userId: user._id || user.id,
          userName: user.name,
          role: "student",
        });
      }

      setMessageText("");

      if (socket) {
        socket.emit("stop_typing", {
          courseId,
          userId: user._id || user.id,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen page-surface">
        <div className="w-64 fixed top-0 left-0 h-full z-30">
          <Sidebar />
        </div>
        <div className="ml-64 w-full flex items-center justify-center p-6">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg font-semibold">
              Loading chat...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen page-surface">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-30">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="ml-64 w-full flex flex-col h-screen relative">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 p-3 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-blue-600 dark:text-blue-400 shadow-xl hover:shadow-2xl hover:scale-110 border-2 border-blue-200/50 dark:border-gray-600/50 transition-all duration-300 z-20 group"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          ) : (
            <Moon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          )}
        </button>
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 p-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {courseName}
            </h1>
            {teacher && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Instructor: {teacher.name}
              </p>
            )}
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Clock className="w-12 h-12 mb-4 text-gray-400" />
                <p>No messages yet. Be the first to say hello!</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                // Get current user ID (handle both _id and id properties)
                const currentUserId = user._id || user.id;
                const msgSenderId = msg.sender._id || msg.sender;

                // Convert both IDs to strings for proper comparison
                const isSentByMe =
                  String(msgSenderId) === String(currentUserId);

                return (
                  <motion.div
                    key={msg._id || `msg-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      display: "flex",
                      justifyContent: isSentByMe ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "300px",
                        borderRadius: "8px",
                        padding: "8px 16px",
                        backgroundColor: isSentByMe ? "#3b82f6" : "#e5e7eb",
                        color: isSentByMe ? "white" : "#1f2937",
                      }}
                    >
                      <p className="text-sm font-semibold mb-1">
                        {msg.sender.name}{" "}
                        {msg.senderRole === "teacher" && (
                          <span className="text-xs opacity-75">
                            (Instructor)
                          </span>
                        )}
                      </p>
                      <p>{msg.message}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            )}
            {Object.keys(typingUsers).length > 0 && (
              <div className="flex gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="inline-block">
                  {Object.values(typingUsers).join(", ")} typing...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
            <form
              onSubmit={handleSendMessage}
              className="flex gap-2"
            >
              <input
                type="text"
                value={messageText}
                onChange={handleInputChange}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                disabled={sendingMessage || !messageText.trim()}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourseChat;

