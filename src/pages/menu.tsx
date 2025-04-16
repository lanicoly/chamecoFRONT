import { useNavigate } from "react-router-dom";
import { MenuTopo } from "../components/menuTopo";
//essa interface props serve para eu herdar variáveis e funções do componante pai (que nesse caso é o arquivo app.tsx)

//estou usando essa interface para que eu consiga usar a função criada no "App" em todos os arquivos que eu chamar ela e importar do componente pai, realizando uma breve navegação entre as telas

export function Menu() {
  const navigate = useNavigate();

  return (
    <div className="bg-cover flex flex-col items-center min-h-screen justify-center font-montserrat bg-tijolos">
      {/*background*/}
      <MenuTopo/>
      {/*main-container */}
      <div className="flex flex-1 items-center justify-center  box-border">
        {/*menu*/}
        <div className="bg-white rounded-[15px] p-6 sm:p-6 md:p-[40px] grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-6 md:gap-[30px] my-4 sm:my-6 md:my-[36px] shadow-[rgba(0,0,0,0.3)_-6px_6px_15px]">
          {/*Menu-item*/}
          <div
            onClick={() => navigate("/chaves")}
            className="menu-item bg-white border-4 border-[#646999] rounded-[10px] flex justify-center items-center w-full h-[100px] sm:h-[120px] md:h-[150px] cursor-pointer transition-all duration-200 hover:bg-[#e0e0e0] hover:transform hover:-translate-y-1"
          >
            {/*Content*/}
            <div className="content flex flex-col items-center">
              <img
                src="/fi-rs-key.svg"
                alt="Chaves"
                className="w-[40px] sm:w-[50px] md:w-[60px] h-[40px] sm:h-[50px] md:h-[60px] icon"
              />
              <span className="text-[#646999] text-center font-montserrat text-[16px] sm:text-[18px] md:text-[20px] font-bold leading-normal">
                CHAVES
              </span>
            </div>
          </div>
          <div
            onClick={() => navigate("/usuarios")}
            className="menu-item bg-white border-4 border-[#646999] rounded-[10px] flex justify-center items-center w-full h-[100px] sm:h-[120px] md:h-[150px] cursor-pointer transition-all duration-200 hover:bg-[#e0e0e0] hover:transform hover:-translate-y-1"
          >
            <div className="content flex flex-col items-center">
              <img
                src="/01 align center.svg"
                alt="Usuários"
                className="w-[40px] sm:w-[50px] md:w-[60px] h-[40px] sm:h-[50px] md:h-[60px] icon"
              />
              <span className="text-[#646999] text-center font-montserrat text-[16px] sm:text-[18px] md:text-[20px] font-bold leading-normal">
                USUÁRIOS
              </span>
            </div>
          </div>
          <div
            onClick={() => navigate("/blocos")}
            className="menu-item bg-white border-4 border-[#646999] rounded-[10px] flex justify-center items-center  w-full h-[100px] sm:h-[120px] md:h-[150px] cursor-pointer transition-all duration-200 hover:bg-[#e0e0e0] hover:transform hover:-translate-y-1"
          >
            <div className="content flex flex-col items-center">
              <img
                src="/fi-rs-bank.svg"
                alt="Blocos"
                className="w-[40px] sm:w-[50px] md:w-[60px] h-[40px] sm:h-[50px] md:h-[60px] icon"
              />
              <span className="text-[#646999] text-center font-montserrat text-[16px] sm:text-[18px] md:text-[20px] font-bold leading-normal">
                BLOCOS
              </span>
            </div>
          </div>
          <div 
          onClick={() => navigate("/emprestimos")}
          className="menu-item bg-white border-4 border-[#646999] rounded-[10px] flex justify-center items-center w-full md:w-[270px] h-[120px] md:h-[150px] cursor-pointer transition-all duration-200 hover:bg-[#e0e0e0] hover:transform hover:-translate-y-1">
            <div className="content flex flex-col items-center">
              <img
                src="/emprestimo.svg"
                alt="Empréstimos"
                className="w-[40px] sm:w-[50px] md:w-[60px] h-[40px] sm:h-[50px] md:h-[60px] icon"
              />
              <span className="text-[#646999] text-center font-montserrat text-[16px] sm:text-[18px] md:text-[20px] font-bold leading-normal">
                EMPRÉSTIMOS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
