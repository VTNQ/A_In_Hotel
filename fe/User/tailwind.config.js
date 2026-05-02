/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        dmserif: ['"DM Serif Display"', "serif"],
        montserrat: ["Montserrat", "sans-serif"],
        display: ['"Playfair Display"', "serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        "outline-variant": "rgb(193 198 215)",
        "on-surface": "rgb(24 28 32)",
        peach: {
          200: "#FFE0C7",
          300: "#FFD1B3",
        },
        primary: {
          DEFAULT: "rgb(180 140 91)",
        },
      },
    },
  },
  plugins: [],
};
