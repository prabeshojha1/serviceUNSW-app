/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/context/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#FFE600",
          pressed: "#E6CF00",
          soft: "#FFF9C7",
        },
        ink: "#171717",
        canvas: "#F5F5F2",
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#ECECE7",
          raised: "#FAFAF8",
        },
        border: {
          DEFAULT: "#D9D9D2",
          strong: "#B8B8B0",
        },
        muted: "#666662",
        link: "#145DA0",
        info: {
          DEFAULT: "#145DA0",
          soft: "#E7F1FA",
        },
        success: {
          DEFAULT: "#1F6B45",
          soft: "#E5F3EB",
        },
        warning: {
          DEFAULT: "#8A4B00",
          soft: "#FFF0DA",
        },
        danger: {
          DEFAULT: "#A12B2B",
          soft: "#FBE9E9",
        },
        ai: {
          DEFAULT: "#6240A0",
          soft: "#F0EAF8",
        },
        event: {
          class: "#145DA0",
          society: "#8A3A70",
          deadline: "#7A3E9D",
          general: "#4F5D63",
        },
      },
      borderRadius: {
        card: "16px",
        panel: "24px",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};
