import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InstructorCourseDetail from "./InstructorCourseDetail";
import StudentCourseDetail from "./StudentCourseDetail";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentRequestStatus, setEnrollmentRequestStatus] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("access_token");

        // Fetch user profile
        const userResponse = await axios.get(`http://127.0.0.1:8000/auth/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);

        // Fetch course details
        const courseResponse = await axios.get(`http://127.0.0.1:8000/api/courses/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = courseResponse.data;
        data.lessons = data.lessons || [];
        data.lessons.forEach((lesson) => {
          lesson.videos = lesson.videos || [];
          lesson.pdfs = lesson.pdfs || [];
        });

        setCourse(data);

        // Check enrollment and request status for students
        if (userResponse.data.profile?.role === "student") {
          const enrollmentResponse = await axios.get(`http://127.0.0.1:8000/api/check-enrollment/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsEnrolled(enrollmentResponse.data.is_enrolled);

          const requestResponse = await axios.get(`http://127.0.0.1:8000/api/check-enrollment-request/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEnrollmentRequestStatus(requestResponse.data.status);
        }
      } catch (error) {
        toast.error("Error fetching course details. Please try again.");
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleRequestEnrollment = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const payload = { message: requestMessage || "" }; // Ensure message is not undefined
      await axios.post(
        `http://127.0.0.1:8000/api/request-enrollment/${id}/`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Enrollment request submitted successfully.");
      setEnrollmentRequestStatus("pending");
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Error submitting enrollment request. Please try again.";
      toast.error(errorMsg);
      console.error("Error details:", error.response?.data);
    }
  };

  const handleWithdraw = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://127.0.0.1:8000/api/withdraw-course/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Successfully withdrawn from the course.");
      setIsEnrolled(false);
    } catch (error) {
      toast.error("Error withdrawing from the course. Please try again.");
      console.error("Error withdrawing from course:", error);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://127.0.0.1:8000/api/courses/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Course deleted successfully!");
      setTimeout(() => navigate("/courses"), 1000);
    } catch (error) {
      toast.error("Error deleting course. Please try again.");
      console.error("Error deleting course:", error);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!course) {
    return <div className="text-center mt-10 text-red-500">Course not found.</div>;
  }

  const isInstructor = user?.profile?.role === "instructor";
  const isCourseCreator = user?.id === course?.instructor?.id;

  return (
    <>
      {isInstructor ? (
        <InstructorCourseDetail
          course={course}
          handleDeleteCourse={handleDeleteCourse}
          user={user}
          isCourseCreator={isCourseCreator} // Pass this prop to InstructorCourseDetail
        />
      ) : (
        <StudentCourseDetail
          course={course}
          isEnrolled={isEnrolled}
          enrollmentRequestStatus={enrollmentRequestStatus}
          handleRequestEnrollment={handleRequestEnrollment}
          handleWithdraw={handleWithdraw}
          requestMessage={requestMessage}
          setRequestMessage={setRequestMessage}
        />
      )}
    </>
  );
};

export default CourseDetail;