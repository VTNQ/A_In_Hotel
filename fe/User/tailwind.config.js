/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        dmserif: ['"DM Serif Display"', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors:{
        peach:{
          200:'#FFE0C7',
          300:'#FFD1B3'
        }
      }
    },
  },
  plugins: [],
}
