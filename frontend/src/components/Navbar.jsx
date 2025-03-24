import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
  const isAuthenticated = !!localStorage.getItem("access_token");
  const navigate = useNavigate();

  const onLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          // Remove tokens and user-related data
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          toast.success("You have been logged out successfully.");
          navigate("/login"); // Use navigate for smoother redirection
          window.location.href = "/login";
        } catch (error) {
          toast.error("An error occurred during logout. Please try again.");
          console.error("Logout error:", error);
        }
      }
    });
  };

  const authenticatedLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Courses", path: "/courses" },
    { name: "Categories", path: "/categories" },
    { name: "Profile", path: "/profile" },
    { name: "Coaches", path: "/coaches" },
  ];

  return (
    <nav className="border-b border-gray-800 text-gray-800 flex p-4 justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold hover:text-gray-300">
        MyApp
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex md:items-center md:justify-center">
        <Link
          to="/"
          className="hover:text-gray-300 transition-colors duration-200 mx-3"
        >
          Home
        </Link>
        {isAuthenticated ? (
          <>
            {authenticatedLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="hover:text-gray-300 transition-colors duration-200 mx-3"
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={onLogout}
              className="bg-purple-700 rounded-md text-white p-3 hover:text-gray-300 transition-colors duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="border border-purple-700 rounded-md px-5 py-3 text-purple-700 font-semibold transition-colors duration-200 mx-3"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-purple-700 rounded-md text-white p-3 transition-colors duration-200 mx-3"
            >
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden text-gray-800 hover:text-gray-300 focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 right-0 bg-white shadow-lg w-full z-50">
          <div className="flex flex-col p-4">
            <Link
              to="/"
              className="hover:text-gray-300 transition-colors duration-200 py-2"
            >
              Home
            </Link>
            {isAuthenticated ? (
              <>
                {authenticatedLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="hover:text-gray-300 transition-colors duration-200 py-2"
                  >
                    {link.name}
                  </Link>
                ))}
                <button
                  onClick={onLogout}
                  className="bg-purple-700 rounded-md text-white p-3 hover:text-gray-300 transition-colors duration-200 mt-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="border border-purple-700 rounded-md px-5 py-3 text-purple-700 font-semibold transition-colors duration-200 my-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-700 rounded-md text-white p-3 transition-colors duration-200 my-2"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;