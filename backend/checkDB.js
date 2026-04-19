import mongoose from "mongoose";

async function checkDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/syncademyDB");

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    console.log("\n📦 DATABASE COLLECTIONS:");
    console.log("========================");

    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`${col.name}: ${count} documents`);
    }

    // Check users specifically
    const usersCollection = db.collection("users");
    const users = await usersCollection
      .find({ role: "student" })
      .limit(5)
      .toArray();

    if (users.length > 0) {
      console.log("\n👤 Sample Students:");
      users.forEach((u, idx) => {
        console.log(`\n  ${idx + 1}. ${u.name}`);
        console.log(`     Email: ${u.email}`);
        console.log(`     Batch ID: ${u.batchId || "NONE"}`);
        console.log(`     Interests: ${(u.interests || []).join(", ")}`);
      });
    } else {
      console.log("\n⚠️  No students found in database");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

checkDB();
