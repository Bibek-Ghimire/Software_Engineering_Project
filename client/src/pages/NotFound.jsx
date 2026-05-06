import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen page-surface p-6">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Oops! Page not found.</p>
      <Link
        to="/dashboard"
        className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;

