import { useState, useEffect } from "react";
import axios from "axios";

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
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch the user's profile data when the component mounts
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/auth/profile/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setUserData({
          username: response.data.username,
          email: response.data.email,
          profile: {
            role: response.data.profile.role || "",
            bio: response.data.profile.bio || "",
            phone_number: response.data.profile.phone_number || "",
            profile_image: response.data.profile.profile_image || null,
          },
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in userData.profile) {
      // Update nested profile fields
      setUserData({
        ...userData,
        profile: {
          ...userData.profile,
          [name]: value,
        },
      });
    } else {
      // Update top-level fields (username, email, etc.)
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
    try {
      const formData = new FormData();
      formData.append("username", userData.username);
      formData.append("email", userData.email);
      formData.append("profile.role", userData.profile.role);
      formData.append("profile.bio", userData.profile.bio);
      formData.append("profile.phone_number", userData.profile.phone_number);

      if (userData.profile.profile_image) {
        formData.append("profile.profile_image", userData.profile.profile_image);
      }

      const response = await axios.put(
        "http://127.0.0.1:8000/auth/profile/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Error updating profile: " + (error.response?.data || error.message));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>
      <form onSubmit={handleSubmit}>
        {/* Non-editable fields */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={userData.username}
            readOnly
            className="w-full px-3 py-2 border rounded-lg bg-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            readOnly
            className="w-full px-3 py-2 border rounded-lg bg-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Role</label>
          <input
            type="text"
            name="role"
            value={userData.profile.role}
            readOnly
            className="w-full px-3 py-2 border rounded-lg bg-gray-100"
          />
        </div>

        {/* Editable fields */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            value={userData.profile.bio}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
          <input
            type="text"
            name="phone_number"
            value={userData.profile.phone_number}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Profile Image</label>
          {userData.profile.profile_image ? (
            <div className="mb-3">
              <img
                src={
                  typeof userData.profile.profile_image === "string"
                    ? `http://127.0.0.1:8000${userData.profile.profile_image}` // Assuming the backend returns a relative URL
                    : URL.createObjectURL(userData.profile.profile_image) // For newly uploaded files
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mb-2"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-3">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          <input
            type="file"
            name="profile_image"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Update Profile
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 text-center ${
            message.includes("Error") ? "text-red-500" : "text-green-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Profile;