import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  UserPlus,
  CheckCircle,
  Shield,
  X,
} from "lucide-react";

import { registerUser } from "../services/authService";
import ThemeToggle from "../components/ThemeToggle";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // default role
  const [interests, setInterests] = useState([]);
  const [interestInput, setInterestInput] = useState("");

  // Predefined topics
  const suggestedTopics = [
    "Web Development",
    "Data Science",
    "Mobile Development",
    "Machine Learning",
    "Cloud Computing",
    "Database Design",
    "DevOps",
    "UI/UX Design",
    "Cybersecurity",
    "AI",
    "Python",
    "JavaScript",
    "React",
    "Node.js",
    "Java",
  ];

  const handleAddInterest = (topic) => {
    if (!interests.includes(topic) && interests.length < 5) {
      setInterests([...interests, topic]);
      setInterestInput("");
    }
  };

  const handleRemoveInterest = (topic) => {
    setInterests(interests.filter((t) => t !== topic));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && interestInput.trim()) {
      e.preventDefault();
      if (!interests.includes(interestInput) && interests.length < 5) {
        setInterests([...interests, interestInput]);
        setInterestInput("");
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !role) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (interests.length === 0) {
      toast.error("Please select at least one interest");
      return;
    }

    try {
      // Call backend API with role and interests
      const data = await registerUser({
        name,
        email,
        password,
        role,
        interests,
      });
      console.log("Registered user:", data);

      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      // Show the backend error message if available
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Registration failed";
      toast.error(message);
      console.error("Registration error:", error.response || error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-200 overflow-x-hidden">
      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
          style={{ animationDelay: "1000ms" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
          style={{ animationDelay: "500ms" }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8 w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Join the Community
            </h2>
            <p className="text-gray-300 text-sm">
              Create your account to start learning with peers
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleRegister}
            className="space-y-4"
          >
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="w-full appearance-none bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  value={role} // bind to state
                  onChange={(e) => setRole(e.target.value)} // update state on change
                  required
                >
                  <option value="">Select Role</option>
                  <option value="student">👨‍🎓 Student</option>
                  <option value="teacher">👩‍🏫 Teacher</option>
                </select>
              </div>
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password (min 6 characters)"
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Interests Section */}
            <div className="mt-6 pt-4 border-t border-white/20">
              <label className="text-sm font-semibold text-white block mb-3">
                Select Your Interests (Min. 1)
              </label>

              {/* Interest Input */}
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Type a topic and press Enter..."
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>

              {/* Selected Interests */}
              <div className="flex flex-wrap gap-2 mb-3">
                {interests.map((interest) => (
                  <div
                    key={interest}
                    className="bg-purple-500/30 border border-purple-400 text-white rounded-full px-3 py-1 text-sm flex items-center gap-2 group"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="hover:bg-purple-600/50 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Suggested Topics */}
              <div className="text-xs text-gray-300 mb-2">Quick select:</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {suggestedTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => handleAddInterest(topic)}
                    disabled={
                      interests.includes(topic) || interests.length >= 5
                    }
                    className={`px-3 py-1 text-xs rounded-full transition-all ${
                      interests.includes(topic)
                        ? "bg-purple-500/50 text-gray-400 opacity-50"
                        : interests.length >= 5
                          ? "bg-gray-500/20 text-gray-400 opacity-50"
                          : "bg-white/10 text-white hover:bg-white/20 cursor-pointer border border-white/20"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2 text-xs text-gray-400">
              <input
                type="checkbox"
                className="mt-1 rounded border-gray-600 bg-white/10 text-purple-400 focus:ring-purple-400"
                required
              />
              <span>
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-blue-600 hover:text-indigo-600"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-blue-600 hover:text-indigo-600"
                >
                  Privacy Policy
                </Link>
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600  text-white py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
            >
              Create Account
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-indigo-600 transition-colors font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <Link
          to="/"
          className="absolute top-6 left-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 text-white hover:bg-white/20 transition-all duration-300 flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Register;
