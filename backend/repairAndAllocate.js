import "dotenv/config.js";
import mongoose from "mongoose";
import User from "./models/User.js";
import Batch from "./models/Batch.js";
import {
  allocateAllStudentsToBatches,
  allocateUserToBatch,
} from "./services/batchAllocationService.js";

const repairAndAllocate = async () => {
  try {
    console.log("🔧 Starting batch repair and allocation...\n");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Step 1: Find students with invalid batchId references
    console.log("📋 Step 1: Checking for orphaned batch references...\n");
    const allStudents = await User.find({ role: "student" });
    const orphanedStudents = [];

    for (const student of allStudents) {
      if (student.batchId) {
        const batch = await Batch.findById(student.batchId);
        if (!batch) {
          orphanedStudents.push(student);
          console.log(
            `   ⚠️  ${student.name} references non-existent batch ${student.batchId}`,
          );
        }
      }
    }

    if (orphanedStudents.length > 0) {
      console.log(`\n   Found ${orphanedStudents.length} orphaned students`);
      console.log("   Clearing their batch assignments...\n");
      for (const student of orphanedStudents) {
        student.batchId = null;
        await student.save();
        console.log(`   ✅ Cleared batch for ${student.name}`);
      }
    } else {
      console.log("   ✅ No orphaned references found\n");
    }

    // Step 2: Allocate all unallocated students
    console.log("\n📊 Step 2: Allocating unallocated students...\n");

    const unallocatedCount = await User.countDocuments({
      role: "student",
      $or: [{ batchId: { $exists: false } }, { batchId: null }],
    });

    if (unallocatedCount > 0) {
      const result = await allocateAllStudentsToBatches();
      console.log(`✅ Allocation complete!`);
      console.log(`   Students allocated: ${result.allocated}`);
      console.log(`   Batches created: ${result.totalBatches}\n`);
    } else {
      console.log("✅ All students already allocated\n");
    }

    // Step 3: Display final status
    console.log("📊 Final Status:\n");
    const finalStudents = await User.find({ role: "student" });
    const allocatedFinal = finalStudents.filter((s) => s.batchId).length;
    const unallocatedFinal = finalStudents.filter((s) => !s.batchId).length;

    console.log(`   Total students: ${finalStudents.length}`);
    console.log(`   ✅ Allocated: ${allocatedFinal}`);
    console.log(`   ❌ Unallocated: ${unallocatedFinal}\n`);

    // Step 4: Show batch details
    const batches = await Batch.find().populate(
      "members",
      "name email interests",
    );
    console.log(`📚 Batch Details (${batches.length} total):\n`);

    for (const batch of batches) {
      console.log(`🎓 ${batch.name}`);
      console.log(`   Interests: ${batch.interests.join(", ") || "General"}`);
      console.log(`   Members: ${batch.members.length}/${batch.maxSize}`);
      batch.members.slice(0, 3).forEach((member) => {
        console.log(`     • ${member.name}`);
      });
      if (batch.members.length > 3) {
        console.log(`     • ... and ${batch.members.length - 3} more`);
      }
      console.log();
    }

    console.log("✅ Repair and allocation complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

repairAndAllocate();
