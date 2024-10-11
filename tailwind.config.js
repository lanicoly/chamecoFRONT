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
        'tijolos': "url('/fundo_tijolos.svg')",
        'chaves': "url('/fundo_chaves.svg')",
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