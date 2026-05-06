import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Github,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState(""); // Track role from dropdown

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password || !selectedRole) {
      toast.error("Please fill in all fields and select a role");
      return;
    }

    try {
      const data = await loginUser({ email, password });

      //  STRICT AUTHENTICATION: Clear old session before setting new one
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      console.log(` Cleared old session for security`);

      // Save new user and token to sessionStorage (per-tab isolation)
      sessionStorage.setItem("user", JSON.stringify(data.user));
      sessionStorage.setItem("token", data.token);

      console.log(
        ` New session established - User: ${data.user.name} (${data.user.id})`,
      );

      // Role from backend
      const backendRole = data.user.role.toLowerCase();

      // Check if selected role matches backend role
      if (backendRole !== selectedRole) {
        // Clear session if role doesn't match
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        toast.error(`This user is not registered as a ${selectedRole}`);
        return;
      }

      toast.success("Login successful!");

      // Navigate based on backend role
      if (backendRole === "student") {
        navigate("/dashboard/student");
      } else if (backendRole === "teacher") {
        navigate("/dashboard/teacher");
      } else {
        navigate("/"); // fallback
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Login failed";
      toast.error(message);
    }
  };

  const handleSocialLogin = (provider) => {
    toast.error(
      `${provider} login is not available yet. Please use email and password to login.`,
    );
  };

  return (
    <div className="page-surface min-h-screen overflow-x-hidden text-stone-900 dark:text-stone-100">
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
              Welcome Back
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-sm">
              Sign in to continue your collaborative learning flow.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >
            {/* Role Selector */}
            {/* Role Selector */}
            <div className="relative">
              <select
                required
                value={selectedRole} // bind to state
                onChange={(e) => setSelectedRole(e.target.value)} // update state on change
                className="form-input appearance-none px-12"
              >
                <option value="">Select Role</option>
                <option value="student"> Student</option>
                <option value="teacher"> Teacher</option>
              </select>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-500 dark:text-stone-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C9.79 2 8 3.79 8 6s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 16c-4.41 0-8 1.79-8 4v2h16v-2c0-2.21-3.59-4-8-4z" />
                </svg>
              </div>
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
                placeholder="Password"
                className="form-input px-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-stone-700 dark:text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-stone-300 bg-white text-orange-600 focus:ring-orange-500 dark:border-stone-700 dark:bg-stone-800 dark:text-orange-400"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full cta-main py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center group"
            >
              Sign In
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-stone-700 dark:text-stone-300 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors font-medium"
              >
                Create Account
              </Link>
            </p>
          </div>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-300 dark:border-stone-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-stone-600 dark:text-stone-400">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialLogin("Google")}
                disabled
                className="surface-panel p-3 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60 transition-all duration-300 flex items-center justify-center group"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm">Google</span>
              </button>
              <button
                onClick={() => handleSocialLogin("GitHub")}
                disabled
                className="surface-panel p-3 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60 transition-all duration-300 flex items-center justify-center group"
              >
                <Github className="w-5 h-5 mr-2" />
                <span className="text-sm">GitHub</span>
              </button>
            </div>
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

export default Login;
