export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-2"> 
        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 mb-2"> 
          <div className="flex flex-col justify-center items-center">
            <img className="w-80" src="./logo-lateral-sigec.svg" alt="logo lateral sigec" />
          </div>

          <div className="flex flex-col items-center justify-center">
            <p className="text-base font-semibold text-[#081683] text-center md:text-left"> 
              &copy; 2025 IFPI Campus Floriano. Todos os direitos reservados.
            </p>
            <p className="text-base font-semibold text-[#081683] text-center md:text-left"> 
              Desenvolvido pelo Co.Lab - Laboratório de Cocriação de Software.
            </p>
          </div>

          <div className="flex flex-col tablet:flex-row items-center justify-center gap-4">
            <img width={150} src="./logo-colab-branca.svg" alt="logo do colab" />
            <div className="flex flex-col gap-1 items-center">
              <p className="text-base font-semibold text-[#081683]">Acompanhe o Co.Lab:</p>
              <div className="flex gap-2 items-center">
                <a target="_blank" className="p-2 bg-[#18C64F] rounded-xl" href="https://www.instagram.com/lab.colab/">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-instagram-icon lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a target="_blank" className=" p-2 bg-[#18C64F] rounded-xl" href="https://github.com/colab-ifpicaflo">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-github-icon lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                </a>

              </div>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}