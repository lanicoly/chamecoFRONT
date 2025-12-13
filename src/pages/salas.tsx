import { Plus, X, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { MenuTopo } from "../components/menuTopo";
import api from "../services/api";
import { PopUpdeSucesso } from "../components/popups/PopUpdeSucesso";
import { PopUpError } from "../components/popups/PopUpError";
import { AxiosError } from "axios";
import { useParams } from "react-router-dom";
import { PassadorPagina } from "../components/passadorPagina";
import { useEffect } from "react";
import { Pesquisa } from "../components/pesquisa";
// import { Blocos } from "../pages/blocos";
import { useMemo } from "react";
import useGenericGetSalas from "../hooks/salas/useGenericGetSalas";
import useGetBlocos from "../hooks/blocos/useGetBlocos";
import { IUsuario } from "./chaves";
import useGenericGetUsuarios from "../hooks/usuarios/useGenericGetUsers";
import { useRef } from "react";
import Spinner from "../components/spinner";

export interface Sala {
  id: number;
  nome: string;
  bloco: number;
  nome_bloco: string;
  usuarios: IUsuario[];
}

export function Salas() {
  const { blocoId, nomeBloco: blocoNome } = useParams<{ blocoId: string, nomeBloco: string }>();

  const blocoIdNumber = blocoId ? Number(blocoId) : undefined;

  const blocoNumero = blocoId ? Number(blocoId) : 1;

  const { bloco } = useGetBlocos();
  const [blocosMap, setBlocosMap] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    if (!bloco?.length) return;
    const m = new Map<number, string>();
    for (const b of bloco) m.set(b.id, b.nome.toUpperCase());
    setBlocosMap(m);
  }, [bloco]);

  function nomeBloco(
    idBloco: number | null | undefined,
    map: Map<number, string>
  ) {
    if (idBloco == null) return "BLOCO DESCONHECIDO";
    return map.get(idBloco) ?? "CARREGANDO...";
  }

  const nomeDoBloco = nomeBloco(blocoIdNumber, blocosMap);


  const { salas, loading } = useGenericGetSalas({ blocoId: blocoIdNumber });
  const [usuariosAutorizadosIds, setUsuariosAutorizadosIds] = useState<
    number[]
  >([]);
  const [listaSalas, setListaSalas] = useState<Sala[]>([]);

  useEffect(() => {
    if (salas && Array.isArray(salas)) {
      const salasConvertidas: Sala[] = salas.map((s) => ({
        ...s,
        bloco: Number(s.bloco),
        nome_bloco: nomeDoBloco,
        usuarios: s.usuarios || [],
      }));
      setListaSalas(salasConvertidas);
    }
  }, [salas, nomeDoBloco]);

  const itensPorPagina = 5;
  const [paginaAtual, setPaginaAtual] = useState(1);
  const indexInicio = (paginaAtual - 1) * itensPorPagina;
  const indexFim = indexInicio + itensPorPagina;

  const [pesquisa, setPesquisa] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [nome, setNome] = useState("");

  const salasDoBloco = listaSalas.filter((sala) => {
    return Number(sala.bloco) === Number(blocoId);
  });

  const [isSalaModalOpen, setIsSalaModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [salaSelecionada, setSalaSelecionada] = useState<number | null>(null);
  const [isSuccesModalOpen, setIsSuccesModalOpen] = useState(false);
  const [isPopUpErrorOpen, setIsPopUpErrorOpen] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  //   console.log("Salas:", salasDoBloco);

  const salasFiltradas = isSearching
    ? salasDoBloco.filter((sala) => {
      const usuariosNomes =
        sala.usuarios?.map((u) => u.nome.toLowerCase()).join(" ") || "";

      return (
        sala.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
        usuariosNomes.includes(pesquisa.toLowerCase())
      );
    })
    : salasDoBloco;

  const totalPaginas = Math.max(
    1,
    Math.ceil(salasFiltradas.length / itensPorPagina)
  );
  const itensAtuais = salasFiltradas.slice(indexInicio, indexFim);

  function openSalaModal() {
    setIsSalaModalOpen(true);
  }

  function closeSalaModal() {
    setNome("");
    setIsSalaModalOpen(false);
  }

  function openEditModal() {
    if (salaSelecionada) {
      setNome(salaAtual?.nome || "");
      setUsuariosAutorizadosIds(salaAtual?.usuarios.map((u) => u.id) || []);
      setIsEditModalOpen(true);
    }
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
    setNome("");
    setUsuariosAutorizadosIds([]);
  }

  const [isViewUsersModalOpen, setIsViewUsersModalOpen] = useState(false);
  const [usuarioFilter, setUsuarioFilter] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const {
    usuarios: allUsuarios,
    // loading: loadingUsuarios,
    // error: errorUsuarios,
  } = useGenericGetUsuarios(usuarioFilter);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // função para requisição do método post
  async function adicionarSalaAPI() {
    const novaSala = {
      nome,
      bloco: blocoNumero,
      usuarios_autorizados: usuariosAutorizadosIds,
    };
    if (novaSala.nome === null) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    } else {
      try {
        const response = await api.post("/chameco/api/v1/salas/", novaSala);

        if (response) {
          const salaCriada: Sala = {
            ...response.data,
            bloco: Number(response.data.bloco),
            nome_bloco: nomeDoBloco,
            usuarios: response.data.usuarios || [],
          };
          setListaSalas((prevSalas) => [...prevSalas, salaCriada]);
          setIsSuccesModalOpen(!isSuccesModalOpen);
          setNome("");
          closeSalaModal();
        }

        setMensagemSucesso("Sala adicionada com sucesso!");
      } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message?: string }>;

        const mensagem =
          axiosError.response?.data?.message || "Erro ao criar sala.";

        console.error(
          "Erro ao criar sala:",
          axiosError.response?.data || axiosError.message
        );

        setMensagemErro(mensagem);
        setIsPopUpErrorOpen(true);
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

  //Adicionando função de excluir sala + função para requisição delete
  async function excluirSalaAPI(id: number, nome: string, bloco: number) {
    try {
      await api.delete(`/chameco/api/v1/salas/${id}/`, {
        data: { nome, bloco },
      });
    } catch (error: unknown) {
      console.error("Erro ao excluir sala:", error);
    }
  }

  function removeSala(e: React.FormEvent) {
    e.preventDefault();

    if (salaSelecionada === null) {
      console.error("Nenhuma sala selecionada para excluir.");
      return;
    }

    const salaSelecionadaObj = salasDoBloco.find(
      (sala) => sala.id === salaSelecionada
    );

    if (!salaSelecionadaObj) {
      console.error("Sala não encontrada.");
      return;
    }

    const { id, nome, bloco } = salaSelecionadaObj;

    setListaSalas((prevSalas) =>
      prevSalas.filter((sala) => sala.id !== salaSelecionada)
    );

    setSalaSelecionada(null);

    excluirSalaAPI(id, nome, Number(bloco)).catch((error) =>
      console.error("Erro ao excluir sala:", error)
    );
    closeDeleteModal();
  }

  // adicionando função de editar informações de uma sala + função para requisição PUT
  async function editarSalaAPI(salaSelecionada: Sala) {
    try {
      const response = await api.put(
        `/chameco/api/v1/salas/${salaSelecionada.id}/`,
        {
          nome: salaSelecionada.nome,
          bloco: salaSelecionada.bloco,
          usuarios_autorizados: usuariosAutorizadosIds,
        }
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error: unknown) {
      console.error("Erro ao editar sala.", error);
    }
  }

  function editaSala(e: React.FormEvent) {
    e.preventDefault();

    if (salaSelecionada !== null) {
      const salaEditada = salasDoBloco.find(
        (sala) => sala.id === salaSelecionada
      );

      if (salaEditada) {
        const novaSala: Sala = {
          ...salaEditada,
          nome: nome || salaEditada.nome,
          bloco: Number(salaEditada.bloco),
        };

        editarSalaAPI(novaSala)
          .then((salaAtualizada) => {
            if (salaAtualizada) {
              const salaConvertida: Sala = {
                ...salaAtualizada,
                bloco: Number(salaAtualizada.bloco),
                nome_bloco: nomeDoBloco,
                usuarios: salaAtualizada.usuarios || [],
              };

              setListaSalas((prev) =>
                prev.map((s) =>
                  s.id === salaConvertida.id ? salaConvertida : s
                )
              );
            }
          })
          .catch((error) => {
            console.error("Erro ao editar sala:", error);
          });
      }

      setSalaSelecionada(null);
      setNome("");
      closeEditModal();
    }
  }

  function statusSala(id: number) {
    if (salaSelecionada !== null) {
      desselecionaSala();
    } else {
      selecionaSala(id);
    }
  }

  function selecionaSala(id: number) {
    setSalaSelecionada(id);
  }

  function desselecionaSala() {
    setSalaSelecionada(null);
  }

  function avancarPagina() {
    if (paginaAtual < totalPaginas) {
      setPaginaAtual(paginaAtual + 1);
    }
  }

  function voltarPagina() {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1);
    }
  }

  const resetFormsAndCloseModals = () => {
    setUsuariosAutorizadosIds([]);
    setIsViewUsersModalOpen(false);
  };

  const openViewUsersModalHandler = (sala: Sala) => {
    setSalaSelecionada(sala.id);
    setIsViewUsersModalOpen(true);
  };

  //Adicionando funcão de abrir e fechar modal de excluir salas
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  function openDeleteModal() {
    if (salaSelecionada !== null) {
      setIsDeleteModalOpen(true);
    }
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  const salaAtual = salaSelecionada
    ? listaSalas.find((s) => s.id === salaSelecionada)
    : null;

  return (
    <div className="flex items-center justify-center bg-tijolos h-screen bg-no-repeat bg-cover">
      {isSuccesModalOpen && <PopUpdeSucesso mensagem={mensagemSucesso} />}
      {isPopUpErrorOpen && <PopUpError mensagem={mensagemErro} />}
      {/* menu topo */}
      <MenuTopo text="VOLTAR" backRoute="/blocos" />
      {/* menu topo */}

      {/* parte informativa tela salas */}
      <div className="relative bg-white w-full max-w-[960px] rounded-3xl px-6  py-2 tablet:py-3 desktop:py-6 m-12 top-8  tablet:top-6 tablet:h-[480px] h-[90%]">
        {/* cabeçalho tela salas */}
        <div className="flex w-full gap-2">
          <h1 className="flex w-full justify-center text-sky-900 text-2xl font-semibold">
            {blocoNome ? blocoNome : "CARREGANDO..."}
          </h1>
        </div>
        {/* fim cabeçalho tela salas */}

        {/* conteudo central tela salas */}
        <div className="flex flex-col mobile:px-8 px-4 py-3 w-auto justify-center gap-3">
          {/* adicionar sala + pesquisa */}
          <div className="flex justify-center items-center min-w-[220px] flex-wrap gap-2 flex-1 mobile:justify-between">
            {/* input de pesquisa */}
            <Pesquisa
              pesquisa={pesquisa}
              placeholder="Sala"
              setIsSearching={setIsSearching}
              setPesquisa={setPesquisa}
            />
            {/* fim input de pesquisa */}

            <button
              onClick={openSalaModal}
              className="px-4 py-1.5 bg-[#18C64F] text-white font-medium flex gap-2 justify-center items-center hover:bg-[#56ab71] rounded-md w-full tablet:w-auto"
            >
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
              ADICIONAR SALA
            </button>

            {/* Adicionando pop up de adicionar salas */}
            {isSalaModalOpen && (
              <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    adicionarSalaAPI();
                  }}
                  className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px]"
                >
                  <div className="flex justify-center mx-auto w-full max-w-[90%]">
                    <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                      ADICIONAR SALA
                    </p>
                    <button
                      onClick={closeSalaModal}
                      type="submit"
                      className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                    >
                      <X className=" mb-[5px] text-[#192160]" />
                    </button>
                  </div>

                  <div className="justify-center items-center ml-[40px] mr-8">
                    <p className="text-[#192160] text-sm font-medium mb-1">
                      Digite o nome da sala
                    </p>

                    <input
                      className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                      type="text"
                      placeholder="Sala"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                    />
                  </div>

                  <div
                    className="justify-center items-center ml-[40px] mr-8"
                    ref={dropdownRef}
                  >
                    <p className="text-[#192160] text-sm font-medium mb-1">
                      Digite os usuários autorizados
                    </p>
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
                      <div className="relative">
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
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center items-center mt-[10px] w-full">
                    <button
                      type="submit"
                      className="px-3 py-2 border-[3px] rounded-xl font-semibold  text-sm flex gap-[4px] justify-center items-center  bg-[#16C34D] text-[#FFF]"
                    >
                      <Plus className="h-10px" /> CRIAR NOVA SALA
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Fim adicionando pop up de adicionar salas */}
          </div>
          {/* fim adicionar sala + pesquisa */}

          {/* conteudo central tabela*/}
          <div>
            {/* botões editar e excluir */}
            <div className="flex gap-4 justify-end my-2">
              <button
                onClick={openEditModal}
                className="flex gap-1 justify-start items-center font-medium text-sm text-[#646999] underline"
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
              {/* Adicionando pop up de editar sala */}
              {isEditModalOpen && (
                <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                  <form
                    onSubmit={editaSala}
                    className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px]"
                  >
                    <div className="flex justify-center mx-auto w-full max-w-[90%]">
                      <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                        EDITAR SALA
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
                        Digite o novo nome da sala
                      </p>

                      <input
                        className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                        type="text"
                        placeholder="Sala"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                      />
                    </div>

                    <div
                      className="justify-center items-center ml-[40px] mr-8"
                      ref={dropdownRef}
                    >
                      <label className="text-[#192160] text-sm font-medium mb-1 block">
                        Usuários Autorizados*
                      </label>
                      <div className="relative">
                        <div className="flex flex-wrap gap-1 p-2 rounded-[10px] border border-[#646999] focus-within:outline-none min-h-[40px]">
                          {/* serve para retornar os usuários autorizados desta chave */}
                          {usuariosAutorizadosIds.map((id) => {
                            const user: IUsuario | undefined =
                              allUsuarios?.find((u) => u.id === id);

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
                          />
                        </div>

                        {showUserDropdown && (
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
                        )}
                      </div>
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

              {/* Fim adicionando pop up de editar sala */}

              <button
                onClick={openDeleteModal}
                className="flex gap-1 justify-start items-center font-medium text-sm text-rose-600 underline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="#e11d48"
                  className="bi bi-x-lg"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                </svg>
                Excluir
              </button>

              {/* Adicionando pop up de deletar bloco */}
              {isDeleteModalOpen && (
                <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                  <form
                    onSubmit={removeSala}
                    className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px] justify-center items-center"
                  >
                    <div className="flex justify-center mx-auto w-full max-w-[90%]">
                      <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] h-max">
                        EXCLUIR SALA
                      </p>
                      <button
                        onClick={closeDeleteModal}
                        type="button"
                        className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                      >
                        <X className=" text-[#192160]" />
                      </button>
                    </div>
                    <TriangleAlert className="size-16 text-red-700" />

                    <p className="text-center font-medium px-2 text-[#192160]">
                      Essa ação é{" "}
                      <strong className="font-semibold ">definitiva</strong> e
                      não pode ser desfeita.{" "}
                      <strong className="font-semibold">
                        Tem certeza disso?
                      </strong>
                    </p>
                    <div className="flex justify-center items-center mt-[10px] w-full gap-3">
                      <button
                        onClick={closeDeleteModal}
                        type="button"
                        className="px-4 py-2 border-[3px] rounded-xl font-semibold  text-sm flex gap-[4px] justify-center items-center  bg-slate-500 text-[#FFF]"
                      >
                        CANCELAR
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border-[3px] rounded-xl font-semibold  text-sm flex gap-[4px] justify-center items-center  bg-red-700 text-[#FFF]"
                      >
                        EXCLUIR
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
            {/* fim botões editar e excluir */}

            {/* tabela com todas as salas */}
            <div className="overflow-y-auto max-h-[248px] tablet:max-h-64 desktop:max-h-96">
              <table className="w-full border-separate border-spacing-y-2 tablet:mb-6 bg-white">
                <thead className="bg-white sticky top-0 z-10">
                  <tr>
                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 min-w-1/4 max-w-24  ">
                      Nome da sala
                    </th>
                    <th className="text-center text-[10px] sm:text-[12px] font-medium text-sky-900 p-2 w-[20%]">
                      Usuários Autorizados
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {itensAtuais.length > 0 ? (
                    itensAtuais.map((sala) => (
                      <tr
                        key={sala.id}
                        className={`hover:bg-[#d5d8f1] cursor-pointer px-2 ${salaSelecionada === sala.id ? "bg-gray-200" : ""
                          }`}
                        onClick={() => statusSala(sala.id)}
                      >
                        <td className="align-top p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] max-w-[96px] tablet:max-w-[200px] laptop:max-w-[400px] break-words ">
                          {sala.nome}
                        </td>
                        <td className="align-center w-[20%] h-full tablet:max-w-[200px] laptop:max-w-[400px] break-words">
                          <button
                            onClick={() => openViewUsersModalHandler(sala)}
                            className="border-1 border-[#B8BCE0] border-solid bg-[#565D8F] w-full h-full min-h-[40px] flex justify-center items-center p-2"
                            // disabled={isLoading}
                            title="Ver usuários autorizados"
                          >
                            <div className="flex justify-center items-center mr-1">
                              <svg
                                className="size-6 ml-2 mr-2"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 36 35"
                                fill="none"
                              >
                                <g clipPath="url(#clip0_1781_438)">
                                  <path
                                    d="M18 14.5833C17.1347 14.5833 16.2888 14.3267 15.5694 13.846C14.8499 13.3653 14.2892 12.682 13.958 11.8826C13.6269 11.0831 13.5403 10.2035 13.7091 9.35481C13.8779 8.50615 14.2946 7.7266 14.9064 7.11474C15.5183 6.50289 16.2978 6.08621 17.1465 5.9174C17.9951 5.74859 18.8748 5.83523 19.6742 6.16636C20.4737 6.49749 21.1569 7.05825 21.6377 7.77771C22.1184 8.49718 22.375 9.34304 22.375 10.2083C22.375 11.3687 21.9141 12.4815 21.0936 13.3019C20.2731 14.1224 19.1603 14.5833 18 14.5833ZM25.2917 20.4167C25.2917 19.2563 24.8307 18.1435 24.0103 17.3231C23.1898 16.5026 22.077 16.0417 20.9167 16.0417H15.0833C13.923 16.0417 12.8102 16.5026 11.9897 17.3231C11.1693 18.1435 10.7083 19.2563 10.7083 20.4167V23.3333H13.625V20.4167C13.625 20.0299 13.7786 19.659 14.0521 19.3855C14.3256 19.112 14.6966 18.9583 15.0833 18.9583H20.9167C21.3034 18.9583 21.6744 19.112 21.9479 19.3855C22.2214 19.659 22.375 20.0299 22.375 20.4167V23.3333H25.2917V20.4167ZM18.0131 34.5115C17.2937 34.5119 16.5992 34.2477 16.0619 33.7692L10.596 29.1667H0.5V4.375C0.5 3.21468 0.960936 2.10188 1.78141 1.28141C2.60188 0.460936 3.71468 0 4.875 0L31.125 0C32.2853 0 33.3981 0.460936 34.2186 1.28141C35.0391 2.10188 35.5 3.21468 35.5 4.375V29.1667H25.506L19.8958 33.8042C19.3761 34.2626 18.7061 34.5142 18.0131 34.5115ZM3.41667 26.25H11.6621L17.9694 31.5656L24.459 26.25H32.5833V4.375C32.5833 3.98823 32.4297 3.61729 32.1562 3.3438C31.8827 3.07031 31.5118 2.91667 31.125 2.91667H4.875C4.48823 2.91667 4.11729 3.07031 3.8438 3.3438C3.57031 3.61729 3.41667 3.98823 3.41667 4.375V26.25Z"
                                    fill="white"
                                  />
                                </g>
                              </svg>
                              <p className="break-words text-xs text-[#FFFF] text-center text-[0.8rem] font-semibold leading-normal truncate">
                                {sala.usuarios?.length || 0} pessoa
                                {(sala.usuarios?.length || 0) !== 1
                                  ? "s"
                                  : ""}{" "}
                                autorizada
                                {(sala.usuarios?.length || 0) !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </button>
                        </td>

                        {isViewUsersModalOpen && salaAtual && (
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

                              <div className="rounded-md bg-[#B8BCE0] p-2 max-h-48 overflow-y-auto">
                                {salaAtual?.usuarios?.length ? (
                                  salaAtual.usuarios.map((user: IUsuario) => (
                                    <p
                                      key={user.id}
                                      className="text-sm text-[#192160] py-1"
                                    >
                                      - {user.nome}
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
                        )}
                      </tr>
                    ))
                  ) :
                    <tr>
                      <td colSpan={5} className="text-center p-4 text-gray-500">
                        {loading
                          ? (<Spinner />)
                          : "Nenhuma sala encontrada."}
                      </td>
                    </tr>

                  }
                </tbody>
              </table>
            </div>
            {/* fim tabela com todas as salas */}

            {/* passador de página */}
            <PassadorPagina
              avancarPagina={avancarPagina}
              voltarPagina={voltarPagina}
              totalPaginas={totalPaginas}
              paginaAtual={paginaAtual}
            />
            {/* fim passador de página */}
          </div>
          {/* fim conteudo central tabela*/}
        </div>
        {/* fim conteudo central tela salas */}

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
      {/* fim parte informativa tela salas */}
    </div>
  );
}
