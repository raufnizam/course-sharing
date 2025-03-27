import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const InstructorCourseDetail = ({ course, handleDeleteCourse, user }) => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isCourseOwner = user && user.username === course.instructor;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        // 1. Fetch enrollments which includes student IDs
        const enrollmentsRes = await axios.get(
          `http://127.0.0.1:8000/api/course-enrollments/${course.id}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // 2. Extract student IDs from enrollments
        const studentIds = enrollmentsRes.data.map((e) => e.student);

        if (studentIds.length === 0) {
          setEnrollments([]);
          setStudents({});
          setLoading(false);
          return;
        }

        // 3. Fetch student details including usernames
        const studentsRes = await axios.get(
          `http://127.0.0.1:8000/auth/users/?ids=${studentIds.join(",")}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Create mapping of students
        const studentsMap = {};
        studentsRes.data.forEach((student) => {
          studentsMap[student.id] = {
            ...student,
            displayName: student.profile?.full_name || student.username,
          };
        });

        setEnrollments(enrollmentsRes.data);
        setStudents(studentsMap);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load course data");
        toast.error("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    if (isCourseOwner) {
      fetchData();
    }
  }, [course.id, isCourseOwner]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await handleDeleteCourse();
        toast.success("Course deleted successfully!");
        navigate("/courses");
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("Failed to delete course");
      }
    }
  };

  const handleViewProfile = (studentId) => {
    const student = students[studentId];
    if (student) {
      navigate(`/users/${student.username}`);
    } else {
      toast.error("Student data not available");
    }
  };

  const handleSendMessage = (studentId) => {
    navigate(`/messages/new?recipient=${studentId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <div className="text-red-500 text-center py-10">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-6 p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-gray-600 mt-1">Created by {course.instructor}</p>
        </div>
        <button
          onClick={() => navigate("/courses")}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md transition"
        >
          ← Back to Courses
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Course Info Section */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Course Details</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Category:</span>{" "}
                {course.category || "General"}
              </p>
              <p>
                <span className="font-medium">Created:</span>{" "}
                {new Date(course.created_at).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Last Updated:</span>{" "}
                {new Date(course.updated_at).toLocaleDateString()}
              </p>
              <p className="mt-3">{course.description}</p>
            </div>
          </div>

          {/* Lessons Section */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Lessons</h2>
              {isCourseOwner && (
                <button
                  onClick={() => navigate(`/courses/${course.id}/add-lesson`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  + Add Lesson
                </button>
              )}
            </div>

            {course.lessons?.length === 0 ? (
              <div className="bg-gray-50 p-8 text-center rounded-lg">
                <p className="text-gray-500">No lessons added yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {course.lessons?.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="border p-4 rounded-lg hover:shadow-md transition cursor-pointer"
                    onClick={() => navigate(`/lessons/${lesson.id}`)}
                  >
                    <h3 className="font-semibold text-lg">{lesson.title}</h3>
                    <p className="text-gray-600 mt-1">{lesson.description}</p>
                    <div className="mt-2 flex space-x-2 text-sm text-gray-500">
                      {lesson.videos?.length > 0 && (
                        <span>🎥 {lesson.videos.length} video(s)</span>
                      )}
                      {lesson.pdfs?.length > 0 && (
                        <span>📄 {lesson.pdfs.length} PDF(s)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {isCourseOwner && (
            <>
              {/* Management Actions */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-3">
                  Course Management
                </h2>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate(`/courses/${course.id}/edit`)}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
                  >
                    Edit Course Details
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                  >
                    Delete Course
                  </button>
                </div>
              </div>

              {/* Enrolled Students */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold">
                    Enrolled Students ({enrollments.length})
                  </h2>
                </div>

                {enrollments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No students enrolled yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {enrollments.map((enrollment) => {
                      const student = students[enrollment.student] || {};
                      return (
                        <div
                          key={enrollment.id}
                          className="flex items-center justify-between p-2 bg-white rounded border"
                        >
                          <div className="flex-1">
                            <button
                              onClick={() =>
                                handleViewProfile(enrollment.student)
                              }
                              className="text-left hover:underline"
                            >
                              <p className="font-medium">
                                {student.displayName || "Anonymous"}
                              </p>
                            </button>
                            <p className="text-sm text-gray-500">
                              {student.email}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                          <button
                              onClick={() =>
                                handleViewProfile(enrollment.student)
                              }
                              className="text-blue-500 hover:text-blue-700 text-sm"
                            >
                              Profile
                            </button>
                            <button
                              onClick={() =>
                                handleSendMessage(enrollment.student)
                              }
                              className="text-green-500 hover:text-green-700 text-sm"
                            >
                              Message
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorCourseDetail;
