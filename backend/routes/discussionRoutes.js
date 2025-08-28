import express from "express";
import Discussion from "../models/Discussion.js";

const router = express.Router();

// GET all discussions
router.get("/", async (req, res) => {
  try {
    const discussions = await Discussion.find().sort({ createdAt: -1 });
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new discussion
router.post("/", async (req, res) => {
  const { title, description, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: "Title and Author are required" });
  }

  try {
    const discussion = new Discussion({ title, description, author });
    await discussion.save();
    res.status(201).json(discussion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
