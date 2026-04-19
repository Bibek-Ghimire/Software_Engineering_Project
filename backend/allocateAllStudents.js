import "dotenv/config.js";
import mongoose from "mongoose";
import User from "./models/User.js";
import Batch from "./models/Batch.js";
import { allocateAllStudentsToBatches } from "./services/batchAllocationService.js";

const allocateStudents = async () => {
  try {
    console.log("📦 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Count unallocated students
    const unallocatedCount = await User.countDocuments({
      role: "student",
      $or: [{ batchId: { $exists: false } }, { batchId: null }],
    });

    console.log(`📊 Students needing allocation: ${unallocatedCount}`);

    if (unallocatedCount > 0) {
      console.log("\n🔄 Running batch allocation...\n");
      const result = await allocateAllStudentsToBatches();

      console.log(`✅ ${result.message}`);
      console.log(`   Total students: ${result.totalStudents}`);
      console.log(`   Allocated: ${result.allocated}`);
      console.log(`   Total batches created: ${result.totalBatches}\n`);

      if (result.batches && result.batches.length > 0) {
        console.log("📋 Batch Summary:");
        for (const batch of result.batches) {
          console.log(`   - ${batch.name}`);
          console.log(
            `     Interests: ${batch.interests.join(", ") || "None"}`,
          );
          console.log(`     Members: ${batch.members.length}`);
        }
      }
    } else {
      console.log("✅ All students already allocated!\n");
    }

    // Show final batch allocation summary
    const batches = await Batch.find().populate(
      "members",
      "name email interests",
    );
    console.log(`\n📊 Total batches in database: ${batches.length}`);

    for (const batch of batches) {
      console.log(`\n🎓 ${batch.name}`);
      console.log(`   Interests: ${batch.interests.join(", ") || "General"}`);
      console.log(`   Members (${batch.members.length}/${batch.maxSize}):`);
      batch.members.slice(0, 5).forEach((member) => {
        console.log(`     - ${member.name} (${member.email})`);
      });
      if (batch.members.length > 5) {
        console.log(`     ... and ${batch.members.length - 5} more`);
      }
    }

    console.log("\n✅ Allocation complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

allocateStudents();
