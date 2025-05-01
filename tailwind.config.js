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

      colors: {
        "primary-green": "#0ebb44", // verde dos botões
        "primary-blue": "#007bff", // azul dos botões
      },

      backgroundImage: {
        'tijolos': "url('/public/fundo_tijolos.svg')",
        'login-fundo': "url('/public/back-login.svg')",
        'chaves': "url('/fundo_chaves.svg')",
      },
      
      
      screens: {
        'mobile': '480px',
        'tablet': '640px',  
        'laptop': '1024px', 
        'desktop': '1280px',
      },
    },
  plugins: [],
}}