import User from "../models/User.js";

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      college,
      bio,
      skills,
      interests,
      profilePhoto,
    } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      college,
      bio,
      skills,
      interests,
      profilePhoto,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("-password"); // exclude passwords
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching teachers" });
  }
};
