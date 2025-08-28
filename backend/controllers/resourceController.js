// backend/controllers/resourceController.js
import Resource from "../models/Resource.js";
import fs from "fs";
import path from "path";

// GET all resources
export const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate("teacher", "name email");
    res.status(200).json(resources);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST create resource
export const createResource = async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!title || !description || !file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newResource = new Resource({
      title,
      description,
      fileUrl: `/uploads/${file.filename}`,
      fileType: file.mimetype,
      teacher: req.user.id,
    });

    await newResource.save();
    res.status(201).json(newResource);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT update resource
export const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    if (resource.teacher.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const { title, description } = req.body;

    if (req.file) {
      // Delete old file
      fs.unlinkSync(path.join("backend", resource.fileUrl));
      resource.fileUrl = `/uploads/${req.file.filename}`;
      resource.fileType = req.file.mimetype;
    }

    resource.title = title || resource.title;
    resource.description = description || resource.description;

    await resource.save();
    res.status(200).json(resource);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE resource
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    if (resource.teacher.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    // Delete file from server
    fs.unlinkSync(path.join("backend", resource.fileUrl));
    await resource.remove();
    res.status(200).json({ message: "Resource deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
