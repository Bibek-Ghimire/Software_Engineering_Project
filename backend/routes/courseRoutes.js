// backend/routes/courseRoutes.js
import express from "express";
import Course from "../models/Course.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    // Populate teacher's name, email, and role
    const courses = await Course.find().populate("teacher", "name email role");
    res.status(200).json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("teacher", "name email role");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json(course);
  } catch (err) {
    console.error("Error fetching course:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (teacher only)
router.post("/", protect, async (req, res) => {
  const { title, description, level, duration, price } = req.body;
  if (!title || !description || !level || !duration || !price)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const course = new Course({
      title,
      description,
      level,
      duration,
      price,
      teacher: req.user.id, // Ensure authMiddleware sets req.user.id
    });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (teacher only)
router.put("/:id", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Only the teacher who created can update
    if (course.teacher.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const { title, description, level, duration, price } = req.body;
    course.title = title || course.title;
    course.description = description || course.description;
    course.level = level || course.level;
    course.duration = duration || course.duration;
    course.price = price || course.price;

    await course.save();
    res.status(200).json(course);
  } catch (err) {
    console.error("Error updating course:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (teacher only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Only the teacher who created can delete
    if (!course.teacher || course.teacher.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await Course.findByIdAndDelete(course._id);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
