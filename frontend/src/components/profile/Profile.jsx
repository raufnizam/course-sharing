import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    profile: {
      role: "",
      bio: "",
      phone_number: "",
      profile_image: null,
    },
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          toast.error("Please login to view your profile");
          navigate("/login");
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/auth/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setUserData({
          username: response.data.username,
          email: response.data.email,
          profile: {
            role: response.data.profile?.role || "No role assigned",
            bio: response.data.profile?.bio || "No bio provided",
            phone_number: response.data.profile?.phone_number || "Not provided",
            profile_image: response.data.profile?.profile_image || null,
          },
        });
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again");
          navigate("/login");
        } else {
          toast.error("Error loading profile data");
          console.error("Error fetching profile:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [navigate]);

  const handleEditClick = () => {
    navigate("/profile/edit");
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>
        <div className="text-center py-8">Loading profile data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Profile</h1>
      
      <div className="flex flex-col items-center mb-6">
        {userData.profile.profile_image ? (
          <img
            src={`http://127.0.0.1:8000${userData.profile.profile_image}`}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-blue-100 flex items-center justify-center">
            <span className="text-gray-500 text-lg">No Image</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="border-b pb-4">
          <h2 className="text-sm font-medium text-gray-500">Username</h2>
          <p className="mt-1 text-lg">{userData.username}</p>
        </div>

        <div className="border-b pb-4">
          <h2 className="text-sm font-medium text-gray-500">Email</h2>
          <p className="mt-1 text-lg">{userData.email}</p>
        </div>

        <div className="border-b pb-4">
          <h2 className="text-sm font-medium text-gray-500">Role</h2>
          <p className="mt-1 text-lg capitalize">{userData.profile.role}</p>
        </div>

        <div className="border-b pb-4">
          <h2 className="text-sm font-medium text-gray-500">Bio</h2>
          <p className="mt-1 text-lg whitespace-pre-line">
            {userData.profile.bio}
          </p>
        </div>

        <div className="border-b pb-4">
          <h2 className="text-sm font-medium text-gray-500">Phone Number</h2>
          <p className="mt-1 text-lg">{userData.profile.phone_number}</p>
        </div>
      </div>

      <button
        onClick={handleEditClick}
        className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Edit Profile
      </button>
    </div>
  );
};

export default Profile;