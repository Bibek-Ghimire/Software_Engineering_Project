// backend/controllers/resourceController.js
import Resource from "../models/Resource.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ GET all resources
export const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate("teacher", "name email");
    res.status(200).json(resources);
  } catch (err) {
    console.error("GetAllResources Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ CREATE resource
export const createResource = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { title, description } = req.body;
    const file = req.file;

    if (!title || !description || !file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const teacherId = req.user._id?.toString() || req.user.id?.toString();

    const newResource = new Resource({
      title,
      description,
      fileUrl: `/uploads/${file.filename}`,
      fileType: file.mimetype,
      teacher: teacherId,
    });

    await newResource.save();
    res.status(201).json(newResource);
  } catch (err) {
    console.error("CreateResource Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ UPDATE resource
export const updateResource = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user._id?.toString() || req.user.id?.toString();
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    if (!resource.teacher || resource.teacher.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description } = req.body;

    // If new file uploaded
    if (req.file) {
      try {
        if (resource.fileUrl) {
          const oldFilePath = path.join(
            __dirname,
            "../uploads",
            path.basename(resource.fileUrl)
          );
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
      } catch (fileErr) {
        console.error("File deletion error (update):", fileErr.message);
      }

      resource.fileUrl = `/uploads/${req.file.filename}`;
      resource.fileType = req.file.mimetype;
    }

    console.log("DEBUG User trying to update/delete:", userId);
console.log("DEBUG Resource teacher:", resource.teacher?.toString());

    resource.title = title || resource.title;
    resource.description = description || resource.description;

    await resource.save();
    res.status(200).json(resource);
  } catch (err) {
    console.error("UpdateResource Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ DELETE resource
export const deleteResource = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user._id?.toString() || req.user.id?.toString();
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    if (!resource.teacher || resource.teacher.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete file safely
    try {
      if (resource.fileUrl) {
        const filePath = path.join(
          __dirname,
          "../uploads",
          path.basename(resource.fileUrl)
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    } catch (fileErr) {
      console.error("File deletion error (delete):", fileErr.message);
    }

    console.log("DEBUG User trying to update/delete:", userId);
console.log("DEBUG Resource teacher:", resource.teacher?.toString());

    await resource.deleteOne();
    res.status(200).json({ message: "Resource deleted" });
  } catch (err) {
    console.error("DeleteResource Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
