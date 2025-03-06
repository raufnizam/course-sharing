import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const LessonEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState({
    title: "",
    description: "",
    order: "",
    course: "",
    video_file: null,
    pdf_file: null,
    video_file_name: "",
    pdf_file_name: "",
  });
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch lesson details
    const fetchLesson = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          `http://127.0.0.1:8000/api/lessons/${id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLesson(response.data);
      } catch (error) {
        setMessage("Error fetching lesson details.");
      }
    };

    // Fetch courses
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://127.0.0.1:8000/api/courses/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data);
      } catch (error) {
        setMessage("Error fetching courses.");
      }
    };

    fetchLesson();
    fetchCourses();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setLesson({ ...lesson, [e.target.name]: e.target.value });
  };

  // Handle file changes
  const handleFileChange = (e) => {
    setLesson({ ...lesson, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
  
    const formData = new FormData();
    formData.append("title", lesson.title);
    formData.append("description", lesson.description);
    formData.append("order", Number(lesson.order));  // Ensure correct data type
    formData.append("course", Number(lesson.course));
  
    // Append files only if they exist
    if (lesson.video_file instanceof File) {
      formData.append("video_file", lesson.video_file);
    }
    if (lesson.pdf_file instanceof File) {
      formData.append("pdf_file", lesson.pdf_file);
    }
  
    try {
      await axios.put(`http://127.0.0.1:8000/api/lessons/${id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Lesson updated successfully.");
      setTimeout(() => navigate(`/lessons/${id}`), 2000);
    } catch (error) {
      console.log("Error Response:", error.response.data); // Log exact error
      setMessage(`Error: ${JSON.stringify(error.response.data)}`);
    }
  };
  

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Edit Lesson</h1>
      {message && (
        <div
          className={`mb-4 ${
            message.includes("Error") ? "text-red-500" : "text-green-500"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={lesson.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={lesson.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Order</label>
          <input
            type="number"
            name="order"
            value={lesson.order}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Course</label>
          <select
            name="course"
            value={lesson.course}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Video File */}
        <div>
          <label className="block font-medium">Video File (Optional)</label>
          {lesson.video_file_name && (
            <div className="mb-2 flex items-center">
              <span className="mr-2">📹 {lesson.video_file_name}</span>
              
            </div>
          )}
          <input
            type="file"
            name="video_file"
            accept="video/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* PDF File */}
        <div>
          <label className="block font-medium">PDF File (Optional)</label>
          {lesson.pdf_file_name && (
            <div className="mb-2 flex items-center">
              <span className="mr-2">📄 {lesson.pdf_file_name}</span>
              
            </div>
          )}
          <input
            type="file"
            name="pdf_file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Update Lesson
          </button>
          <button
            type="button"
            onClick={() => navigate(`/lessons/${id}`)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default LessonEdit;
