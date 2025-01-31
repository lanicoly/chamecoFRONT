import { useNavigate } from "react-router-dom";

export function MenuTopo() {
  const navigate = useNavigate();

  return (
    <nav className="flex justify-center px-4 py-2 bg-white fixed top-0 w-full z-10 items-center">
      <button
        onClick={() => navigate("/menu")}
        className="flex gap-2 justify-start mr-auto items-center font-medium text-lg text-sky-900 w-auto"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#082f49"
          className="bi bi-chevron-left"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
          />
        </svg>
        MENU
      </button>

      {/* logo chameco lateral */}
      <div className="sm:flex pl-[85px] hidden  bottom-4 items-center">
        <img className="w-[150px]" src="\logo_lateral.png" alt="logo chameco" />
      </div>
      {/* fim logo chameco lateral */}

      <div className="flex ml-auto">
        <button className="flex justify-center items-center gap-1 text-[#565D8F] font-semibold text-base bg-[#B8C1FF] rounded-l-md p-2 h-max w-max cursor-default">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi    bi-person-circle"
            viewBox="0 0 16 16"
          >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path
              fill-rule="evenodd"
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
            />
          </svg>
          Usuário
        </button>
        <button
          onClick={() => navigate("/login")}
          className="text-white flex justify-center items-center gap-1.5 w-max font-medium text-base bg-[#565D8F] rounded-r-md p-2 h-max"
        >
          Sair
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-box-arrow-right"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
            />
            <path
              fill-rule="evenodd"
              d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}
