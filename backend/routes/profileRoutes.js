import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import User from "../models/User.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// GET profile
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// PUT profile update
router.put(
  "/",
  protect,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const fields = ["name", "college", "bio", "linkedin", "github"];
      fields.forEach((f) => {
        if (req.body[f] !== undefined) user[f] = req.body[f];
      });

      // Parse skills/interests safely
      const parseJSON = (str) => {
        if (!str) return [];
        try {
          return JSON.parse(str);
        } catch {
          return [];
        }
      };
      user.skills = parseJSON(req.body.skills);
      user.interests = parseJSON(req.body.interests);

      // File uploads
      if (req.files.photo) user.profilePicture = "/" + req.files.photo[0].path.replace(/\\/g, "/");
      if (req.files.resume) user.resume = "/" + req.files.resume[0].path.replace(/\\/g, "/");

      await user.save();
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to save profile" });
    }
  }
);

export default router;
