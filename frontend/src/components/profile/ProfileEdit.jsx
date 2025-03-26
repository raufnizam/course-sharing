import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

const ProfileEdit = () => {
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
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          toast.error("Please login to edit your profile");
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
            role: response.data.profile?.role || "",
            bio: response.data.profile?.bio || "",
            phone_number: response.data.profile?.phone_number || "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in userData.profile) {
      setUserData({
        ...userData,
        profile: {
          ...userData.profile,
          [name]: value,
        },
      });
    } else {
      setUserData({
        ...userData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    setUserData({
      ...userData,
      profile: {
        ...userData.profile,
        profile_image: e.target.files[0],
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      
      // Only include editable fields
      formData.append("profile.bio", userData.profile.bio);
      formData.append("profile.phone_number", userData.profile.phone_number);
      
      if (userData.profile.profile_image instanceof File) {
        formData.append("profile.profile_image", userData.profile.profile_image);
      }

      await axios.put(
        "http://127.0.0.1:8000/auth/profile/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      let errorMessage = "Error updating profile";
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Session expired. Please login again";
          navigate("/login");
        } else if (error.response.data) {
          errorMessage = error.response.data.message || JSON.stringify(error.response.data);
        }
      }
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>
        <div className="text-center py-8">Loading profile data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Non-editable fields (display only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={userData.username}
            readOnly
            className="w-full px-3 py-2 border rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={userData.email}
            readOnly
            className="w-full px-3 py-2 border rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <input
            type="text"
            value={userData.profile.role}
            readOnly
            className="w-full px-3 py-2 border rounded-md bg-gray-100 capitalize"
          />
        </div>

        {/* Editable fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={userData.profile.bio}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows="4"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phone_number"
            value={userData.profile.phone_number}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Image</label>
          <div className="mt-2 flex items-center">
            {userData.profile.profile_image && (
              <div className="mr-4">
                <img
                  src={
                    typeof userData.profile.profile_image === "string"
                      ? `http://127.0.0.1:8000${userData.profile.profile_image}`
                      : URL.createObjectURL(userData.profile.profile_image)
                  }
                  alt="Current profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className={`flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;