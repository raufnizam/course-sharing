import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const LessonDetail = () => {
  const { id } = useParams(); // Get the lesson ID from the URL
  const navigate = useNavigate(); // For navigation
  const [lesson, setLesson] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch lesson details
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`http://127.0.0.1:8000/api/lessons/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLesson(response.data);
      } catch (error) {
        setMessage("Error fetching lesson details. Please try again.");
      }
    };

    fetchLesson();
  }, [id]);

  // Delete lesson function
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this lesson?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://127.0.0.1:8000/api/lessons/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Lesson deleted successfully.");
      setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds
    } catch (error) {
      setMessage("Error deleting lesson. Please try again.");
    }
  };

  if (!lesson) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Lesson Details</h1>
      {message && (
        <div className={`mb-4 ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>
          {message}
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mb-4"
      >
        Back
      </button>

      {/* Edit Button */}
      <button
        onClick={() => navigate(`/lessons/edit/${id}`)} // Navigate to edit page
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-4 ml-2"
      >
        Edit
      </button>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mb-4 ml-2"
      >
        Delete
      </button>

      {/* Lesson Information */}
      {console.log(lesson)}
      <div className="space-y-4">
        <p><strong>Title:</strong> {lesson.title}</p>
        <p><strong>Description:</strong> {lesson.description}</p>
        <p><strong>Order:</strong> {lesson.order}</p>
      </div>

      {/* Video Section */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Video</h2>
        {lesson.video_file ? (
          <div className="mt-4 border p-4 rounded-lg shadow-sm">
            <p className="font-medium">{lesson.video_title || "Untitled Video"}</p>
            <video controls className="w-full mt-2">
              <source src={lesson.video_file} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p className="text-gray-600">{lesson.video_description || "No description available."}</p>
          </div>
        ) : (
          <p>No video available for this lesson.</p>
        )}
      </div>

      {/* PDF Section */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">PDF</h2>
        {lesson.pdf_file ? (
          <div className="mt-4 border p-4 rounded-lg shadow-sm">
            <p className="font-medium">{lesson.pdf_title || "Untitled PDF"}</p>
            <a href={lesson.pdf_file} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
              View PDF
            </a>
            <p className="text-gray-600">{lesson.pdf_description || "No description available."}</p>
          </div>
        ) : (
          <p>No PDF available for this lesson.</p>
        )}
      </div>
    </div>
  );
};

export default LessonDetail;
