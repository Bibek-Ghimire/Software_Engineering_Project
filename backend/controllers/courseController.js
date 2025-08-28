// backend/controllers/courseController.js
import Course from "../models/Course.js";

// GET all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("teacher", "name email role");
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// GET single course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("teacher", "name email role");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// POST: Create a new course
export const createCourse = async (req, res) => {
  try {
    const { title, description, duration, level, price } = req.body;

    if (!title || !description || !duration || !level || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Attach teacher ID from req.user (JWT middleware)
    const teacherId = req.user.id;

    const newCourse = new Course({
      title,
      description,
      duration,
      level,
      price,
      teacher: teacherId,
    });

    await newCourse.save();
    res.status(201).json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// PUT: Update an existing course
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Only the teacher who created can update
    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this course" });
    }

    const { title, description, duration, level, price } = req.body;
    course.title = title || course.title;
    course.description = description || course.description;
    course.duration = duration || course.duration;
    course.level = level || course.level;
    course.price = price || course.price;

    await course.save();
    res.status(200).json({ message: "Course updated", course });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// DELETE: Remove a course
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Only the teacher who created can delete
    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this course" });
    }

    await course.remove();
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
