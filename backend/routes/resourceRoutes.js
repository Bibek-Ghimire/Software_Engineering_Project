// backend/routes/resourceRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import {
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
} from "../controllers/resourceController.js";

const router = express.Router();

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "backend/uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Routes
router.get("/", protect, getAllResources);
router.post("/", protect, upload.single("file"), createResource);
router.put("/:id", protect, upload.single("file"), updateResource);
router.delete("/:id", protect, deleteResource);

export default router;
