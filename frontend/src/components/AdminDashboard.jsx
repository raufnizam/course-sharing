import React, { useState } from "react";

const AdminDashboard = ({
  allUsers = [],
  allCourses = [],
  enrollmentRequests = [],
  handleDeleteUser,
  handleApproveRequest,
  handleRejectRequest,
}) => {
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  // Filter users, courses, and enrollment requests based on search term
  const filteredUsers = allUsers.filter((user) =>
    user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredCourses = allCourses.filter((course) =>
    course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredRequests = enrollmentRequests.filter((request) =>
    request?.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request?.student?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <p className="mb-6">Welcome, Admin! You have full access to manage the platform.</p>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users, courses, or requests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Display All Users */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">All Users</h3>
        {filteredUsers.length > 0 ? (
          <ul className="space-y-4">
            {filteredUsers.map((user) => (
              <li key={user?.id} className="border p-4 rounded-md shadow-sm">
                <p><strong>Username:</strong> {user?.username}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>
                <button
                  onClick={() => handleDeleteUser(user?.id)}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Delete User
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No users found.</p>
        )}
      </div>

      {/* Display All Courses */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">All Courses</h3>
        {filteredCourses.length > 0 ? (
          <ul className="space-y-4">
            {filteredCourses.map((course) => (
              <li key={course?.id} className="border p-4 rounded-md shadow-sm">
                <p><strong>Title:</strong> {course?.title}</p>
                <p><strong>Description:</strong> {course?.description}</p>
                <p><strong>Instructor:</strong> {course?.instructor}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No courses found.</p>
        )}
      </div>

      {/* Display Enrollment Requests */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Enrollment Requests</h3>
        {filteredRequests.length > 0 ? (
          <ul className="space-y-4">
            {filteredRequests.map((request) => (
              <li key={request?.id} className="border p-4 rounded-md shadow-sm">
                <p><strong>Course:</strong> {request?.course?.title}</p>
                <p><strong>Student:</strong> {request?.student?.username}</p>
                <p><strong>Status:</strong> {request?.status}</p>
                {request?.status === "pending" && (
                  <div className="mt-2">
                    <button
                      onClick={() => handleApproveRequest(request?.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request?.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No enrollment requests found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;