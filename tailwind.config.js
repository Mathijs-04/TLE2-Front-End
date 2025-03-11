/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: '#F4F0E6', // Background color
        IceBlue: '#A6BDE7', // Nav and component bg
        Navy: '#001344', // Titles and text
        RoyalBlue: '#0C1C8C', //text
        SlateBlue: '#274277', //components
        Yellow: '#FFB41F', //primary button
        DuskBlue: '#58719F', //tertiare button
        Sage: '#97A78F', //green
        Red: '#D23E4D', //red

      },
      fontFamily: {
        merriweather: ['Merriweather', 'serif'],
        nunito: ['Nunito', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}