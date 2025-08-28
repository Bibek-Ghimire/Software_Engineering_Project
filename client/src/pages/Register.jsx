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
  Shield
} from "lucide-react";

import { registerUser } from "../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // default role

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

  try {
    // Call backend API with role
    const data = await registerUser({ name, email, password, role });
    console.log("Registered user:", data);

    toast.success("Registration successful! Please login.");
    navigate("/login");
  } catch (error) {
    // Show the backend error message if available
    const message = error?.response?.data?.message || error.message || "Registration failed";
    toast.error(message);
    console.error("Registration error:", error.response || error);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '1000ms' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '500ms' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8 w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-3 rounded-full">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Join the Community
            </h2>
            <p className="text-gray-300 text-sm">Create your account to start learning with peers</p>
          </div>

          {/* Benefits */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 mb-6">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                <span>Access to 500+ study groups</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                <span>Connect with global learners</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                <span>Track your learning progress</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
             <div className="relative">
    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
   <div className="relative">
  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
  <select
    className="w-full appearance-none bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
    value={role}                 // bind to state
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
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2 text-xs text-gray-400">
              <input 
                type="checkbox" 
                className="mt-1 rounded border-gray-600 bg-white/10 text-purple-400 focus:ring-purple-400" 
                required
              />
              <span>
                I agree to the <Link to="/terms" className="text-purple-400 hover:text-purple-300">Terms of Service</Link> and <Link to="/privacy" className="text-purple-400 hover:text-purple-300">Privacy Policy</Link>
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
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
                className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-6 flex items-center justify-center text-gray-400 text-xs">
            <Shield className="w-4 h-4 mr-1" />
            <span>Your data is protected with 256-bit encryption</span>
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