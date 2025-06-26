export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-8"> 
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-[23px] font-bold mb-2 text-[#081683]"> 
              SIGEC - Sistema de Gerenciamento de Chaves
            </h3>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold mb-4 text-[#16c34d]">
              Desenvolvido por:
            </h4>
            <p className="text-base text-[#081683] text-center md:text-left"> 
              Co.Lab - Laboratório de Cocriação de Software do <strong>IFPI campus Floriano</strong>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100"></div>
        <p className="text-base text-center text-[#081683] mt-auto pt-4">
          &copy; 2025 - Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}