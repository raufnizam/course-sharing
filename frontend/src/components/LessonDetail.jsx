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
        // Ensure videos and pdfs are initialized as arrays
        const data = response.data;
        data.videos = data.videos || [];
        data.pdfs = data.pdfs || [];
        setLesson(data);
      } catch (error) {
        setMessage("Error fetching lesson details. Please try again.");
      }
    };

    fetchLesson();
  }, [id]);

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

      {/* Lesson Information */}
      <div className="space-y-4">
        <p><strong>Title:</strong> {lesson.title}</p>
        <p><strong>Description:</strong> {lesson.description}</p>
        <p><strong>Order:</strong> {lesson.order}</p>
      </div>

      {/* Videos in Lesson */}
      {lesson.videos.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Videos</h2>
          {lesson.videos.map((video) => (
            <div key={video.id} className="mt-4 border p-4 rounded-lg shadow-sm">
              <p className="font-medium">{video.title}</p>
              <video controls className="w-full mt-2">
                <source src={video.video_file} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p className="text-gray-600">{video.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* PDFs in Lesson */}
      {lesson.pdfs.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">PDFs</h2>
          {lesson.pdfs.map((pdf) => (
            <div key={pdf.id} className="mt-4 border p-4 rounded-lg shadow-sm">
              <p className="font-medium">{pdf.title}</p>
              <a href={pdf.pdf_file} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                View PDF
              </a>
              <p className="text-gray-600">{pdf.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonDetail;