import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InstructorDashboard from "./InstructorDashboard";
import StudentDashboard from "./StudentDashboard";
import AdminDashboard from "./AdminDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUserData from "./useUserData"; // Import custom hook

const Dashboard = () => {
  const { userData, loading, error } = useUserData(); // Use custom hook
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [enrollmentRequests, setEnrollmentRequests] = useState([]);
  const [studentRequests, setStudentRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (userData.profile?.role) {
      fetchRoleSpecificData(userData.profile.role);
    }
  }, [userData.profile?.role]);

  const fetchRoleSpecificData = async (role) => {
    try {
      const token = localStorage.getItem("access_token");
      if (role === "instructor") {
        const [coursesResponse, requestsResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/user-courses/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://127.0.0.1:8000/api/list-enrollment-requests/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
        setCourses(coursesResponse.data);
        setEnrollmentRequests(requestsResponse.data);
      } else if (role === "student") {
        const [enrollmentsResponse, requestsResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/user-courses/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://127.0.0.1:8000/api/student-enrollment-requests/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
        setCourses(enrollmentsResponse.data);
        setStudentRequests(requestsResponse.data);
        if (enrollmentsResponse.data.length === 0) {
          const allCoursesResponse = await axios.get("http://127.0.0.1:8000/api/courses/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setAllCourses(allCoursesResponse.data);
        }
      } else if (role === "admin") {
        const [usersResponse, coursesResponse, requestsResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/auth/admin/users/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://127.0.0.1:8000/api/courses/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://127.0.0.1:8000/api/list-enrollment-requests/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
        setAllUsers(usersResponse.data);
        setAllCourses(coursesResponse.data);
        setEnrollmentRequests(requestsResponse.data);
      }
    } catch (error) {
      setMessage("Error fetching data. Please try again.");
    }
  };

  console.log(userData);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
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

      <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>
      <div className="space-y-4">
        <p><strong>Username:</strong> {userData.username}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Role:</strong> {userData.profile?.role}</p>
      </div>

      {userData.profile?.role === "instructor" && (
        <InstructorDashboard
          courses={courses}
          enrollmentRequests={enrollmentRequests}
        />
      )}

      {userData.profile?.role === "student" && (
        <StudentDashboard
          courses={courses}
          studentRequests={studentRequests}
          allCourses={allCourses}
        />
      )}

      {userData.profile?.role === "admin" && (
        <AdminDashboard
          allUsers={allUsers}
          allCourses={allCourses}
          enrollmentRequests={enrollmentRequests}
        />
      )}
    </div>
  );
};

export default Dashboard;