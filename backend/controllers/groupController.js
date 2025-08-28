import Group from "../models/Group.js";

// Get all groups
export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate("members", "name email profilePhoto");
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new group
export const createGroup = async (req, res) => {
  try {
    const { name, description, members, tags } = req.body;
    const group = await Group.create({ name, description, members, tags });
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
