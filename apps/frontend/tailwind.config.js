/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#222222",
        secondary: "#D8D8D8",
        surface: "#F5F5F5",
      },
      fontFamily: {
        body: ["Poppins", "sans-serif"],
        heading: ["Ahsing", "DG Ghayaty", "serif"],
        arabicHeading: ["DG Ghayaty", "Ahsing", "serif"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(to right, #222222, #3A3A3A)",
      },
    },
  },
  plugins: [],
};
