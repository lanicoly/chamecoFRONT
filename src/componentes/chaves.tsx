import {
    ChevronLeft
}from "lucide-react";

  //essa interface props serve para eu herdar variáveis e funções do componante pai (que nesse caso é o arquivo app.tsx)

  //estou usando essa interface para que eu consiga usar a função criada no "App" em todos os arquivos que eu chamar ela e importar do componente pai, realizando uma breve navegação entre as telas

  interface ChavesProps {
    mudarTela: (index:number) => void
  }
  
  export function Chaves({ mudarTela}:ChavesProps) {
    return(
        <div className="bg-cover flex flex-col items-center justify-center font-montserrat bg-chaves">
            <div className="w-full h-[140px] flex-shrink-0 p-5 bg-white flex justify-between items-center relative shadow-md">
                {/*header*/}
                <div className="w-full h-[140px] flex-shrink-0 p-5 flex justify-between items-center relative ">
                    <div className="flex items-center gap-2 mb-[15px] text-[#02006C] font-medium tablet:mb-0">
                    {/* Adicionando botão de Menu */}
                    <button onClick={() => mudarTela(1)}>
                        <ChevronLeft className="w-[25px] h-[25px] tablet:w-[35px] tablet:h-[35px]" />
                    </button>
                    <span>MENU</span>
                    </div>
                    {/* logo-spacer */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
                    <img className="w-16 h-auto tablet:w-24 laptop:w-32 desktop:w-40" src="src/assets/logo_lateral.png" alt="logo chameco" />
                    </div>
                    {/* User/Exit */}
                    <div className="flex ml-auto">
                    <button className="flex justify-center items-center gap-1 text-[#565D8F] font-semibold text-base bg-[#B8C1FF] rounded-l-md p-2 h-max w-max">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi    bi-person-circle" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                        </svg>
                        Usuário
                    </button>
                    <button className="text-white flex justify-center items-center gap-1.5 w-max font-medium text-base bg-[#565D8F] rounded-r-md p-2 h-max">
                        Sair
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                        <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                        </svg>
                    </button>
                    </div>
                </div>
            </div>
        </div>
        
    );

  }