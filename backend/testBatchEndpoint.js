import axios from "axios";
import "dotenv/config.js";
import User from "./models/User.js";
import connectDB from "./config/db.js";
import jwt from "jsonwebtoken";

async function testBatchEndpoint() {
  try {
    await connectDB();

    // Get a test user
    const user = await User.findOne({ email: "alice@example.com" });

    if (!user) {
      console.log("❌ Alice not found in database");
      process.exit(1);
    }

    console.log("👤 Found Alice:");
    console.log(`   ID: ${user._id}`);
    console.log(`   Batch ID: ${user.batchId}`);
    console.log(`   Interests: ${user.interests.join(", ")}`);

    // Create a JWT token for Alice
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    console.log(`\n🔐 Generated token: ${token.substring(0, 20)}...\n`);

    // Test the batch endpoint
    console.log("📡 Testing /api/batches/protected/my-batch endpoint...\n");

    const response = await fetch(
      "http://localhost:5000/api/batches/protected/my-batch",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const data = await response.json();

    if (data.success) {
      console.log("✅ Endpoint Response:");
      console.log(`   Batch: ${data.data.name}`);
      console.log(`   Members: ${data.data.memberCount}/${data.data.maxSize}`);
      console.log(`   Interests: ${data.data.interests.join(", ")}`);
    } else {
      console.log("❌ Error:", data.message);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

testBatchEndpoint();
