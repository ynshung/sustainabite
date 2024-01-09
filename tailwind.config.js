/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Raleway", "Inter", "Helvetica", "Arial", "sans-serif"],
        title: ["Titan One", "Raleway", "sans-serif"],
      },
      colors: {
        // 200
        bone: {
          50: "#faf6f2",
          100: "#f2ece2",
          200: "#ebe0d1",
          300: "#d4bb9d",
          400: "#c29b75",
          500: "#b5835a",
          600: "#a8714e",
          700: "#8c5b42",
          800: "#714a3b",
          900: "#5c3f32",
          950: "#311f19",
        },
        // 400
        buff: {
          50: "#fbf7f1",
          100: "#f5ecdf",
          200: "#ead7be",
          300: "#dcba95",
          400: "#d1a177",
          500: "#c27f4d",
          600: "#b46b42",
          700: "#965538",
          800: "#794533",
          900: "#623b2c",
          950: "#341c16",
        },
        // 900
        taupe: {
          50: "#f6f5f0",
          100: "#e8e5d9",
          200: "#d2cdb6",
          300: "#b8ae8c",
          400: "#a3946c",
          500: "#94845e",
          600: "#7f6c4f",
          700: "#675541",
          800: "#58483b",
          900: "#4a3d34",
          950: "#2b221d",
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#b5835a",
          secondary: "#4a3d34",
          accent: "#fcd34d",
        },
      },
    ],
  },
};
