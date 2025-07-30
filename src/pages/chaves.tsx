import { Plus, X, TriangleAlert } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { PassadorPagina } from "../components/passadorPagina";
import { Pesquisa } from "../components/pesquisa";
import { BotaoAdicionar } from "../components/botaoAdicionar";
import { MenuTopo } from "../components/menuTopo";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import useGetSalas from "../hooks/salas/useGetSalas";
import useGetUsuarios from "../hooks/usuarios/useGetUsers";
import { PopUpdeSucess } from "../components/popups/PopUpSucess";
import { PopUpdeErro } from "../components/popups/PopUpErro";
import Spinner from "../components/spinner";
import { useChaves } from "../context/ChavesContext";
import { AxiosError } from "axios";


export interface IUsuario {
  autorizado_emprestimo: boolean,
  chaves: IChave[];
  id: number,
  id_cortex: number,
  nome: string,
  setor: string,
  tipo: string,
  superusuario?: number
}
export interface IChave {
  id: number;
  sala: number | null;
  disponivel: boolean;
  usuarios: IUsuario[];
  descricao?: string | null;
}

export interface ISala {
  id: number;
  nome: string;
  bloco?: string | number; 
}

interface IChavesContentProps {
  chaves: IChave[];
  loading: boolean;
  error: boolean;
  refetch: any;
}

export function Chaves() {
  const navigate = useNavigate();

  const { chaves, loading, error, refetch } = useChaves();

  
  // Estado para verificar se o token existe antes de prosseguir
  const [hasCheckedToken, setHasCheckedToken] = useState(false);
  const [tokenExists, setTokenExists] = useState(false);

  // Verifica o token na montagem
  useEffect(() => {
    const currentToken = localStorage.getItem("authToken"); 
    if (currentToken) {
      setTokenExists(true);
    } else {
      // Se não houver token, pode redirecionar para login ou mostrar mensagem
      console.error("Token não encontrado no localStorage ao montar o componente Chaves.");
      <BotaoAdicionar text="Voltar para Login" onClick={() => navigate("/login")}/>; 
    }
    setHasCheckedToken(true);
  }, [navigate]);

  useEffect(() => {
    refetch();
  }, [])


  // Se ainda não verificou ou se o token não existe, mostra estado de carregamento/erro
  if (!hasCheckedToken) {
    return <Spinner></Spinner>;
  }

  if (!tokenExists) {
    return (
      <div>
        Erro: Usuário não autenticado. Por favor, faça login novamente.
       <BotaoAdicionar text="Voltar para Login" onClick={() => navigate("/login")}/>; 
      </div>
    );
  }

  // Se o token existe, renderiza o componente principal que usa os hooks
  return <ChavesContent chaves={chaves} loading={loading} error={error} refetch={refetch} />;
}

function ChavesContent({ chaves, loading, error, refetch }: IChavesContentProps) {
  const navigate = useNavigate();

  const userType=localStorage.getItem("userType");
  // const { chaves, loading: loadingChaves, error: errorChaves, refetch: refetchChaves } = useChaves();
  const loadingChaves = loading;
  const errorChaves = error;
  const refetchChaves = refetch;
  const { salas, loading: loadingSalas, error: errorSalas } = useGetSalas();
  const { usuarios: allUsuarios, loading: loadingUsuarios, error: errorUsuarios } = useGetUsuarios(); 
  const [chavesList, setChavesList] = useState<IChave[]>([]);
  const [chaveSelecionada, setChaveSelecionada] = useState<IChave | null>(null);
  const [salaSelecionadaId, setSalaSelecionadaId] = useState<number | null>(null);
  const [disponivel, setDisponivel] = useState<boolean>(true);
  const [descricao, setDescricao] = useState<string>("");
  const [usuariosAutorizadosIds, setUsuariosAutorizadosIds] = useState<number[]>([]);
  const [isChavesModalOpen, setIsChavesModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewUsersModalOpen, setIsViewUsersModalOpen] = useState(false);
  const [isSuccesModalOpen, setIsSuccesModalOpen] = useState(false);
  const [isPopUpErrorOpen, setIsPopUpErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pesquisa, setPesquisa] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [isDescricaoModalOpen, setIsDescricaoModalOpen] = useState(false);
  const [descricaoSelecionada, setDescricaoSelecionada] = useState<string | null>(null);
  const itensPorPagina = 5;
  const [usuarioFilter, setUsuarioFilter] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  console.log("Salas", salas)
  console.log("Chaves:", chaves);
 
  useEffect(() => {
    if (chaves && Array.isArray(chaves)) {
      setChavesList(chaves);
    }

    // refetchChaves();
  }, [chaves]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    }


    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


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
    setUsuariosAutorizadosIds([]);
    setChaveSelecionada(null);
    setIsChavesModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsViewUsersModalOpen(false);
    setIsDescricaoModalOpen(false);
    setDescricaoSelecionada(null);
  };



  async function criarChave(e: React.FormEvent) {
    e.preventDefault();
    const currentToken = localStorage.getItem("authToken"); 
    if (!currentToken) {
      setErrorMessage("Sessão expirada ou token inválido. Faça login novamente.");
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
      usuarios_autorizados: usuariosAutorizadosIds,
      descricao: descricao || null,
      token: currentToken, // Usar token lido
    };

    setIsLoading(true);
    try {
      await api.post("/chameco/api/v1/chaves/", novaChavePayload, {
        params: { token: currentToken } // Enviar como param também, se necessário
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
        apiErrorMessage = detail || JSON.stringify(axiosError.response?.data) || axiosError.message;
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
      setErrorMessage("Sessão expirada ou token inválido. Faça login novamente.");
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
      usuarios_autorizados: usuariosAutorizadosIds,
      descricao: descricao || null,
      token: currentToken,
    };

    setIsLoading(true);
    try {
      await api.put(`/chameco/api/v1/chaves/${chaveSelecionada.id}/`, chaveAtualizadaPayload, {
        params: { token: currentToken }
      });
      setIsSuccesModalOpen(true);
      resetFormsAndCloseModals();
      if (refetchChaves) refetchChaves(true); 
      handleCloseFeedbackModals();
    } catch (err: unknown) {
      // console.error("Erro ao atualizar a chave:", err);
      // const apiErrorMessage = err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message;
      // setErrorMessage(`Erro ao atualizar chave: ${apiErrorMessage}`);
      // setIsPopUpErrorOpen(true);
      // handleCloseFeedbackModals();

      let apiErrorMessage = "Erro ao atualizar chave:";

      if (err && typeof err === "object" && (err as AxiosError).isAxiosError) {
        const axiosError = err as AxiosError;
        apiErrorMessage = (axiosError.response?.data as any)?.message || apiErrorMessage;
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
      setErrorMessage("Sessão expirada ou token inválido. Faça login novamente.");
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
        apiErrorMessage = detail || JSON.stringify(axiosError.response?.data) || axiosError.message;
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
    const sala: ISala | undefined = salas?.find((s:ISala) => s.id === chave.sala);
    const termoPesquisa = pesquisa.toLowerCase();
    const usuariosNomes = chave.usuarios?.map(u => u.nome.toLowerCase()).join(" ") || "";
    return (
      sala?.nome.toLowerCase().includes(termoPesquisa) ||
      chave.id?.toString().includes(termoPesquisa) ||
      (chave.descricao && chave.descricao.toLowerCase().includes(termoPesquisa)) ||
      usuariosNomes.includes(termoPesquisa)
    );
  });

  const totalPaginas = Math.max(1, Math.ceil(chavesFiltradas.length / itensPorPagina));
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
    setUsuariosAutorizadosIds(chave.usuarios?.map(u => u.id) || []); 
    setIsEditModalOpen(true);
  };

  const openDeleteModalHandler = (chave: IChave) => {
    setChaveSelecionada(chave);
    setIsDeleteModalOpen(true);
  };
  
  const openViewUsersModalHandler = (chave: IChave) => {
    setChaveSelecionada(chave);
    setIsViewUsersModalOpen(true);
  };

  const openDescricaoModalHandler = (descricao: string | null | undefined) => {
    setDescricaoSelecionada(descricao || "Nenhuma descrição fornecida.");
    setIsDescricaoModalOpen(true);
  };

  // Mostra carregamento enquanto hooks buscam dados
  if (loadingChaves || loadingSalas || loadingUsuarios) {
    return <Spinner></Spinner>; 
  }

  // Mostra erro se algum hook falhar (exceto o erro de token já tratado no componente pai)
  if (errorSalas || errorUsuarios) {
    navigate("/login");
  }
  
  // Tratamento específico para erro do hook useGetChaves que não seja falta de token
  if (errorChaves && typeof errorChaves === "object" && "message" in errorChaves && (errorChaves as any).message !== "Token não encontrado") {
       navigate("/login");
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
              
              {userType === "admin" ? (""
                
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
                  <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 p-2 w-[17%]">Sala</th>
                  <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 p-2 w-[17%]">Bloco</th>
                  {/*<th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 p-2 w-[7%]">Quantidade</th>*/}
                  <th className="text-center text-[10px] sm:text-[12px] font-medium text-sky-900 p-2 w-[20%]">Usuários Autorizados</th>
                  <th className="text-center text-[10px] sm:text-[12px] font-medium text-sky-900 p-2 w-[14%]">Status da chave</th>
                  <th className="text-center text-[10px] sm:text-[12px] font-medium text-sky-900 p-2 w-[5%]">Descrição</th>
                  <th className="text-center text-[10px] sm:text-[12px] font-medium text-sky-900 p-2 w-[15%]"></th>
                </tr>
              </thead>
              <tbody>
                {itensPaginados.length > 0 ? (
                  itensPaginados.map((chave) => (
                    <tr
                      key={chave.id}
                      className={`hover:bg-[#d5d8f1] px-2 ${chaveSelecionada?.id === chave.id ? "bg-gray-200" : ""}`}
                    >
                      <td className="align-middle p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0]  w-[17%] tablet:max-w-[200px] laptop:max-w-[400px]  break-words">
                        {salas?.find((sala:ISala) => sala.id === chave.sala)?.nome || `ID: ${chave.sala}` || "N/A"}
                      </td>
                      <td className="align-middle p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0]  w-[17%] tablet:max-w-[200px] laptop:max-w-[400px] break-words">
                        <div className="flex justify-center items-center ">
                          <svg className="size-6 ml-2 mr-2  " xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                          <path d="M15.2572 2.83333V11H2.42391V4C2.42391 3.69058 2.54683 3.39383 2.76562 3.17504C2.98441 2.95625 3.28116 2.83333 3.59058 2.83333H15.2572ZM17.5906 0.5H3.59058C2.66232 0.5 1.77208 0.868749 1.1157 1.52513C0.459325 2.1815 0.0905762 3.07174 0.0905762 4L0.0905762 13.3333H17.5906V0.5Z" fill="#565D8F"/>
                          <path d="M24.5902 2.83333C24.8996 2.83333 25.1964 2.95625 25.4152 3.17504C25.634 3.39383 25.7569 3.69058 25.7569 4V11H22.2569V2.83333H24.5902ZM24.5902 0.5H19.9236V13.3333H28.0902V4C28.0902 3.07174 27.7215 2.1815 27.0651 1.52513C26.4087 0.868749 25.5185 0.5 24.5902 0.5V0.5Z" fill="#565D8F"/>
                          <path d="M5.92391 18.0003V26.167H3.59058C3.28116 26.167 2.98441 26.0441 2.76562 25.8253C2.54683 25.6065 2.42391 25.3097 2.42391 25.0003V18.0003H5.92391ZM8.25724 15.667H0.0905762V25.0003C0.0905762 25.9286 0.459325 26.8188 1.1157 27.4752C1.77208 28.1316 2.66232 28.5003 3.59058 28.5003H8.25724V15.667Z" fill="#565D8F"/>
                          <path d="M25.7572 18.0003V25.0003C25.7572 25.3097 25.6343 25.6065 25.4155 25.8253C25.1967 26.0441 24.9 26.167 24.5906 26.167H12.9239V18.0003H25.7572ZM28.0906 15.667H10.5906V28.5003H24.5906C25.5188 28.5003 26.4091 28.1316 27.0655 27.4752C27.7218 26.8188 28.0906 25.9286 28.0906 25.0003V15.667Z" fill="#565D8F"/>
                        </svg>
                        <p className="text-[#646999] text-center  text-[15px] font-semibold leading-normal truncate ">
                          {salas?.find((sala: ISala) => sala.id === chave.sala)?.bloco || "-"}
                        </p>
                        </div>
                      </td>
                    
                      <td className="align-center  w-[20%] h-full tablet:max-w-[200px] laptop:max-w-[400px] break-words  ">
                        <button 
                      onClick={() => openViewUsersModalHandler(chave)}
                      className="border-1 border-[#B8BCE0] border-solid bg-[#565D8F] w-full h-full min-h-[40px] flex justify-center items-center  p-2"
                      disabled={isLoading}
                      title="Ver usuários autorizados">
                        <div className=" flex justify-center items-center mr-1 ">
                          <svg
                            className="size-6 ml-2 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 36 35"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_1781_438)">
                              <path
                                d="M18 14.5833C17.1347 14.5833 16.2888 14.3267 15.5694 13.846C14.8499 13.3653 14.2892 12.682 13.958 11.8826C13.6269 11.0831 13.5403 10.2035 13.7091 9.35481C13.8779 8.50615 14.2946 7.7266 14.9064 7.11474C15.5183 6.50289 16.2978 6.08621 17.1465 5.9174C17.9951 5.74859 18.8748 5.83523 19.6742 6.16636C20.4737 6.49749 21.1569 7.05825 21.6377 7.77771C22.1184 8.49718 22.375 9.34304 22.375 10.2083C22.375 11.3687 21.9141 12.4815 21.0936 13.3019C20.2731 14.1224 19.1603 14.5833 18 14.5833ZM25.2917 20.4167C25.2917 19.2563 24.8307 18.1435 24.0103 17.3231C23.1898 16.5026 22.077 16.0417 20.9167 16.0417H15.0833C13.923 16.0417 12.8102 16.5026 11.9897 17.3231C11.1693 18.1435 10.7083 19.2563 10.7083 20.4167V23.3333H13.625V20.4167C13.625 20.0299 13.7786 19.659 14.0521 19.3855C14.3256 19.112 14.6966 18.9583 15.0833 18.9583H20.9167C21.3034 18.9583 21.6744 19.112 21.9479 19.3855C22.2214 19.659 22.375 20.0299 22.375 20.4167V23.3333H25.2917V20.4167ZM18.0131 34.5115C17.2937 34.5119 16.5992 34.2477 16.0619 33.7692L10.596 29.1667H0.5V4.375C0.5 3.21468 0.960936 2.10188 1.78141 1.28141C2.60188 0.460936 3.71468 0 4.875 0L31.125 0C32.2853 0 33.3981 0.460936 34.2186 1.28141C35.0391 2.10188 35.5 3.21468 35.5 4.375V29.1667H25.506L19.8958 33.8042C19.3761 34.2626 18.7061 34.5142 18.0131 34.5115ZM3.41667 26.25H11.6621L17.9694 31.5656L24.459 26.25H32.5833V4.375C32.5833 3.98823 32.4297 3.61729 32.1562 3.3438C31.8827 3.07031 31.5118 2.91667 31.125 2.91667H4.875C4.48823 2.91667 4.11729 3.07031 3.8438 3.3438C3.57031 3.61729 3.41667 3.98823 3.41667 4.375V26.25Z"
                                fill="white"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_1781_438">
                                <rect
                                  width="35"
                                  height="35"
                                  fill="white"
                                  transform="translate(0.5)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                          <p className=" break-words text-xs text-[#FFFF] text-center  text-[0.8rem] font-semibold leading-normal truncate">
                            Pessoas autorizadas
                          </p>
                        </div>
                        </button>
                      </td>
                      <td className={`align-middle text-center p-2 text-sm text-white font-semibold border-2 border-solid border-[#B8BCE0]  w-[14%] tablet:max-w-[200px] laptop:max-w-[400px]  break-words ${chave.disponivel ? "bg-[#22b350]" : "bg-red-700"}`}>
                        {chave.disponivel ? "Disponível" : "Indisponível"}
                      </td>
                      <td className="align-center  pl-2 pr-2 text-center w-[5%]">
                        <button
                          onClick={() => openDescricaoModalHandler(chave.descricao)}
                          className="bg-[#565D8F] text-white p-1 rounded flex items-center justify-center  w-full h-full min-h-[40px] "
                          disabled={isLoading}
                          title="Ver descrição"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
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
                            <img src="/fi-rr-pencil (1).svg" alt="Editar" className="w-4 h-4" />
                            Editar
                          </button>
                          {userType === "admin" ? (""
                
                          ) : (
                          <button
                            onClick={() => openDeleteModalHandler(chave)}
                            className="flex gap-1 items-center font-medium text-sm text-rose-600 underline disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                          >
                            <X className="w-4 h-4" />
                            Excluir
                          </button>)}
                        </div>
                        
                    </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center p-4 text-gray-500">
                      {loadingChaves ? "Carregando chaves..." : "Nenhuma chave encontrada."}
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
              <h3 className="text-[#192160] text-center text-[20px] font-semibold flex-grow">ADICIONAR CHAVE</h3>
              <button onClick={resetFormsAndCloseModals} type="button" className="p-1 rounded flex-shrink-0">
                <X className="text-[#192160]" />
              </button>
            </div>

            <div className="w-full">
              <label className="text-[#192160] text-sm font-medium mb-1 block">Selecione uma sala*</label>
              <select
                className="w-full p-2 rounded-[10px] cursor-pointer border border-[#646999] focus:outline-none text-[#777DAA]"
                value={salaSelecionadaId === null ? "" : salaSelecionadaId}
                onChange={(e) => setSalaSelecionadaId(e.target.value ? Number(e.target.value) : null)}
                required
              >
                <option value="" disabled>Selecione...</option>
                {salas?.map((sala: ISala) => (
                  <option key={sala.id} value={sala.id}>{sala.nome}</option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <label htmlFor="add-descricao" className="text-[#192160] text-sm font-medium mb-1 block">Descreva os detalhes sobre a chave (opcional)</label>
              <textarea
                id="add-descricao"
                className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium"
                placeholder="Detalhes sobre a chave"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
            
            <div className="w-full" ref={dropdownRef}>
              <label className="text-[#192160] text-sm font-medium mb-1 block">Usuários Autorizados</label>
              <div className="relative">
                <div className="flex flex-wrap gap-1 p-2 rounded-[10px] border border-[#646999] focus-within:outline-none min-h-[40px]">
                  {usuariosAutorizadosIds.map(id => {
                    const user: IUsuario | undefined = allUsuarios.find((u) => u.id === id);
                    return (
                      <div key={id} className="flex items-center bg-[#f0f0f0] rounded-md px-2 py-1 text-[#777DAA] text-xs">
                        {user?.nome}
                        <button
                          type="button"
                          onClick={() => setUsuariosAutorizadosIds(prev => prev.filter(uid => uid !== id))}
                          className="ml-1 text-[#777DAA] hover:text-[#192160] focus:outline-none"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                  <input
                    type="text"
                    className="flex-grow min-w-[50px] outline-none text-[#777DAA] text-xs"
                    placeholder={usuariosAutorizadosIds.length > 0 ? "" : "Buscar usuário..."}
                    value={usuarioFilter}
                    onChange={(e) => setUsuarioFilter(e.target.value)}
                    onFocus={() => setShowUserDropdown(true)}
                  />
                </div>
                
                {showUserDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#646999] rounded-[10px] shadow-lg max-h-32 overflow-y-auto">
                    {allUsuarios
                      .filter((user) => 
                        !usuariosAutorizadosIds.includes(user.id) && 
                        user.nome.toLowerCase().includes(usuarioFilter.toLowerCase())
                      )
                      .map((user) => (
                        <div
                          key={user.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer text-[#777DAA] text-xs"
                          onClick={() => {
                            setUsuariosAutorizadosIds(prev => [...prev, user.id]);
                            setUsuarioFilter('');
                          }}
                        >
                          {user.nome}
                        </div>
                      ))}
                    {allUsuarios.filter((user) => 
                        !usuariosAutorizadosIds.includes(user.id) && 
                        user.nome.toLowerCase().includes(usuarioFilter.toLowerCase())
                      ).length === 0 && (
                      <div className="p-2 text-[#777DAA] text-xs">Nenhum usuário encontrado</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center items-center mt-2 w-full">
              <button
                type="submit"
                className="px-4 py-2 border-[3px] rounded-xl font-semibold text-sm flex gap-1 justify-center items-center bg-[#16C34D] text-[#FFF] disabled:opacity-50"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" /> {isLoading ? "CRIANDO..." : "CRIAR NOVA CHAVE"}
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
              <h3 className="text-[#192160] text-center text-[20px] font-semibold flex-grow">EDITAR CHAVE</h3>
              <button onClick={resetFormsAndCloseModals} type="button" className="p-1 rounded flex-shrink-0">
                <X className="text-[#192160]" />
              </button>
            </div>
            {userType === "admin" ? ("") : (
            <div className="w-full">
              <label className="text-[#192160] text-sm font-medium mb-1 block">Selecione uma sala*</label>
               <select
                className="w-full p-2 rounded-[10px] cursor-pointer border border-[#646999] focus:outline-none text-[#777DAA]"
                value={salaSelecionadaId === null ? "" : salaSelecionadaId}
                onChange={(e) => setSalaSelecionadaId(e.target.value ? Number(e.target.value) : null)}
                required
              >
                <option value="" disabled>Selecione...</option>
                {salas?.map((sala: ISala) => (
                  <option key={sala.id} value={sala.id}>{sala.nome}</option>
                ))}
              </select>
            </div>
            )}
            {userType === "admin" ? ("") : (
            <div className="w-full">
              <label className="text-[#192160] text-sm font-medium mb-1 block">Descrição (opcional)</label>
              <textarea
                className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium"
                placeholder="Detalhes sobre a chave"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
            )}
          
          
            <div className="w-full" ref={dropdownRef}>
              <label className="text-[#192160] text-sm font-medium mb-1 block">Usuários Autorizados</label>
              <div className="relative">
                <div className="flex flex-wrap gap-1 p-2 rounded-[10px] border border-[#646999] focus-within:outline-none min-h-[40px]">
                  {usuariosAutorizadosIds.map(id => {
                    const user: IUsuario | undefined = allUsuarios.find((u) => u.id === id);
                    
                    if (!user) return null; // evita erro se não encontrar o usuário

                    return (
                      <div key={id} className="flex items-center bg-[#f0f0f0] rounded-md px-2 py-1 text-[#777DAA] text-xs">
                        {user?.nome}
                        <button
                          type="button"
                          onClick={() => setUsuariosAutorizadosIds(prev => prev.filter(uid => uid !== id))}
                          className="ml-1 text-[#777DAA] hover:text-[#192160] focus:outline-none"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                  <input
                    type="text"
                    className="flex-grow min-w-[50px] outline-none text-[#777DAA] text-xs"
                    placeholder={usuariosAutorizadosIds.length > 0 ? "" : "Buscar usuário..."}
                    value={usuarioFilter}
                    onChange={(e) => setUsuarioFilter(e.target.value)}
                    onFocus={() => setShowUserDropdown(true)}
                  />
                </div>
                
                {showUserDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#646999] rounded-[10px] shadow-lg max-h-32 overflow-y-auto">
                    {allUsuarios
                      .filter((user: IUsuario) => 
                        !usuariosAutorizadosIds.includes(user.id) && 
                        user.nome.toLowerCase().includes(usuarioFilter.toLowerCase())
                      )
                      .map((user: IUsuario) => (
                        <div
                          key={user.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer text-[#777DAA] text-xs"
                          onClick={() => {
                            setUsuariosAutorizadosIds(prev => [...prev, user.id]);
                            setUsuarioFilter('');
                          }}
                        >
                          {user.nome}
                        </div>
                      ))}
                    {allUsuarios.filter((user: IUsuario) => 
                        !usuariosAutorizadosIds.includes(user.id) && 
                        user.nome.toLowerCase().includes(usuarioFilter.toLowerCase())
                      ).length === 0 && (
                      <div className="p-2 text-[#777DAA] text-xs">Nenhum usuário encontrado</div>
                    )}
                  </div>
                )}
              </div>
            </div>

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
              <h3 className="text-[#192160] text-center text-[20px] font-semibold flex-grow">EXCLUIR CHAVE</h3>
              <button onClick={resetFormsAndCloseModals} type="button" className="p-1 rounded flex-shrink-0">
                <X className="text-[#192160]" />
              </button>
            </div>
            <TriangleAlert className="size-16 text-red-700" />
            <p className="text-center px-2">
              Essa ação é{" "}
              <strong className="font-semibold">definitiva</strong> e não pode ser desfeita.
              Deseja excluir a chave da sala <strong className="font-semibold">{salas?.find((s: ISala) => s.id === chaveSelecionada.sala)?.nome || `ID: ${chaveSelecionada.sala}`}</strong>?
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
      
      {isViewUsersModalOpen && chaveSelecionada && (
         <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
          <div className="container flex flex-col gap-3 w-full p-4 h-auto rounded-[15px] bg-white mx-5 max-w-[400px]">
             
              <div className="flex justify-between items-center w-full">
              <h3 className="text-[#192160] text-center text-[20px] font-semibold flex-grow">USUÁRIOS AUTORIZADOS</h3>
              <button onClick={resetFormsAndCloseModals} type="button" className="p-1 rounded flex-shrink-0">
                <X className="text-[#192160]" />
              </button>
            </div>
            <p className="text-sm text-center text-gray-600">Chave da sala: <strong className="font-semibold">{salas?.find((s: ISala) => s.id === chaveSelecionada.sala)?.nome || `ID: ${chaveSelecionada.sala}`}</strong></p>
            <div className=" rounded-md bg-[#B8BCE0] p-2 max-h-48 overflow-y-auto">
              {chaveSelecionada.usuarios && chaveSelecionada.usuarios.length > 0 ? (
                chaveSelecionada.usuarios.map((user: IUsuario) => (
                  <p key={user.id} className="text-sm text-[#192160] py-1">- {user.nome} </p>
                ))
              ) : (
                <p className="text-sm text-center text-gray-700">Nenhum usuário autorizado.</p>
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
      )}
      
      {/* Modal Ver Descrição */} 
      {isDescricaoModalOpen && (
        <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
          <div className="container flex flex-col gap-4 w-full p-4 h-auto rounded-[15px] bg-white mx-5 max-w-[450px]">
            <div className="flex justify-between items-center w-full">
              <h3 className="text-[#192160] text-center text-[20px] font-semibold flex-grow">DESCRIÇÃO DA CHAVE</h3>
              <button onClick={resetFormsAndCloseModals} type="button" className="p-1 rounded flex-shrink-0">
                <X className="text-[#192160]" />
              </button>
            </div>
           <div className=" rounded-md bg-[#B8BCE0] p-2"> 
             {descricaoSelecionada && descricaoSelecionada !== "Nenhuma descrição fornecida." ? (
                <p className="text-sm text-[#192160] py-1 whitespace-pre-wrap break-words">{descricaoSelecionada}</p>
              ) : (
                <p className="text-sm text-center text-gray-700">Nenhuma descrição adicionada.</p>
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
      {isSuccesModalOpen && <PopUpdeSucess text="Operação realizada com sucesso!" />}
      {isPopUpErrorOpen && <PopUpdeErro text={errorMessage || "Ops, deu erro! Tente novamente :)"} />}
    </div>
  );
}

