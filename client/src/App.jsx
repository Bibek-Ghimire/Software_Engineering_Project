import { Toaster } from "react-hot-toast";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import Home from "./pages/Home";
import Resources from "./pages/Resources";
// import AddResource from "./pages/AddResource";
import ProfileView from "./pages/ProfileView";
import ProfileEdit from "./pages/ProfileEdit";
import NotFound from "./pages/NotFound"; // we'll create this
import NotificationPage from "./pages/NotificationPage";
import LeaderBoard from "./pages/LeaderBoard";
import StudentDashboard from "./pages/StudentDashboard";
import AllCourses from "./pages/AllCourses";
import CourseDetail from "./pages/CourseDetail";
import Groups from "./pages/Groups";
import Discussion from "./pages/Discussion";
import CoursesPage from "./pages/Teacher/CoursesPage";
import AddResource from "./pages/Teacher/AddResource";
import CoursesView from "./pages/Teacher/CoursesPage";
import CourseEdit from "./pages/Teacher/CoursesPage";
import StudyGroupsPage from "./pages/Teacher/StudyGroupsPage";
import TeacherProfile from "./pages/Teacher/TeacherProfile";
import Leaderboard from "./pages/Teacher/Leaderboard";
import EnrollmentRequests from "./pages/Teacher/EnrollmentRequests";
import ApprovedStudentsGroups from "./pages/Teacher/ApprovedStudentsGroups";
import TeacherChatList from "./pages/Teacher/TeacherChatList";
import TeacherCourseChat from "./pages/Teacher/TeacherCourseChat";
import StudentChatList from "./pages/Student/StudentChatList";
import StudentCourseChat from "./pages/Student/StudentCourseChat";

import TeacherProfileView from "./pages/Teacher/TeacherProfileView";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/dashboard/student"
          element={<StudentDashboard />}
        />
        <Route
          path="/dashboard/teacher"
          element={<TeacherDashboard />}
        />
        <Route
          path="/courses"
          element={<AllCourses />}
        />
        <Route
          path="/course/:id"
          element={<CourseDetail />}
        />
        <Route
          path="/notifications"
          element={<NotificationPage />}
        />
        <Route
          path="/resources"
          element={<Resources />}
        />
        {/* <Route path="/add-resource" element={<AddResource />} /> */}
        <Route
          path="/profile"
          element={<ProfileView />}
        />
        <Route
          path="/profile/edit"
          element={<ProfileEdit />}
        />
        <Route
          path="/profile/:id"
          element={<ProfileView />}
        />
        <Route
          path="/leaderboard"
          element={<LeaderBoard />}
        />
        <Route
          path="/groups"
          element={<Groups />}
        />
        <Route
          path="/teacher/resources"
          element={<AddResource />}
        />
        <Route
          path="/teacher/leaderboard"
          element={<Leaderboard />}
        />
        <Route
          path="/teacher/enrollment-requests"
          element={<EnrollmentRequests />}
        />
        <Route
          path="/teacher/approved-students"
          element={<ApprovedStudentsGroups />}
        />
        <Route
          path="/teacher/profile"
          element={<TeacherProfile />}
        />
        <Route
          path="/teacher/course"
          element={<CoursesPage />}
        />
        <Route
          path="/teacher/:id"
          element={<TeacherProfile />}
        />
        <Route
          path="/discussions"
          element={<Discussion />}
        />
        <Route
          path="/courses/view/:id"
          element={<CoursesView />}
        />
        <Route
          path="/courses/edit/:id"
          element={<CourseEdit />}
        />
        <Route
          path="/teacher/chat"
          element={<TeacherChatList />}
        />
        <Route
          path="/teacher/chat/:courseId"
          element={<TeacherCourseChat />}
        />
        <Route
          path="/student/chat"
          element={<StudentChatList />}
        />
        <Route
          path="/student/chat/:courseId"
          element={<StudentCourseChat />}
        />
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </Router>
  );
}

export default App;
