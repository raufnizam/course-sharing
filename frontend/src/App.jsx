import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/dashboard/Dashboard";
import CreateCourse from "./components/courses/CreateCourse";
import CourseList from "./components/courses/CourseList";
import CourseDetail from "./components/courses/CourseDetail";
import AddLesson from "./components/lesson/AddLesson";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LessonDetail from "./components/lesson/LessonDetail";
import LessonEdit from "./components/lesson/LessonEdit";
import EditCourse from "./components/courses/EditCourse";
import CategoryList from "./components/category/CategoryList";
import CreateCategory from "./components/category/CreateCategory";
import EditCategory from "./components/category/EditCategory";
import NotFound from "./components/NotFound"; // Add a 404 Not Found component
import Profile from "./components/profile/Profile";
import ProfileEdit from "./components/profile/ProfileEdit";
import UserProfile from "./components/profile/UserProfile";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  const isAuthenticated = !!localStorage.getItem("access_token");

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
          />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users/:username" element={<UserProfile />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/create-course" element={<CreateCourse />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/courses/:id/edit" element={<EditCourse />} />
            <Route path="/lessons/:id" element={<LessonDetail />} />
            <Route path="/lessons/edit/:id" element={<LessonEdit />} />
            <Route path="/courses/:id/add-lesson" element={<AddLesson />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/create-category" element={<CreateCategory />} />
            <Route path="/edit-category/:id" element={<EditCategory />} />
          </Route>

          {/* Fallback Route (404 Not Found) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;