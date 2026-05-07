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
  const [role, setRole] = useState(""); // default to Select Role
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
    <div className="page-surface min-h-screen text-stone-900 dark:text-stone-100 overflow-x-hidden">
      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="surface-card-strong w-full max-w-md p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="tone-line mb-4"></span>
            <h2 className="brand-title text-3xl font-bold mb-2">
              Join the Community
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-sm">
              Create your account to start learning with your cohort.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleRegister}
            className="space-y-4"
          >
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-500 dark:text-stone-400 w-5 h-5" />
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-500 dark:text-stone-400 w-5 h-5" />
                <select
                  className="form-input appearance-none px-12"
                  value={role} // bind to state
                  onChange={(e) => setRole(e.target.value)} // update state on change
                  required
                >
                  <option value="">Select Role</option>
                  <option value="student"> Student</option>
                  <option value="teacher"> Teacher</option>
                </select>
              </div>
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-500 dark:text-stone-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Full Name"
                className="form-input px-12"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-500 dark:text-stone-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Email Address"
                className="form-input px-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-500 dark:text-stone-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password (min 6 characters)"
                className="form-input px-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-500 dark:text-stone-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Interests Section */}
            <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-700">
              <label className="text-sm font-semibold text-stone-900 dark:text-stone-50 block mb-3">
                Select Your Interests (Min. 1)
              </label>

              {/* Interest Input */}
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Type a topic and press Enter..."
                  className="form-input-compact"
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
                    className="bg-orange-100 dark:bg-orange-500/20 border border-orange-300 dark:border-orange-500/40 text-stone-900 dark:text-stone-50 rounded-full px-3 py-1 text-sm flex items-center gap-2 group"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="hover:bg-rose-600/40 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Suggested Topics */}
              <div className="text-xs text-stone-600 dark:text-stone-400 mb-2">
                Quick select:
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {suggestedTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => handleAddInterest(topic)}
                    disabled={
                      interests.includes(topic) || interests.length >= 5
                    }
                    className={`px-3 py-1 text-xs rounded-full transition-all ${interests.includes(topic)
                      ? "bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-500 opacity-50"
                      : interests.length >= 5
                        ? "bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-500 opacity-50"
                        : "bg-orange-100 dark:bg-orange-500/20 text-stone-900 dark:text-stone-50 hover:bg-orange-200 dark:hover:bg-orange-500/30 cursor-pointer border border-orange-200 dark:border-orange-500/40"
                      }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2 text-xs text-stone-700 dark:text-stone-300">
              <input
                type="checkbox"
                className="mt-1 rounded border-stone-300 bg-white text-orange-600 focus:ring-orange-500 dark:border-stone-700 dark:bg-stone-800 dark:text-orange-400"
                required
              />
              <span>
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-orange-600 hover:text-orange-700"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-orange-600 hover:text-orange-700"
                >
                  Privacy Policy
                </Link>
              </span>
            </div>

            <button
              type="submit"
              className="w-full cta-main py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center group"
            >
              Create Account
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-stone-700 dark:text-stone-300 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <Link
          to="/"
          className="absolute top-6 left-6 surface-card px-4 py-3 text-stone-900 dark:text-stone-50 hover:bg-white/90 dark:hover:bg-stone-800/80 transition-all duration-300 flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Register;
