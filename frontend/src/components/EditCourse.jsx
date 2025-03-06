import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState({ title: "", description: "" });
    const [message, setMessage] = useState("");

    // Fetch course details
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await axios.get(`http://127.0.0.1:8000/api/courses/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCourse(response.data);
            } catch (error) {
                setMessage("Error fetching course details. Please try again.");
            }
        };

        fetchCourse();
    }, [id]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("access_token");
            await axios.put(`http://127.0.0.1:8000/api/courses/${id}/`, course, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage("Course updated successfully!");
            setTimeout(() => navigate(`/courses/${id}`), 1000); // Redirect to course detail page
        } catch (error) {
            setMessage("Error updating course. Please try again.");
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Edit Course</h1>
            {message && (
                <div className={`mb-4 ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>
                    {message}
                </div>
            )}

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