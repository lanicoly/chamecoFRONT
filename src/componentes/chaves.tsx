import {ChevronLeft,ChevronRight}from "lucide-react";

  //essa interface props serve para eu herdar variáveis e funções do componante pai (que nesse caso é o arquivo app.tsx)

  //estou usando essa interface para que eu consiga usar a função criada no "App" em todos os arquivos que eu chamar ela e importar do componente pai, realizando uma breve navegação entre as telas

  interface ChavesProps {
    mudarTela: (index:number) => void
  }
  
  export function Chaves({ mudarTela}:ChavesProps) {
    return(
        <div className="items-center justify-center  h-screen flex-shrink-0 bg-chaves">
            <div className="w-full h-[140px] flex-shrink-0 p-5 bg-white flex justify-between items-center relative shadow-md">
                {/*header*/}
                <div className="w-full h-[140px] flex-shrink-0 p-5 flex justify-between items-center relative ">
                    <div className="flex items-center gap-2 mb-[15px] text-[#02006C] font-medium tablet:mb-0">
                    {/* Adicionando botão de Menu */}
                        <div onClick={() => mudarTela(1)} className="justify-center flex items-center cursor-pointer">
                            <button>
                                <ChevronLeft className="w-[25px] h-[25px] tablet:w-[35px] tablet:h-[35px]" />
                            </button>
                            <span className="font-semibold text-[20px]">MENU</span>
                        </div>
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
            <main className="flex justify-center items-center pt-8 px-12 ">
                <div className="bg-white p-6 rounded-2xl shadow-lg inline-flex  flex-col  gap-8">
                    <div className=" mb-6 flex justify-end items-center content-center self-stretch flex-wrap">
                        <div className=" flex-col flex w-[534px] h-[59px] px-[173px] pb-[5px] justify-center items-center">
                            <h2 className="text-3xl font-bold text-blue-800">CHAVES</h2>
                        </div>    
                        {/*Adicionando botao de status */}
                        <div className="flex items-center gap-2 mb-[15px] text-[#02006C] font-medium tablet:mb-0">
                            <span className="font-semibold text-[20px]">STATUS DE CHAVE</span>
                            <button>
                                <ChevronRight className="w-[25px] h-[25px] tablet:w-[35px] tablet:h-[35px]" />
                            </button>
                        </div>
                    </div>

                    {/* Filtros de busca */}
                    <div className="flex space-x-4 mb-6">
                        <input
                        type="text"
                        placeholder="Pesquisar..."
                        className="w-1/3 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600"
                        />
                        <input
                        type="text"
                        placeholder="Filtrar..."
                        className="w-1/3 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600"
                        />
                        <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                        + ADICIONAR CHAVE
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                    <div className="min-w-full shadow-md">
                        <div className="flex justify-between text-left text-sm leading-normal text-gray-800 uppercase py-3 px-4">
                        <div className="w-1/4 border-t border-custom-gray">Sala</div>
                        <div className="w-1/4 border-t border-custom-gray">Bloco</div>
                        <div className="w-1/4 border-t border-custom-gray">Quantidade de Chaves</div>
                        <div className="w-1/4 border-t border-custom-gray">Lista de Pessoas Autorizadas</div>
                        <div className="w-[10%] "></div>
                        </div>
                        
                        {/* Exemplo de linha */}
                        <div className="border-t py-4 px-4t ransition duration-300 ease-in-out flex justify-between items-center text-sm text-gray-700">
                        <div className="w-1/4 border-t border-custom-gray">Sala A01</div>
                        <div className="w-1/4 border-t border-custom-gray">Bloco A</div>
                        <div className="w-1/4 border-t border-custom-gray">01 Chaves</div>
                        <div className="w-1/4 border-t border-custom-gray">
                            <button className="bg-blue-500 text-white py-1 px-4 rounded">
                            Pessoas autorizadas
                            </button>
                        </div>
                        <div className="w-[10%]">
                            <button className="text-blue-600 hover:underline">Ver mais</button>
                        </div>
                        </div>

                        {/* Adicione mais linhas conforme necessário */}
                    </div>
                    </div>


                    {/* Paginação */}
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-sm text-gray-600">Mostrando 1-5 de 25</p>
                        <div className="flex space-x-2">
                            <button className="bg-gray-300 text-gray-800 py-1 px-3 rounded hover:bg-gray-400">1</button>
                            <button className="bg-gray-300 text-gray-800 py-1 px-3 rounded hover:bg-gray-400">2</button>
                            
                        </div>
                    </div>
                </div>
            </main>
            
        </div>
        
    );

  }