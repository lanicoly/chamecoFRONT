import { Plus, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { MenuTopo } from "../components/menuTopo";
import { DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { FilterableInputResponsaveis } from "../components/inputs/FilterableInputResponsaveis";
import { FilterableInputSolicitantes } from "../components/inputs/FilterableInputSolicitantes";
import { FilterableInputChaves } from "../components/inputs/FilterableInputChaves";
import useGetResponsaveis from "../hooks/usuarios/useGetResponsaveis";
import useGetSalas from "../hooks/salas/useGetSalas";
import useGetUsuarios from "../hooks/usuarios/useGetUsers";
import useGetEmprestimos from "../hooks/emprestimos/useGetEmprestimos";
import api from "../services/api";
import { PopUpdeSucesso } from "../components/popups/PopUpdeSucesso";
import { PopUpError } from "../components/popups/PopUpError";
import { EmprestimosPendentes } from "../components/emprestimoPendente";
import { EmprestimosConcluidos } from "../components/emprestimoConcluido";
import { useChaves } from "../context/ChavesContext";
import { AxiosError } from "axios";

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

  const pesquisa = ""

  const [chaveSelecionadaId, setChaveSelecionadaId] = useState<number | null>(null);
  const [solicitanteSelecionadoId, setSolicitanteSelecionadoId] = useState<number | null>(null);
  const [responsavelSelecionadoId, setResponsavelSelecionadoId] = useState<number | null>(null);
  const [observacao, setObservacao] = useState<string | null>();

  const [onReset, setOnReset] = useState(false);
  const [isSuccesModalOpen, setIsSuccesModalOpen] = useState(false);
  const [isPopUpErrorOpen, setIsPopUpErrorOpen] = useState(false);

  // Esses hooks estão acessando a API 16 vezes, o que não é necessário.
  const { responsaveis } = useGetResponsaveis();
  // const { chaves } = useGetChaves();
  const { salas } = useGetSalas();
  const { usuarios } = useGetUsuarios();
  const {chaves, refetch} = useChaves();

  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  async function criarEmprestimo() {
    const novoEmprestimo: Iemprestimo = {
      chave: chaveSelecionadaId,
      usuario_responsavel: responsavelSelecionadoId,
      usuario_solicitante: solicitanteSelecionadoId,
      observacao: observacao,
    };

    console.log("Dados:", JSON.stringify(novoEmprestimo));

    if (
      novoEmprestimo.chave === null ||
      novoEmprestimo.usuario_responsavel === null ||
      novoEmprestimo.usuario_solicitante === null
    ) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    } else {
      try {
        const response = await api.post("/chameco/api/v1/realizar-emprestimo/", novoEmprestimo);

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

        if (error && typeof error === "object" && (error as AxiosError).isAxiosError) {
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

  const [isObservacaoModalOpen, setIsObservacaoModalOpen] = useState(false);

  function openObservacaoModal() {
    setIsObservacaoModalOpen(true);
  }

  function closeObservacaoModal() {
    setIsObservacaoModalOpen(false);
  }

  // Adicionando função de abrir e fechar modal de editar observacao de um emprestimo
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  function openEditModal() {
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
  }

  const [editarObservacao, setEditarObservacao] = useState("");

  function editarObservacaoCriacao(e: React.FormEvent) {
    e.preventDefault();
    setObservacao(editarObservacao);
    setEditarObservacao("");
    setIsEditModalOpen(false);
  }

  // Deixando o botão de alternar entre empréstimos pendentes e concluídos funcional
  const [exibirEmprestimosPendentes, setExibirEmprestimosPendentes] = useState(true);
  const alternarEmprestimos = () => {
    setExibirEmprestimosPendentes(
      (exibirEmprestimoAtual) => !exibirEmprestimoAtual
    );
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
    refetch()
    console.log("atualizou o context")
  }, [])

  return (
    <div className="flex-col min-h-screen flex items-center justify-center bg-tijolos h-full bg-no-repeat bg-cover">
      {isSuccesModalOpen && <PopUpdeSucesso mensagem={mensagemSucesso}/>}
      {isPopUpErrorOpen && <PopUpError mensagem={mensagemErro}/>}

      <MenuTopo text="MENU" backRoute="/menu" />

      {/* parte informativa tela de empréstimo */}
      <div className="relative bg-white w-full max-w-[80%] rounded-3xl px-6  py-2 tablet:py-3 desktop:py-6 m-12 top-8 tablet:top-10 desktop:top-8">
        {/* cabeçalho tela de empréstimo*/}
        <div className="flex w-full">
          <h1 className="flex w-full justify-center text-sky-900 text-2xl font-semibold">
            EMPRÉSTIMOS
          </h1>

          <button>
            <svg
              width="30"
              height="30"
              viewBox="0 0 38 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="30"
                height="30"
                transform="translate(0.5)"
                fill="white"
              />
              <g clip-path="url(#clip0_2169_2594)">
                <path
                  d="M36.1128 25.0627L32.4671 11.923C31.6886 9.11219 29.9923 6.64257 27.6482 4.90717C25.3041 3.17176 22.4469 2.27029 19.5313 2.34623C16.6157 2.42217 13.8093 3.47116 11.5587 5.32624C9.30811 7.18133 7.74269 9.7359 7.11159 12.5834L4.29182 25.2731C4.15538 25.8878 4.1587 26.5254 4.30156 27.1387C4.44441 27.752 4.72314 28.3254 5.11719 28.8166C5.51123 29.3079 6.01054 29.7043 6.57826 29.9768C7.14599 30.2493 7.76765 30.3908 8.39738 30.391H13.455C13.7768 31.9759 14.6367 33.4007 15.8888 34.4242C17.141 35.4476 18.7085 36.0067 20.3257 36.0067C21.9429 36.0067 23.5104 35.4476 24.7625 34.4242C26.0147 33.4007 26.8745 31.9759 27.1963 30.391H32.0619C32.7098 30.3907 33.349 30.2407 33.9294 29.9528C34.5099 29.6648 35.0159 29.2466 35.4082 28.7309C35.8004 28.2151 36.0682 27.6157 36.1907 26.9795C36.3131 26.3432 36.2869 25.6872 36.1142 25.0627H36.1128ZM20.3257 33.1953C19.4588 33.1917 18.6141 32.9204 17.9073 32.4184C17.2006 31.9164 16.6661 31.2083 16.3772 30.391H24.2742C23.9852 31.2083 23.4508 31.9164 22.744 32.4184C22.0372 32.9204 21.1926 33.1917 20.3257 33.1953ZM33.1766 27.0328C33.0458 27.2062 32.8762 27.3466 32.6814 27.4428C32.4867 27.539 32.2721 27.5882 32.0549 27.5866H8.39738C8.18742 27.5866 7.98015 27.5394 7.79087 27.4486C7.60158 27.3577 7.43512 27.2255 7.30376 27.0617C7.1724 26.8979 7.07951 26.7067 7.03193 26.5022C6.98435 26.2977 6.9833 26.0852 7.02886 25.8802L9.84863 13.1905C10.3455 10.9558 11.5751 8.9512 13.3421 7.49552C15.109 6.03985 17.3119 5.2166 19.6004 5.15665C21.889 5.0967 24.1319 5.80348 25.9727 7.16464C27.8134 8.5258 29.1463 10.4632 29.7595 12.6689L33.4052 25.8087C33.4647 26.0165 33.475 26.2352 33.4353 26.4477C33.3957 26.6602 33.3071 26.8605 33.1766 27.0328Z"
                  fill="#C6191A"
                />
              </g>
              <defs>
                <clipPath id="clip0_2169_2594">
                  <rect
                    width="33.6522"
                    height="33.6522"
                    fill="white"
                    transform="translate(3.5 2.34766)"
                  />
                </clipPath>
              </defs>
            </svg>
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
                    <td className="text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[20%]">
                      <FilterableInputChaves
                        onSelectItem={(idSelecionado) => {
                          setChaveSelecionadaId(Number(idSelecionado) || null);
                        }}
                        reset={onReset}
                      />
                    </td>
                    <td className="text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[20%]">
                      <FilterableInputSolicitantes
                        items={usuarios}
                        onSelectItem={(idSelecionado) => {
                          setSolicitanteSelecionadoId(idSelecionado);
                        }}
                        reset={onReset}
                      />
                    </td>
                    <td className="text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[15%]">
                      <FilterableInputResponsaveis
                        items={responsaveis}
                        onSelectItem={(idSelecionado) => {
                          setResponsavelSelecionadoId(idSelecionado);
                        }}
                        reset={onReset}
                      />
                    </td>

                    <td
                      onClick={openObservacaoModal}
                      className="border-2 border-[#B8BCE0] border-solid bg-primary-blue  p-0.5 font-semibold break-words cursor-pointer"
                    >
                      <div className=" flex justify-center items-center mr-1 gap-2">
                        <Plus color="white" size={18} />
                        <p className=" text-sm text-[#FFFF] text-center font-semibold leading-normal truncate">
                          OBSERVAÇÃO
                        </p>
                      </div>
                    </td>
                    <td
                      onClick={() => criarEmprestimo()}
                      className="border-2 border-[#B8BCE0] border-solid bg-primary-green  p-0.5 font-semibold break-words cursor-pointer"
                    >
                      <div className=" flex justify-center items-center mr-1 gap-2">
                        <Plus color="white" size={18} />
                        <p className=" text-sm text-[#FFFF] text-center font-semibold leading-normal truncate">
                          CRIAR EMPRÉSTIMO
                        </p>
                      </div>
                    </td>

                    {/* Adicionando pop up de observação do empréstimo */}
                    {isObservacaoModalOpen && (
                      //  && emprestimo.id === emprestimoSelecionado)
                      <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                        <form className="container flex flex-col gap-2 w-full px-4 py-4 h-auto rounded-[15px] bg-white mx-5 max-w-[500px]">
                          <div className="flex justify-center w-full ">
                            <p className="text-[#192160] text-center text-[20px] font-semibold w-[85%]">
                              OBSERVAÇÃO DO EMPRÉSTIMO
                            </p>
                            <button
                              onClick={closeObservacaoModal}
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
                            </button>

                            {/* Começo do pop up de editar emprestimo */}
                            {isEditModalOpen && (
                              <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                                <form
                                  // onSubmit={editarObservacao}
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
                                      type="button"
                                      onClick={editarObservacaoCriacao}
                                      className="px-3 py-2 border-[3px] rounded-xl font-semibold  text-sm flex gap-[4px] justify-center items-center  bg-[#16C34D] text-[#FFF]"
                                    >
                                      SALVAR ALTERAÇÕES
                                    </button>
                                  </div>
                                </form>
                              </div>
                            )}
                            {/* Fim do pop up de editar emprestimo */}
                          </div>
                        </form>
                      </div>
                    )}

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
                  className="flex w-[280px] h-[30px] p-3 justify-center items-center gap-2 rounded-[12px] bg-[#B8C1FF]  mt-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 28 29"
                    fill="none"
                  >
                    <mask
                      id="mask0_2194_4255"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="28"
                      height="29"
                    >
                      <rect y="0.5" width="28" height="28" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_2194_4255)">
                      <path
                        d="M14.0582 23.8334C11.4526 23.8334 9.23595 22.9292 7.40817 21.1209C5.58039 19.3126 4.6665 17.1056 4.6665 14.5001V14.2959L2.79984 16.1626L1.1665 14.5292L5.83317 9.86258L10.4998 14.5292L8.8665 16.1626L6.99984 14.2959V14.5001C6.99984 16.4445 7.68525 18.0973 9.05609 19.4584C10.4269 20.8195 12.0943 21.5001 14.0582 21.5001C14.5637 21.5001 15.0596 21.4417 15.5457 21.3251C16.0318 21.2084 16.5082 21.0334 16.9748 20.8001L18.7248 22.5501C17.9859 22.9779 17.2276 23.2987 16.4498 23.5126C15.6721 23.7265 14.8748 23.8334 14.0582 23.8334ZM22.1665 19.1376L17.4998 14.4709L19.1332 12.8376L20.9998 14.7042V14.5001C20.9998 12.5556 20.3144 10.9029 18.9436 9.54175C17.5728 8.18064 15.9054 7.50008 13.9415 7.50008C13.4359 7.50008 12.9401 7.55841 12.454 7.67508C11.9679 7.79175 11.4915 7.96675 11.0248 8.20008L9.27484 6.45008C10.0137 6.0223 10.7721 5.70147 11.5498 5.48758C12.3276 5.27369 13.1248 5.16675 13.9415 5.16675C16.5471 5.16675 18.7637 6.07091 20.5915 7.87925C22.4193 9.68758 23.3332 11.8945 23.3332 14.5001V14.7042L25.1998 12.8376L26.8332 14.4709L22.1665 19.1376Z"
                        fill="#565D8F"
                      />
                    </g>
                  </svg>
                  <p className="items-center text-[#565D8F] text-[15px] font-semibold">
                    Ver empréstimos{" "}
                    {exibirEmprestimosPendentes ? "concluídos" : "pendentes"}
                  </p>
                </button>
              </div>
            </div>

            {/* tabela com emprestimo pendente */}
            <div
              className={`overflow-y-auto max-h-[248px] tablet:max-h-64 desktop:max-h-96 ${
                exibirEmprestimosPendentes ? "block" : "hidden"
              }`}
            >
              <EmprestimosPendentes
                new_emprestimos={emprestimosPendentes}
                salas={salas}
                chaves={chaves}
                solicitantes={usuarios}
                responsaveis={usuarios}
                dataRetirada=""
                horario_emprestimo=""
                observacao={observacao ?? null}
                pesquisa={pesquisa}
                refreshCounter={refreshCounter}
                setRefreshCounter={setRefreshCounter}
              />
            </div>
            {/* fim tabela de emprestimo pendente */}

            {/* tabela com emprestimo concluido */}
            {!exibirEmprestimosPendentes && (
              <div
                className={
                  "overflow-y-auto max-h-[248px] tablet:max-h-64 desktop:max-h-96"
                }
              >
                <EmprestimosConcluidos
                  new_emprestimos={emprestimosConcluidos}
                  salas={salas}
                  chaves={chaves}
                  responsaveis={usuarios}
                  solicitantes={usuarios}
                  observacao={observacao ?? null}
                  dataRetirada=""
                  horario_emprestimo=""
                  dataDevolucao=""
                  horario_devolucao=""
                  pesquisa={pesquisa}
                />
                {/* fim tabela com emprestimo concluido */}
              </div>
            )}
            {/* fim tabela de emprestimo concluido */}
          </div>
          {/* fim conteudo central tabela*/}
        </div>
        {/* fim conteudo central tela de empréstimo */}

        {/* logo chameco lateral */}
        <div className="flex justify-start bottom-4 absolute sm:hidden">
          <img
            className="sm:w-[200px] w-32"
            src="\logo_lateral.png"
            alt="logo chameco"
          />
        </div>
        {/* fim logo chameco lateral */}
      </div>
      {/* fim parte informativa tela de empréstimo */}
    </div>
  );
}
