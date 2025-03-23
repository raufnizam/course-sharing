import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
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
        setMessage("Error fetching categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  // Handle category deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const token = localStorage.getItem("access_token");
        await axios.delete(`http://127.0.0.1:8000/api/categories/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage("Category deleted successfully!");
        setCategories(categories.filter((cat) => cat.id !== id)); // Remove deleted category from the list
      } catch (error) {
        setMessage("Error deleting category. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Category List</h1>
      {message && (
        <div className={`mb-4 ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>
          {message}
        </div>
      )}

      {/* Create Category Button */}
      <button
        onClick={() => navigate("/create-category")}
        className="mb-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Create Category
      </button>

      {/* List of Categories */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="border p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">{category.name}</h2>
            <p className="text-gray-600">{category.description}</p>
            <div className="mt-4 space-x-4">
              <button
                onClick={() => navigate(`/edit-category/${category.id}`)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;