import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student", // Default role
  });
  const [loading, setLoading] = useState(false); // Loading state for registration
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true

    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/register/", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profile: {
          role: formData.role, // Only role is required during registration
        },
      });

      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
    } catch (error) {
      let errorMessage = "Error during registration. Please try again.";

      if (error.response) {
        // Server responded with an error
        const errorData = error.response.data;

        // Check if the error data is an object (e.g., validation errors)
        if (typeof errorData === "object" && errorData !== null) {
          // Convert the error object to a readable string
          const errorMessages = Object.values(errorData).flat().join(", ");
          errorMessage = "Error: " + errorMessages;
        } else {
          // If the error data is a string or other type
          errorMessage = "Error: " + errorData;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "Error: No response from the server.";
      } else {
        // Something happened in setting up the request
        errorMessage = "Error: Unable to connect to the server.";
      }

      toast.error(errorMessage);
      console.error("Registration error:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading} // Disable button while loading
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;