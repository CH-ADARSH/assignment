import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === "light" ? "dark" : "light");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <button
      
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="px-4 py-2 rounded-md bg-primaryLight dark:bg-primaryDark text-white font-semibold transition"
    >
      {theme === "light" ? "Dark Mode" : "Light Mode"}
    </button>
  );
}
