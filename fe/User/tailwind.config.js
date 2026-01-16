/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        dmserif: ['"DM Serif Display"', "serif"],
        montserrat: ["Montserrat", "sans-serif"],
        display: ['"Playfair Display"', "serif"],
      },
      colors: {
        peach: {
          200: "#FFE0C7",
          300: "#FFD1B3",
        },
        primary:{
          DEFAULT: 'rgb(180 140 91)',
        }
      },
    },
  },
  plugins: [],
};
