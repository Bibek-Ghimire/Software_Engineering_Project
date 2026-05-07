import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Resources from "../pages/Resources";
import CreateGroup from "../pages/CreateGroup";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import StudyBatchPage from "../pages/StudyBatchPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="/resources"
          element={<Resources />}
        />
        <Route
          path="/create-group"
          element={<CreateGroup />}
        />
        <Route
          path="/profile"
          element={<Profile />}
        />
        <Route
          path="/study-batch"
          element={<StudyBatchPage />}
        />
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
