import { Link } from "react-router-dom";

const InstructorDashboard = ({ courses, enrollmentRequests, handleApproveRequest, handleRejectRequest }) => {
  return (
    <div>
      {/* Create Course Button */}
      <button
        onClick={() => navigate("/create-course")}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Create Course
      </button>

      {/* Display Instructor's Courses */}
      {courses.length > 0 && (
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

      {/* Display Enrollment Requests */}
      {enrollmentRequests.length > 0 && (
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
    </div>
  );
};

export default InstructorDashboard;