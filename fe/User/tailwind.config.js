/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
