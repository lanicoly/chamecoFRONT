import { Plus, X, TriangleAlert } from "lucide-react";
import { useState, useEffect } from "react";
import { PassadorPagina } from "../components/passadorPagina";
import { Pesquisa } from "../components/pesquisa";
import { BotaoAdicionar } from "../components/botaoAdicionar";
import { MenuTopo } from "../components/menuTopo";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import useGetSalas from "../hooks/salas/useGenericGetSalas";
// import useGenericGetUsuarios from "../hooks/usuarios/useGenericGetUsers";
import useGenericGetChaves from "../hooks/chaves/useGenericGetChaves";
import { PopUpdeSucess } from "../components/popups/PopUpSucess";
import { PopUpdeErro } from "../components/popups/PopUpErro";
import Spinner from "../components/spinner";
import { AxiosError } from "axios";
import useGetBlocos from "../hooks/blocos/useGetBlocos";
import { useMemo } from "react";

export interface IUsuario {
  autorizado_emprestimo: boolean;
  salas: ISala[];
  id: number;
  id_cortex: number;
  nome: string;
  setor: string;
  tipo: string;
  superusuario?: number;
}
export interface IChave {
  id: number;
  sala: number | null;
  nome_sala: string;
  disponivel: boolean;
  usuarios: IUsuario[];
  descricao?: string | null;
}

export interface ISala {
  id: number;
  nome: string;
  bloco?: string | number;
  nome_bloco: string;
  usuarios?: IUsuario[];
}

interface ISalaMap {
  id: number;
  nome: string;
  bloco: number;
  bloco_nome: string;
}

interface IChavesContentProps {
  chaves: IChave[];
  loading: boolean;
  error: boolean;
  refetch: any;
  salasCompletas: ISala[];
}

export function Chaves() {
  // const navigate = useNavigate();

  const { chaves, loading, error, refetch } = useGenericGetChaves();

  // Se o token existe, renderiza o componente principal que usa os hooks
  return (
    <ChavesContent
      chaves={chaves}
      loading={loading}
      error={error}
      refetch={refetch}
    />
  );
}

function ChavesContent({
  chaves,
  loading,
  error,
  refetch,
}: // salasCompletas,
  IChavesContentProps) {
  const navigate = useNavigate();

  const userType = localStorage.getItem("userType");
  const loadingChaves = loading;
  const errorChaves = error;
  const refetchChaves = refetch;
  const { salas, loading: loadingSalas, error: errorSalas } = useGetSalas();
  const [chavesList, setChavesList] = useState<IChave[]>([]);
  const [chaveSelecionada, setChaveSelecionada] = useState<IChave | null>(null);
  const [salaSelecionadaId, setSalaSelecionadaId] = useState<number | null>(
    null
  );
  const [disponivel, setDisponivel] = useState<boolean>(true);
  const [descricao, setDescricao] = useState<string>("");

  const [isChavesModalOpen, setIsChavesModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const [isViewUsersModalOpen, setIsViewUsersModalOpen] = useState(false);
  const [isSuccesModalOpen, setIsSuccesModalOpen] = useState(false);
  const [isPopUpErrorOpen, setIsPopUpErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pesquisa, setPesquisa] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [isDescricaoModalOpen, setIsDescricaoModalOpen] = useState(false);
  const [descricaoSelecionada, setDescricaoSelecionada] = useState<
    string | null
  >(null);
  const itensPorPagina = 5;

  const { bloco } = useGetBlocos();

  const blocosMap = useMemo(
    () =>
      bloco.reduce((map, bloco) => {
        map[bloco.id] = bloco.nome;
        return map;
      }, {} as Record<number, string>),
    [bloco]
  );

  const salasMap: Record<number, ISalaMap> = salas.reduce(
    (salasPorId, sala) => {
      salasPorId[sala.id] = {
        id: sala.id,
        nome: sala.nome,
        bloco: Number(sala.bloco ?? 0),
        bloco_nome: String(sala.bloco),
      };
      return salasPorId;
    },
    {} as Record<number, ISalaMap>
  );

  //   console.log("Salas", salas);
  //   console.log("Chaves:", chaves);

  useEffect(() => {
    if (chaves && Array.isArray(chaves)) {
      setChavesList(chaves);
    }
  }, [chaves]);

  const handleCloseFeedbackModals = () => {
    setTimeout(() => {
      setIsSuccesModalOpen(false);
      setIsPopUpErrorOpen(false);
      setErrorMessage("");
    }, 3000);
  };

  const resetFormsAndCloseModals = () => {
    setSalaSelecionadaId(null);
    setDescricao("");
    setDisponivel(true);
    // setUsuariosAutorizadosIds([]);
    setChaveSelecionada(null);
    setIsChavesModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    // setIsViewUsersModalOpen(false);
    setIsDescricaoModalOpen(false);
    setDescricaoSelecionada(null);
  };

  async function criarChave(e: React.FormEvent) {
    e.preventDefault();
    const currentToken = localStorage.getItem("authToken");
    if (!currentToken) {
      setErrorMessage(
        "Sessão expirada ou token inválido. Faça login novamente."
      );
      setIsPopUpErrorOpen(true);
      handleCloseFeedbackModals();
      navigate("/login");
      return;
    }
    if (salaSelecionadaId === null) {
      setErrorMessage("Selecione uma sala.");
      setIsPopUpErrorOpen(true);
      handleCloseFeedbackModals();
      return;
    }

    const novaChavePayload = {
      sala: salaSelecionadaId,
      disponivel: true,
      // usuarios_autorizados: usuariosAutorizadosIds,
      descricao: descricao || null,
      token: currentToken, // Usar token lido
    };

    setIsLoading(true);
    try {
      await api.post("/chameco/api/v1/chaves/", novaChavePayload, {
        params: { token: currentToken }, // Enviar como param também, se necessário
      });
      setIsSuccesModalOpen(true);
      resetFormsAndCloseModals();
      if (refetchChaves) refetchChaves(true); // Força refresh no hook
      handleCloseFeedbackModals();
    } catch (err: unknown) {
      console.error("Erro ao criar a chave:", err);

      let apiErrorMessage = "Erro desconhecido.";

      if (err && typeof err === "object" && (err as AxiosError).isAxiosError) {
        const axiosError = err as AxiosError;
        const detail = (axiosError.response?.data as any)?.detail;
        apiErrorMessage =
          detail ||
          JSON.stringify(axiosError.response?.data) ||
          axiosError.message;
      } else if (err instanceof Error) {
        apiErrorMessage = err.message;
      }

      setErrorMessage(`Erro ao criar chave: ${apiErrorMessage}`);
      setIsPopUpErrorOpen(true);
      handleCloseFeedbackModals();
    } finally {
      setIsLoading(false);
    }
  }

  async function atualizarChave(e: React.FormEvent) {
    e.preventDefault();
    const currentToken = localStorage.getItem("authToken");
    if (!chaveSelecionada || chaveSelecionada.id === null) {
      setErrorMessage("Nenhuma chave selecionada para atualização.");
      setIsPopUpErrorOpen(true);
      handleCloseFeedbackModals();
      return;
    }
    if (!currentToken) {
      setErrorMessage(
        "Sessão expirada ou token inválido. Faça login novamente."
      );
      setIsPopUpErrorOpen(true);
      handleCloseFeedbackModals();
      navigate("/login");
      return;
    }
    if (salaSelecionadaId === null) {
      setErrorMessage("Selecione uma sala.");
      setIsPopUpErrorOpen(true);
      handleCloseFeedbackModals();
      return;
    }

    const chaveAtualizadaPayload = {
      sala: salaSelecionadaId,
      disponivel: disponivel,
      // usuarios_autorizados: usuariosAutorizadosIds,
      descricao: descricao || null,
      token: currentToken,
    };

    setIsLoading(true);
    try {
      await api.put(
        `/chameco/api/v1/chaves/${chaveSelecionada.id}/`,
        chaveAtualizadaPayload,
        {
          params: { token: currentToken },
        }
      );
      setIsSuccesModalOpen(true);
      resetFormsAndCloseModals();
      if (refetchChaves) refetchChaves(true);
      handleCloseFeedbackModals();
    } catch (err: unknown) {
      let apiErrorMessage = "Erro ao atualizar chave:";

      if (err && typeof err === "object" && (err as AxiosError).isAxiosError) {
        const axiosError = err as AxiosError;
        apiErrorMessage =
          (axiosError.response?.data as any)?.message || apiErrorMessage;
      }

      console.error("Erro ao lista as chaves:", err);
      setErrorMessage(apiErrorMessage);
      setIsPopUpErrorOpen(true);
      handleCloseFeedbackModals();
    } finally {
      setIsLoading(false);
    }
  }

  async function excluirChave(e: React.FormEvent) {
    e.preventDefault();
    const currentToken = localStorage.getItem("authToken");
    if (!chaveSelecionada || chaveSelecionada.id === null) {
      setErrorMessage("Nenhuma chave selecionada para exclusão.");
      setIsPopUpErrorOpen(true);
      handleCloseFeedbackModals();
      return;
    }
    if (!currentToken) {
      setErrorMessage(
        "Sessão expirada ou token inválido. Faça login novamente."
      );
      setIsPopUpErrorOpen(true);
      handleCloseFeedbackModals();
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      await api.delete(`/chameco/api/v1/chaves/${chaveSelecionada.id}/`, {
        params: { token: currentToken }, // DELETE usa token como param
      });
      setIsSuccesModalOpen(true);
      resetFormsAndCloseModals();
      if (refetchChaves) refetchChaves(true);
      handleCloseFeedbackModals();
    } catch (err) {
      console.error("Erro ao excluir a chave:", err);

      let apiErrorMessage = "Erro desconhecido.";

      if (err && typeof err === "object" && (err as AxiosError).isAxiosError) {
        const axiosError = err as AxiosError;
        const detail = (axiosError.response?.data as any)?.detail;
        apiErrorMessage =
          detail ||
          JSON.stringify(axiosError.response?.data) ||
          axiosError.message;
      } else if (err instanceof Error) {
        apiErrorMessage = err.message;
      }

      setErrorMessage(`Erro ao excluir chave: ${apiErrorMessage}`);
      setIsPopUpErrorOpen(true);
      handleCloseFeedbackModals();
    } finally {
      setIsLoading(false);
    }
  }

  // --- Funções Auxiliares

  const handlePesquisa = (valor: string) => {
    setPesquisa(valor);
    setIsSearching(valor !== "");
    setPaginaAtual(1);
  };

  const chavesFiltradas = chavesList.filter((chave) => {
    if (!isSearching) return true;
    const sala: ISala | undefined = salas?.find(
      (s: ISala) => s.id === chave.sala
    );
    const termoPesquisa = pesquisa.toLowerCase();
    // const usuariosNomes =
    //   chave.usuarios?.map((u) => u.nome.toLowerCase()).join(" ") || "";
    const nomeBloco = getNomeBloco(chave.sala).toLowerCase();
    return (
      sala?.nome.toLowerCase().includes(termoPesquisa) ||
      chave.id?.toString().includes(termoPesquisa) ||
      (chave.descricao &&
        chave.descricao.toLowerCase().includes(termoPesquisa)) ||
      // usuariosNomes.includes(termoPesquisa) ||
      nomeBloco.includes(termoPesquisa)
    );
  });

  const totalPaginas = Math.max(
    1,
    Math.ceil(chavesFiltradas.length / itensPorPagina)
  );
  const indexInicio = (paginaAtual - 1) * itensPorPagina;
  const indexFim = indexInicio + itensPorPagina;
  const itensPaginados = chavesFiltradas.slice(indexInicio, indexFim);

  const avancarPagina = () => {
    if (paginaAtual < totalPaginas) {
      setPaginaAtual(paginaAtual + 1);
    }
  };

  const voltarPagina = () => {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1);
    }
  };

  const openChavesModalHandler = () => {
    resetFormsAndCloseModals();
    setIsChavesModalOpen(true);
  };

  const openEditModalHandler = (chave: IChave) => {
    setChaveSelecionada(chave);
    setSalaSelecionadaId(chave.sala);
    setDisponivel(chave.disponivel);
    setDescricao(chave.descricao || "");
    // setUsuariosAutorizadosIds(chave.usuarios?.map((u) => u.id) || []);
    setIsEditModalOpen(true);
  };

  const openDeleteModalHandler = (chave: IChave) => {
    setChaveSelecionada(chave);
    setIsDeleteModalOpen(true);
  };
  const openDescricaoModalHandler = (descricao: string | null | undefined) => {
    setDescricaoSelecionada(descricao || "Nenhuma descrição fornecida.");
    setIsDescricaoModalOpen(true);
  };

  // Mostra erro se algum hook falhar (exceto o erro de token já tratado no componente pai)
  if (errorSalas) {
    navigate("/login");
  }

  // Tratamento específico para erro do hook useGetChaves que não seja falta de token
  if (
    errorChaves &&
    typeof errorChaves === "object" &&
    "message" in errorChaves &&
    (errorChaves as any).message !== "Token não encontrado"
  ) {
    navigate("/login");
  }

  // const allUsuarios = userFilter(usuarioFilter, "todos", 1);

  function getNomeBloco(salaId: number | null | undefined) {
    if (salaId == null) return "—";
    const sala = salasMap[salaId];
    if (!sala) return "BLOCO N/A";
    return blocosMap[sala.bloco] || "BLOCO N/A";
  }

  return (
    <div className="bg-cover flex flex-col items-center min-h-screen justify-center font-montserrat bg-chaves">
      <MenuTopo text="MENU" backRoute="/menu" />
      <div className="relative bg-white w-full max-w-[960px] rounded-3xl px-2 py-2 tablet:py-4 desktop:py-6 m-12 top-8 tablet:top-6 tablet:h-auto min-h-[480px] h-auto">
        <div className="relative flex w-full gap-2 mt-5 justify-center items-center content-center flex-wrap tablet:flex-row mb-[30px]">
          <h1 className="flex justify-center text-3xl text-[#081683] font-semibold">
            CHAVES
          </h1>
        </div>
        <main className="flex flex-col mobile:px-8 py-3 w-auto justify-center gap-3">
          <div className="relative flex flex-wrap justify-between items-center gap-2">
            <div className="h-fit items-center w-full tablet:w-auto">
              <Pesquisa
                pesquisa={pesquisa}
                placeholder="Sala ou Bloco"
                setIsSearching={setIsSearching}
                setPesquisa={handlePesquisa}
              />
            </div>
            <div className="flex items-center w-full justify-end gap-4 tablet:w-auto">
              {userType === "diretor.geral" ? (
                ""
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <BotaoAdicionar
                    text="ADICIONAR CHAVE"
                    onClick={openChavesModalHandler}
                  />
                </div>
              )}
            </div>
          </div>
          {/* Tabela */}
          <div className="overflow-y-auto h-auto max-h-[248px] tablet:max-h-64 desktop:max-h-96">
            <table className="w-full h-full border-separate border-spacing-y-2 bg-white">
              <thead className="bg-white sticky top-0 z-10">
                <tr>
                  <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 p-2 w-[17%]">
                    Sala
                  </th>
                  <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 p-2 w-[17%]">
                    Bloco
                  </th>
                  {/* <th className="text-center text-[10px] sm:text-[12px] font-medium text-sky-900 p-2 w-[20%]">
                    Usuários Autorizados
                  </th> */}
                  <th className="text-center text-[10px] sm:text-[12px] font-medium text-sky-900 p-2 w-[14%]">
                    Status da chave
                  </th>
                  <th className="text-center text-[10px] sm:text-[12px] font-medium text-sky-900 p-2 w-[5%]">
                    Descrição
                  </th>
                  <th className="text-center text-[10px] sm:text-[12px] font-medium text-sky-900 p-2 w-[15%]"></th>
                </tr>
              </thead>
              <tbody>
                {itensPaginados.length > 0 ? (
                  itensPaginados.map((chave) => (
                    <tr
                      key={chave.id}
                      className={`hover:bg-[#d5d8f1] px-2 ${chaveSelecionada?.id === chave.id ? "bg-gray-200" : ""
                        }`}
                    >
                      {/* SALA - USA nome_sala DIRETO DA API */}
                      <td className="align-middle p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[17%] tablet:max-w-[200px] laptop:max-w-[400px] break-words">
                        {chave.nome_sala || "Nome não disponível"}
                      </td>

                      {/* BLOCO - EXTRAIR DO NOME DA SALA */}
                      <td className="align-middle p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[17%] tablet:max-w-[200px] laptop:max-w-[400px] break-words">
                        <div className="flex justify-center items-center">
                          <svg
                            className="size-6 ml-2 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            width="29"
                            height="29"
                            viewBox="0 0 29 29"
                            fill="none"
                          >
                            <path
                              d="M15.2572 2.83333V11H2.42391V4C2.42391 3.69058 2.54683 3.39383 2.76562 3.17504C2.98441 2.95625 3.28116 2.83333 3.59058 2.83333H15.2572ZM17.5906 0.5H3.59058C2.66232 0.5 1.77208 0.868749 1.1157 1.52513C0.459325 2.1815 0.0905762 3.07174 0.0905762 4L0.0905762 13.3333H17.5906V0.5Z"
                              fill="#565D8F"
                            />
                            <path
                              d="M24.5902 2.83333C24.8996 2.83333 25.1964 2.95625 25.4152 3.17504C25.634 3.39383 25.7569 3.69058 25.7569 4V11H22.2569V2.83333H24.5902ZM24.5902 0.5H19.9236V13.3333H28.0902V4C28.0902 3.07174 27.7215 2.1815 27.0651 1.52513C26.4087 0.868749 25.5185 0.5 24.5902 0.5V0.5Z"
                              fill="#565D8F"
                            />
                            <path
                              d="M5.92391 18.0003V26.167H3.59058C3.28116 26.167 2.98441 26.0441 2.76562 25.8253C2.54683 25.6065 2.42391 25.3097 2.42391 25.0003V18.0003H5.92391ZM8.25724 15.667H0.0905762V25.0003C0.0905762 25.9286 0.459325 26.8188 1.1157 27.4752C1.77208 28.1316 2.66232 28.5003 3.59058 28.5003H8.25724V15.667Z"
                              fill="#565D8F"
                            />
                            <path
                              d="M25.7572 18.0003V25.0003C25.7572 25.3097 25.6343 25.6065 25.4155 25.8253C25.1967 26.0441 24.9 26.167 24.5906 26.167H12.9239V18.0003H25.7572ZM28.0906 15.667H10.5906V28.5003H24.5906C25.5188 28.5003 26.4091 28.1316 27.0655 27.4752C27.7218 26.8188 28.0906 25.9286 28.0906 25.0003V15.667Z"
                              fill="#565D8F"
                            />
                          </svg>
                          <p className="text-[#646999] text-center text-[15px] font-semibold leading-normal truncate">
                            {getNomeBloco(chave.sala)}
                          </p>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td
                        className={`align-middle text-center p-2 text-sm text-white font-semibold border-2 border-solid border-[#B8BCE0] w-[14%] tablet:max-w-[200px] laptop:max-w-[400px] break-words ${chave.disponivel ? "bg-[#22b350]" : "bg-red-700"
                          }`}
                      >
                        {chave.disponivel ? "Disponível" : "Indisponível"}
                      </td>

                      {/* DESCRIÇÃO - USA descricao DIRETO DA API */}
                      <td className="align-center pl-2 pr-2 text-center w-[5%]">
                        <button
                          onClick={() =>
                            openDescricaoModalHandler(chave.descricao)
                          }
                          className="bg-[#565D8F] text-white p-1 rounded flex items-center justify-center w-full h-full min-h-[40px]"
                          disabled={isLoading}
                          title={
                            chave.descricao ? "Ver descrição" : "Sem descrição"
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                          </svg>
                        </button>
                      </td>
                      <td className="align-center text-xs text-[#646999] font-semibold w-[15%]">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => openEditModalHandler(chave)}
                            className="flex gap-1 items-center font-medium text-sm text-[#646999] underline disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                          >
                            <img
                              src="/fi-rr-pencil (1).svg"
                              alt="Editar"
                              className="w-4 h-4"
                            />
                            Editar
                          </button>
                          {userType === "diretor.geral" ? (
                            ""
                          ) : (
                            <button
                              onClick={() => openDeleteModalHandler(chave)}
                              className="flex gap-1 items-center font-medium text-sm text-rose-600 underline disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={isLoading}
                            >
                              <X className="w-4 h-4" />
                              Excluir
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center p-4 text-gray-500">
                      {loadingChaves
                        ? (<Spinner />)
                        : "Nenhuma chave encontrada."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Paginação */}
          <div className="mt-4">
            <PassadorPagina
              avancarPagina={avancarPagina}
              voltarPagina={voltarPagina}
              totalPaginas={totalPaginas}
              paginaAtual={paginaAtual}
            />
          </div>
        </main>
        {/* Logo Chameco */}
        <div className="flex justify-start mt-4 sm:hidden">
          <img
            className="sm:w-[200px] w-32"
            src="/logo_lateral.png"
            alt="logo chameco"
          />
        </div>
      </div>
      {/* Modal Adicionar Chave */}
      {isChavesModalOpen && (
        <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
          <form
            onSubmit={criarChave}
            className="container flex flex-col gap-4 w-full p-4 h-auto rounded-[15px] bg-white mx-5 max-w-[450px]"
          >
            <div className="flex justify-between items-center w-full">
              <h3 className="text-[#192160] text-center text-[20px] font-semibold flex-grow">
                ADICIONAR CHAVE
              </h3>
              <button
                onClick={resetFormsAndCloseModals}
                type="button"
                className="p-1 rounded flex-shrink-0"
              >
                <X className="text-[#192160]" />
              </button>
            </div>

            <div className="w-full">
              <label className="text-[#192160] text-sm font-medium mb-1 block">
                Selecione uma sala*
              </label>
              <select
                className="w-full p-2 rounded-[10px] cursor-pointer border border-[#646999] focus:outline-none text-[#777DAA]"
                value={salaSelecionadaId === null ? "" : salaSelecionadaId}
                onChange={(e) =>
                  setSalaSelecionadaId(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                required
              >
                <option value="" disabled>
                  Selecione...
                </option>
                {salas?.map((sala: ISala) => (
                  <option key={sala.id} value={sala.id}>
                    {sala.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <label
                htmlFor="add-descricao"
                className="text-[#192160] text-sm font-medium mb-1 block"
              >
                Descreva os detalhes sobre a chave (opcional)
              </label>
              <textarea
                id="add-descricao"
                className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium"
                placeholder="Detalhes sobre a chave"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

            {/* <div className="w-full" ref={dropdownRef}>
              <label className="text-[#192160] text-sm font-medium mb-1 block">
                Usuários Autorizados
              </label>
              <div className="relative">
                <div className="flex flex-wrap gap-1 p-2 rounded-[10px] border border-[#646999] focus-within:outline-none min-h-[40px]">
                  {usuariosAutorizadosIds.map((id) => {
                    const user: IUsuario | undefined = allUsuarios.find(
                      (u) => u.id === id
                    );
                    return (
                      <div
                        key={id}
                        className="flex items-center bg-[#f0f0f0] rounded-md px-2 py-1 text-[#777DAA] text-xs"
                      >
                        {user?.nome}
                        <button
                          type="button"
                          onClick={() =>
                            setUsuariosAutorizadosIds((prev) =>
                              prev.filter((uid) => uid !== id)
                            )
                          }
                          className="ml-1 text-[#777DAA] hover:text-[#192160] focus:outline-none"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                  <input
                    type="text"
                    className="flex-grow min-w-[50px] outline-none text-[#777DAA] text-xs"
                    placeholder={
                      usuariosAutorizadosIds.length > 0
                        ? ""
                        : "Buscar usuário..."
                    }
                    value={usuarioFilter}
                    onChange={(e) => setUsuarioFilter(e.target.value)}
                    onFocus={() => setShowUserDropdown(true)}
                  />
                </div>

                {showUserDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#646999] rounded-[10px] shadow-lg max-h-32 overflow-y-auto">
                    {allUsuarios
                      .filter(
                        (user) =>
                          !usuariosAutorizadosIds.includes(user.id) &&
                          user.nome
                            .toLowerCase()
                            .includes(usuarioFilter.toLowerCase())
                      )
                      .map((user) => (
                        <div
                          key={user.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer text-[#777DAA] text-xs"
                          onClick={() => {
                            setUsuariosAutorizadosIds((prev) => [
                              ...prev,
                              user.id,
                            ]);
                            setUsuarioFilter("");
                          }}
                        >
                          {user.nome}
                        </div>
                      ))}
                    {allUsuarios.filter(
                      (user) =>
                        !usuariosAutorizadosIds.includes(user.id) &&
                        user.nome
                          .toLowerCase()
                          .includes(usuarioFilter.toLowerCase())
                    ).length === 0 && (
                      <div className="p-2 text-[#777DAA] text-xs">
                        Nenhum usuário encontrado
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div> */}

            <div className="flex justify-center items-center mt-2 w-full">
              <button
                type="submit"
                className="px-4 py-2 border-[3px] rounded-xl font-semibold text-sm flex gap-1 justify-center items-center bg-[#16C34D] text-[#FFF] disabled:opacity-50"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />{" "}
                {isLoading ? "CRIANDO..." : "CRIAR NOVA CHAVE"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Editar Chave */}
      {isEditModalOpen && chaveSelecionada && (
        <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
          <form
            onSubmit={atualizarChave}
            className="container flex flex-col gap-4 w-full p-4 h-auto rounded-[15px] bg-white mx-5 max-w-[450px]"
          >
            {/* ... Conteúdo do modal Editar ... */}
            <div className="flex justify-between items-center w-full">
              <h3 className="text-[#192160] text-center text-[20px] font-semibold flex-grow">
                EDITAR CHAVE
              </h3>
              <button
                onClick={resetFormsAndCloseModals}
                type="button"
                className="p-1 rounded flex-shrink-0"
              >
                <X className="text-[#192160]" />
              </button>
            </div>
            {userType === "diretor.geral" ? (
              ""
            ) : (
              <div className="w-full">
                <label className="text-[#192160] text-sm font-medium mb-1 block">
                  Selecione uma sala*
                </label>
                <select
                  className="w-full p-2 rounded-[10px] cursor-pointer border border-[#646999] focus:outline-none text-[#777DAA]"
                  value={salaSelecionadaId === null ? "" : salaSelecionadaId}
                  onChange={(e) =>
                    setSalaSelecionadaId(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  required
                >
                  <option value="" disabled>
                    Selecione...
                  </option>
                  {salas?.map((sala: ISala) => (
                    <option key={sala.id} value={sala.id}>
                      {sala.nome}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {userType === "diretor.geral" ? (
              ""
            ) : (
              <div className="w-full">
                <label className="text-[#192160] text-sm font-medium mb-1 block">
                  Descrição (opcional)
                </label>
                <textarea
                  className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium"
                  placeholder="Detalhes sobre a chave"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>
            )}

            {/* <div className="w-full" ref={dropdownRef}>
              <label className="text-[#192160] text-sm font-medium mb-1 block">
                Usuários Autorizados*
              </label>
              <div className="relative">
                <div className="flex flex-wrap gap-1 p-2 rounded-[10px] border border-[#646999] focus-within:outline-none min-h-[40px]">
                  {/* serve para retornar os usuários autorizados desta chave */}
            {/* {usuariosAutorizadosIds.map((id) => {
                    const user: IUsuario | undefined = allUsuarios?.find(
                      (u) => u.id === id
                    );

                    if (!user) return null; // evita erro se não encontrar o usuário

                    return (
                      <div
                        key={id}
                        className="flex flex-row items-center bg-[#f0f0f0] rounded-md px-2 py-1 text-[#777DAA] text-xs"
                      >
                        {user?.nome}
                        <button
                          type="button"
                          onClick={() =>
                            setUsuariosAutorizadosIds((prev) =>
                              prev.filter((uid) => uid !== id)
                            )
                          }
                          className="ml-1 text-[#777DAA] hover:text-[#192160] focus:outline-none"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </div>
                    );
                  })}

                  <input
                    type="search"
                    className="flex-grow min-w-[50px] outline-none text-[#777DAA] text-xs"
                    placeholder={
                      usuariosAutorizadosIds.length > 0
                        ? ""
                        : "Buscar usuário..."
                    }
                    value={usuarioFilter}
                    onChange={(e) => setUsuarioFilter(e.target.value)}
                    onFocus={() => setShowUserDropdown(true)}
                  /> */}
            {/* </div>  */}

            {/* {showUserDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#646999] rounded-[10px] shadow-lg max-h-32 overflow-y-auto">
                    {allUsuarios
                      ?.filter(
                        (user: IUsuario) =>
                          !usuariosAutorizadosIds.includes(user.id) &&
                          user.nome
                            .toLowerCase()
                            .includes(usuarioFilter.toLowerCase())
                      )
                      .map((user: IUsuario) => (
                        <div
                          key={user.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer text-[#777DAA] text-xs"
                          onClick={() => {
                            setUsuariosAutorizadosIds((prev) => [
                              ...prev,
                              user.id,
                            ]);
                            setUsuarioFilter("");
                          }}
                        >
                          {user.nome}
                        </div>
                      ))}

                    {allUsuarios?.filter(
                      (user: IUsuario) =>
                        !usuariosAutorizadosIds.includes(user.id) &&
                        user.nome
                          .toLowerCase()
                          .includes(usuarioFilter.toLowerCase())
                    ).length === 0 && (
                      <div className="p-2 text-[#777DAA] text-xs">
                        Nenhum usuário encontrado
                      </div>
                    )}
                  </div>
                )} */}
            {/* </div> */}
            {/* </div> */}

            {/* botão de salvar usuários autorizados */}
            <div className="flex justify-center items-center mt-2 w-full">
              <button
                type="submit"
                className="px-4 py-2 border-[3px] rounded-xl font-semibold text-sm flex gap-1 justify-center items-center bg-[#16C34D] text-[#FFF] disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Modal Excluir Chave */}
      {isDeleteModalOpen && chaveSelecionada && (
        <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
          <form
            onSubmit={excluirChave}
            className="container flex flex-col gap-3 w-full p-4 h-auto rounded-[15px] bg-white mx-5 max-w-[400px] justify-center items-center"
          >
            {/* ... Conteúdo do modal Excluir ... */}
            <div className="flex justify-between items-center w-full">
              <h3 className="text-[#192160] text-center text-[20px] font-semibold flex-grow">
                EXCLUIR CHAVE
              </h3>
              <button
                onClick={resetFormsAndCloseModals}
                type="button"
                className="p-1 rounded flex-shrink-0"
              >
                <X className="text-[#192160]" />
              </button>
            </div>
            <TriangleAlert className="size-16 text-red-700" />
            <p className="text-center px-2">
              Essa ação é <strong className="font-semibold">definitiva</strong>{" "}
              e não pode ser desfeita. Deseja excluir a chave da sala{" "}
              <strong className="font-semibold">
                {salas?.find((s: ISala) => s.id === chaveSelecionada.sala)
                  ?.nome || `ID: ${chaveSelecionada.sala}`}
              </strong>
              ?
            </p>
            <div className="flex justify-center items-center mt-2 w-full gap-3">
              <button
                onClick={resetFormsAndCloseModals}
                type="button"
                className="px-4 py-2 border-[3px] rounded-xl font-semibold text-sm flex gap-1 justify-center items-center bg-slate-500 text-[#FFF] disabled:opacity-50"
                disabled={isLoading}
              >
                CANCELAR
              </button>
              <button
                type="submit"
                className="px-4 py-2 border-[3px] rounded-xl font-semibold text-sm flex gap-1 justify-center items-center bg-red-700 text-[#FFF] disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "EXCLUINDO..." : "EXCLUIR"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* {isViewUsersModalOpen && chaveSelecionada && (
        <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
          <div className="container flex flex-col gap-3 w-full p-4 h-auto rounded-[15px] bg-white mx-5 max-w-[400px]">
            <div className="flex justify-between items-center w-full">
              <h3 className="text-[#192160] text-center text-[20px] font-semibold flex-grow">
                USUÁRIOS AUTORIZADOS
              </h3>
              <button
                onClick={resetFormsAndCloseModals}
                type="button"
                className="p-1 rounded flex-shrink-0"
              >
                <X className="text-[#192160]" />
              </button>
            </div>
            <p className="text-sm text-center text-gray-600">
              Chave da sala:{" "}
              <strong className="font-semibold">
                {salas?.find((s: ISala) => s.id === chaveSelecionada.sala)
                  ?.nome || `ID: ${chaveSelecionada.sala}`}
              </strong>
            </p>
            <div className=" rounded-md bg-[#B8BCE0] p-2 max-h-48 overflow-y-auto">
              {chaveSelecionada.usuarios &&
              chaveSelecionada.usuarios.length > 0 ? (
                chaveSelecionada.usuarios.map((user: IUsuario) => (
                  <p key={user.id} className="text-sm text-[#192160] py-1">
                    - {user.nome}{" "}
                  </p>
                ))
              ) : (
                <p className="text-sm text-center text-gray-700">
                  Nenhum usuário autorizado.
                </p>
              )}
            </div>
            <div className="flex justify-center items-center mt-2 w-full">
              <button
                onClick={resetFormsAndCloseModals}
                type="button"
                className="px-4 py-2 border-[3px] rounded-xl font-semibold text-sm flex gap-1 justify-center items-center bg-slate-500 text-[#FFF]"
              >
                FECHAR
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* Modal Ver Descrição */}
      {isDescricaoModalOpen && (
        <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
          <div className="container flex flex-col gap-4 w-full p-4 h-auto rounded-[15px] bg-white mx-5 max-w-[450px]">
            <div className="flex justify-between items-center w-full">
              <h3 className="text-[#192160] text-center text-[20px] font-semibold flex-grow">
                DESCRIÇÃO DA CHAVE
              </h3>
              <button
                onClick={resetFormsAndCloseModals}
                type="button"
                className="p-1 rounded flex-shrink-0"
              >
                <X className="text-[#192160]" />
              </button>
            </div>
            <div className=" rounded-md bg-[#B8BCE0] p-2">
              {descricaoSelecionada &&
                descricaoSelecionada !== "Nenhuma descrição fornecida." ? (
                <p className="text-sm text-[#192160] py-1 whitespace-pre-wrap break-words">
                  {descricaoSelecionada}
                </p>
              ) : (
                <p className="text-sm text-center text-gray-700">
                  Nenhuma descrição adicionada.
                </p>
              )}
            </div>
            <div className="flex justify-center items-center mt-2 w-full">
              <button
                type="button"
                onClick={resetFormsAndCloseModals}
                className="px-4 py-2 border-[3px] rounded-xl font-semibold text-sm flex gap-1 justify-center items-center bg-gray-300 text-gray-700"
              >
                FECHAR
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modais de Feedback */}
      {isSuccesModalOpen && (
        <PopUpdeSucess text="Operação realizada com sucesso!" />
      )}
      {isPopUpErrorOpen && (
        <PopUpdeErro
          text={errorMessage || "Ops, deu erro! Tente novamente :)"}
        />
      )}
    </div>
  );
}