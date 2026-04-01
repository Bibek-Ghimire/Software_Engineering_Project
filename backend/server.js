// server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

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
// Middleware
import { protect } from "./middleware/authMiddleware.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";

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
    origin: "http://localhost:5173",
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
app.use("/api/leaderboard", leaderboardRoutes);
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
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// -------------------------
// Start Server
// -------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
