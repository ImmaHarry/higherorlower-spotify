/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./site/**/*.{html,js}"],
  theme: {
    fontFamily: {
      'montserrat': ['Montserrat', 'sans-serif'],
    },
    extend: {
      colors: {
        'spotify-green': '#1ED760',
        'spotify-black': '#121212',
        'spotify-purple-one': '#6D51D0',
        'spotify-purple-two': '#A74EBD',
        'spotify-purple-three': '#D54AB6',
        'modal-background': '#1C1C1C',
      }
  },
  plugins: [],
}
}
