/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0D9488',      // Teal for health and calm
        secondary: '#EF4444',    // Red for alerts
        background: '#F8FAFC',   // Clean white/grey
        danger: '#DC2626',       // Dark red for critical
        success: '#10B981',      // Green for positive
        warning: '#F59E0B',      // Orange for warnings
      },
    },
  },
  plugins: [],
}
