import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  getAllTeachers,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);

// GET all teachers
router.get("/teachers", getAllTeachers);

// GET specific user by ID (readonly) - must be last to avoid conflicts
router.get("/:id", protect, getUserById);

export default router;
