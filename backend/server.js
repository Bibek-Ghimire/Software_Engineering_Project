// server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";

// -------------------------
// Import Routes
// -------------------------
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import discussionRoutes from "./routes/discussionRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import batchRoutes from "./routes/batchRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import enrollmentRequestRoutes from "./routes/enrollmentRequestRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
// Middleware
import { protect } from "./middleware/authMiddleware.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";

// -------------------------
// Import Socket Handlers
// -------------------------
import { initCourseChat } from "./socket/courseChat.js";
import { initNotificationSocket } from "./socket/notificationSocket.js";

// -------------------------
// Config & App Init
// -------------------------
dotenv.config();
const app = express();

// -------------------------
// Middleware
// -------------------------
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    credentials: true,
  }),
);
app.use(express.json()); // parse JSON

// -------------------------
// Test Route
// -------------------------
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running" });
});

// -------------------------
// API Routes
// -------------------------
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/enrollment-requests", enrollmentRequestRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/chat", chatRoutes);
// Example protected route
app.get("/api/protected", protect, (req, res) => {
  res.json({ message: `Hello ${req.user.name}, you are authorized!` });
});

// -------------------------
// File Uploads
// -------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------------
// MongoDB Connection
// -------------------------
console.log(
  `📦 Connecting to MongoDB: ${process.env.MONGO_URI?.substring(0, 60)}...`,
);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// -------------------------
// Start Server
// -------------------------
const PORT = process.env.PORT || 5000;

// Create HTTP server with socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    credentials: true,
  },
});

// Initialize socket handlers
initCourseChat(io);
const notificationIO = initNotificationSocket(io);

// Export io for use in other modules
global.io = io;
global.notificationIO = notificationIO;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`💬 Socket.IO enabled for real-time chat and notifications`);
});
