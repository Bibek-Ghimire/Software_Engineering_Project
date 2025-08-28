import express from "express";
import Group from "../models/Group.js";

const router = express.Router();

// @desc    Get all groups
// @route   GET /api/groups
router.get("/", async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a group
// @route   POST /api/groups
router.post("/", async (req, res) => {
  const { name, description, members, memberCount, courseDetail } = req.body;

  try {
    const group = new Group({
      name,
      description,
      members,
      memberCount,
      courseDetail,
    });

    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Join a group
// @route   POST /api/groups/:id/join
router.post("/:id/join", async (req, res) => {
  const groupId = req.params.id;
  const { userName } = req.body; // pass from frontend

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Prevent duplicate join
    if (group.members.includes(userName)) {
      return res.status(400).json({ message: "Already a member" });
    }

    group.members.push(userName);
    group.memberCount = group.members.length;
    await group.save();

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
