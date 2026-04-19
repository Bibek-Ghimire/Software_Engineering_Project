import axios from "axios";

const testRegistration = async () => {
  try {
    // Generate unique email
    const timestamp = Date.now();
    const testEmail = `student${timestamp}@example.com`;

    console.log("📝 Testing user registration...\n");

    const userData = {
      name: `Student ${timestamp}`,
      email: testEmail,
      password: "test123",
      role: "student",
      interests: ["Python", "Data Science", "Machine Learning"],
    };

    console.log("Registering user:", userData.email);
    const regRes = await axios.post(
      "http://localhost:5000/api/auth/register",
      userData,
    );
    console.log(
      "✅ Registration response:",
      regRes.status,
      regRes.data.message,
    );

    console.log("\n📝 Testing login with same credentials...\n");
    const loginRes = await axios.post("http://localhost:5000/api/auth/login", {
      email: userData.email,
      password: userData.password,
    });

    console.log("✅ Login successful!");
    console.log(
      "User:",
      loginRes.data.user.name,
      "(" + loginRes.data.user.email + ")",
    );
    console.log("Role:", loginRes.data.user.role);
    console.log("Interests:", loginRes.data.user.interests);

    // Now test batch endpoint
    console.log("\n📚 Testing batch endpoint with new user...\n");
    const batchRes = await axios.get(
      "http://localhost:5000/api/batches/protected/my-batch",
      {
        headers: { Authorization: `Bearer ${loginRes.data.token}` },
      },
    );

    console.log("✅ Batch data retrieved!");
    console.log("Batch Name:", batchRes.data.data.name);
    console.log("Members:", batchRes.data.data.memberCount);
    console.log("Interests:", batchRes.data.data.interests);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    process.exit(1);
  }
};

testRegistration();
