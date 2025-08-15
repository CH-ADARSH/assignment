import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav
      className="bg-white dark:bg-gray-900 shadow-md p-4 flex justify-between items-center
                 transition-colors duration-500"
    >
      {/* Brand / Home Link */}
      <Link to="/" className="text-xl font-bold text-primaryLight dark:text-secondaryDark">
        My Persona App
      </Link>

      {/* Navigation Items & Theme Toggle */}
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="text-gray-600 dark:text-gray-300 hover:text-primaryLight dark:hover:text-secondaryLight transition"
        >
          Home
        </Link>

        <ThemeToggle />
      </div>
    </nav>
  );
}
