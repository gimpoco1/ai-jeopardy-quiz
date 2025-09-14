/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        boardBlue: "#0a2338",
        boardSlate: "#364657",
        boardGold: "#f3ad1b"
      }
    },
  },
  plugins: [],
}
