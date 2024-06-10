/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        swoodroom: {
          primary: "#00062f",
          secondary: "#f47b5e",
          accent: "#bdbbd7",
          neutral: "#00062f",
          "base-100": "#ffffff",
          info: "#00062f",
          success: "#00ff00",
          warning: "#f47b5e",
          error: "#ff0000",
        },
      },
    ],
  },
};
