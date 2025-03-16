import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InstructorDashboard from "./InstructorDashboard";
import StudentDashboard from "./StudentDashboard";
import AdminDashboard from "./AdminDashboard";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const Dashboard = () => {
  const [userData, setUserData] = useState({});
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [enrollmentRequests, setEnrollmentRequests] = useState([]);
  const [studentRequests, setStudentRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // Add state for all users
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
          const coursesResponse = await axios.get(
            "http://127.0.0.1:8000/api/user-courses/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCourses(coursesResponse.data);
  
          const requestsResponse = await axios.get(
            "http://127.0.0.1:8000/api/list-enrollment-requests/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setEnrollmentRequests(requestsResponse.data);
        } else if (response.data.role === "student") {
          const enrollmentsResponse = await axios.get(
            "http://127.0.0.1:8000/api/user-courses/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCourses(enrollmentsResponse.data);
  
          const requestsResponse = await axios.get(
            "http://127.0.0.1:8000/api/student-enrollment-requests/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setStudentRequests(requestsResponse.data);
  
          if (enrollmentsResponse.data.length === 0) {
            const allCoursesResponse = await axios.get(
              "http://127.0.0.1:8000/api/courses/",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setAllCourses(allCoursesResponse.data);
          }
        } else if (response.data.role === "admin") {
          // Fetch all users for admin
          try {
            const usersResponse = await axios.get(
              "http://127.0.0.1:8000/auth/admin/users/",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log("Users Response:", usersResponse.data); // Log the response
            setAllUsers(usersResponse.data); // Ensure this is an array
          } catch (error) {
            console.error("Error fetching users:", error);
            setMessage("Error fetching users. Please try again.");
          }
  
          // Fetch all courses for admin
          const allCoursesResponse = await axios.get(
            "http://127.0.0.1:8000/api/courses/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setAllCourses(allCoursesResponse.data);
  
          // Fetch all enrollment requests for admin
          const requestsResponse = await axios.get(
            "http://127.0.0.1:8000/api/list-enrollment-requests/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setEnrollmentRequests(requestsResponse.data);
        }
      } catch (error) {
        setMessage("Error fetching user data. Please log in again.");
      }
    };
  
    fetchUserData();
  }, []);

  const handleApproveRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        `http://127.0.0.1:8000/api/approve-enrollment/${requestId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Enrollment request approved successfully.");
      const requestsResponse = await axios.get(
        "http://127.0.0.1:8000/api/list-enrollment-requests/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEnrollmentRequests(requestsResponse.data);
    } catch (error) {
      setMessage("Error approving enrollment request. Please try again.");
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        `http://127.0.0.1:8000/api/reject-enrollment/${requestId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Enrollment request rejected successfully.");
      const requestsResponse = await axios.get(
        "http://127.0.0.1:8000/api/list-enrollment-requests/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEnrollmentRequests(requestsResponse.data);
    } catch (error) {
      setMessage("Error rejecting enrollment request. Please try again.");
    }
  };

  const handleWithdrawRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(
        `http://127.0.0.1:8000/api/withdraw-enrollment-request/${requestId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Enrollment request withdrawn successfully.");

      // Refresh the student's enrollment requests
      const requestsResponse = await axios.get(
        "http://127.0.0.1:8000/api/student-enrollment-requests/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudentRequests(requestsResponse.data);
    } catch (error) {
      setMessage("Error withdrawing enrollment request. Please try again.");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(
        `http://127.0.0.1:8000/auth/admin/users/${userId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("User deleted successfully.");
      // Refresh the list of users
      const usersResponse = await axios.get(
        "http://127.0.0.1:8000/auth/admin/users/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllUsers(usersResponse.data);
    } catch (error) {
      setMessage("Error deleting user. Please try again.");
    }
  };

  if (message) {
    return <div className="text-center mt-10 text-red-500">{message}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      {/* Add ToastContainer here */}
      <ToastContainer
        position="top-right"
        autoClose={3000} // Auto-close after 3 seconds
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
        <p>
          <strong>Username:</strong> {userData.username}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Role:</strong> {userData.role}
        </p>
      </div>

      {/* Conditionally Render Role-Specific Dashboard */}
      {userData.role === "instructor" && (
        <InstructorDashboard
          courses={courses}
          enrollmentRequests={enrollmentRequests}
          handleApproveRequest={handleApproveRequest}
          handleRejectRequest={handleRejectRequest}
        />
      )}

      {userData.role === "student" && (
        <StudentDashboard
          courses={courses}
          studentRequests={studentRequests}
          allCourses={allCourses}
          handleWithdrawRequest={handleWithdrawRequest}
        />
      )}

      {userData.role === "admin" && (
        <AdminDashboard
          allUsers={allUsers}
          allCourses={allCourses}
          enrollmentRequests={enrollmentRequests}
          handleDeleteUser={handleDeleteUser}
          handleApproveRequest={handleApproveRequest}
          handleRejectRequest={handleRejectRequest}
        />
      )}
    </div>
  );
};

export default Dashboard;