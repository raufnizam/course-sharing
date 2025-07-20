import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]); // State to store categories
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const navigate = useNavigate();

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://127.0.0.1:8000/api/categories/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data);
      } catch (error) {
        toast.error("Error fetching categories. Please try again.");
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !category) {
      toast.error("Title, description, and category cannot be empty.");
      return;
    }

    setLoading(true); // Set loading state to true

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/courses/",
        { title, description, category: parseInt(category) }, // Ensure category is sent as an ID (number)
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Course created successfully!");
      setTimeout(() => {
        navigate(`/courses/${response.data.id}/add-lesson`); // Redirect to add lesson page
      }, 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Error creating course. Please try again.";
      toast.error(errorMsg);
      console.error("Error creating course:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Create Course</h1>

      <form onSubmit={handleCreateCourse} className="space-y-4">
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

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading} // Disable button while loading
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;