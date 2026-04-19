import mongoose from "mongoose";
import User from "./models/User.js";
import Batch from "./models/Batch.js";

async function check() {
  try {
    await mongoose.connect("mongodb://localhost:27017/syncademyDB");

    const totalStudents = await User.countDocuments({ role: "student" });
    const allocatedStudents = await User.countDocuments({
      role: "student",
      batchId: { $exists: true },
    });
    const totalBatches = await Batch.countDocuments({});

    console.log("\n✅ BATCH ALLOCATION REPORT");
    console.log("==========================");
    console.log(`Total Students: ${totalStudents}`);
    console.log(`Allocated Students: ${allocatedStudents}`);
    console.log(`Total Batches: ${totalBatches}`);
    console.log(
      `Allocation Rate: ${totalStudents > 0 ? Math.round((allocatedStudents / totalStudents) * 100) : 0}%`,
    );

    if (totalBatches > 0) {
      console.log("\n🎓 Batch Details:");
      const batches = await Batch.find({}).populate("members");
      batches.forEach((batch, idx) => {
        console.log(`\n  Batch ${idx + 1}: ${batch.name}`);
        console.log(`    Members: ${batch.members.length}/${batch.maxSize}`);
        console.log(`    Interests: ${batch.interests.join(", ")}`);
        console.log(`    Algorithm: ${batch.allocationAlgorithm}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

check();
