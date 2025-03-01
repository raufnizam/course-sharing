import { Link } from "react-router-dom";

const Navbar = () => {
  const isAuthenticated = !!localStorage.getItem("access_token");

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-gray-300">
          MyApp
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-gray-300 transition-colors duration-200">
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="hover:text-gray-300 transition-colors duration-200"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("access_token");
                  localStorage.removeItem("refresh_token");
                  window.location.href = "/login";
                }}
                className="hover:text-gray-300 transition-colors duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-gray-300 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-gray-300 transition-colors duration-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
