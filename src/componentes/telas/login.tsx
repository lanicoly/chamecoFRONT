import axios from "axios";

import { useState } from "react";

interface LoginProps {
  mudarTela: (index: number) => void;
}

export function Login({ mudarTela }: LoginProps) {
  const url =
    "https://web-rsi1mpmw72mx.up-de-fra1-k8s-1.apps.run-on-seenode.com/chameco/api/v1/login/";
  // Adicionando validação de usuário e senha
  const [usuario, setUsuario] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const body = {
      cpf: usuario,
      password: senha,
    };

    if (!usuario || !senha) {
      setError("Por favor, preencha todos os campos!");
      return;
    }
    setError("");

    try {
      const response = await axios.post(url, body, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const statusResponse = response.status;
      const data = response.data;

      if (statusResponse === 200) {
        if ("usuario" in data) {
          mudarTela(1);
        } else {
          setError("Usuário não registrado no sistema!");
          return;
        }
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const statusResponse = error.response?.status;

        if (statusResponse === 400) {
          setError("Preencha os campos corretamente!");
          return;
        }
        if (statusResponse === 401) {
          setError("Usuário ou senha incorretos!");
          return;
        }
        if (statusResponse === 500) {
          setError("Erro interno do servidor! Contate o suporte.");
          return;
        }
      }
    }
  }

  return (
    <div className="flex items-center justify-center w-auto h-screen bg-login-fundo  flex-shrink bg-no-repeat bg-center">
      {/* Adicionando container de login */}
      <div className="container max-w-[650px] w-full p-4 rounded-[10px] h-auto bg-white flex flex-col sm:flex-row">
        {/* Adicionando logo */}
        <div className="flex justify-center  mt-10 sm:mt-[60px] sm:ml-[30px]">
          <img
            src="logo.login.png"
            alt=""
            className="w-[350px] h-auto hidden sm:block"
          />
        </div>

        {/* Adicionando div do formulário */}
        <div className="flex flex-col items-center pt-[30px]">
          <h1 className="text-[#16C34D] items-center font-semibold text-[40px] text-center">
            Boas Vindas!
          </h1>
          <p className="text-[#192160] items-center text-[15px] tablet:m-[5px] tablet:text-[17px] font-medium text-center mt-[10px]">
            Insira seus dados para continuar
          </p>

          {/* Adicionando formulário */}
          <form className="ml-[30px] mt-[20px]" onSubmit={handleSubmit}>
            {/* Div com o primeiro input - login */}
            <div className="relative ">
              <p className="text-[#192160] text-[13px] font-medium mb-[5px]">
                Digite seu usuário
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                className="absolute left-[10px] top-[38px] transform -translate-y-1/2 text-[#777DAA] pointer-events-none w-[18px]"
              >
                <g clip-path="url(#clip0_1608_2126)">
                  <path
                    d="M10.5 10C11.4889 10 12.4556 9.70676 13.2779 9.15735C14.1001 8.60794 14.741 7.82705 15.1194 6.91342C15.4978 5.99979 15.5969 4.99446 15.4039 4.02455C15.211 3.05465 14.7348 2.16373 14.0355 1.46447C13.3363 0.765206 12.4454 0.289002 11.4755 0.0960758C10.5055 -0.0968503 9.50021 0.00216643 8.58658 0.380605C7.67295 0.759043 6.89206 1.39991 6.34265 2.22215C5.79324 3.0444 5.5 4.0111 5.5 5C5.50132 6.32568 6.02853 7.59668 6.96593 8.53407C7.90332 9.47147 9.17432 9.99868 10.5 10ZM10.5 1.66667C11.1593 1.66667 11.8037 1.86217 12.3519 2.22844C12.9001 2.59471 13.3273 3.1153 13.5796 3.72439C13.8319 4.33348 13.8979 5.0037 13.7693 5.6503C13.6407 6.29691 13.3232 6.89085 12.857 7.35703C12.3908 7.8232 11.7969 8.14067 11.1503 8.26929C10.5037 8.3979 9.83348 8.33189 9.22439 8.0796C8.6153 7.82731 8.09471 7.40007 7.72844 6.8519C7.36216 6.30374 7.16667 5.65927 7.16667 5C7.16667 4.11595 7.51786 3.2681 8.14298 2.64298C8.7681 2.01786 9.61595 1.66667 10.5 1.66667Z"
                    fill="#777DAA"
                  />
                  <path
                    d="M10.5 11.667C8.51155 11.6692 6.60518 12.4601 5.19914 13.8661C3.79309 15.2722 3.00221 17.1785 3 19.167C3 19.388 3.0878 19.6 3.24408 19.7562C3.40036 19.9125 3.61232 20.0003 3.83333 20.0003C4.05435 20.0003 4.26631 19.9125 4.42259 19.7562C4.57887 19.6 4.66667 19.388 4.66667 19.167C4.66667 17.6199 5.28125 16.1362 6.37521 15.0422C7.46917 13.9482 8.9529 13.3337 10.5 13.3337C12.0471 13.3337 13.5308 13.9482 14.6248 15.0422C15.7188 16.1362 16.3333 17.6199 16.3333 19.167C16.3333 19.388 16.4211 19.6 16.5774 19.7562C16.7337 19.9125 16.9457 20.0003 17.1667 20.0003C17.3877 20.0003 17.5996 19.9125 17.7559 19.7562C17.9122 19.6 18 19.388 18 19.167C17.9978 17.1785 17.2069 15.2722 15.8009 13.8661C14.3948 12.4601 12.4884 11.6692 10.5 11.667Z"
                    fill="#777DAA"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1608_2126">
                    <rect
                      width="20"
                      height="20"
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>

              <input
                className="w-[250px] p-[4px] pl-[30px] items-center rounded-[10px] border border-[#777DAA] focus:outline-none text-[#777DAA] text-sm font-medium"
                type="text"
                placeholder="Usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />
            </div>

            {/* Div com o segundo input - senha */}
            <div className="relative mt-[20px]">
              <p className="text-[#192160] text-[13px] font-medium mb-[5px]">
                Digite sua senha
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="20"
                viewBox="0 0 18 20"
                fill="none"
                className="absolute left-[10px] top-[40px] transform -translate-y-1/2 text-[#777DAA] pointer-events-none w-[15px]"
              >
                <path
                  d="M14.6667 7.02V5.83333C14.6667 4.28624 14.0521 2.80251 12.9581 1.70854C11.8642 0.614582 10.3804 0 8.83333 0C7.28624 0 5.80251 0.614582 4.70854 1.70854C3.61458 2.80251 3 4.28624 3 5.83333V7.02C2.2578 7.34392 1.62608 7.8771 1.18208 8.55434C0.738088 9.23158 0.501065 10.0235 0.5 10.8333V15.8333C0.501323 16.938 0.940735 17.997 1.72185 18.7782C2.50296 19.5593 3.562 19.9987 4.66667 20H13C14.1047 19.9987 15.1637 19.5593 15.9448 18.7782C16.7259 17.997 17.1653 16.938 17.1667 15.8333V10.8333C17.1656 10.0235 16.9286 9.23158 16.4846 8.55434C16.0406 7.8771 15.4089 7.34392 14.6667 7.02ZM4.66667 5.83333C4.66667 4.72826 5.10565 3.66846 5.88705 2.88705C6.66846 2.10565 7.72826 1.66667 8.83333 1.66667C9.9384 1.66667 10.9982 2.10565 11.7796 2.88705C12.561 3.66846 13 4.72826 13 5.83333V6.66667H4.66667V5.83333ZM15.5 15.8333C15.5 16.4964 15.2366 17.1323 14.7678 17.6011C14.2989 18.0699 13.663 18.3333 13 18.3333H4.66667C4.00363 18.3333 3.36774 18.0699 2.8989 17.6011C2.43006 17.1323 2.16667 16.4964 2.16667 15.8333V10.8333C2.16667 10.1703 2.43006 9.53441 2.8989 9.06557C3.36774 8.59672 4.00363 8.33333 4.66667 8.33333H13C13.663 8.33333 14.2989 8.59672 14.7678 9.06557C15.2366 9.53441 15.5 10.1703 15.5 10.8333V15.8333Z"
                  fill="#777DAA"
                />
              </svg>
              <input
                type="password"
                placeholder="Senha"
                className="w-[250px] p-[4px] pl-[30px] rounded-[10px] border border-[#777DAA] focus:outline-none text-[#777DAA] text-sm font-medium"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              {error && (
                <div className="text-red-500 items-center text-[12px] pr-[2px] tablet:m-[5px] tablet:text-[17px] font-medium text-center">
                  {error}
                </div>
              )}

              {/* Adicionando botão de entrar */}
              <div className="mt-[30px] text-center items-center ml-[70px]">
                <button
                  type="submit"
                  className="px-2 py-1 w-[115px] rounded-lg h-[35px] font-semibold text-[17px] flex gap-[4px] justify-center items-center bg-[#18C64F] text-[#FFF] shadow-[rgba(0, 0, 0, 0.25)]"
                >
                  ENTRAR
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
