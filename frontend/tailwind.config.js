/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: "#faf6f1",
          100: "#f2e9dd",
          500: "#8b5e3c",
          700: "#4b2e1c",
          900: "#2b1810",
        },
      },
    },
  },
  plugins: [],
};