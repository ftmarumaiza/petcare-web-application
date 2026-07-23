import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiSun, FiMoon, FiLogOut, FiActivity } from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  // just toggling a class on <html>, nothing fancy
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between bg-white/80 px-6 py-4 backdrop-blur-md dark:bg-gray-900/80 border-b border-gray-100 dark:border-gray-800">
      <Link to="/" className="text-lg font-semibold text-primary-600 dark:text-primary-400">
        🐾 Pet Care Assistant
      </Link>

      <div className="flex items-center gap-4">
        {user && <span className="hidden text-sm text-gray-500 sm:inline">Hi, {user.name}</span>}

        <Link
          to="/chat"
          className="flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-100 dark:bg-gray-800 dark:text-primary-400"
        >
          <FiActivity /> PawDoc AI
        </Link>

        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          title="Toggle dark mode"
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-gray-800"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
