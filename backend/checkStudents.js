import "dotenv/config.js";
import mongoose from "mongoose";
import User from "./models/User.js";

const checkStudents = async () => {
  try {
    console.log("📦 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected\n");

    const students = await User.find({ role: "student" }).select(
      "name email interests batchId",
    );

    console.log(`📊 Total students: ${students.length}\n`);

    const allocated = students.filter((s) => s.batchId);
    const unallocated = students.filter((s) => !s.batchId);

    console.log(`✅ Allocated: ${allocated.length}`);
    console.log(`❌ Unallocated: ${unallocated.length}\n`);

    if (students.length > 0) {
      console.log("👥 Student List:");
      students.forEach((student) => {
        const status = student.batchId ? "✅" : "❌";
        const batchInfo = student.batchId
          ? `Batch: ${student.batchId}`
          : "No batch";
        console.log(
          `${status} ${student.name} (${student.email}) - Interests: ${student.interests.join(", ") || "None"} - ${batchInfo}`,
        );
      });
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

checkStudents();
