import mongoose from "mongoose";
import User from "./models/User.js";
import Batch from "./models/Batch.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { autoBatchAllocation } from "./services/batchAllocationService.js";

dotenv.config();

const testBatchAllocation = async () => {
  try {
    // Connect to MongoDB
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/syncademy",
    );
    console.log("✅ MongoDB connected\n");

    // Clear existing test data
    console.log("🧹 Cleaning up old test data...");
    await User.deleteMany({
      email: {
        $in: [
          "testuser1@example.com",
          "testuser2@example.com",
          "testuser3@example.com",
        ],
      },
    });
    console.log("✅ Old test data cleaned\n");

    // Create 3 test students
    console.log("👥 Creating test students...\n");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("testpassword123", salt);

    // Student 1: React + Python + Machine Learning
    const student1 = await User.create({
      name: "Alice (React Dev)",
      email: "testuser1@example.com",
      password: hashedPassword,
      role: "student",
      interests: ["React", "Python", "Machine Learning"],
      skills: ["JavaScript", "Python"],
    });
    console.log("✅ Student 1 Created:");
    console.log(`   Name: ${student1.name}`);
    console.log(`   Interests: ${student1.interests.join(", ")}`);
    console.log(`   Email: ${student1.email}\n`);

    // Student 2: React + Python + Web Development (SIMILAR to Student 1)
    const student2 = await User.create({
      name: "Bob (React Dev)",
      email: "testuser2@example.com",
      password: hashedPassword,
      role: "student",
      interests: ["React", "Python", "Web Development"],
      skills: ["JavaScript", "Python"],
    });
    console.log("✅ Student 2 Created:");
    console.log(`   Name: ${student2.name}`);
    console.log(`   Interests: ${student2.interests.join(", ")}`);
    console.log(`   Email: ${student2.email}`);
    console.log(`   ⭐ SIMILAR TO STUDENT 1: Both have React & Python\n`);

    // Student 3: Java + Spring Boot + Data Science (DIFFERENT)
    const student3 = await User.create({
      name: "Charlie (Java Dev)",
      email: "testuser3@example.com",
      password: hashedPassword,
      role: "student",
      interests: ["Java", "Spring Boot", "Data Science"],
      skills: ["Java", "SQL"],
    });
    console.log("✅ Student 3 Created:");
    console.log(`   Name: ${student3.name}`);
    console.log(`   Interests: ${student3.interests.join(", ")}`);
    console.log(`   Email: ${student3.email}`);
    console.log(`   ⭐ DIFFERENT: No overlap with Students 1 & 2\n`);

    // Run batch allocation with different algorithms
    const algorithms = [
      "greedy",
      "hierarchical",
      "kmeans",
      "dbscan",
      "spectral",
    ];

    for (const algo of algorithms) {
      console.log(`\n${"=".repeat(70)}`);
      console.log(
        `🧠 Running Batch Allocation Algorithm: ${algo.toUpperCase()}`,
      );
      console.log(`${"=".repeat(70)}\n`);

      const result = await autoBatchAllocation(algo);

      console.log(`📊 Results:`);
      console.log(`   Total Clusters: ${result.totalClusters}`);
      console.log(`   Total Batches: ${result.totalBatches}\n`);

      console.log(`📋 Batch Details:\n`);

      for (let i = 0; i < result.batches.length; i++) {
        const batch = result.batches[i];
        console.log(`   Batch ${i + 1}: ${batch.name}`);
        console.log(`   Interests: ${batch.interests.join(", ")}`);
        console.log(`   Members: ${batch.members.length}`);

        // Fetch member details
        const members = await User.find({ _id: { $in: batch.members } }).select(
          "name email interests",
        );
        members.forEach((member) => {
          console.log(`     - ${member.name} (${member.email})`);
          console.log(`       Interests: ${member.interests.join(", ")}`);
        });
        console.log();
      }

      // Verify the test
      console.log(`✅ VERIFICATION FOR ${algo.toUpperCase()}:\n`);

      const batches = await Batch.find().populate(
        "members",
        "name email interests",
      );

      let student1Batch = null;
      let student2Batch = null;
      let student3Batch = null;

      batches.forEach((batch) => {
        batch.members.forEach((member) => {
          if (member.email === "testuser1@example.com") {
            student1Batch = batch;
          } else if (member.email === "testuser2@example.com") {
            student2Batch = batch;
          } else if (member.email === "testuser3@example.com") {
            student3Batch = batch;
          }
        });
      });

      if (
        student1Batch &&
        student2Batch &&
        student1Batch._id.equals(student2Batch._id)
      ) {
        console.log(
          `   ✅ PASS: Students 1 & 2 (similar interests) are in SAME batch`,
        );
        console.log(`      Batch: ${student1Batch.name}`);
        console.log(
          `      Batch Interests: ${student1Batch.interests.join(", ")}`,
        );
      } else {
        console.log(
          `   ❌ FAIL: Students 1 & 2 (similar interests) are in DIFFERENT batches`,
        );
        if (student1Batch)
          console.log(`      Student 1 Batch: ${student1Batch.name}`);
        if (student2Batch)
          console.log(`      Student 2 Batch: ${student2Batch.name}`);
      }

      if (
        student1Batch &&
        student3Batch &&
        !student1Batch._id.equals(student3Batch._id)
      ) {
        console.log(
          `   ✅ PASS: Student 1 & 3 (different interests) are in DIFFERENT batches`,
        );
        console.log(`      Student 1 Batch: ${student1Batch.name}`);
        console.log(`      Student 3 Batch: ${student3Batch.name}`);
      } else {
        console.log(
          `   ⚠️  Student 1 & 3 are in SAME batch (could happen with small datasets)`,
        );
      }

      console.log();
    }

    console.log(`\n${"=".repeat(70)}`);
    console.log(`✅ TEST COMPLETED`);
    console.log(`${"=".repeat(70)}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

testBatchAllocation();
