import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const AddLesson = () => {
  const { id } = useParams(); // Course ID from the URL
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  // Handle form submission
  const handleAddLesson = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!title.trim() || !description.trim()) {
      setMessage("Title and description cannot be empty.");
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("course", id); // Add course ID
    if (videoFile) formData.append("video_file", videoFile); // Optional video file
    if (pdfFile) formData.append("pdf_file", pdfFile); // Optional PDF file

    try {
      setIsLoading(true); // Set loading state to true
      setMessage(""); // Clear any previous messages

      // Fetch token and send POST request
      const token = localStorage.getItem("access_token");
      const response = await axios.post("http://127.0.0.1:8000/api/lessons/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle success
      setMessage("Lesson added successfully!");
      setTimeout(() => {
        navigate(`/courses/${id}`); // Redirect to course detail page
      }, 2000);
    } catch (error) {
      // Handle errors
      console.error("Error adding lesson:", error.response?.data); // Log detailed error
      setMessage("Error adding lesson. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Add Lesson</h1>

      {/* Message Display */}
      {message && (
        <div className={`mb-4 ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>
          {message}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleAddLesson} className="space-y-4">
        {/* Title Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Video Upload Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Video (Optional)</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* PDF Upload Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">PDF (Optional)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>


        <button
            type="button"
            onClick={() => navigate(`/courses/${id}`)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Back
          </button>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading} // Disable button while loading
          className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Adding Lesson..." : "Add Lesson"}
        </button>
      </form>
    </div>
  );
};

export default AddLesson;