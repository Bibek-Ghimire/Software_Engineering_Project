import { Toaster } from 'react-hot-toast';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Groups from "./pages/StudyGroups";
import Resources from "./pages/Resources";
import AddResource from "./pages/AddResource";
import ProfileView from "./pages/ProfileView";
import ProfileEdit from "./pages/ProfileEdit";
import CreateGroup from "./pages/CreateGroup";
import NotFound from "./pages/NotFound"; // we'll create this
import NotificationPage from "./pages/NotificationPage";
import LeaderBoard from "./pages/LeaderBoard";
import StudentDashboard from "./pages/StudentDashboard";
import AllCourses from "./pages/AllCourses";



function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />
         <Route path="/courses" element={<AllCourses />} />
        <Route path="/groups" element={<Groups />} />
         <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/add-resource" element={<AddResource />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
