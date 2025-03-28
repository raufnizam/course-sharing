import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileEdit = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    bio: "",
    phone_number: "",
    profile_image: null,
    role: ""
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
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
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setFormData({
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          username: response.data.username,
          email: response.data.email,
          bio: response.data.profile?.bio || "",
          phone_number: response.data.profile?.phone_number || "",
          profile_image: response.data.profile?.profile_image || null,
          role: response.data.profile?.role || ""
        });
      } catch (error) {
        handleFetchError(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.match('image.*')) {
      setErrors({ ...errors, profile_image: "Only image files are allowed" });
      return;
    }
    setFormData({ ...formData, profile_image: file });
    setErrors({ ...errors, profile_image: null });
  };

  const removeProfileImage = () => {
    setFormData({ ...formData, profile_image: null });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }
    
    if (formData.phone_number && !/^[0-9+\-\s]+$/.test(formData.phone_number)) {
      newErrors.phone_number = "Invalid phone number format";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);

    try {
      const token = localStorage.getItem("access_token");
      const formDataToSend = new FormData();
      
      // Append all fields
      formDataToSend.append("first_name", formData.first_name);
      formDataToSend.append("last_name", formData.last_name);
      formDataToSend.append("profile[bio]", formData.bio);
      formDataToSend.append("profile[phone_number]", formData.phone_number);
      
      if (formData.profile_image instanceof File) {
        formDataToSend.append("profile[profile_image]", formData.profile_image);
      } else if (formData.profile_image === null) {
        // Explicitly send null to remove image
        formDataToSend.append("profile[profile_image]", "");
      }

      await axios.put(
        "http://127.0.0.1:8000/auth/profile/",
        formDataToSend,
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
      handleSubmitError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFetchError = (error) => {
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again");
      navigate("/login");
    } else {
      toast.error("Error loading profile data");
      console.error("Error fetching profile:", error);
    }
  };

  const handleSubmitError = (error) => {
    console.error("Update error:", error.response?.data || error.message);
    let errorMessage = "Error updating profile";
    
    if (error.response?.data) {
      // Handle Django validation errors
      const errorData = error.response.data;
      
      if (typeof errorData === 'object') {
        // Convert nested errors to flat object
        const flattenedErrors = {};
        
        for (const [field, messages] of Object.entries(errorData)) {
          if (Array.isArray(messages)) {
            flattenedErrors[field] = messages.join(', ');
          } else if (typeof messages === 'object') {
            // Handle nested profile errors
            for (const [profileField, profileMessages] of Object.entries(messages)) {
              flattenedErrors[profileField] = Array.isArray(profileMessages) 
                ? profileMessages.join(', ')
                : profileMessages;
            }
          }
        }
        
        setErrors(flattenedErrors);
        errorMessage = "Please fix the errors below";
      } else {
        errorMessage = errorData.toString();
      }
    }
    
    toast.error(errorMessage);
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name*</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.first_name ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-500'
              }`}
            />
            {errors.first_name && (
              <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name*</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.last_name ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-500'
              }`}
            />
            {errors.last_name && (
              <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>
            )}
          </div>
        </div>

        {/* Non-editable fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={formData.username}
            readOnly
            className="w-full px-3 py-2 border rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={formData.email}
            readOnly
            className="w-full px-3 py-2 border rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <input
            type="text"
            value={formData.role}
            readOnly
            className="w-full px-3 py-2 border rounded-md bg-gray-100 capitalize"
          />
        </div>

        {/* Editable fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows="4"
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-red-500">{errors.bio}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.phone_number ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-500'
            }`}
          />
          {errors.phone_number && (
            <p className="mt-1 text-sm text-red-500">{errors.phone_number}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Image</label>
          <div className="mt-2 flex items-center">
            {formData.profile_image && (
              <div className="mr-4 relative">
                <img
                  src={
                    typeof formData.profile_image === "string"
                      ? `http://127.0.0.1:8000${formData.profile_image}`
                      : URL.createObjectURL(formData.profile_image)
                  }
                  alt="Current profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeProfileImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  title="Remove image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          {errors.profile_image && (
            <p className="mt-1 text-sm text-red-500">{errors.profile_image}</p>
          )}
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className={`flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : "Save Changes"}
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