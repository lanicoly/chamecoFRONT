/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'Montserrat',
      },

      backgroundImage: {
        'tijolos': "url('/public/fundo_tijolos.svg')",
      },
      screens: {
        'mobile': '480px',
        'tablet': '640px',  
        'laptop': '1024px', 
        'desktop': '1280px',
        
      },
    },
  },
  plugins: [],
}