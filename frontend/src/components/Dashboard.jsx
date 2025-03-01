import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userData, setUserData] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://127.0.0.1:8000/auth/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        setMessage("Error fetching user data. Please log in again.");
      }
    };

    fetchUserData();
  }, []);

  if (message) {
    return <div className="text-center mt-10 text-red-500">{message}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>
      <div className="space-y-4">
        <p>
          <strong>Username:</strong> {userData.username}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Is Staff:</strong> {userData.is_staff ? "Yes" : "No"}
        </p>
        <p>
          <strong>Is Active:</strong> {userData.is_active ? "Yes" : "No"}
        </p>
        <p>
          <strong>Date Joined:</strong>{" "}
          {new Date(userData.date_joined).toLocaleString()}
        </p>
      </div>

      {/* Create Course Button */}
      <button
        onClick={() => navigate("/create-course")}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Create Course
      </button>
    </div>
  );
};

export default Dashboard;