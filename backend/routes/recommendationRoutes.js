import {
  getRecommendedCourses,
  getRecommendedResources,
  getRecommendedGroups,
  getRecommendedTeachers,
  addInterestedCourse,
  removeInterestedCourse,
} from "../services/recommendationService.js";
import { protect } from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

/**
 * GET /api/recommendations/courses
 * Get recommended courses for the logged-in user
 */
router.get("/courses", protect, async (req, res) => {
  process.stderr.write("🔴 API Called\n");
  try {
    const limit = req.query.limit || 6;
    const recommendations = await getRecommendedCourses(
      req.user.id,
      parseInt(limit),
    );
    process.stderr.write("🔴 Got " + recommendations.length + " items\n");

    res.json({
      success: true,
      count: recommendations.length,
      data: recommendations.map((course) => ({
        _id: course._id,
        title: course.title,
        description: course.description,
        level: course.level,
        duration: course.duration,
        price: course.price,
        teacher: course.teacher,
        enrollmentCount: course.enrollmentCount,
        rating: course.rating,
        recommendationScore: course.recommendationScore
          ? (course.recommendationScore * 100).toFixed(2)
          : "0.00",
      })),
    });
  } catch (err) {
    console.error(
      "Error fetching recommended courses:",
      err.message,
      err.stack,
    );
    res.status(500).json({
      success: false,
      message: err.message || "Error fetching recommendations",
    });
  }
});

/**
 * GET /api/recommendations/resources
 * Get recommended resources for the logged-in user
 */
router.get("/resources", protect, async (req, res) => {
  try {
    const limit = req.query.limit || 6;
    const recommendations = await getRecommendedResources(
      req.user.id,
      parseInt(limit),
    );

    res.json({
      success: true,
      count: recommendations.length,
      data: recommendations.map((resource) => ({
        _id: resource._id,
        title: resource.title,
        description: resource.description,
        fileUrl: resource.fileUrl,
        teacher: resource.teacher,
        recommendationScore: resource.recommendationScore
          ? (resource.recommendationScore * 100).toFixed(2)
          : "0.00",
      })),
    });
  } catch (err) {
    console.error("Error fetching recommended resources:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching recommendations" });
  }
});

/**
 * GET /api/recommendations/groups
 * Get recommended groups for the logged-in user
 */
router.get("/groups", protect, async (req, res) => {
  try {
    const limit = req.query.limit || 6;
    const recommendations = await getRecommendedGroups(
      req.user.id,
      parseInt(limit),
    );

    res.json({
      success: true,
      count: recommendations.length,
      data: recommendations.map((group) => ({
        _id: group._id,
        name: group.name,
        description: group.description,
        members: group.members,
        memberCount: group.members?.length || 0,
        recommendationScore: group.recommendationScore
          ? (group.recommendationScore * 100).toFixed(2)
          : "0.00",
      })),
    });
  } catch (err) {
    console.error("Error fetching recommended groups:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching recommendations" });
  }
});

/**
 * GET /api/recommendations/teachers
 * Get recommended teachers for the logged-in user
 */
router.get("/teachers", protect, async (req, res) => {
  try {
    const limit = req.query.limit || 6;
    const recommendations = await getRecommendedTeachers(
      req.user.id,
      parseInt(limit),
    );

    res.json({
      success: true,
      count: recommendations.length,
      data: recommendations.map((teacher) => ({
        _id: teacher._id,
        name: teacher.name,
        bio: teacher.bio,
        subject: teacher.subject,
        department: teacher.department,
        profilePicture: teacher.profilePicture,
        engagementScore: teacher.engagementScore,
        coursesCreated: teacher.coursesCreated,
        batch: teacher.batch,
        achievements: teacher.achievements,
        recommendationScore: teacher.recommendationScore
          ? (teacher.recommendationScore * 100).toFixed(2)
          : "0.00",
      })),
    });
  } catch (err) {
    console.error("Error fetching recommended teachers:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching recommendations" });
  }
});

/**
 * POST /api/recommendations/interested-course/:courseId
 * Add a course to user's interested list
 */
router.post("/interested-course/:courseId", protect, async (req, res) => {
  try {
    const user = await addInterestedCourse(req.user.id, req.params.courseId);
    res.json({
      success: true,
      message: "Course added to interested list",
      interestedCount: user.interestedCourses?.length || 0,
    });
  } catch (err) {
    console.error("Error adding interested course:", err);
    res
      .status(500)
      .json({ success: false, message: "Error updating interested courses" });
  }
});

/**
 * DELETE /api/recommendations/interested-course/:courseId
 * Remove a course from user's interested list
 */
router.delete("/interested-course/:courseId", protect, async (req, res) => {
  try {
    const user = await removeInterestedCourse(req.user.id, req.params.courseId);
    res.json({
      success: true,
      message: "Course removed from interested list",
      interestedCount: user.interestedCourses?.length || 0,
    });
  } catch (err) {
    console.error("Error removing interested course:", err);
    res
      .status(500)
      .json({ success: false, message: "Error updating interested courses" });
  }
});

export default router;
