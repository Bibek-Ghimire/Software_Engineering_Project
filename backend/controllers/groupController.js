import Group from "../models/Group.js";

// POST /api/groups
export const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const group = await Group.create({
      name,
      description,
      createdBy: req.user.id,
      members: [req.user.id]
    });
    res.status(201).json({ message: "Group created", group });
  } catch (err) {
    res.status(500).json({ message: "Error creating group", error: err.message });
  }
};

// GET /api/groups
export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate("createdBy", "name email").populate("members", "name");
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: "Error fetching groups", error: err.message });
  }
};

// GET /api/groups/my
export const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({ createdBy: req.user.id });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: "Error fetching my groups", error: err.message });
  }
};

// PUT /api/groups/join/:groupId
export const joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ message: "Already a member" });
    }

    group.members.push(req.user.id);
    await group.save();

    res.json({ message: "Joined group successfully", group });
  } catch (err) {
    res.status(500).json({ message: "Error joining group", error: err.message });
  }
};

// PUT /api/groups/leave/:groupId
export const leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    group.members = group.members.filter(member => member.toString() !== req.user.id);
    await group.save();

    res.json({ message: "Left group successfully", group });
  } catch (err) {
    res.status(500).json({ message: "Error leaving group", error: err.message });
  }
};
