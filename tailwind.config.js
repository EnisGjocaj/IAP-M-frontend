/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FFD700",
        secondary: "#00308F",
        backbg: "rgba(43, 78, 255, 0.7);",
      },
      // screens: {
      //   md: { max: "800px" },
      //   sm: { max: "639px" },
      // },
      boxShadow: {
        shadow1: "0px 30px 40px 0px rgba(1, 11, 60, 0.1)",
        shadow2: "0px 30px 60px 0px rgba(0, 4, 48, 0.3)",
      },
    },
  },
  plugins: [],
}
