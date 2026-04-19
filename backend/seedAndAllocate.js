import mongoose from "mongoose";
import User from "./models/User.js";
import Batch from "./models/Batch.js";
import connectDB from "./config/db.js";

async function seedAndAllocate() {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Batch.deleteMany({});

    console.log("🌱 Creating test students...\n");

    // Create test students
    const students = await User.insertMany([
      {
        name: "Alice Johnson",
        email: "alice@example.com",
        password: "test123", // In real app, this would be hashed
        role: "student",
        interests: ["React", "Python", "Machine Learning"],
        skills: ["JavaScript", "Python"],
      },
      {
        name: "Bob Smith",
        email: "bob@example.com",
        password: "test123",
        role: "student",
        interests: ["React", "Python", "Web Development"],
        skills: ["JavaScript", "Node.js"],
      },
      {
        name: "Charlie Brown",
        email: "charlie@example.com",
        password: "test123",
        role: "student",
        interests: ["Java", "Spring Boot", "Data Science"],
        skills: ["Java", "SQL"],
      },
      {
        name: "Diana Prince",
        email: "diana@example.com",
        password: "test123",
        role: "student",
        interests: ["React", "Python", "Machine Learning"],
        skills: ["JavaScript", "Python"],
      },
      {
        name: "Eve Wilson",
        email: "eve@example.com",
        password: "test123",
        role: "student",
        interests: ["Mobile Development", "Cloud Computing"],
        skills: ["Swift", "AWS"],
      },
    ]);

    console.log(`✅ Created ${students.length} test students\n`);

    // Now run allocation
    console.log("🎓 Running batch allocation...\n");

    // Import allocation service
    const { allocateAllStudentsToBatches } =
      await import("./services/batchAllocationService.js");
    const result = await allocateAllStudentsToBatches();

    console.log("✅ Batch Allocation Complete!\n");
    console.log("📊 Results:");
    console.log(`   Total Students: ${result.totalStudents}`);
    console.log(`   Allocated: ${result.allocated}`);
    console.log(`   Batches Created: ${result.totalBatches}\n`);

    console.log("🎓 Batch Details:");
    result.batches.forEach((batch, idx) => {
      console.log(`\n   Batch ${idx + 1}: ${batch.name}`);
      console.log(`   Members: ${batch.members.length}/${batch.maxSize}`);
      console.log(`   Interests: ${batch.interests.join(", ")}`);
    });

    console.log("\n🔐 TEST LOGIN CREDENTIALS:");
    console.log("   Email: alice@example.com");
    console.log("   Password: test123");
    console.log("\n   (Try any of the test emails above)\n");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

seedAndAllocate();
