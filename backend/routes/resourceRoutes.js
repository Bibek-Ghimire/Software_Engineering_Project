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

// Setup Multer storage with correct absolute path
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")), // fixed path
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Routes
router.get("/", protect, getAllResources);
router.post("/", protect, upload.single("file"), createResource);
router.put("/:id", protect, upload.single("file"), updateResource);
router.delete("/:id", protect, deleteResource);

export default router;
