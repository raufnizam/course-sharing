import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentDashboard = ({ courses, studentRequests, allCourses, handleWithdrawRequest }) => {
  const navigate = useNavigate();

  // Function to handle withdrawal and show toast notifications
  const handleWithdraw = async (requestId) => {
    try {
      await handleWithdrawRequest(requestId);
      toast.success("Enrollment request withdrawn successfully."); // Success toast
    } catch (error) {
      toast.error("Error withdrawing enrollment request. Please try again."); // Error toast
    }
  };

  return (
    <div>
      {/* Toast Container */}
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

      {/* Display Enrolled Courses */}
      {courses.length > 0 && (
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

      {/* Display "View All Courses" Button if No Courses Enrolled */}
      {courses.length === 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">No Enrolled Courses</h2>
          <p className="mb-4">You are not enrolled in any courses yet.</p>
          <button
            onClick={() => navigate("/courses")}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            View All Courses
          </button>
        </div>
      )}

      {/* Display Enrollment Requests */}
      {studentRequests.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Your Enrollment Requests</h2>
          <ul className="space-y-2">
            {studentRequests.map((request) => (
              <li key={request.id} className="border p-4 rounded-md">
                <h3 className="font-semibold">{request.course.title}</h3>
                <p><strong>Status:</strong> <span className={`${request.status === "pending" ? "text-yellow-600" : request.status === "approved" ? "text-green-600" : "text-red-600"}`}>{request.status}</span></p>
                <p><strong>Course Description:</strong> {request.course.description}</p>
                <p><strong>Instructor:</strong> {request.course.instructor}</p>
                <p><strong>Message:</strong> {request.message || "No message provided."}</p>
                <p><strong>Requested At:</strong> {new Date(request.requested_at).toLocaleString()}</p>

                {/* Withdraw Button for Pending Requests */}
                {request.status === "pending" && (
                  <button
                    onClick={() => handleWithdraw(request.id)}
                    className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Withdraw Request
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;