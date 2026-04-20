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

const checkDatabase = async () => {
  try {
    // Check teachers
    const teachers = await User.find({ role: "teacher" });
    console.log(`\n👨‍🏫 Found ${teachers.length} teachers:`);
    teachers.forEach((t) => {
      console.log(`  - ${t.name} (${t._id})`);
    });

    // Check courses
    const courses = await Course.find().populate("teacher", "name");
    console.log(`\n📚 Found ${courses.length} courses:`);
    courses.forEach((c) => {
      console.log(`  - "${c.title}"`);
      console.log(`    Teacher: ${c.teacher ? c.teacher.name : "NO TEACHER!"}`);
      console.log(`    Teacher ID: ${c.teacher ? c.teacher._id : "null"}`);
    });

    // Check if first course has teacher populated
    if (courses.length > 0) {
      const firstCourse = await Course.findById(courses[0]._id).populate(
        "teacher",
        "name email",
      );
      console.log(`\n🔍 First course detailed check:`);
      console.log(`  Title: ${firstCourse.title}`);
      console.log(`  Teacher object: ${JSON.stringify(firstCourse.teacher)}`);
      console.log(`  Teacher populated: ${!!firstCourse.teacher}`);
    }

    process.exit();
  } catch (err) {
    console.error("Error checking database:", err);
    process.exit(1);
  }
};

checkDatabase();
