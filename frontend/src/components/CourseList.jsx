import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(""); // Track user role
  const navigate = useNavigate();

  // Fetch user role and data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://127.0.0.1:8000/auth/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(response.data.role); // Set user role
      } catch (error) {
        setMessage("Error fetching user data. Please log in again.");
      }
    };
    fetchUserData();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://127.0.0.1:8000/api/categories/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data);
      } catch (error) {
        setMessage("Error fetching categories. Please try again.");
      }
    };
    fetchCategories();
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://127.0.0.1:8000/api/courses/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data);
      } catch (error) {
        setMessage("Error fetching courses. Please try again.");
      } finally {
        setLoading(false); // Stop loading when data is fetched
      }
    };
    fetchCourses();
  }, []);

  // Filter courses by selected category
  const filteredCourses = selectedCategory
    ? courses.filter((course) => course.category?.id === parseInt(selectedCategory))
    : courses;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Course List</h1>

      {/* Display Loading or Message */}
      {loading && <div className="text-blue-500 mb-4">Loading courses...</div>}
      {message && <div className="text-red-500 mb-4">{message}</div>}

      {/* Category Filter Dropdown */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Filter by Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Create Course Button (Only for Instructors) */}
      {userRole === "instructor" && (
        <button
          onClick={() => navigate("/create-course")}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Create Course
        </button>
      )}

      {/* List of Courses */}
      <div className="space-y-4 mt-4">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div key={course.id} className="border p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-gray-600">{course.description}</p>
              <p className="text-sm text-gray-500">
                Instructor: {course.instructor || "Unknown Instructor"}
              </p>
              <p className="text-sm text-gray-500">
                Category: {course.category ? course.category : "Uncategorized"}
              </p>
              <div className="flex items-center justify-between mt-2">
                <Link
                  to={`/courses/${course.id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No courses found.</div>
        )}
      </div>
    </div>
  );
};

export default CourseList;