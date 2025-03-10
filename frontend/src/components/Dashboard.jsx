import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userData, setUserData] = useState({});
  const [courses, setCourses] = useState([]); // Courses the user is enrolled in or created
  const [allCourses, setAllCourses] = useState([]); // All available courses
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          "http://127.0.0.1:8000/auth/profile/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);

        // Fetch user courses based on role
        if (response.data.role === "instructor") {
          // Fetch courses created by the instructor
          const coursesResponse = await axios.get(
            "http://127.0.0.1:8000/api/user-courses/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCourses(coursesResponse.data);
        } else if (response.data.role === "student") {
          // Fetch courses the student is enrolled in
          const enrollmentsResponse = await axios.get(
            "http://127.0.0.1:8000/api/user-courses/", // Endpoint to fetch enrolled courses
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCourses(enrollmentsResponse.data);

          // If no courses are enrolled, fetch all courses
          if (enrollmentsResponse.data.length === 0) {
            const allCoursesResponse = await axios.get(
              "http://127.0.0.1:8000/api/courses/", // Endpoint to fetch all courses
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setAllCourses(allCoursesResponse.data);
          }
        }
      } catch (error) {
        setMessage("Error fetching user data. Please log in again.");
      }
    };

    fetchUserData();
  }, []);

  if (message) {
    return <div className="text-center mt-10 text-red-500">{message}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>
      <div className="space-y-4">
        <p>
          <strong>Username:</strong> {userData.username}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Role:</strong> {userData.role} {/* Display role */}
        </p>
        <p>
          <strong>Is Staff:</strong> {userData.is_staff ? "Yes" : "No"}
        </p>
        <p>
          <strong>Is Active:</strong> {userData.is_active ? "Yes" : "No"}
        </p>
        <p>
          <strong>Date Joined:</strong>{" "}
          {new Date(userData.date_joined).toLocaleString()}
        </p>
      </div>

      {/* Conditionally render the "Create Course" button for instructors */}
      {userData.role === "instructor" && (
        <button
          onClick={() => navigate("/create-course")}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Create Course
        </button>
      )}

      {/* Display user courses if any */}
      {userData.role === "instructor" && courses.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Your Courses</h2>
          <ul className="space-y-2">
            {courses.map((course) => (
              <li key={course.id} className="border p-4 rounded-md">
                <h3 className="font-semibold">{course.title}</h3>
                <p>{course.description}</p>
                <p className="text-sm text-gray-500">
                  Category: {course.category ? course.category : "Uncategorized"}
                </p>
                <Link
                  to={`/courses/${course.id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  View Details
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display enrolled courses for students */}
      {userData.role === "student" && courses.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Your Enrolled Courses</h2>
          <ul className="space-y-2">
            {courses.map((course) => (
              <li key={course.id} className="border p-4 rounded-md">
                <h3 className="font-semibold">{course.title}</h3>
                <p>{course.description}</p>
                <p className="text-sm text-gray-500">
                  Category: {course.category ? course.category : "Uncategorized"}
                </p>
                <Link
                  to={`/courses/${course.id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  View Details
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display "View All Courses" button if no courses are enrolled */}
      {userData.role === "student" && courses.length === 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">No Enrolled Courses</h2>
          <p className="mb-4">You are not enrolled in any courses yet.</p>
          <button
            onClick={() => navigate("/courses")} // Redirect to the course list page
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            View All Courses
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;