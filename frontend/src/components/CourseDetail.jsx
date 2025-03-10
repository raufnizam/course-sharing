import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import InstructorCourseDetail from "./InstructorCourseDetail";
import StudentCourseDetail from "./StudentCourseDetail";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const userResponse = await axios.get(
          `http://127.0.0.1:8000/auth/profile/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(userResponse.data);

        const courseResponse = await axios.get(
          `http://127.0.0.1:8000/api/courses/${id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = courseResponse.data;
        data.lessons = data.lessons || [];
        data.lessons.forEach((lesson) => {
          lesson.videos = lesson.videos || [];
          lesson.pdfs = lesson.pdfs || [];
        });

        setCourse(data);

        // Check if the student is enrolled
        if (userResponse.data.role === "student") {
          const enrollmentResponse = await axios.get(
            `http://127.0.0.1:8000/api/check-enrollment/${id}/`, // Use the new endpoint
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setIsEnrolled(enrollmentResponse.data.is_enrolled); // Update enrollment status
        }
      } catch (error) {
        setMessage("Error fetching course details. Please try again.");
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    try {
        const token = localStorage.getItem("access_token");
        const response = await axios.post(
            `http://127.0.0.1:8000/api/enroll-course/${id}/`,
            {}, // Empty body for POST request
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        setMessage("Successfully enrolled in the course.");
        setIsEnrolled(true); // Update enrollment status
    } catch (error) {
        setMessage("Error enrolling in the course. Please try again.");
    }
};

  const handleDeleteCourse = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://127.0.0.1:8000/api/courses/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Course deleted successfully!");
      setTimeout(() => navigate("/courses"), 1000);
    } catch (error) {
      setMessage("Error deleting course. Please try again.");
    }
  };

  if (!course) return <div>Loading...</div>;

  const isInstructor = user && user.role === "instructor";

  return (
    <>
        {message && (
            <div className={`mb-4 ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>
                {message}
            </div>
        )}

        {isInstructor ? (
            <InstructorCourseDetail
                course={course}
                handleDeleteCourse={handleDeleteCourse}
                user={user} // Pass the logged-in user
            />
        ) : (
            <StudentCourseDetail
                course={course}
                isEnrolled={isEnrolled}
                handleEnroll={handleEnroll}
            />
        )}
    </>
);
};

export default CourseDetail;
