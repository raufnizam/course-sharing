import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const isAuthenticated = !!localStorage.getItem("access_token");

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
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        toast.success("You have been logged out successfully.");
        window.location.href = "/login";
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
      <Link to="/" className="text-2xl font-bold hover:text-gray-300">
        MyApp
      </Link>
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
    </nav>
  );
};

export default Navbar;