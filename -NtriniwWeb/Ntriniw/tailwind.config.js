/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        primary: "#00f2ea", // Neon Cyan/Blue
        secondary: "#ff0050", // Energetic Red/Pink
        dark: "#0f172a", // Dark Slate
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

