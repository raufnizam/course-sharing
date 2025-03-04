import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const CourseDetail = () => {
  const { id } = useParams(); // Get the course ID from the URL
  const navigate = useNavigate(); // For navigation
  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`http://127.0.0.1:8000/api/courses/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Ensure lessons, videos, and pdfs are initialized as arrays
        const data = response.data;
        data.lessons = data.lessons || [];
        data.lessons.forEach((lesson) => {
          lesson.videos = lesson.videos || [];
          lesson.pdfs = lesson.pdfs || [];
        });
        setCourse(data);
      } catch (error) {
        setMessage("Error fetching course details. Please try again.");
      }
    };

    fetchCourse();
  }, [id]);

  if (!course) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Course Details</h1>
      {message && (
        <div className={`mb-4 ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>
          {message}
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => navigate("/courses")}
        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mb-4"
      >
        Back to Course List
      </button>

      {/* Course Information */}
      <div className="space-y-4">
        <p><strong>Title:</strong> {course.title}</p>
        <p><strong>Description:</strong> {course.description}</p>
        <p><strong>Instructor:</strong> {course.instructor.username}</p>
        <p><strong>Created At:</strong> {new Date(course.created_at).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(course.updated_at).toLocaleString()}</p>
      </div>

      {/* Add Lesson Button */}
      <button
        onClick={() => navigate(`/courses/${id}/add-lesson`)}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Add Lesson
      </button>

      {/* List of Lessons (with Videos and PDFs) */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Lessons</h2>
        {course.lessons.length === 0 ? (
          <p>No lessons added yet.</p>
        ) : (
          <div className="space-y-6">
            {course.lessons.map((lesson) => (
              <div key={lesson.id} className="border p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold">{lesson.title}</h3>
                <p className="text-gray-600">{lesson.description}</p>

                {/* Videos in Lesson */}
                {lesson.videos.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold">Videos</h4>
                    {lesson.videos.map((video) => (
                      <div key={video.id} className="mt-2">
                        <p className="font-medium">{video.title}</p>
                        <video controls className="w-full mt-1">
                          <source src={video.video_file} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ))}
                  </div>
                )}

                {/* PDFs in Lesson */}
                {lesson.pdfs.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold">PDFs</h4>
                    {lesson.pdfs.map((pdf) => (
                      <div key={pdf.id} className="mt-2">
                        <p className="font-medium">{pdf.title}</p>
                        <a href={pdf.pdf_file} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                          View PDF
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
