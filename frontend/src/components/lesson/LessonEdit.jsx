import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LessonEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState({
    title: "",
    description: "",
    order: "",
    course: "", // Store the course ID here
    video_file: null,
    pdf_file: null,
    video_file_name: "",
    pdf_file_name: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const verifyAndFetchData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Please login to access this page");
        navigate("/login");
        return;
      }

      try {
        // Verify user role
        const profileResponse = await axios.get(
          "http://127.0.0.1:8000/auth/profile/",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const role = profileResponse.data.profile?.role;
        if (role !== "admin" && role !== "instructor") {
          toast.error("Only administrators and instructors can edit lessons");
          navigate("/");
          return;
        }

        setIsAuthorized(true);

        // Fetch lesson details
        const lessonResponse = await axios.get(
          `http://127.0.0.1:8000/api/lessons/${id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setLesson({
          ...lessonResponse.data,
          course: lessonResponse.data.course // Store the course ID from the response
        });
      } catch (error) {
        if (error.response?.status === 404) {
          toast.error("Lesson not found");
          navigate("/lessons");
        } else if (error.response?.status === 401) {
          toast.error("Session expired. Please login again");
          navigate("/login");
        } else {
          toast.error("Error loading lesson data");
          console.error("Error:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyAndFetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    setLesson({ ...lesson, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setLesson({ ...lesson, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", lesson.title);
    formData.append("description", lesson.description);
    formData.append("order", Number(lesson.order));
    formData.append("course", lesson.course); // Include the course ID in the form data

    if (lesson.video_file instanceof File) {
      formData.append("video_file", lesson.video_file);
    }
    if (lesson.pdf_file instanceof File) {
      formData.append("pdf_file", lesson.pdf_file);
    }

    try {
      const token = localStorage.getItem("access_token");
      await axios.put(`http://127.0.0.1:8000/api/lessons/${id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Lesson updated successfully!");
      navigate(`/lessons/${id}`);
    } catch (error) {
      let errorMessage = "Error updating lesson";
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Session expired. Please login again";
          navigate("/login");
        } else if (error.response.data) {
          errorMessage = error.response.data.message || JSON.stringify(error.response.data);
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  if (!isAuthorized) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Edit Lesson</h1>
        <div className="text-center py-8">
          {isLoading ? "Verifying permissions..." : "You don't have permission to edit lessons"}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Edit Lesson</h1>
        <div className="text-center py-8">Loading lesson data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Edit Lesson</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={lesson.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            minLength={3}
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={lesson.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            minLength={10}
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Order <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="order"
            value={lesson.order}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            min={1}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Video File
          </label>
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            PDF File
          </label>
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

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Updating..." : "Update Lesson"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/lessons/${id}`)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default LessonEdit;