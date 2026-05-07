import mongoose from "mongoose";
import Course from "./models/Course.js";
import User from "./models/User.js";
import Payment from "./models/Payment.js";
import dotenv from "dotenv";

dotenv.config();

const checkEnrollment = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Get all courses with student count
    const courses = await Course.find().select(
      "title students enrollmentCount",
    );
    console.log(`\n📚 Total Courses: ${courses.length}`);
    courses.forEach((course) => {
      console.log(
        `  - ${course.title}: ${course.students.length} students enrolled`,
      );
    });

    // Get all payments
    const payments = await Payment.find().select("status course student");
    console.log(`\n💳 Total Payments: ${payments.length}`);
    const completed = payments.filter((p) => p.status === "completed");
    const pending = payments.filter((p) => p.status === "pending");
    const failed = payments.filter((p) => p.status === "failed");
    console.log(`  - Completed: ${completed.length}`);
    console.log(`  - Pending: ${pending.length}`);
    console.log(`  - Failed: ${failed.length}`);

    // Get a sample student
    const students = await User.find({ role: "student" }).limit(1);
    if (students.length > 0) {
      const student = students[0];
      console.log(`\n👤 Sample Student: ${student.name} (${student._id})`);

      // Check courses where this student is enrolled
      const enrolledCourses = await Course.find({ students: student._id });
      console.log(`  - Enrolled Courses: ${enrolledCourses.length}`);
      enrolledCourses.forEach((course) => {
        console.log(`    - ${course.title}`);
      });

      // Check payments for this student
      const studentPayments = await Payment.find({ student: student._id });
      console.log(`  - Total Payments: ${studentPayments.length}`);
      studentPayments.forEach((p) => {
        console.log(`    - Status: ${p.status}, Course: ${p.course}`);
      });
    }

    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

checkEnrollment();
