/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {

      extend: {
        colors: {
          'custom-blue': '#02006C', // Adicionando cor personalizada
          'custom-green': '#18C64F',
          'custom-white': '#FFF',
          'custom-gray': '#D9D9D9', 
          'custom-bloco': '#646999', //cor da letra dos blocos
          'custom-plus': 'solid #B8BCE0', //cor da borda do adicionar bloco
          'custom-shadow': '50px 50px 20px rgba(0, 0, 0, 0.5)', //cor para o box shadow
       },
        fontFamily: {
        sans: 'Montserrat',
       }
      },
    },
  plugins: [],
}