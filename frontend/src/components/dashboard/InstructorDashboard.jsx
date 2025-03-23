import { useNavigate } from "react-router-dom";
import CourseCard from "./CourseCard";
import EnrollmentRequestCard from "./EnrollmentRequestCard";

const InstructorDashboard = ({ courses, enrollmentRequests, handleApproveRequest, handleRejectRequest }) => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Instructor Dashboard</h2>
      <p className="mb-6">Welcome, Instructor! Manage your courses and enrollment requests here.</p>

      {/* Create Course Button */}
      <button
        onClick={() => navigate("/create-course")}
        className="mb-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Create Course
      </button>

      {/* Display Instructor's Courses */}
      {courses.length > 0 ? (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Your Courses</h3>
          <ul className="space-y-4">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500 mb-8">No courses found.</p>
      )}

      {/* Display Enrollment Requests */}
      {enrollmentRequests.length > 0 ? (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Enrollment Requests</h3>
          <ul className="space-y-4">
            {enrollmentRequests.map((request) => (
              <EnrollmentRequestCard
                key={request.id}
                request={request}
                onApprove={() => handleApproveRequest(request.id)} // Pass request ID to approve
                onReject={() => handleRejectRequest(request.id)} // Pass request ID to reject
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

export default InstructorDashboard;