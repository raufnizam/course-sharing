import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Verify admin status on component mount
  useEffect(() => {
    const verifyAdmin = async () => {
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
        
        if (response.data.profile?.role !== "admin") {
          toast.error("Only administrators can create categories");
          navigate("/categories");
        } else {
          setIsAdmin(true);
        }
      } catch (error) {
        toast.error("Error verifying permissions");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, [navigate]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim()) {
      toast.error("Name and description cannot be empty");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        "http://127.0.0.1:8000/api/categories/",
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      toast.success("Category created successfully!");
      navigate("/categories");
    } catch (error) {
      let errorMessage = "Error creating category";
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Session expired. Please login again";
          navigate("/login");
        } else if (error.response.data) {
          errorMessage = error.response.data.message || error.response.data.detail;
        }
      }
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Create Category</h1>
        <div className="text-center py-8">Verifying permissions...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Create Category</h1>
        <div className="text-center py-8 text-red-500">
          You don't have permission to access this page
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Create Category</h1>
      
      <form onSubmit={handleCreateCategory} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            minLength={3}
            maxLength={50}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            minLength={10}
            maxLength={500}
            rows={4}
          />
        </div>
        
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300"
            disabled={loading}
          >
            Create Category
          </button>
          <button
            type="button"
            onClick={() => navigate("/categories")}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;