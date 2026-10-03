/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4d89ff", // Xanh dương giống mẫu
        secondary: "#f3f6ff", // Màu nền nhạt
        background: "#ffffff",
        textMain: "#1f2937",
        textMuted: "#9ca3af"
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
