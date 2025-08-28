import { Toaster } from 'react-hot-toast';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import Home from "./pages/Home";
import Resources from "./pages/Resources";
import AddResource from "./pages/AddResource";
import ProfileView from "./pages/ProfileView";
import ProfileEdit from "./pages/ProfileEdit";
import NotFound from "./pages/NotFound"; // we'll create this
import NotificationPage from "./pages/NotificationPage";
import LeaderBoard from "./pages/LeaderBoard";
import StudentDashboard from "./pages/StudentDashboard";
import AllCourses from "./pages/AllCourses";
import Groups from "./pages/Groups";
import CreateGroup from "./pages/CreateGroup";
import Discussion from "./pages/Discussion";
import CoursesPage from "./pages/Teacher/CoursesPage";
import CoursesView from "./pages/Teacher/CoursesPage";
import CourseEdit from "./pages/Teacher/CoursesPage";
import StudyGroupsPage from "./pages/Teacher/StudyGroupsPage"

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
        <Route path="/courses" element={<AllCourses />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/add-resource" element={<AddResource />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/creategroup" element={<CreateGroup />} />
        <Route path="/discussions" element={<Discussion />} />
        <Route path="/teacher/course" element={<CoursesPage />} />
        <Route path="/courses/view/:id" element={<CoursesView />} />
        <Route path="/courses/edit/:id" element={<CourseEdit />} />
        <Route path="/creategroup" element={<StudyGroupsPage />} /> {/* ✅ new route */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
