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
          "primary-content": "#ffffff",
          secondary: "#f47b5e",
          "secondary-content": "#ffffff",
          accent: "#bdbbd7",
          "accent-content": "#ffffff",
          neutral: "#00062f",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          info: "#00062f",
          "info-content": "#ffffff",
          success: "#84cc16",
          "success-content": "#ffffff",
          warning: "#c66046",
          "warning-content": "#ffffff",
          error: "#823720",
          "warning-content": "#ffffff",
        },
      },
    ],
  },
};
