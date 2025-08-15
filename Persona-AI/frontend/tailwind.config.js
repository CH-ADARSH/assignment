export default {
  darkMode: "class", // enable class-based dark mode
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        raleway: ["Raleway", "ui-sans-serif", "system-ui"],
      },
      colors: {
        primaryLight: "#1E3A8A", // Navy blue
        secondaryLight: "#14B8A6", // Teal
        primaryDark: "#0f172a", // Dark blue-gray
        secondaryDark: "#14B8A6", // Keep teal consistent
      },
      backgroundImage: {
        "gradient-light":
          "linear-gradient(to bottom right, #020024, #090979, #00d4ff)",
        "gradient-dark":
          "linear-gradient(to bottom right, #121C84, #1FC5A8, #0E197D)",
      },
    },
  },
  plugins: [],
};
