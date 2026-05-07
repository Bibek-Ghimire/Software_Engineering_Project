import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import Course from "../models/Course.js";

const router = express.Router();

// ----------------- Multer Setup -----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ----------------- Helper -----------------
const parseJSON = (str) => {
  if (!str) return [];
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
};

// ----------------- GET Profile -----------------
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// ----------------- UPDATE Profile (Student/Teacher) -----------------
router.put(
  "/",
  protect,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Editable fields
      const fields = [
        "name",
        "college",
        "bio",
        "linkedin",
        "github",
        "qualification",
        "subject",
      ];
      fields.forEach((f) => {
        if (req.body[f] !== undefined) user[f] = req.body[f];
      });

      // Array fields
      user.skills = parseJSON(req.body.skills);
      user.interests = parseJSON(req.body.interests);
      user.achievements = parseJSON(req.body.achievements);

      // File uploads
      if (
        req.files &&
        req.files.profilePicture &&
        req.files.profilePicture.length > 0
      ) {
        user.profilePicture =
          "/uploads/" + req.files.profilePicture[0].filename;
      }
      if (req.files && req.files.resume && req.files.resume.length > 0) {
        user.resume = "/uploads/" + req.files.resume[0].filename;
      }

      await user.save();
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to save profile" });
    }
  },
);

// ----------------- Teacher Upload Photo -----------------
router.post(
  "/teacher/upload-photo",
  protect,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: "User not found" });
      if (!req.file)
        return res.status(400).json({ message: "No file uploaded" });

      user.profilePicture = "/uploads/" + req.file.filename;
      await user.save();
      res.json({ profilePicture: user.profilePicture });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to upload photo" });
    }
  },
);

// ----------------- Teacher Upload Resume -----------------
router.post(
  "/teacher/upload-resume",
  protect,
  upload.single("resume"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: "User not found" });
      if (!req.file)
        return res.status(400).json({ message: "No file uploaded" });

      user.resume = "/uploads/" + req.file.filename;
      await user.save();
      res.json({ resume: user.resume });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to upload resume" });
    }
  },
);

// ----------------- Enrolled Courses -----------------
router.get("/enrolled-courses", protect, async (req, res) => {
  try {
    const studentId = req.user._id || req.user.id;
    console.log(`📚 Fetching enrolled courses for user: ${studentId} (${req.user.name})`);

    // Get all courses where student is enrolled (in students array)
    // We use a more robust query to match the student ID in the array
    const courses = await Course.find({
      students: studentId,
    }).populate({
      path: "teacher",
      select: "name email _id",
    });

    console.log(
      `✅ Dashboard: Found ${courses.length} enrolled courses for ${req.user.name}`,
    );

    // Transform courses to include needed fields
    const enrolledCourses = courses.map((course) => ({
      _id: course._id,
      title: course.title,
      description: course.description,
      teacher: {
        _id: course.teacher._id,
        name: course.teacher.name,
        email: course.teacher.email,
      },
      level: course.level,
      duration: course.duration,
      price: course.price,
      enrollmentCount: course.enrollmentCount || 0,
    }));

    console.log(
      `📤 Returning ${enrolledCourses.length} enrolled courses to client`,
    );
    res.json(enrolledCourses);
  } catch (error) {
    console.error("❌ Error fetching enrolled courses:", error);
    res.status(500).json({
      message: "Error fetching enrolled courses",
      error: error.message,
    });
  }
});

// ----------------- Saved Items -----------------
router.get("/saved-items", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("savedCourses")
      .populate("savedResources");
    res.json({
      savedCourses: user.savedCourses || [],
      savedResources: user.savedResources || [],
      completedCourses: user.completedCourses || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching saved items" });
  }
});

// ----------------- Completed Courses -----------------
router.post("/complete-course/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const courseId = req.params.id;

    // Check if course is already in completedCourses (comparing ObjectIds properly)
    const alreadyCompleted = user.completedCourses.some(
      (id) => id.toString() === courseId,
    );

    if (!alreadyCompleted) {
      user.completedCourses.push(courseId);
      await user.save();
    }
    res.json({ message: "Course marked as completed!" });
  } catch (err) {
    console.error("Error completing course:", err);
    res
      .status(500)
      .json({ message: "Error completing course", error: err.message });
  }
});

router.delete("/complete-course/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const courseId = req.params.id;

    user.completedCourses = user.completedCourses.filter(
      (id) => id.toString() !== courseId,
    );

    await user.save();
    res.json({ message: "Course marked as in-progress" });
  } catch (err) {
    console.error("Error reverting completion:", err);
    res.status(500).json({ message: "Error updating course status" });
  }
});

router.delete("/complete-course/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.completedCourses = user.completedCourses.filter(
      (id) => id.toString() !== req.params.id,
    );
    await user.save();
    res.json({ message: "Course marked as in-progress" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uncompleting course" });
  }
});

router.post("/save-course/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.savedCourses.includes(req.params.id)) {
      user.savedCourses.push(req.params.id);
      await user.save();
    }
    res.json({ message: "Course saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving course" });
  }
});

router.delete("/save-course/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.savedCourses = user.savedCourses.filter(
      (id) => id.toString() !== req.params.id,
    );
    await user.save();
    res.json({ message: "Course removed from saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error unsaving course" });
  }
});

router.post("/save-resource/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.savedResources.includes(req.params.id)) {
      user.savedResources.push(req.params.id);
      await user.save();
    }
    res.json({ message: "Resource saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving resource" });
  }
});

router.delete("/save-resource/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.savedResources = user.savedResources.filter(
      (id) => id.toString() !== req.params.id,
    );
    await user.save();
    res.json({ message: "Resource removed from saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error unsaving resource" });
  }
});

export default router;
