/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if valid token exists in sessionStorage on mount
    const token = sessionStorage.getItem("token");
    const user = sessionStorage.getItem("user");
    setIsAuthenticated(!!token && !!user);
  }, []);

  const login = () => setIsAuthenticated(true);

  const logout = () => {
    setIsAuthenticated(false);
    //  STRICT CLEANUP: Clear all authentication and session data
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    console.log(" All session data cleared on logout");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
