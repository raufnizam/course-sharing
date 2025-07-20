import { useEffect, useState } from "react";
import api from "../../api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({ title: "", description: "", category: "" });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${token}` };

        const [categoriesResponse, courseResponse] = await Promise.all([
          api.get("/api/categories/", { headers }),
          api.get(`/api/courses/${id}/`, { headers }),
        ]);

        const fetchedCategories = categoriesResponse.data;
        const fetchedCourse = courseResponse.data;

        setCategories(fetchedCategories);

        const categoryName = fetchedCourse.category;
        const category = fetchedCategories.find(
          (cat) => cat.name === categoryName
        );
        const categoryId = category ? category.id : "";

        setCourse({
          title: fetchedCourse.title || "",
          description: fetchedCourse.description || "",
          category: categoryId,
        });
      } catch (error) {
        toast.error("Error fetching course details. Please try again.");
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      await api.put(
        `/api/courses/${id}/`,
        {
          ...course,
          category: course.category ? parseInt(course.category) : null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Course updated successfully!");
      setTimeout(() => navigate(`/courses/${id}`), 1000);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Error updating course. Please try again.";
      toast.error(errorMsg);
      console.error("Error updating course:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Edit Course</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={course.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={course.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={course.category || ""}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}> {/* Use cat.id as the value */}
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditCourse;