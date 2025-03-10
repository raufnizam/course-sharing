import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userData, setUserData] = useState({});
  const [courses, setCourses] = useState([]); // Courses the user is enrolled in or created
  const [allCourses, setAllCourses] = useState([]); // All available courses
  const [enrollmentRequests, setEnrollmentRequests] = useState([]); // Enrollment requests for instructors
  const [studentRequests, setStudentRequests] = useState([]); // Enrollment requests for students
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

          // Fetch enrollment requests for the instructor's courses
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

          // Fetch enrollment requests made by the student
          const requestsResponse = await axios.get(
            "http://127.0.0.1:8000/api/student-enrollment-requests/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setStudentRequests(requestsResponse.data);

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
      // Refresh the enrollment requests list
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
      // Refresh the enrollment requests list
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

      {/* Display enrollment requests for instructors */}
      {userData.role === "instructor" && enrollmentRequests.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Enrollment Requests</h2>
          <ul className="space-y-2">
            {enrollmentRequests.map((request) => (
              <li key={request.id} className="border p-4 rounded-md">
                <h3 className="font-semibold">{request.course.title}</h3>
                <p>Requested by: {request.student.username}</p>
                <p>Message: {request.message || "No message provided."}</p>
                <p>Status: {request.status}</p>
                {request.status === "pending" && (
                  <div className="mt-2">
                    <button
                      onClick={() => handleApproveRequest(request.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display enrollment requests for students */}
      {userData.role === "student" && studentRequests.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Your Enrollment Requests</h2>
          <ul className="space-y-2">
            {studentRequests.map((request) => (
              <li key={request.id} className="border p-4 rounded-md">
                <h3 className="font-semibold">{request.course.title}</h3>
                <p>Status: {request.status}</p>
                <p>Message: {request.message || "No message provided."}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;