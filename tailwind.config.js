/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")], // <-- This is the missing line
  theme: {
    extend: {
      colors: {
        "unsw-yellow": "#ffe600",
        "unsw-gold": "#ffd200",
        "unsw-red": "#e1251b",
        "accent-blue": "#0066cc",
        "accent-pink": "#e91e63",
        "accent-green": "#2ecc71",
        "accent-purple": "#8e44ad",
      },
    },
  },
  plugins: [],
}
