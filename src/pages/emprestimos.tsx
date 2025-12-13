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
import useGetUsuarios from "../hooks/usuarios/useGenericGetUsers";
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
  // const tipo = Number(localStorage.getItem("userType"));
  // const pesquisa = "";

  const [chaveSelecionadaId, setChaveSelecionadaId] = useState<number | null>(
    null
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

  // chame sempre o MESMO hook; mude só o parâmetro
  const { responsaveis } = useGetResponsaveis();

  const { salas } = useGetSalas();
  const { usuarios } = useGetUsuarios();
  const { chaves, refetch } = useChaves();

  const [pesquisa, setPesquisa] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

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
    // console.log("Chave", chaveSelecionadaId)

    //     console.log("Dados:", JSON.stringify(novoEmprestimo));

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
          novoEmprestimo
        );

        if (response) {
          setOnReset(true); // ativa o reset
          setTimeout(() => setOnReset(false), 100); // evita reset contínuo
          setIsSuccesModalOpen(!isSuccesModalOpen);
          setObservacao("");
        }

        //Colocando esse incremento no lugar do reload

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

  // const [isObservacaoModalOpen, setIsObservacaoModalOpen] = useState(false);

  // function openObservacaoModal() {
  //   setIsObservacaoModalOpen(true);
  // }

  // function closeObservacaoModal() {
  //   setIsObservacaoModalOpen(false);
  // }

  // Adicionando função de abrir e fechar modal de editar observacao de um emprestimo
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
    setExibirEmprestimosPendentes(
      (exibirEmprestimoAtual) => !exibirEmprestimoAtual
    );

    setPesquisa("");
    setIsSearching(false);
  };

  // Ainda está faltando o loading e o error
  const [refreshCounter, setRefreshCounter] = useState(0);

  const { new_emprestimos: emprestimosPendentes } = useGetEmprestimos(
    false,
    refreshCounter
  );
  const { new_emprestimos: emprestimosConcluidos } = useGetEmprestimos(
    true,
    refreshCounter
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefreshCounter((qtdMinutos) => qtdMinutos + 1);
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // para garantir que sempre terei as chaves nessa tela
    refetch();
    // console.log("atualizou o context")
  }, []);

  const chavesRef = useRef<HTMLElementTagNameMap["td"]>(null);
  const solicitanteRef = useRef<HTMLElementTagNameMap["td"]>(null);
  const responsavelRef = useRef<HTMLElementTagNameMap["td"]>(null);
  const observacaoRef = useRef<HTMLElementTagNameMap["td"]>(null);
  const enviarRef = useRef<HTMLElementTagNameMap["td"]>(null);
  type EnviarRef = React.RefObject<HTMLElementTagNameMap["td"]>;

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
    actionOnEnter?: () => void
  ) {
    if (e.key === "Enter") {
      e.preventDefault();

      if (actionOnEnter) {
        actionOnEnter();
      }

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

  return (
    <div className="flex-col min-h-screen flex items-center justify-center bg-tijolos h-full bg-no-repeat bg-cover">
      {isSuccesModalOpen && <PopUpdeSucesso mensagem={mensagemSucesso} />}
      {isPopUpErrorOpen && <PopUpError mensagem={mensagemErro} />}

      {localStorage.getItem("userType") === "vigilante" ? (
        <MenuTopo text="" backRoute="" />
      ) : (
        <MenuTopo text="MENU" backRoute="/menu" />
      )}

      {/* parte informativa tela de empréstimo */}
      <div className="relative bg-white w-full max-w-[80%] rounded-3xl px-6 py-2 tablet:py-3 desktop:py-6 m-12 top-8 tablet:top-10 desktop:top-8">
        {/* cabeçalho tela de empréstimo*/}
        <div className="flex w-full px-4">
          <Relogio />
          <h1 className="flex w-full justify-center text-sky-900 text-2xl font-semibold">
            EMPRÉSTIMOS
          </h1>

          <button>
            <div className=" flex items-center justify-center gap-1 px-2 py-1 border-[#0240E1] border-2 rounded bg-[#0240E1] bg-opacity-10 shadow-md shadow-zinc-600">
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
              <p className=" md:block hidden text-base font-semibold text-[#0240E1]">
                NOTIFICAÇÕES
              </p>
            </div>
          </button>
        </div>
        {/* fim cabeçalho tela de empréstimo */}

        {/* conteudo central tela de empréstimo */}
        <div className="flex flex-col px-4 py-1 w-auto justify-center gap-1">
          {/* conteudo central tabela*/}
          <div>
            <div className="flex items-center justify-between mt-2">
              <h2 className="text-primary-green items-center font-semibold text-xl shadow-none">
                Criar novo empréstimo
              </h2>
            </div>

            {/* tabela de criacao de emprestimo */}
            <div className=" max-h-[248px] tablet:max-h-64 desktop:max-h-96">
              <table className="w-full border-separate border-spacing-y-2 tablet:mb-2 bg-white">
                <thead className="bg-white sticky top-0 z-11">
                  <tr>
                    {/* <th className="text-left text-[13px] sm:text-[13px] font-medium text-sky-900 w-[13%]">
                      Informe a sala
                    </th> */}
                    <th className="text-left text-[13px] sm:text-[13px] font-medium text-sky-900 w-[13%]">
                      Informe a chave
                    </th>
                    <th className="text-left text-[13px] sm:text-[13px] font-medium text-sky-900 flex-1 min-w-10 w-[22%] ">
                      Informe quem solicitou
                    </th>
                    <th className="text-left text-[13px] sm:text-[13px] font-medium text-sky-900 w-[22%] ">
                      Informe quem entregou
                    </th>
                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[20%]   "></th>
                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 pl-2"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      className="text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[37%]"
                      ref={chavesRef}
                      onKeyDown={(e) => handleNavigation(e, solicitanteRef)}
                    >
                      <FilterableInputChaves
                        onSelectItem={(idSelecionado) => {
                          setChaveSelecionadaId(Number(idSelecionado) || null);
                        }}
                        reset={onReset}
                      />
                    </td>

                    <td
                      ref={solicitanteRef}
                      onKeyDown={(e) => handleNavigation(e, responsavelRef)}
                      className="text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[37%]"
                    >
                      <FilterableInputSolicitantes
                        onSelectItem={(idSelecionado) => {
                          setSolicitanteSelecionadoId(idSelecionado);
                        }}
                        reset={onReset}
                      />
                    </td>

                    <td
                      className="text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[37%]"
                      ref={responsavelRef}
                      onKeyDown={(e) => handleNavigation(e, observacaoRef)}
                    >
                      <FilterableInputResponsaveis
                        items={responsaveis}
                        onSelectItem={(idSelecionado) => {
                          setResponsavelSelecionadoId(idSelecionado);
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

                    {/* Adicionando pop up de observação do empréstimo */}
                    {/* {isObservacaoModalOpen && ( */}
                    {/* //  && emprestimo.id === emprestimoSelecionado) */}
                    {/* <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                        <form className="container flex flex-col gap-2 w-full px-4 py-4 h-auto rounded-[15px] bg-white mx-5 max-w-[500px]">
                          <div className="flex justify-center w-full ">
                            <p className="text-[#192160] text-center text-[20px] font-semibold w-[85%]">
                              OBSERVAÇÃO DO EMPRÉSTIMO
                            </p>
                            <button
                              onClick={openEditModal}
                              type="button"
                              className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                            >
                              <X className=" mb-[5px] text-[#192160] ml-auto" />
                            </button>
                          </div>

                          <div className="flex w-full h-auto px-[10px] py-2 mb-4 flex-col rounded-lg bg-[#B8BCE0]">
                            <p className="text-[#192160] font-medium p-1">
                              {observacao ||
                                "Detalhadamento sobre o empréstimo que será criado, como pessoa que autorizou aluno, entre outros."}
                            </p>
                            <button
                              type="button"
                              onClick={() => openEditModal()}
                              className="flex gap-1 justify-end items-center font-medium text-sm text-[#646999] underline"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                fill="#646999"
                                className="bi bi-pen"
                                viewBox="0 0 16 16"
                              >
                                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                              </svg>
                              Editar
                            </button> */}

                    {/* Começo do pop up de editar emprestimo */}
                    {isEditModalOpen && (
                      <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                        <form
                          onSubmit={(e) => handleSalvarObservacao(e, enviarRef)}
                          className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px]"
                        >
                          <div className="flex justify-center mx-auto w-full max-w-[90%]">
                            <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                              EDITAR OBSERVAÇÃO
                            </p>

                            <button
                              onClick={closeEditModal}
                              type="button"
                              className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                            >
                              <X className=" mb-[5px] text-[#192160]" />
                            </button>
                          </div>

                          <div className="justify-center items-center ml-[40px] mr-8">
                            <p className="text-[#192160] text-sm font-medium mb-1">
                              Digite a nova observação
                            </p>

                            <input
                              className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                              type="text"
                              placeholder="Observação"
                              value={
                                editarObservacao !== null
                                  ? editarObservacao
                                  : ""
                              }
                              onChange={(e) =>
                                setEditarObservacao(e.target.value)
                              }
                            />
                          </div>

                          <div className="flex justify-center items-center mt-[10px] w-full">
                            <button
                              type="submit"
                              className="px-3 py-2 border-[3px] rounded-xl font-semibold  text-sm flex gap-[4px] justify-center items-center  bg-[#16C34D] text-[#FFF]"
                            >
                              SALVAR ALTERAÇÕES
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                    {/* Fim do pop up de editar emprestimo */}
                    {/* </div> */}
                    {/* </form> */}
                    {/* </div> */}
                    {/* )} */}

                    {/* Fim adicionando pop up de observacao do emprestimo */}
                  </tr>
                </tbody>
              </table>
              <hr className="text-[#646999] p-2 border-t-2 font-extrabold" />
            </div>
            {/* fim tabela de criacao de emprestimo */}

            <div className=" flex gap-2 flex-wrap justify-between items-center">
              <div className="flex items-center gap-4">
                <h2
                  className={`${
                    exibirEmprestimosPendentes
                      ? "text-red-500"
                      : "text-[#0240E1]"
                  } items-center font-semibold text-xl mt-2`}
                >
                  Empréstimos{" "}
                  {exibirEmprestimosPendentes ? "pendentes" : "concluídos"}
                </h2>

                <button
                  onClick={alternarEmprestimos}
                  className={`flex py-1 px-3 justify-center items-center gap-2 rounded-md bg-opacity-10 mt-2 border-2 ${
                    exibirEmprestimosPendentes
                      ? "bg-[#0240E1] border-[#0240E1]"
                      : "bg-red-500 border-red-500"
                  }`}
                >
                  <svg
                    width="16"
                    height="10"
                    viewBox="0 0 16 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_2953_3884)">
                      <path
                        d="M0.666504 5.46699C3.5465 -0.933008 12.1865 -0.933008 15.0665 5.46699"
                        stroke={`${
                          exibirEmprestimosPendentes ? "#0240E1" : "#EF4444"
                        }`}
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M7.86631 8.6667C7.55114 8.6667 7.23905 8.60462 6.94787 8.48401C6.65669 8.3634 6.39211 8.18662 6.16925 7.96376C5.94639 7.74089 5.76961 7.47632 5.649 7.18514C5.52839 6.89396 5.46631 6.58187 5.46631 6.2667C5.46631 5.95153 5.52839 5.63944 5.649 5.34826C5.76961 5.05708 5.94639 4.7925 6.16925 4.56964C6.39211 4.34678 6.65669 4.17 6.94787 4.04939C7.23905 3.92878 7.55114 3.8667 7.86631 3.8667C8.50283 3.8667 9.11328 4.11956 9.56336 4.56964C10.0135 5.01973 10.2663 5.63018 10.2663 6.2667C10.2663 6.90322 10.0135 7.51367 9.56336 7.96376C9.11328 8.41384 8.50283 8.6667 7.86631 8.6667Z"
                        fill={`${
                          exibirEmprestimosPendentes ? "#0240E1" : "#EF4444"
                        }`}
                        stroke={`${
                          exibirEmprestimosPendentes ? "#0240E1" : "#EF4444"
                        }`}
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2953_3884">
                        <rect width="16" height="9.33333" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <p
                    className={`items-center ${
                      exibirEmprestimosPendentes
                        ? "text-[#0240E1]"
                        : "text-[#EF4444]"
                    } text-[15px] font-semibold`}
                  >
                    {" "}
                    {exibirEmprestimosPendentes ? "CONCLUÍDOS" : "PENDENTES"}
                  </p>
                </button>
              </div>
              <Pesquisa
                pesquisa={pesquisa}
                placeholder="Pesquisar"
                setIsSearching={setIsSearching}
                setPesquisa={setPesquisa}
              />
            </div>

            {/* tabela com emprestimo pendente */}
            <div
              className={`overflow-y-auto max-h-52 tablet:max-h-60 ${
                exibirEmprestimosPendentes ? "block" : "hidden"
              }`}
            >
              <EmprestimosPendentes
                new_emprestimos={emprestimosPendentes}
                setRefreshCounter={setRefreshCounter}
                termoPesquisa={pesquisa}
              />
            </div>
            {/* fim tabela de emprestimo pendente */}

            {/* tabela com emprestimo concluido */}
            {!exibirEmprestimosPendentes && (
              <div className={"overflow-y-auto max-h-[248px] tablet:max-h-60"}>
                <EmprestimosConcluidos
                  new_emprestimos={emprestimosConcluidos}
                  salas={salas}
                  termoPesquisa={pesquisa}
                />
                {/* fim tabela com emprestimo concluido */}
              </div>
            )}
            {/* fim tabela de emprestimo concluido */}
          </div>
          {/* fim conteudo central tabela*/}
        </div>
        {/* fim conteudo central tela de empréstimo */}

        {/* logo sigec lateral */}
        <div className="flex justify-start bottom-4 absolute mobile:hidden">
          <img
            className="sm:w-[200px] w-32"
            src="\logo-sigec.svg"
            alt="logo sigec"
          />
        </div>
        {/* fim logo sigec lateral */}
      </div>
      {/* fim parte informativa tela de empréstimo */}
    </div>
  );
}
