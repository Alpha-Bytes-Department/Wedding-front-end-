/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#d4af37",
          50: "#faf8f0",
          100: "#f5f0d9",
          500: "#d4af37",
          600: "#b8961e",
          700: "#9c7d19",
        },
        "wedding-gray": "#676767",
        "wedding-dark": "#333333",
        "wedding-bg": "#faf7eb",
      },
      fontFamily: {
        primary: ["Playfair Display", "serif"],
        secondary: ["Open Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
