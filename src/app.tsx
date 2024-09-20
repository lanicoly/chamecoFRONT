import {
  ChevronLeft,
  CirclePlus,
  LayoutDashboard,
  X,
  Plus,
} from "lucide-react";
import { useState } from "react";

export function App() {
  // Adicionando função de abrir e fechar pop up
  const [isBlocoModalOpen, setIsBlocoModalOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  function openBlocoModal() {
    setIsBlocoModalOpen(true);
  }

  function closeBlocoModal() {
    setNome("");
    setDescricao("");
    setIsBlocoModalOpen(false);
  }

  return (
    <div className="items-center justify-center flex h-screen flex-shrink-0">
      {/* Adicionando container */}
      <div className="container w-3/5 p-4 h-5/6 rounded-[25px] bg-white min-w-[600px]">
        {/* Adicionando div com botão de voltar ao menu e h1 blocos */}
        <div className="flex justify-between">
          <div className="flex items-center gap-2 mb-[15px] text-custom-blue font-medium">
            <button>
              <ChevronLeft className="w-[35px] h-[35px]" />
            </button>
            <span>MENU</span>
          </div>
          <h1 className="text-2xl font-semibold mx-auto p-3 w-48 text-custom-blue shadow-gray-800 ml-56">
            BLOCOS
          </h1>
        </div>

        {/* Adicionando botão "adicionar bloco" */}
        <div>
          <div className="justify-end w-full h-[60px] flex p-5">
            <button
              onClick={openBlocoModal}
              className="flex w-[190px] h-[33px] text-[12px] justify-center items-center gap-[5px] mt-[-20px] font-medium border-2 border-custom-plus bg-custom-green text-custom-white hover:bg-[#56ab71]"
            >
              <CirclePlus className="w-4" /> ADICIONAR BLOCO
            </button>
            {/* Adicionando pop up de adicionar blocos */}
            {isBlocoModalOpen && (
              <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50">
                <form className="container flex flex-col gap-2 w-[400px] p-[10px] h-[300px] rounded-[15px] bg-white ">
                  <div className="flex justify-between mx-auto">
                    <p className="text-[#192160] text-center text-[20px] font-semibold p-[10px] ml-[10px] ">
                      ADICIONAR BLOCO
                    </p>
                    <button
                      onClick={closeBlocoModal}
                      type="button"
                      className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                    >
                      <X className="ml-[40px] mb-[5px] text-[#192160]" />
                    </button>
                  </div>

                  <div className="justify-center items-center ml-[40px]">
                    <p className="text-[#192160] text-base font-medium mb-1">
                      Digite o nome do bloco
                    </p>
                    <div className="relative w-[300px]">
                      <input
                        className="w-full p-[4px] pl-[30px] rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-sm font-medium"
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        placeholder="Bloco"
                      />
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute left-[8px] top-1/2 transform -translate-y-1/2 text-[#777DAA] pointer-events-none"
                      >
                        <g id="01 align center">
                          <path
                            id="Vector"
                            d="M9.75 1.5V6.75H1.5V2.25C1.5 2.05109 1.57902 1.86032 1.71967 1.71967C1.86032 1.57902 2.05109 1.5 2.25 1.5H9.75ZM11.25 0H2.25C1.65326 0 1.08097 0.237053 0.65901 0.65901C0.237053 1.08097 0 1.65326 0 2.25L0 8.25H11.25V0Z"
                            fill="#777DAA"
                          />
                          <path
                            id="Vector_2"
                            d="M15.7497 1.5C15.9487 1.5 16.1394 1.57902 16.2801 1.71967C16.4207 1.86032 16.4997 2.05109 16.4997 2.25V6.75H14.2497V1.5H15.7497ZM15.7497 0H12.7498V8.25H17.9997V2.25C17.9997 1.65326 17.7627 1.08097 17.3407 0.65901C16.9188 0.237053 16.3465 0 15.7497 0V0Z"
                            fill="#777DAA"
                          />
                          <path
                            id="Vector_3"
                            d="M3.75 11.25V16.5H2.25C2.05109 16.5 1.86032 16.421 1.71967 16.2803C1.57902 16.1397 1.5 15.9489 1.5 15.75V11.25H3.75ZM5.25 9.75H0V15.75C0 16.3467 0.237053 16.919 0.65901 17.341C1.08097 17.7629 1.65326 18 2.25 18H5.25V9.75Z"
                            fill="#777DAA"
                          />
                          <path
                            id="Vector_4"
                            d="M16.5 11.25V15.75C16.5 15.9489 16.421 16.1397 16.2803 16.2803C16.1397 16.421 15.9489 16.5 15.75 16.5H8.25V11.25H16.5ZM18 9.75H6.75V18H15.75C16.3467 18 16.919 17.7629 17.341 17.341C17.7629 16.919 18 16.3467 18 15.75V9.75Z"
                            fill="#777DAA"
                          />
                        </g>
                      </svg>
                    </div>
                  </div>

                  <div className="justify-center items-center ml-[40px]">
                    <p className="text-[#192160] text-base font-medium mb-1">
                      Descreva os detalhes sobre o bloco
                    </p>
                    <textarea
                      className="w-[300px] p-[4px] rounded-[10px] border border-[#646999] text-[#777DAA] focus:outline-none text-sm font-medium resize-none"
                      placeholder="Descrição do detalhamento sobre o bloco"
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      required
                    />

                  </div>

                  <div className="justify-center items-center mt-[10px] ml-[100px]">
                    <button
                      type="submit"
                      className="px-2 py-1 border-[3px] rounded-xl w-[190px] h-[40px] font-semibold  text-[11px] flex gap-[4px] justify-center items-center  bg-[#16C34D] text-[#FFF]"
                    >
                      <Plus className="h-10px" /> CRIAR NOVO BLOCO
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Adicionando blocos de A-E */}
        <div className="flex flex-col items-center min-w-[50px]">
          <div className="flex space-x-2 gap-[66px] h-[140px]">
            <button className="text-custom-bloco text-[12px] font-semibold">
              <LayoutDashboard className="w-[70px] h-[70px] p-[16px]  text-custom-bloco rounded-[15px] bg-custom-gray mb-2 hover:bg-[#d5d8f1]" />
              Bloco A
            </button>
            <button className="text-custom-bloco text-[12px] font-semibold">
              <LayoutDashboard className="w-[70px] h-[70px] p-[16px]  text-custom-bloco rounded-[15px] bg-custom-gray mb-2 hover:bg-[#d5d8f1]" />
              Bloco B
            </button>
            <button className="text-custom-bloco text-[12px] font-semibold">
              <LayoutDashboard className="w-[70px] h-[70px] p-[16px]  text-custom-bloco rounded-[15px] bg-custom-gray mb-2 hover:bg-[#d5d8f1]" />
              Bloco C
            </button>
            <button className="text-custom-bloco text-[12px] font-semibold">
              <LayoutDashboard className="w-[70px] h-[70px] p-[16px]  text-custom-bloco rounded-[15px] bg-custom-gray mb-2 hover:bg-[#d5d8f1]" />
              Bloco D
            </button>
            <button className="text-custom-bloco text-[12px] font-semibold">
              <LayoutDashboard className="w-[70px] h-[70px] p-[16px]  text-custom-bloco rounded-[15px] bg-custom-gray mb-2 hover:bg-[#d5d8f1]" />
              Bloco E
            </button>
          </div>

          {/* Adicionando blocos de F-J*/}
          <div className="flex space-x-2  gap-[66px] h-[190px]">
            <button className="text-custom-bloco text-[12px] font-semibold ">
              <LayoutDashboard className="w-[70px] h-[70px] text-custom-bloco p-[16px] rounded-[15px] bg-custom-gray mb-2 hover:bg-[#d5d8f1]" />
              Bloco F
            </button>
            <button className="text-custom-bloco text-[12px] font-semibold">
              <LayoutDashboard className="w-[70px] h-[70px]  text-custom-bloco p-[16px] rounded-[15px] bg-custom-gray mb-2 hover:bg-[#d5d8f1]" />
              Bloco G
            </button>
            <button className="text-custom-bloco text-[12px] font-semibold">
              <LayoutDashboard className="w-[70px] h-[70px]  text-custom-bloco p-[16px] rounded-[15px] bg-custom-gray mb-2 hover:bg-[#d5d8f1]" />
              Bloco H
            </button>
            <button className="text-custom-bloco text-[12px] font-semibold">
              <LayoutDashboard className="w-[70px] h-[70px]  text-custom-bloco p-[16px] rounded-[15px] bg-custom-gray mb-2 hover:bg-[#d5d8f1]" />
              Bloco I
            </button>
            <button className="text-custom-bloco text-[12px] font-semibold">
              <LayoutDashboard className="w-[70px] h-[70px]  text-custom-bloco p-[16px] rounded-[15px] bg-custom-gray mb-2 hover:bg-[#d5d8f1]" />
              Bloco J
            </button>
          </div>
        </div>

        {/* Adicionando logo CHAMECO */}
        <div className="flex justify-start p-[10px] ">
          <img width={130} src="\public\logo_lateral.png" alt="logo chameco" />
        </div>

        {/* Adicionando passador de página */}
        <div className="mt-[-90px] flex justify-end items-center p-[5px] ">
          <button className="size-[22px] rounded-sm text-white text-sm flex items-center justify-center font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#075985"
              className="bi bi-chevron-left"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
              />
            </svg>
          </button>

          <div className="w-24 gap-1.5 px-2 py-1 flex items-center justify-center">
            <div className="size-[28px] rounded-full bg-[#8d93c9] text-white text-sm flex items-center justify-center font-semibold">
              1
            </div>
            <div className="text-base text-sky-800 font-semibold">
              de <strong className="font-bold">1</strong>
            </div>
          </div>

          <button className="size-[22px] rounded-sm text-white text-sm flex items-center justify-center font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#075985"
              className="bi bi-chevron-right"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
