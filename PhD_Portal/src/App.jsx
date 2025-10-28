import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "./App.css";
import LandingPage from "./starting-point/landing-page/LandingPage.jsx";
import LoginPage from "./starting-point/login-page/LoginPage.jsx";
import RegistrationPage from "./Registration_page/Registration_page.jsx";

import StudentLayout from "./layout/StudentLayout.jsx";
import StudentDashboard from "./pages/dashboard/StudentDashboard.jsx";
import AllCourses from "./pages/my-courses/AllCourses.jsx";
import AllCourseDetails from "./pages/my-courses/AllCourseDetails.jsx";
import LearningGuides from "./pages/my-courses/LearningGuides.jsx";
import StudentProfile from "./pages/profile-page/StudentProfile.jsx";
import AssignmentsPanel from "./pages/assignment-page/AssignmentPanel.jsx";
import AssignmentDetails from "./pages/assignment-page/AssignmentDetails.jsx";
import GuideAllocation from "./pages/guide-allocation/GuideAllocation.jsx";

import GuideLayout from "./layout/GuideLayout.jsx";
import GuideDashboard from "./pages-guide/dashboard/GuideDashboard.jsx";
import StudentList from "./pages-guide/student-list/StudentList.jsx";
import StudentProfilePage from "./pages-guide/student-list/StudentProfilePage.jsx";
import GuideAssignmentList from "./pages-guide/assignment-page/GuideAssignmentList.jsx";
import GuideAssignmentDetails from "./pages-guide/assignment-page/GuideAssignmentDetails.jsx";
import Schedule from "./pages-guide/schedule-page/Schedule.jsx";
import GuideForum from "./pages-guide/forum-page/GuideForum.jsx";
import GuideProfile from "./pages-guide/profile-page/GuideProfile.jsx";
import FacultyLayout from "./layout/FacultyLayout.jsx";
import FacultyDashboard from "./pages-faculty-coordinator/dashaboard/FacultyDashboard.jsx";
import FacultyProfile from "./pages-faculty-coordinator/profile-page/FacultyProfile.jsx";
import FacultyStudentList from "./pages-faculty-coordinator/student-list/FacultyStudentList.jsx";
import FacultyAssignmentList from "./pages-faculty-coordinator/assignment-page/FacultyAssignmentList.jsx";
import FacultySchedule from "./pages-faculty-coordinator/schedule-page/FacultySchedule.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import AdminDashboard from "./pages-admin/dashboard/AdminDashboard.jsx";
import UserManagement from "./pages-admin/user-management/UserManagement.jsx";
import GuideAssignments from "./pages-admin/guide-assignments/GuideAssignments.jsx";
import FacultyCoordinators from "./pages-admin/faculty-coordinators/FacultyCoordinators.jsx";
import AdminSchedule from "./pages-admin/schedule/AdminSchedule.jsx";
import Analytics from "./pages-admin/analytics/Analytics.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const App = () => {
  const [showLanding, setShowLanding] = useState(true);
  return (
    <Router>
      <Provider store={store}>
        <div className="relative h-screen w-screen overflow-auto scroll-smooth font-[Marcellus]">
          <Routes>
            {/* Landing page route */}
            <Route
              path="/"
              element={
                <>
                  {showLanding && (
                    <LandingPage onContinue={() => setShowLanding(false)} />
                  )}
                  {!showLanding && <LoginPage />}
                </>
              }
            />
            <Route path="/register" element={<RegistrationPage />} />

            <Route
              path="/student"
              element={
                <ProtectedRoute role="Student">
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="courses" element={<AllCourses />} />
              <Route path="courses/details" element={<AllCourseDetails />} />
              <Route
                path="courses/details/learning-guides"
                element={<LearningGuides />}
              />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="assignments" element={<AssignmentsPanel />} />
              <Route path="assignments/:id" element={<AssignmentDetails />} />
              <Route path="guide-allocation" element={<GuideAllocation />} />
            </Route>

            <Route
              path="/guide"
              element={
                <ProtectedRoute role="Guide">
                  <GuideLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<GuideDashboard />} />
              <Route path="students" element={<StudentList />} />
              <Route path="students/:id" element={<StudentProfilePage />} />
              <Route path="assignments" element={<GuideAssignmentList />} />
              <Route
                path="assignments/:id"
                element={<GuideAssignmentDetails />}
              />
              <Route path="schedule" element={<Schedule />} />
              <Route path="forum" element={<GuideForum />} />
              <Route path="profile" element={<GuideProfile />} />
            </Route>

            <Route
              path="/faculty-coordinator"
              element={
                <ProtectedRoute role="FacultyCoordinator">
                  <FacultyLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<FacultyDashboard />} />
              <Route path="students" element={<FacultyStudentList />} />
              <Route path="assignments" element={<FacultyAssignmentList />} />
              <Route path="schedule" element={<FacultySchedule />} />
              <Route path="profile" element={<FacultyProfile />} />
            </Route>

            <Route
              path="/admin"
              element={
                <ProtectedRoute role="Admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="guide-assignments" element={<GuideAssignments />} />
              <Route path="faculty-coordinators" element={<FacultyCoordinators />} />
              <Route path="schedule" element={<AdminSchedule />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
          </Routes>
        </div>
      </Provider>
    </Router>
  );
};

export default App;
