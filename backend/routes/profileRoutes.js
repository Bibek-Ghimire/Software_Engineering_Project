import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import User from "../models/User.js";

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
      if (req.files && req.files.profilePicture && req.files.profilePicture.length > 0) {
        user.profilePicture = "/uploads/" + req.files.profilePicture[0].filename;
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
  }
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
  }
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
  }
);

export default router;
