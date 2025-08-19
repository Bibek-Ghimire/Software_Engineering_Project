import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  LogIn,
  Star,
  Github
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

  // Simulate API call
  setTimeout(() => {
    toast.success("Login successful! Welcome back.");

    // ✅ Simulate fetching user data (e.g., from localStorage or backend)
    const userData = JSON.parse(localStorage.getItem("user")) || {
      role: "Student" // You can test with "Teacher"
    };

    // ✅ Navigate based on role
    if (userData.role === "Student") {
      navigate("/dashboard/student");
    } else {
      navigate("/dashboard/teacher");
    }
  }, 1000);
};

// Social login handler moved outside handleLogin
const handleSocialLogin = (provider) => {
  toast.success(`Logging in with ${provider}...`);

  setTimeout(() => {
    // ✅ Simulated role for social login (can be dynamic too)
    const userData = {
      role: "Teacher" // or "Student"
    };

    if (userData.role === "Student") {
      navigate("/dashboard/student");
    } else {
      navigate("/dashboard/teacher");
    }
  }, 1500);
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
              <div className="bg-gradient-to-r from-blue-400 to-purple-400 p-3 rounded-full">
                <LogIn className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-300 text-sm">Sign in to continue your learning journey</p>
          </div>

          {/* Welcome back message */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <div className="flex -space-x-2 mr-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div>
                <p className="text-white text-sm font-medium">Join 10,000+ active learners</p>
                <p className="text-gray-400 text-xs">Continue where you left off</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
             {/* Role Selector */}
  <div className="relative">
    <select
      required
      className="w-full appearance-none bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
    >
      <option value="">Select Role</option>
      <option value="student">👨‍🎓 Student</option>
      <option value="teacher">👩‍🏫 Teacher</option>
    </select>
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C9.79 2 8 3.79 8 6s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 16c-4.41 0-8 1.79-8 4v2h16v-2c0-2.21-3.59-4-8-4z" />
      </svg>
    </div>
  </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-400 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="mr-2 rounded border-gray-600 bg-white/10 text-blue-400 focus:ring-blue-400"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
            >
              Sign In
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Create Account
              </Link>
            </p>
          </div>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialLogin('Google')}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center group"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm">Google</span>
              </button>
              <button
                onClick={() => handleSocialLogin('GitHub')}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center group"
              >
                <Github className="w-5 h-5 mr-2" />
                <span className="text-sm">GitHub</span>
              </button>
            </div>
          </div>

          {/* Quick Login for Demo */}
          <div className="mt-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <p className="text-yellow-400 text-xs text-center">
              Demo: Use any email and password to login
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

export default Login;