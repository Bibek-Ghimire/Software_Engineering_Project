import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { allocateUserToBatch } from "../services/batchAllocationService.js";

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, interests } = req.body;

    console.log(
      `📝 Registration Request - Name: ${name}, Email: ${email}, Role: ${role}, Role Type: ${typeof role}`,
    );

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
      interests: interests || [],
    });
    await newUser.save();

    console.log(
      ` User registered - Name: ${newUser.name}, Role: ${newUser.role}, ID: ${newUser._id}`,
    );

    // Automatically allocate student to a batch
    if (role === "student") {
      try {
        await allocateUserToBatch(newUser._id);
      } catch (batchError) {
        console.log("Batch allocation warning:", batchError.message);
        // Don't fail registration if batch allocation fails
      }
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Registration error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      console.warn(`⚠️  Login failed - Invalid credentials for: ${email}`);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log(
      `🔑 Login successful - User: ${user.name}, ID: ${user._id}, Role: ${user.role}`,
    );

    const token = generateToken(user._id, user.role);
    console.log(
      `✅ JWT token generated - Contains ID: ${user._id}, Role: ${user.role}`,
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        interests: user.interests || [],
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// LOGOUT USER
export const logoutUser = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
