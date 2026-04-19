import "dotenv/config.js";
import mongoose from "mongoose";
import User from "./models/User.js";
import Batch from "./models/Batch.js";

const checkBatches = async () => {
  try {
    console.log("📦 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected\n");

    const batches = await Batch.find().populate(
      "members",
      "name email interests",
    );

    console.log(`📊 Total batches: ${batches.length}\n`);

    if (batches.length > 0) {
      batches.forEach((batch, idx) => {
        console.log(`${idx + 1}. ${batch.name}`);
        console.log(`   ID: ${batch._id}`);
        console.log(`   Interests: ${batch.interests.join(", ") || "None"}`);
        console.log(`   Members (${batch.members.length}/${batch.maxSize}):`);
        batch.members.slice(0, 3).forEach((member) => {
          console.log(`     - ${member.name} (${member.email})`);
        });
        if (batch.members.length > 3) {
          console.log(`     ... and ${batch.members.length - 3} more`);
        }
        console.log();
      });
    } else {
      console.log("❌ No batches found in database!");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

checkBatches();
