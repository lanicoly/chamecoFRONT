
  //essa interface props serve para eu herdar variáveis e funções do componante pai (que nesse caso é o arquivo app.tsx)

  //estou usando essa interface para que eu consiga usar a função criada no "App" em todos os arquivos que eu chamar ela e importar do componente pai, realizando uma breve navegação entre as telas
interface MenuProps {
    mudarTela: (index:number) => void
}

export function Menu({ mudarTela}:MenuProps) {
    return (
      <div className="bg-cover flex flex-col items-center justify-center font-montserrat bg-tijolos">
        <div className="w-full h-[140px] flex-shrink-0 p-5 bg-white flex justify-between items-center relative shadow-md">
          {/*header*/}
          <div className="flex w-[90px] h-[90px] ml-[15px] flex-col justify-center items-center gap-[1px] flex-shrink-0">
            {/*Início*/}
            <div className="flex w-[40px] h-[45px] flex-col justify-center items-center flex-shrink-0">
              {/*Img + span*/}
              <div className="flex flex-col items-center justify-center">
                <img src="\return.svg" alt="Início" className="w-10 h-11" />
                <span className="text-[20px] font-bold text-[#646999]">SAIR</span>
              </div>
            </div>
          </div>
          {/*logo-spacer*/}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
            <img src="\logo_lateral.png" alt="Logo CHAMECO" className="w-16 h-auto tablet:w-24 laptop:w-32 desktop:w-40" />
          </div>
        </div>
  
        {/*main-container */}
        <div className="flex flex-1 items-center justify-center w-full max-w-[1200px] box-border">
          {/*menu*/}
          <div className="bg-white rounded-[15px] p-[40px] grid grid-cols-1 md:grid-cols-2 gap-[30px] my-[36px] shadow-[rgba(0,0,0,0.3)_-6px_6px_15px]">
            {/*Menu-item*/}
            <div className="menu-item bg-white border-2 border-[#646999] rounded-[10px] flex justify-center items-center w-full md:w-[270px] h-[150px] cursor-pointer transition-all duration-200 hover:bg-[#e0e0e0] hover:transform hover:-translate-y-1">
              {/*Content*/}
              <div className="content flex flex-col items-center">
                <img src="\fi-rs-key.svg" alt="Chaves" className="w-[50px] h-[50px] mb-[15px] icon" />
                <span className="text-[#646999] text-center font-montserrat text-[20px] font-bold leading-normal">CHAVES</span>
              </div>
            </div>
            <div className="menu-item bg-white border-2 border-[#646999] rounded-[10px] flex justify-center items-center w-full md:w-[270px] h-[150px] cursor-pointer transition-all duration-200 hover:bg-[#e0e0e0] hover:transform hover:-translate-y-1">
              <div className="content flex flex-col items-center">
                <img src="\01 align center.svg" alt="Usuários" className="w-[50px] h-[50px] mb-[15px] icon" />
                <span className="text-[#646999] text-center font-montserrat text-[20px] font-bold leading-normal">USUÁRIOS</span>
              </div>
            </div>
            <div onClick={() => mudarTela(2)} className="menu-item bg-white border-2 border-[#646999] rounded-[10px] flex justify-center items-center w-full md:w-[270px] h-[150px] cursor-pointer transition-all duration-200 hover:bg-[#e0e0e0] hover:transform hover:-translate-y-1">
              <div className="content flex flex-col items-center">
                <img src="\fi-rs-bank.svg" alt="Blocos" className="w-[50px] h-[50px] mb-[15px] icon" />
                <span className="text-[#646999] text-center font-montserrat text-[20px] font-bold leading-normal">BLOCOS</span>
              </div>
            </div>
            <div className="menu-item bg-white border-2 border-[#646999] rounded-[10px] flex justify-center items-center w-full md:w-[270px] h-[150px] cursor-pointer transition-all duration-200 hover:bg-[#e0e0e0] hover:transform hover:-translate-y-1">
              <div className="content flex flex-col items-center">
                <img src="\emprestimo.svg" alt="Empréstimos" className="w-[50px] h-[50px] mb-[15px] icon" />
                <span className="text-[#646999] text-center font-montserrat text-[20px] font-bold leading-normal">EMPRÉSTIMOS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }