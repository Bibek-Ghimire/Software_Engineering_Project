import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Course from "./models/Course.js";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected for seeding"))
.catch(err => console.error(err));

const seedCourse = async () => {
  try {
    // Find a teacher
    const teacher = await User.findOne({ role: "teacher" });
    if (!teacher) {
      console.log("No teacher found in DB. Create a teacher first!");
      process.exit();
    }

    // Create a test course
    const course = new Course({
      title: "React for Beginners",
      price: 50,
      sales: 10,
      teacher: teacher._id
    });

    await course.save();
    console.log("Test course created successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedCourse();
