import { ChevronLeft, CirclePlus, LayoutDashboard } from "lucide-react";

export function App() {
  return (
    <div className="items-center justify-center flex h-screen flex-shrink-0">
      <div className="container w-3/5 p-4 h-5/6 rounded-[25px] bg-white">
        <div className="flex justify-between">
          <div>
            <button className="flex items-center gap-2 text-custom-blue font-medium">
              <ChevronLeft className="w-[35px] h-[35px]" />
              VOLTAR
            </button>
          </div>
          <h1 className="text-2xl font-semibold mx-auto p-3 w-48 text-custom-blue shadow-gray-800 ml-56">
            BLOCOS
          </h1>
        </div>

        <div>
          <div className="justify-end w-full h-[60px] flex p-5">
            <button className="flex w-[190px] h-[33px] text-[12px] justify-center items-center gap-[5px] mt-[-20px] font-medium border-2 border-custom-plus bg-custom-green text-custom-white">
              <CirclePlus className="w-4" /> ADICIONAR BLOCO
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex space-x-2 gap-[66px] h-[140px]">
            <button className="text-custom-bloco text-[12px] font-semibold">
              <LayoutDashboard className="w-[70px] h-[70px] p-[16px]  text-custom-bloco rounded-[15px] bg-custom-gray mb-2" />
              Bloco A
            </button>
            <button className="text-custom-bloco text-[12px] font-semibold">
              <LayoutDashboard className="w-[70px] h-[70px] p-[16px]  text-custom-bloco rounded-[15px] bg-custom-gray mb-2" />
              Bloco B
            </button>
            <button className="text-custom-bloco text-[12px] font-semibold">
              <LayoutDashboard className="w-[70px] h-[70px] p-[16px]  text-custom-bloco rounded-[15px] bg-custom-gray mb-2" />
              Bloco C
            </button>
            <button className="text-custom-bloco text-[12px] font-semibold">
              <LayoutDashboard className="w-[70px] h-[70px] p-[16px]  text-custom-bloco rounded-[15px] bg-custom-gray mb-2" />
              Bloco D
            </button>
            <button className="text-custom-bloco text-[12px] font-semibold">
              <LayoutDashboard className="w-[70px] h-[70px] p-[16px]  text-custom-bloco rounded-[15px] bg-custom-gray mb-2" />
              Bloco E
            </button>
          </div>

          <div className="flex space-x-2  gap-[66px] h-[190px]">
            <button className="text-custom-bloco text-[12px] font-semibold ">
              <LayoutDashboard className="w-[70px] h-[70px] text-custom-bloco p-[16px] rounded-[15px] bg-custom-gray mb-2" />
              Bloco F
            </button>
            <button className="text-custom-bloco text-[12px] font-semibold">
              <LayoutDashboard className="w-[70px] h-[70px]  text-custom-bloco p-[16px] rounded-[15px] bg-custom-gray mb-2" />
              Bloco G
            </button>
            <button className="text-custom-bloco text-[12px] font-semibold">
              <LayoutDashboard className="w-[70px] h-[70px]  text-custom-bloco p-[16px] rounded-[15px] bg-custom-gray mb-2" />
              Bloco H
            </button>
            <button className="text-custom-bloco text-[12px] font-semibold">
              <LayoutDashboard className="w-[70px] h-[70px]  text-custom-bloco p-[16px] rounded-[15px] bg-custom-gray mb-2" />
              Bloco I
            </button>
            <button className="text-custom-bloco text-[12px] font-semibold">
              <LayoutDashboard className="w-[70px] h-[70px]  text-custom-bloco p-[16px] rounded-[15px] bg-custom-gray mb-2" />
              Bloco J
            </button>
          </div>
        </div>

        <div className="flex justify-start p-[10px] ">
            <img width={130} src="\public\logo_lateral.png" alt="logo chameco"  />
        </div>
      </div>
    </div>
  );
}


