import "dotenv/config.js";
import axios from "axios";
import User from "./models/User.js";
import connectDB from "./config/db.js";
import jwt from "jsonwebtoken";

async function testBatchEndpoint() {
  try {
    await connectDB();

    console.log("🔍 Environment Check:");
    console.log(`   MONGO_URI: ${process.env.MONGO_URI?.substring(0, 50)}...`);
    console.log(
      `   JWT_SECRET: ${process.env.JWT_SECRET?.substring(0, 30)}...`,
    );

    // Get a test user
    const user = await User.findOne({ email: "alice@example.com" });

    if (!user) {
      console.log("❌ Alice not found in database");
      process.exit(1);
    }

    console.log("\n👤 Found Alice in DB:");
    console.log(`   ID: ${user._id}`);
    console.log(`   Batch ID: ${user.batchId}`);
    console.log(`   Interests: ${user.interests.join(", ")}`);

    // Create a JWT token for Alice
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    console.log(`\n🔐 Generated token: ${token.substring(0, 30)}...`);

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`\n🔓 Token decoded successfully`);
    console.log(`   ID in token: ${decoded.id}`);
    console.log(`   Actual user ID: ${user._id.toString()}`);
    console.log(`   IDs match: ${decoded.id === user._id.toString()}`);

    // Try to find user by ID directly
    console.log("\n🔍 Direct user lookup test:");
    const foundUser = await User.findById(decoded.id);
    if (foundUser) {
      console.log(`   ✅ User found by ID: ${foundUser.name}`);
    } else {
      console.log(`   ❌ User NOT found by ID`);
    }

    // Test the batch endpoint
    console.log("\n📡 Testing /api/batches/protected/my-batch endpoint...\n");

    const response = await axios.get(
      "http://localhost:5000/api/batches/protected/my-batch",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (response.data.success) {
      console.log("✅ Endpoint Response:");
      console.log(`   Batch: ${response.data.data.name}`);
      console.log(
        `   Members: ${response.data.data.memberCount}/${response.data.data.maxSize}`,
      );
      console.log(`   Interests: ${response.data.data.interests.join(", ")}`);
    } else {
      console.log("❌ Error:", response.data.message);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.response?.data?.message || error.message);
    process.exit(1);
  }
}

testBatchEndpoint();
