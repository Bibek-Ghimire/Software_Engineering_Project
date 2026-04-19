import "dotenv/config.js";
import axios from "axios";

const testRegistration = async () => {
  try {
    console.log("📝 Testing user registration...\n");

    const userData = {
      name: "Test Alice",
      email: "testalice@example.com",
      password: "test123",
      role: "student",
      interests: ["React", "Python", "Machine Learning"],
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
    console.log("Token:", loginRes.data.token.substring(0, 30) + "...");
    console.log("User:", loginRes.data.user);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    process.exit(1);
  }
};

testRegistration();
