import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Course from "./models/Course.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const fixCourses = async () => {
  try {
    // Find the first teacher (or create one if needed)
    let teacher = await User.findOne({ role: "teacher" });
    if (!teacher) {
      console.log("No teacher found. Creating one...");
      teacher = new User({
        name: "Dr. John Smith",
        email: "teacher@test.com",
        password: "password123",
        role: "teacher",
        subject: "Python",
        department: "Computer Science",
        bio: "Expert in Python programming and web development",
        profilePicture: "",
        engagementScore: 4.8,
        coursesCreated: 5,
      });
      await teacher.save();
      console.log("Teacher created!");
    }

    // Update all courses without a teacher
    const result = await Course.updateMany(
      { $or: [{ teacher: null }, { teacher: { $exists: false } }] },
      { teacher: teacher._id },
    );

    console.log(`✅ Fixed ${result.modifiedCount} courses`);
    process.exit();
  } catch (err) {
    console.error("Error fixing courses:", err);
    process.exit(1);
  }
};

fixCourses();
