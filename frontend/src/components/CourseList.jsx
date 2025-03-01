import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://127.0.0.1:8000/api/courses/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(response.data);
      } catch (error) {
        setMessage("Error fetching courses. Please try again.");
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Course List</h1>
      {message && <div className="text-red-500 mb-4">{message}</div>}
      {/* Create Course Button */}
      <button
        onClick={() => navigate("/create-course")}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Create Course
      </button>
      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="border p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p className="text-gray-600">{course.description}</p>
            <p className="text-sm text-gray-500">
              Instructor: {course.instructor.username}
            </p>
            <Link
              to={`/courses/${course.id}`}
              className="text-blue-500 hover:text-blue-700"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;