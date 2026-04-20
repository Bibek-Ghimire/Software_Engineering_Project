import jwt from "jsonwebtoken";
import User from "../models/User.js";

// General JWT protection middleware
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log(
        `🔐 Auth: Decoded ID: ${decoded.id}, Decoded Role: ${decoded.role}`,
      );
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        console.error(`❌ Auth: User NOT found with ID: ${decoded.id}`);
        return res
          .status(401)
          .json({ message: "Auth middleware: User not found" });
      }

      console.log(`✅ Auth: User found: ${user.name}, Role: ${user.role}`);

      // Verify role exists and is valid
      if (!user.role) {
        console.error(`❌ Auth: User ${user.name} has no role assigned`);
        return res
          .status(401)
          .json({ message: "Auth middleware: User role not defined" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("❌ Auth error:", error.message);
      return res.status(401).json({ message: "Auth middleware: Token failed" });
    }
  } else {
    console.log("❌ No Bearer token in headers");
    return res.status(401).json({ message: "Auth middleware: No token" });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `Access denied: ${req.user.role} role not allowed` });
    }
    next();
  };
};

// Specific teacher protection middleware
const protectTeacher = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
      if (!user || user.role !== "teacher") {
        return res.status(401).json({ message: "Not authorized as teacher" });
      }

      req.user = user; // contains all teacher fields
      next();
    } catch (error) {
      console.error("Teacher auth error:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export { protect, authorize, protectTeacher };
