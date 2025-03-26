import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddLesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });
  const [videoFile, setVideoFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Verify user role on component mount
  useEffect(() => {
    const verifyUserRole = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Please login to access this page");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/auth/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const role = response.data.profile?.role;
        setUserRole(role);

        // Only allow admin and instructor
        if (role === "admin" || role === "instructor") {
          setIsAuthorized(true);
        } else {
          toast.error("Only administrators and instructors can add lessons");
          navigate(`/courses/${id}`);
        }
      } catch (error) {
        toast.error("Error verifying permissions");
        navigate("/login");
      }
    };

    verifyUserRole();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, setFile) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Title and description cannot be empty");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("course", id);
    if (videoFile) formDataToSend.append("video_file", videoFile);
    if (pdfFile) formDataToSend.append("pdf_file", pdfFile);

    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");
      
      await axios.post("http://127.0.0.1:8000/api/lessons/", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Lesson added successfully!");
      navigate(`/courses/${id}`);
    } catch (error) {
      let errorMessage = "Error adding lesson";
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Session expired. Please login again";
          navigate("/login");
        } else if (error.response.data) {
          errorMessage = error.response.data.message || error.response.data.detail;
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
        <h1 className="text-2xl font-bold mb-6">Add Lesson</h1>
        <div className="text-center py-8 text-red-500">
          Verifying permissions...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Add Lesson</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            minLength={10}
            maxLength={500}
            rows={4}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Video (Optional)
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => handleFileChange(e, setVideoFile)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            PDF (Optional)
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFileChange(e, setPdfFile)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Adding Lesson..." : "Add Lesson"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/courses/${id}`)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLesson;