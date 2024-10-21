
  //essa interface props serve para eu herdar variáveis e funções do componante pai (que nesse caso é o arquivo app.tsx)

  //estou usando essa interface para que eu consiga usar a função criada no "App" em todos os arquivos que eu chamar ela e importar do componente pai, realizando uma breve navegação entre as telas

  interface MenuProps {
    mudarTela: (index:number) => void
}

export function Menu({ mudarTela}:MenuProps) {
    return (
      
      <div className="bg-cover flex flex-col items-center min-h-screen justify-center font-montserrat bg-tijolos">
      {/*background*/}
        <div className="w-full h-[120px] sm:h-[140px] md:h-[160px] flex-shrink-0 p-1 sm:p-1.5 bg-white flex justify-between items-center relative shadow-md">
       {/*header*/}
          <div className="w-full h-[140px] flex-shrink-0 p-5 flex justify-between items-center relative ">
            {/* logo-spacer */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
              <img className="w-24 h-auto tablet:w-32 laptop:w-56 desktop:w-64" src="src/assets/logo_lateral.png" alt="logo chameco" />
            </div>
            {/* User/Exit */}
            <div className="flex ml-auto">
              <button className="flex justify-center items-center gap-0.5 mobile:gap-1.5 tablet:gap-2 text-[#565D8F] font-semibold text-xs mobile:text-sm tablet:text-base bg-[#B8C1FF] rounded-l-md p-1 mobile:p-1.5 tablet:p-2 h-max w-max">
                <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" className="bi    bi-person-circle w-3 h-3 mobile:w-4 mobile:h-4 tablet:w-6 tablet:h-6" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                </svg>
                  Usuário
              </button>
              <button onClick={() => mudarTela(0)} className="text-white flex justify-center items-center gap-0.5 mobile:gap-1.5 tablet:gap-2 w-max font-medium text-xs mobile:text-sm tablet:text-base bg-[#565D8F] rounded-r-md p-1 mobile:p-1.5 tablet:p-2 h-max">
                Sair
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-box-arrow-right w-3 h-3 mobile:w-4 mobile:h-4 tablet:w-6 tablet:h-6" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                  <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
          
        {/*main-container */}
        <div className="flex flex-1 items-center justify-center  box-border">
          {/*menu*/}
          <div className="bg-white rounded-[15px] p-6 sm:p-6 md:p-[40px] grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-6 md:gap-[30px] my-4 sm:my-6 md:my-[36px] shadow-[rgba(0,0,0,0.3)_-6px_6px_15px]">
            {/*Menu-item*/}
            <div onClick={() => mudarTela(4)} className="menu-item bg-white border-4 border-[#646999] rounded-[10px] flex justify-center items-center w-full h-[100px] sm:h-[120px] md:h-[150px] cursor-pointer transition-all duration-200 hover:bg-[#e0e0e0] hover:transform hover:-translate-y-1">

              {/*Content*/}
              <div  className="content flex flex-col items-center">
              <img src="/fi-rs-key.svg"alt="Chaves"className="w-[40px] sm:w-[50px] md:w-[60px] h-[40px] sm:h-[50px] md:h-[60px] icon"/>
                <span className="text-[#646999] text-center font-montserrat text-[16px] sm:text-[18px] md:text-[20px] font-bold leading-normal">CHAVES</span>
              </div>
            </div>
            <div onClick={() => mudarTela(5)} className="menu-item bg-white border-4 border-[#646999] rounded-[10px] flex justify-center items-center w-full h-[100px] sm:h-[120px] md:h-[150px] cursor-pointer transition-all duration-200 hover:bg-[#e0e0e0] hover:transform hover:-translate-y-1">
              <div className="content flex flex-col items-center">
                <img src="/01 align center.svg" alt="Usuários" className="w-[40px] sm:w-[50px] md:w-[60px] h-[40px] sm:h-[50px] md:h-[60px] icon" />
                <span className="text-[#646999] text-center font-montserrat text-[16px] sm:text-[18px] md:text-[20px] font-bold leading-normal">USUÁRIOS</span>
              </div>
            </div>
            <div onClick={() => mudarTela(2)} className="menu-item bg-white border-4 border-[#646999] rounded-[10px] flex justify-center items-center  w-full h-[100px] sm:h-[120px] md:h-[150px] cursor-pointer transition-all duration-200 hover:bg-[#e0e0e0] hover:transform hover:-translate-y-1">
              <div className="content flex flex-col items-center">
                <img src="/fi-rs-bank.svg" alt="Blocos" className="w-[40px] sm:w-[50px] md:w-[60px] h-[40px] sm:h-[50px] md:h-[60px] icon" />
                <span className="text-[#646999] text-center font-montserrat text-[16px] sm:text-[18px] md:text-[20px] font-bold leading-normal">BLOCOS</span>
              </div>
            </div>
            <div className="menu-item bg-white border-4 border-[#646999] rounded-[10px] flex justify-center items-center w-full md:w-[270px] h-[120px] md:h-[150px] cursor-pointer transition-all duration-200 hover:bg-[#e0e0e0] hover:transform hover:-translate-y-1">
              <div className="content flex flex-col items-center">
                <img src="/emprestimo.svg" alt="Empréstimos" className="w-[40px] sm:w-[50px] md:w-[60px] h-[40px] sm:h-[50px] md:h-[60px] icon" />
                <span className="text-[#646999] text-center font-montserrat text-[16px] sm:text-[18px] md:text-[20px] font-bold leading-normal">EMPRÉSTIMOS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }