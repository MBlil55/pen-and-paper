/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "health-stripe": {
          "0%": { backgroundPosition: "1rem 0" },
          "100%": { backgroundPosition: "0 0" }
        }
      },
      animation: {
        "health-stripe": "health-stripe 1s linear infinite"
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}