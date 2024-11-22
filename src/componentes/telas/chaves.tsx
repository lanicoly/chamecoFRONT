import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

//essa interface props serve para eu herdar variáveis e funções do componante pai (que nesse caso é o arquivo app.tsx)

//estou usando essa interface para que eu consiga usar a função criada no "App" em todos os arquivos que eu chamar ela e importar do componente pai, realizando uma breve navegação entre as telas

export function Chaves() {
  const navigate = useNavigate();

  return (
    <div className="bg-cover flex flex-col items-center min-h-screen justify-center font-montserrat bg-chaves">
      {/*background*/}
      <div className="w-full h-[120px] sm:h-[140px] md:h-[160px] flex-shrink-0 p-1 sm:p-1.5 bg-white flex justify-between items-center relative shadow-md">
        {/*header*/}
        <div className="w-full h-[140px] flex-shrink-0 p-5 flex justify-between items-center relative">
          <div className="flex items-center gap-2 mb-[15px] text-[#02006C] font-medium tablet:mb-0">
            {/* Adicionando botão de Menu */}
            <div
              onClick={() => navigate("/menu")}
              className="justify-center flex items-center cursor-pointer"
            >
              <button>
                <ChevronLeft className="w-[25px] h-[25px] tablet:w-[35px] tablet:h-[35px]" />
              </button>
              <span className="font-semibold text-[20px]">MENU</span>
            </div>
          </div>
          {/* logo-spacer */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
            <img
              className="w-24 h-auto tablet:w-32 laptop:w-56 desktop:w-64"
              src="src/assets/logo_lateral.png"
              alt="logo chameco"
            />
          </div>
          {/* User/Exit */}
          <div className="flex ml-auto">
            <button className="flex justify-center items-center gap-0.5 mobile:gap-1.5 tablet:gap-2 text-[#565D8F] font-semibold text-xs mobile:text-sm tablet:text-base bg-[#B8C1FF] rounded-l-md p-1 mobile:p-1.5 tablet:p-2 h-max w-max">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="bi bi-person-circle w-3 h-3 mobile:w-4 mobile:h-4 tablet:w-6 tablet:h-6"
                viewBox="0 0 16 16"
              >
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                <path
                  fillRule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                />
              </svg>
              Usuário
            </button>
            <button
              onClick={() => navigate("/login")}
              className="text-white flex justify-center items-center gap-0.5 mobile:gap-1.5 tablet:gap-2 w-max font-medium text-xs mobile:text-sm tablet:text-base bg-[#565D8F] rounded-r-md p-1 mobile:p-1.5 tablet:p-2 h-max"
            >
              Sair
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="bi bi-box-arrow-right w-3 h-3 mobile:w-4 mobile:h-4 tablet:w-6 tablet:h-6"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
                />
                <path
                  fillRule="evenodd"
                  d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/*fim header */}
      {/*container */}
      <div className="relative bg-white w-full max-w-[960px] rounded-3xl px-6 py-2 tablet:py-3 desktop:py-6 m-12 top-8 tablet:top-6 tablet:h-[480px] h-[90%]">
        {/* titulo chaves*/}
        <div className="relative flex w-full gap-2 mt-5 mb-6 justify-center items-center content-center self-stretch flex-wrap">
          <h1 className="flex justify-center text-3xl text-[#081683] font-semibold">
            CHAVES
          </h1>
          {/*Adicionando botao de status */}
          <div className="absolute right-0 top-0 flex items-center gap-2 mb-[15px] text-[#02006C] font-medium tablet:mb-0">
            <span className="font-semibold text-[20px]">STATUS DE CHAVE</span>
            <button>
              <ChevronRight className="w-[25px] h-[25px] tablet:w-[35px] tablet:h-[35px]" />
            </button>
          </div>
        </div>

        <main className="flex flex-col mobile:px-8 px-4 py-3 w-auto justify-center gap-3">
          {/*inputs+botão */}
          <div className="relative flex justify-center items-center min-w-[220px] flex-wrap gap-2 flex-1 mobile:justify-between">
            <div className="flex gap-2 flex-wrap">
              {/* Filtros de busca */}
              <div className="h-fit items-center w-full tablet:w-auto">
                <div className="flex justify-between items-center px-2 py-1 border-solid border-[1px] border-slate-500 rounded-md ">
                  <input
                    type="text"
                    placeholder="Pesquisar..."
                    className="placeholder-sky-900 text-sm font-medium outline-none "
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    fill="#64748b"
                    className="bi bi-search"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                  </svg>
                </div>
              </div>
              {/* fim input de busca */}
              {/* input de filtro */}
              <div className="flex justify-between items-center px-2 py-1 border-solid border-[1px] border-slate-500 rounded-md ">
                <input
                  type="text"
                  placeholder="Filtrar..."
                  className="placeholder-sky-900 text-sm font-medium outline-none "
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <g opacity="0.4" clip-path="url(#clip0_1696_2859)">
                    <path
                      d="M1.36424 3.46891H3.06818C3.20185 3.96249 3.49365 4.39822 3.89856 4.70887C4.30346 5.01952 4.79898 5.18782 5.30865 5.18782C5.81833 5.18782 6.31384 5.01952 6.71875 4.70887C7.12365 4.39822 7.41545 3.96249 7.54912 3.46891H15.0655C15.2307 3.46891 15.3891 3.40306 15.5059 3.28585C15.6227 3.16864 15.6883 3.00967 15.6883 2.84391C15.6883 2.67815 15.6227 2.51918 15.5059 2.40197C15.3891 2.28476 15.2307 2.21891 15.0655 2.21891H7.54912C7.41545 1.72533 7.12365 1.2896 6.71875 0.978955C6.31384 0.668307 5.81833 0.5 5.30865 0.5C4.79898 0.5 4.30346 0.668307 3.89856 0.978955C3.49365 1.2896 3.20185 1.72533 3.06818 2.21891H1.36424C1.19907 2.21891 1.04066 2.28476 0.923865 2.40197C0.80707 2.51918 0.741455 2.67815 0.741455 2.84391C0.741455 3.00967 0.80707 3.16864 0.923865 3.28585C1.04066 3.40306 1.19907 3.46891 1.36424 3.46891ZM5.30834 1.75016C5.5239 1.75016 5.73461 1.81431 5.91384 1.93449C6.09307 2.05467 6.23276 2.2255 6.31525 2.42535C6.39774 2.62521 6.41933 2.84513 6.37727 3.05729C6.33522 3.26946 6.23142 3.46435 6.079 3.61731C5.92658 3.77027 5.73238 3.87444 5.52097 3.91665C5.30955 3.95885 5.09041 3.93719 4.89126 3.85441C4.69212 3.77162 4.5219 3.63143 4.40214 3.45157C4.28239 3.2717 4.21847 3.06024 4.21847 2.84391C4.2188 2.55393 4.33373 2.27593 4.53805 2.07088C4.74237 1.86583 5.01939 1.75049 5.30834 1.75016Z"
                      fill="#081683"
                    />
                    <path
                      d="M15.0655 7.3743H13.3616C13.2281 6.88061 12.9365 6.44472 12.5316 6.13395C12.1267 5.82317 11.6311 5.65479 11.1214 5.65479C10.6117 5.65479 10.1161 5.82317 9.71127 6.13395C9.30639 6.44472 9.01471 6.88061 8.88126 7.3743H1.36424C1.19907 7.3743 1.04066 7.44015 0.923865 7.55736C0.80707 7.67457 0.741455 7.83354 0.741455 7.9993C0.741455 8.16506 0.80707 8.32403 0.923865 8.44124C1.04066 8.55845 1.19907 8.6243 1.36424 8.6243H8.88126C9.01471 9.118 9.30639 9.55388 9.71127 9.86466C10.1161 10.1754 10.6117 10.3438 11.1214 10.3438C11.6311 10.3438 12.1267 10.1754 12.5316 9.86466C12.9365 9.55388 13.2281 9.118 13.3616 8.6243H15.0655C15.2307 8.6243 15.3891 8.55845 15.5059 8.44124C15.6227 8.32403 15.6883 8.16506 15.6883 7.9993C15.6883 7.83354 15.6227 7.67457 15.5059 7.55736C15.3891 7.44015 15.2307 7.3743 15.0655 7.3743ZM11.1214 9.09305C10.9059 9.09305 10.6951 9.0289 10.5159 8.90872C10.3367 8.78854 10.197 8.61772 10.1145 8.41786C10.032 8.21801 10.0104 7.99809 10.0525 7.78592C10.0945 7.57376 10.1983 7.37887 10.3508 7.22591C10.5032 7.07294 10.6974 6.96877 10.9088 6.92657C11.1202 6.88437 11.3394 6.90603 11.5385 6.98881C11.7376 7.07159 11.9079 7.21178 12.0276 7.39165C12.1474 7.57151 12.2113 7.78298 12.2113 7.9993C12.211 8.28928 12.096 8.56729 11.8917 8.77233C11.6874 8.97738 11.4104 9.09272 11.1214 9.09305Z"
                      fill="#081683"
                    />
                    <path
                      d="M15.0655 12.5314H7.54912C7.41545 12.0378 7.12365 11.6021 6.71875 11.2915C6.31384 10.9808 5.81833 10.8125 5.30865 10.8125C4.79898 10.8125 4.30346 10.9808 3.89856 11.2915C3.49365 11.6021 3.20185 12.0378 3.06818 12.5314H1.36424C1.19907 12.5314 1.04066 12.5973 0.923865 12.7145C0.80707 12.8317 0.741455 12.9906 0.741455 13.1564C0.741455 13.3222 0.80707 13.4811 0.923865 13.5983C1.04066 13.7156 1.19907 13.7814 1.36424 13.7814H3.06818C3.20185 14.275 3.49365 14.7107 3.89856 15.0214C4.30346 15.332 4.79898 15.5003 5.30865 15.5003C5.81833 15.5003 6.31384 15.332 6.71875 15.0214C7.12365 14.7107 7.41545 14.275 7.54912 13.7814H15.0655C15.2307 13.7814 15.3891 13.7156 15.5059 13.5983C15.6227 13.4811 15.6883 13.3222 15.6883 13.1564C15.6883 12.9906 15.6227 12.8317 15.5059 12.7145C15.3891 12.5973 15.2307 12.5314 15.0655 12.5314ZM5.30834 14.2501C5.09278 14.2501 4.88207 14.186 4.70284 14.0658C4.52361 13.9456 4.38392 13.7748 4.30143 13.575C4.21894 13.3751 4.19736 13.1552 4.23941 12.943C4.28146 12.7309 4.38526 12.536 4.53768 12.383C4.69011 12.23 4.8843 12.1259 5.09572 12.0837C5.30713 12.0415 5.52627 12.0631 5.72542 12.1459C5.92457 12.2287 6.09478 12.3689 6.21454 12.5488C6.3343 12.7286 6.39822 12.9401 6.39822 13.1564C6.39772 13.4463 6.28274 13.7242 6.07845 13.9293C5.87417 14.1343 5.59724 14.2497 5.30834 14.2501Z"
                      fill="#081683"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1696_2859">
                      <rect
                        width="14.9469"
                        height="15"
                        fill="white"
                        transform="translate(0.741455 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              {/* fim input de filtro */}
              {/*adicionando botão de + chaves*/}
              <button className="absolute right-0 top-0 px-4 py-1.5 bg-[#18C64F] text-white font-medium flex gap-2 justify-center items-center hover:bg-[#56ab71] rounded-md w-full tablet:w-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="#ffffff"
                  className="bi bi-plus-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>
                ADICIONAR CHAVE
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}