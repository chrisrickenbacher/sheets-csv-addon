/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./src/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      background: "#f9fbfd",
      surface: "#edf2fa",
      accent: "#c9e6fc",
      gray: "#5f6368",
      red: "#eecdcd"
    },
    fontFamily: {
      'roboto': ['Roboto', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

