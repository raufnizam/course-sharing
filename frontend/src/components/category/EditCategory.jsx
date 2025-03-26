import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Verify admin status and fetch category data
  useEffect(() => {
    const verifyAndFetch = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Please login to access this page");
        navigate("/login");
        return;
      }

      try {
        // Verify admin status
        const profileResponse = await axios.get(
          "http://127.0.0.1:8000/auth/profile/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (profileResponse.data.profile?.role !== "admin") {
          toast.error("Only administrators can edit categories");
          navigate("/categories");
          return;
        }

        setIsAdmin(true);

        // Fetch category data
        const categoryResponse = await axios.get(
          `http://127.0.0.1:8000/api/categories/${id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setFormData({
          name: categoryResponse.data.name,
          description: categoryResponse.data.description
        });
      } catch (error) {
        if (error.response?.status === 404) {
          toast.error("Category not found");
          navigate("/categories");
        } else if (error.response?.status === 401) {
          toast.error("Session expired. Please login again");
          navigate("/login");
        } else {
          toast.error("Error loading category data");
          console.error("Error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAndFetch();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("access_token");
      await axios.put(
        `http://127.0.0.1:8000/api/categories/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      toast.success("Category updated successfully!");
      navigate("/categories");
    } catch (error) {
      let errorMessage = "Error updating category";
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
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
        <div className="text-center py-8">Loading category data...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
        <div className="text-center py-8 text-red-500">
          You don't have permission to edit categories
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
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
        
        <div className="flex space-x-4">
          <button
            type="submit"
            className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save Changes"}
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

export default EditCategory;