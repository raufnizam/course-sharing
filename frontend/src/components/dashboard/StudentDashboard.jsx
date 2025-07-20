import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CourseCard from "./CourseCard";
import EnrollmentRequestCard from "./EnrollmentRequestCard";
import PropTypes from "prop-types";

const StudentDashboard = ({ courses, studentRequests, handleWithdrawRequest }) => {
  const navigate = useNavigate();

  // Function to handle withdrawal and show toast notifications
  const handleWithdraw = async (requestId) => {
    try {
      await handleWithdrawRequest(requestId);
      toast.success("Enrollment request withdrawn successfully.");
    } catch {
      toast.error("Error withdrawing enrollment request. Please try again.");
    }
  };

  return (
    <div className="p-6">
      {/* Toast Container */}
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

      <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>
      <p className="mb-6">Welcome, Student! View your enrolled courses and enrollment requests here.</p>

      {/* Display Enrolled Courses */}
      {courses.length > 0 ? (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Your Enrolled Courses</h3>
          <ul className="space-y-4">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </ul>
        </div>
      ) : (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">No Enrolled Courses</h3>
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
      {studentRequests.length > 0 ? (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Your Enrollment Requests</h3>
          <ul className="space-y-4">
            {studentRequests.map((request) => (
              <EnrollmentRequestCard
                key={request.id}
                request={request}
                onWithdraw={handleWithdraw}
              />
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500">No enrollment requests found.</p>
      )}
    </div>
  );
};

StudentDashboard.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    })
  ).isRequired,
  studentRequests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    })
  ).isRequired,
  handleWithdrawRequest: PropTypes.func.isRequired,
};

export default StudentDashboard;