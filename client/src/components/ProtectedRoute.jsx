import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const token = sessionStorage.getItem("token");
  const user = sessionStorage.getItem("user");

  // Ensure both token and user data exist
  const isValid = isAuthenticated && token && user;

  return isValid ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
