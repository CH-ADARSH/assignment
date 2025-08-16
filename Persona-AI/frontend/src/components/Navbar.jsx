import { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md p-4 transition-colors duration-500">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primaryLight dark:text-secondaryDark">
          PersonaHub
        </Link>

        <button
          className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>

        {/* Navigation links (hidden on small screens, shown on md+) */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-600 dark:text-gray-300 hover:text-primaryLight dark:hover:text-secondaryLight transition"
          >
            Home
          </Link>
          {/* Social Links */}
          <div className="flex flex-col md:flex-row gap-4 mt-2 md:mt-0">
            <a
              href="https://github.com/CH-ADARSH"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-primaryLight dark:hover:text-secondaryLight transition"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/adarsh-chaturvedi-/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-primaryLight dark:hover:text-secondaryLight transition"
            >
              LinkedIn
            </a>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4">
          <Link
            to="/"
            className="text-gray-600 dark:text-gray-300 hover:text-primaryLight dark:hover:text-secondaryLight transition"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <a
            href="https://github.com/CH-ADARSH"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-300 hover:text-primaryLight dark:hover:text-secondaryLight transition"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/adarsh-chaturvedi-/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-300 hover:text-primaryLight dark:hover:text-secondaryLight transition"
          >
            LinkedIn
          </a>
          <ThemeToggle />
        </div>
      )}
    </nav>
  );
}
