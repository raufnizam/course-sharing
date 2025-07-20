import { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  // Check user role and authentication
  useEffect(() => {
    const checkAdminAccess = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("/auth/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.data.profile?.role !== "admin") {
          toast.error("You don't have permission to access this page");
          navigate("/");
        } else {
          setUserRole(response.data.profile.role);
          fetchCategories();
        }
      } catch {
        toast.error("Error verifying your access");
        navigate("/login");
      }
    };

    checkAdminAccess();
  }, [navigate]);

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await api.get("/api/categories/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data);
    } catch {
      toast.error("Error fetching categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle category deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const token = localStorage.getItem("access_token");
        await api.delete(`/api/categories/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Category deleted successfully!");
        setCategories(categories.filter((cat) => cat.id !== id));
      } catch {
        toast.error("Error deleting category. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Category List</h1>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Category List</h1>

      {/* Create Category Button - Only show for admin */}
      {userRole === "admin" && (
        <button
          onClick={() => navigate("/create-category")}
          className="mb-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Create Category
        </button>
      )}

      {/* List of Categories */}
      <div className="space-y-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category.id} className="border p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold">{category.name}</h2>
              <p className="text-gray-600">{category.description}</p>
              
              {/* Action Buttons - Only show for admin */}
              {userRole === "admin" && (
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
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            No categories found
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;