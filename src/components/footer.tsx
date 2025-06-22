export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col items-center md:items-start">
            <img
              className="w-24 h-auto mb-4"
              src="src/assets/SIGEC.png"
              alt=""
            />
            <h3 className="text-xl font-bold mb-2 text-[#16c34d]">
              Co.Lab - Laboratório de Cocriação de Software
              <br /> IFPI - Campus Floriano
            </h3>
          </div>
        

        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-lg font-semibold mb-4 text-[#16c34d]">
            Desenvolvido por:
          </h4>
          <div className="grid grid-cols-2 gap-5 w-full max-w-md">
            <p className="text-sm text-center py-1 px-2  rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-[#192160] cursor-pointer">
              Emilia Nunes Cabral
            </p>
            <p className="text-sm text-center py-1 px-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-[#192160] cursor-pointer">
              Laís Nicoly Moreira
            </p>
            <p className="text-sm text-center py-1 px-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-[#192160] cursor-pointer">
              Lucas Soares de Souza
            </p>
            <p className="text-sm text-center py-1 px-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-[#192160] cursor-pointer">
              Priscila Freitas Martins
            </p>
            <p className="text-sm text-center py-1 px-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-[#192160] cursor-pointer">
              Valdson Macedo
            </p>
            <p className="text-sm text-center py-1 px-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-[#192160] cursor-pointer">
              Vanessa Veloso Aragão
            </p>
            <p className="text-sm text-center py-1 px-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-[#192160] cursor-pointer">
              Yasmim Santana Ribeiro
            </p>
          </div>
        </div>
      </div>
      </div>
       <div className="border-t border-gray-100 pt-6"></div>
      <div className="flex flex-col md:flex-row justify-center items-center py-3">
        <p className="text-base text-center text-[#192160]">
          &copy; 2025 - Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
