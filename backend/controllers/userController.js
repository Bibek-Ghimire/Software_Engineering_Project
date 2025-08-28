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

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, college, bio, skills, interests, profilePhoto } = req.body;
    const user = await User.create({ name, email, password, college, bio, skills, interests, profilePhoto });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
