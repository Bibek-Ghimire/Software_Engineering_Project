import "dotenv/config.js";
import mongoose from "mongoose";
import User from "./backend/models/User.js";

const testFindById = async () => {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected\n");

    const id = "69e4bd1380d290eea3dca678";
    console.log("Testing findById with ID:", id);

    // Test 1: findById without select
    const alice1 = await User.findById(id);
    console.log(
      "Test 1 - findById():",
      alice1 ? `✅ ${alice1.name}` : "❌ NULL",
    );

    // Test 2: findById with select
    const alice2 = await User.findById(id).select("-password");
    console.log(
      'Test 2 - findById().select("-password"):',
      alice2 ? `✅ ${alice2.name}` : "❌ NULL",
    );

    // Test 3: findOne as comparison
    const alice3 = await User.findOne({ email: "alice@example.com" });
    console.log(
      "Test 3 - findOne(email):",
      alice3 ? `✅ ${alice3.name}` : "❌ NULL",
    );

    console.log("\nChecking ObjectId conversion...");
    console.log("String ID:", id);
    console.log("ObjectId(id):", new mongoose.Types.ObjectId(id));

    // Test 4: findById with explicit ObjectId
    const alice4 = await User.findById(new mongoose.Types.ObjectId(id));
    console.log(
      "Test 4 - findById(ObjectId):",
      alice4 ? `✅ ${alice4.name}` : "❌ NULL",
    );
  } catch (error) {
    console.error("Error:", error.message);
    if (error.stack) console.error("Stack:", error.stack);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

testFindById();
