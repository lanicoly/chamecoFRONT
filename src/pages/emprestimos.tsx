import { Plus, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { MenuTopo } from "../components/menuTopo";
import { DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { FilterableInputResponsaveis } from "../components/inputs/FilterableInputResponsaveis";
import { FilterableInputSolicitantes } from "../components/inputs/FilterableInputSolicitantes";
import { FilterableInputChaves } from "../components/inputs/FilterableInputChaves";
import useGetResponsaveis from "../hooks/usuarios/useGetResponsaveis";
import useGetSalas from "../hooks/salas/useGenericGetSalas";
// import useGetUsuarios from "../hooks/usuarios/useGenericGetUsers";
import useGetEmprestimos from "../hooks/emprestimos/useGetEmprestimos";
import api from "../services/api";
import { PopUpdeSucesso } from "../components/popups/PopUpdeSucesso";
import { PopUpError } from "../components/popups/PopUpError";
import { EmprestimosPendentes } from "../components/emprestimoPendente";
import { EmprestimosConcluidos } from "../components/emprestimoConcluido";
import { useChaves } from "../context/ChavesContext";
import { AxiosError } from "axios";
import { useRef } from "react";
import { Relogio } from "../components/relogio";
import { Pesquisa } from "../components/pesquisa";

export interface Iemprestimo {
  id?: number | null;
  sala?: number | null;
  chave: number | null;
  usuario_solicitante: number | null;
  usuario_responsavel: number | null;
  token?: string | null;
  observacao?: string | null;
  dataRetirada?: string;
  horario_emprestimo?: string;
  dataDevolucao?: string | null;
  horario_devolucao?: string | null;
}

export interface FiltroEmprestimo {
  setFiltroDataEmprestimo: (dates: DateRange | undefined) => void;
  filtroDataEmprestimo: DateRange | undefined;
}

export function Emprestimos() {
  const [chaveSelecionadaId, setChaveSelecionadaId] = useState<number | null>(
    null,
  );
  const [solicitanteSelecionadoId, setSolicitanteSelecionadoId] = useState<
    number | null
  >(null);
  const [responsavelSelecionadoId, setResponsavelSelecionadoId] = useState<
    number | null
  >(null);
  const [observacao, setObservacao] = useState<string | null>();

  const [onReset, setOnReset] = useState(false);
  const [isSuccesModalOpen, setIsSuccesModalOpen] = useState(false);
  const [isPopUpErrorOpen, setIsPopUpErrorOpen] = useState(false);

  const { responsaveis } = useGetResponsaveis();
  const { salas } = useGetSalas();
  const { refetch } = useChaves();

  const [pesquisa, setPesquisa] = useState("");
  const [, setIsSearching] = useState(false);

  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const [mostrarSomenteAtrasados, setMostrarSomenteAtrasados] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const { new_emprestimos: emprestimosPendentes } = useGetEmprestimos(
    false,
    refreshCounter,
  );
  const { new_emprestimos: emprestimosConcluidos } = useGetEmprestimos(
    true,
    refreshCounter,
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefreshCounter((qtdMinutos) => qtdMinutos + 1);
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const [qtdAtrasados, setQtdAtrasados] = useState(0);

  const chavesRef = useRef<HTMLElementTagNameMap["td"]>(null);
  const solicitanteRef = useRef<HTMLElementTagNameMap["td"]>(null);
  const responsavelRef = useRef<HTMLElementTagNameMap["td"]>(null);
  const observacaoRef = useRef<HTMLElementTagNameMap["td"]>(null);
  const enviarRef = useRef<HTMLElementTagNameMap["td"]>(null);
  type EnviarRef = React.RefObject<HTMLElementTagNameMap["td"]>;

  async function criarEmprestimo() {
    const observacaoAtual = observacao || "";
    const observacaoParaEnvio =
      observacaoAtual.trim() === ""
        ? "Detalhes sobre o empréstimo"
        : observacaoAtual;
    const novoEmprestimo: Iemprestimo = {
      chave: chaveSelecionadaId,
      usuario_responsavel: responsavelSelecionadoId,
      usuario_solicitante: solicitanteSelecionadoId,
      observacao: observacaoParaEnvio,
    };

    if (
      novoEmprestimo.chave === null ||
      novoEmprestimo.usuario_responsavel === null ||
      novoEmprestimo.usuario_solicitante === null
    ) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    } else {
      try {
        const response = await api.post(
          "/chameco/api/v1/realizar-emprestimo/",
          novoEmprestimo,
        );
        if (response) {
          setOnReset(true);
          setTimeout(() => setOnReset(false), 100);
          setIsSuccesModalOpen(!isSuccesModalOpen);
          setObservacao("");
        }
        setMensagemSucesso("Empréstimo realizado com sucesso!");
        setRefreshCounter((contadorAtual) => contadorAtual + 1);
        refetch();
      } catch (error: unknown) {
        let mensagem = "Erro ao criar o empréstimo.";
        if (
          error &&
          typeof error === "object" &&
          (error as AxiosError).isAxiosError
        ) {
          const axiosError = error as AxiosError;
          mensagem = (axiosError.response?.data as any)?.message || mensagem;
        }
        console.error("Erro ao criar o empréstimo:", error);
        setMensagemErro(mensagem);
        setIsPopUpErrorOpen(!isPopUpErrorOpen);
      } finally {
        handleCloseMOdalAndReload();
      }
    }
  }

  const handleCloseMOdalAndReload = () => {
    setTimeout(() => {
      setIsSuccesModalOpen(false);
      setIsPopUpErrorOpen(false);
    }, 2000);
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  function openEditModal() {
    setIsEditModalOpen(true);
  }
  function closeEditModal() {
    setIsEditModalOpen(false);
  }

  const [editarObservacao, setEditarObservacao] = useState("");
  const [exibirEmprestimosPendentes, setExibirEmprestimosPendentes] =
    useState(true);

  const alternarEmprestimos = () => {
    setExibirEmprestimosPendentes((prev) => !prev);
    setPesquisa("");
    setIsSearching(false);
  };

  function handleSalvarObservacao(e: React.FormEvent, enviarRef: EnviarRef) {
    e.preventDefault();
    setObservacao(editarObservacao);
    setEditarObservacao("");
    setIsEditModalOpen(false);
    if (enviarRef.current) {
      enviarRef.current.focus();
    }
  }

  function handleNavigation(
    e: React.KeyboardEvent<HTMLElementTagNameMap["td"]>,
    nextRef?: React.RefObject<HTMLElementTagNameMap["td"]>,
    actionOnEnter?: () => void,
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (actionOnEnter) actionOnEnter();
      if (nextRef?.current) {
        const inputElement = nextRef.current.querySelector("input");
        if (inputElement) {
          inputElement.focus();
        } else {
          nextRef.current.focus();
        }
      }
    }
  }

  function focarProximoInput(nextRef: React.RefObject<HTMLElement | null>) {
    if (nextRef?.current) {
      const inputElement = nextRef.current.querySelector("input");
      if (inputElement) {
        inputElement.focus();
      } else {
        nextRef.current.focus();
      }
    }
  }

  return (
    <div className="flex-col min-h-screen flex items-center justify-center bg-tijolos h-full bg-no-repeat bg-cover p-2 tablet:p-0">
      {isSuccesModalOpen && <PopUpdeSucesso mensagem={mensagemSucesso} />}
      {isPopUpErrorOpen && <PopUpError mensagem={mensagemErro} />}

      {localStorage.getItem("userType") === "vigilante" ? (
        <MenuTopo text="" backRoute="" />
      ) : (
        <MenuTopo text="MENU" backRoute="/menu" />
      )}

      <div className="relative bg-white w-full max-w-[95%] tablet:max-w-[85%] desktop:max-w-[95%] h-auto min-[1800px]:min-h-[820px] min-[700px]:min-h-[420px] min-[1400px]:min-h-[380px] flex flex-col rounded-3xl px-4 tablet:px-6 py-4 desktop:py-6 m-2 tablet:m-8 desktop:m-12 top-6 tablet:top-10 desktop:top-14">
        {/* cabeçalho tela de empréstimo*/}
        <div className="flex w-full px-2 tablet:px-4 items-center justify-between gap-2">
          <Relogio />
          <h1 className="flex-1 text-center text-sky-900 text-xl tablet:text-2xl font-semibold truncate">
            EMPRÉSTIMOS
          </h1>

          <button>
            <div className="flex items-center justify-center gap-1 px-2 py-1 border-[#0240E1] border-2 rounded bg-[#0240E1] bg-opacity-10 shadow-md shadow-zinc-600">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_2949_3868"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                >
                  <rect width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_2949_3868)">
                  <path
                    d="M4 19V17H6V10C6 8.61667 6.41667 7.3875 7.25 6.3125C8.08333 5.2375 9.16667 4.53333 10.5 4.2V3.5C10.5 3.08333 10.6458 2.72917 10.9375 2.4375C11.2292 2.14583 11.5833 2 12 2C12.4167 2 12.7708 2.14583 13.0625 2.4375C13.3542 2.72917 13.5 3.08333 13.5 3.5V4.2C14.8333 4.53333 15.9167 5.2375 16.75 6.3125C17.5833 7.3875 18 8.61667 18 10V17H20V19H4ZM12 22C11.45 22 10.9792 21.8042 10.5875 21.4125C10.1958 21.0208 10 20.55 10 20H14C14 20.55 13.8042 21.0208 13.4125 21.4125C13.0208 21.8042 12.55 22 12 22Z"
                    fill="#0240E1"
                  />
                </g>
              </svg>
              <p className="md:block hidden text-base font-semibold text-[#0240E1]">
                NOTIFICAÇÕES
              </p>
            </div>
          </button>
        </div>

        <div className="flex flex-col px-2 tablet:px-4 py-1 w-full justify-center gap-1">
          <div>
            <div className="flex items-center justify-between mt-2">
              <h2 className="text-primary-green items-center font-semibold text-lg tablet:text-xl shadow-none">
                Criar novo empréstimo
              </h2>
            </div>

            <div className="w-full overflow-visible mb-2">
              <table className="w-full border-separate border-spacing-y-2 bg-white min-w-[600px]">
                <thead className="bg-white sticky top-0 z-11">
                  <tr>
                    <th className="text-left text-[13px] font-medium text-sky-900 w-[13%]">
                      Informe a sala
                    </th>
                    <th className="text-left text-[13px] font-medium text-sky-900 w-[22%]">
                      Informe quem solicitou
                    </th>
                    <th className="text-left text-[13px] font-medium text-sky-900 w-[22%]">
                      Informe quem entregou
                    </th>
                    <th className="w-[20%]"></th>
                    <th className="pl-2"></th>
                  </tr>
                </thead>
                <tbody className="relative z-20">
                  <tr>
                    <td
                      className="text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] bg-white relative overflow-visible z-30 w-[37%]"
                      ref={chavesRef}
                      onKeyDown={(e) => handleNavigation(e, solicitanteRef)}
                    >
                      <FilterableInputChaves
                        onSelectItem={(idSelecionado) => {
                          setChaveSelecionadaId(Number(idSelecionado) || null);
                          focarProximoInput(solicitanteRef);
                        }}
                        reset={onReset}
                      />
                    </td>
                    <td
                      ref={solicitanteRef}
                      onKeyDown={(e) => handleNavigation(e, responsavelRef)}
                      className="text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] bg-white relative overflow-visible z-20 w-[37%]"
                    >
                      <FilterableInputSolicitantes
                        onSelectItem={(idSelecionado) => {
                          setSolicitanteSelecionadoId(idSelecionado);
                          focarProximoInput(responsavelRef);
                        }}
                        reset={onReset}
                      />
                    </td>
                    <td
                      className="text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] bg-white relative overflow-visible z-10 w-[37%]"
                      ref={responsavelRef}
                      onKeyDown={(e) => handleNavigation(e, observacaoRef)}
                    >
                      <FilterableInputResponsaveis
                        items={responsaveis || []}
                        onSelectItem={(idSelecionado) => {
                          setResponsavelSelecionadoId(idSelecionado);
                          focarProximoInput(observacaoRef);
                        }}
                        reset={onReset}
                      />
                    </td>
                    <td
                      ref={observacaoRef}
                      tabIndex={0}
                      onClick={openEditModal}
                      onKeyDown={(e) =>
                        handleNavigation(e, enviarRef, openEditModal)
                      }
                      className="border-2 border-[#B8BCE0] border-solid bg-[#0240E1] p-0.5 font-semibold break-words cursor-pointer shadow-zinc-500 shadow-md"
                    >
                      <div className="flex justify-center items-center mr-1 gap-2 px-2">
                        <Plus color="white" size={18} />
                        <p className="text-sm text-[#FFFF] text-center font-semibold leading-normal truncate">
                          OBSERVAÇÃO
                        </p>
                      </div>
                    </td>
                    <td
                      ref={enviarRef}
                      tabIndex={0}
                      onClick={() => criarEmprestimo()}
                      onKeyDown={(e) =>
                        handleNavigation(e, undefined, criarEmprestimo)
                      }
                      className="border-2 border-[#B8BCE0] border-solid bg-primary-green p-0.5 font-semibold break-words cursor-pointer shadow-zinc-500 shadow-md"
                    >
                      <div className="flex justify-center items-center mr-1 gap-2 px-2">
                        <Plus color="white" size={18} />
                        <p className="text-sm text-[#FFFF] text-center font-semibold leading-normal truncate">
                          CRIAR EMPRÉSTIMO
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <hr className="text-[#646999] p-2 border-t-2 font-extrabold" />
            </div>

            <div className="flex gap-4 flex-wrap justify-between items-center my-2 w-full">
              <div className="flex items-center gap-4 min-w-[200px]">
                <h2
                  className={`${exibirEmprestimosPendentes ? "text-red-500" : "text-[#0240E1]"} items-center font-semibold text-lg tablet:text-xl mt-2`}
                >
                  Empréstimos{" "}
                  {exibirEmprestimosPendentes ? "pendentes" : "concluídos"}
                </h2>
              </div>

              <div className="flex justify-center md:justify-end flex-1 px-4">
                <button
                  onClick={alternarEmprestimos}
                  className={`flex py-1 px-3 justify-center items-center gap-5 rounded-md bg-opacity-10 mt-2 border-2 transition-all ${exibirEmprestimosPendentes ? "bg-[#0240E1] border-[#0240E1]" : "bg-red-500 border-red-500"}`}
                >
                  <p
                    className={`items-center ${exibirEmprestimosPendentes ? "text-[#0240E1]" : "text-[#EF4444]"} text-[15px] font-semibold`}
                  >
                    {exibirEmprestimosPendentes
                      ? "VER CONCLUÍDOS"
                      : "  VER PENDENTES"}
                  </p>
                </button>
              </div>

              <div className="flex items-center gap-3 ml-auto md:ml-0">
                {exibirEmprestimosPendentes && (
                  <div className="flex items-center gap-1 text-sm text-[#646999] font-semibold clean-checkbox">
                    <input
                      type="checkbox"
                      checked={mostrarSomenteAtrasados}
                      onChange={(e) =>
                        setMostrarSomenteAtrasados(e.target.checked)
                      }
                    />
                    Atrasados +24h
                    <div className="flex items-center px-2 py-1 rounded-full bg-[#EF4444] text-xs text-white">
                      {qtdAtrasados}
                    </div>
                  </div>
                )}
                <Pesquisa
                  pesquisa={pesquisa}
                  placeholder="Pesquisar"
                  setIsSearching={setIsSearching}
                  setPesquisa={setPesquisa}
                />
              </div>
            </div>
            <div
              className={`overflow-y-auto max-h-40 min-[700px]:max-h-48 min-[1400px]:max-h-[290px] min-[1800px]:max-h-[495px] ${
                exibirEmprestimosPendentes ? "block" : "hidden"
              }`}
            >
              <EmprestimosPendentes
                new_emprestimos={emprestimosPendentes}
                setRefreshCounter={setRefreshCounter}
                termoPesquisa={pesquisa}
                setQtdAtrasados={setQtdAtrasados}
                filtrarAtrasados={mostrarSomenteAtrasados}
              />
            </div>

            {!exibirEmprestimosPendentes && (
              <div className="overflow-y-auto max-h-40 min-[700px]:max-h-48 min-[1400px]:max-h-[290px] min-[1800px]:max-h-[495px]">
                <EmprestimosConcluidos
                  new_emprestimos={emprestimosConcluidos}
                  salas={salas}
                  termoPesquisa={pesquisa}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-start bottom-4 absolute mobile:hidden">
          <img
            className="sm:w-[200px] w-32"
            src="\logo-sigec.svg"
            alt="logo sigec"
          />
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-50 p-4">
          <form
            onSubmit={(e) => handleSalvarObservacao(e, enviarRef)}
            className="container flex flex-col gap-2 w-full p-4 h-auto rounded-[15px] bg-white max-w-[400px] shadow-xl"
          >
            <div className="flex justify-center items-center w-full">
              <p className="text-[#192160] text-center text-lg font-semibold flex-1">
                EDITAR OBSERVAÇÃO
              </p>
              <button
                onClick={closeEditModal}
                type="button"
                className="p-1 rounded"
              >
                <X className="text-[#192160]" />
              </button>
            </div>
            <div className="w-full mt-2">
              <p className="text-[#192160] text-sm font-medium mb-1">
                Digite a nova observação
              </p>
              <input
                className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium"
                type="text"
                placeholder="Observação"
                value={editarObservacao !== null ? editarObservacao : ""}
                onChange={(e) => setEditarObservacao(e.target.value)}
              />
            </div>
            <div className="flex justify-center items-center mt-4 w-full">
              <button
                type="submit"
                className="w-full tablet:w-auto px-4 py-2 border-[3px] rounded-xl font-semibold text-sm bg-[#16C34D] text-[#FFF]"
              >
                SALVAR ALTERAÇÕES
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
