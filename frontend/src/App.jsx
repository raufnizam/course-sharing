import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CreateCourse from "./components/CreateCourse";
import CourseList from "./components/CourseList";
import CourseDetail from "./components/CourseDetail";
import AddLesson from "./components/AddLesson"; // Import the AddLesson component
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import LessonDetail from "./components/LessonDetail";
import LessonEdit from "./components/LessonEdit";
import EditCourse from "./components/EditCourse";
import CategoryList from "./components/CategoryList";
import CreateCategory from "./components/CreateCategory";
import EditCategory from "./components/EditCategory";


const App = () => {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
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
        </Routes>
      </div>
    </Router>
  );
};

export default App;