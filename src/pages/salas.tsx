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

export interface Sala {
  id: number;
  nome: string;
  bloco: number;
}

export function Salas() {
  const { blocoId } = useParams<{ blocoId: string }>();

  const blocoIdNumber = blocoId ? Number(blocoId) : undefined;

  const blocoNumero = blocoId ? Number(blocoId) : 1;

  const { bloco } = useGetBlocos();

  function nomeBloco(
    idBloco: number | null | undefined,
    blocosMap: Record<number, string>
  ): string {
    return idBloco != null
      ? blocosMap[idBloco]?.toUpperCase() || "BLOCO DESCONHECIDO"
      : "BLOCO DESCONHECIDO";
  }

  const blocosMap = useMemo(
    () =>
      bloco.reduce((map, bloco) => {
        map[bloco.id] = bloco.nome;
        return map;
      }, {} as Record<number, string>),
    [bloco]
  );

  const nomeDoBloco = nomeBloco(blocoIdNumber, blocosMap);

  const { salas } = useGenericGetSalas({ blocoId: blocoIdNumber });
  const [listaSalas, setListaSalas] = useState<Sala[]>([]);
  useEffect(() => {
  if (salas) {
    const salasConvertidas: Sala[] = salas.map((s) => ({
      ...s,
      bloco: Number(s.bloco), 
    }));
    setListaSalas(salasConvertidas);
  }
}, [salas]);

  const itensPorPagina = 5;
  const [paginaAtual, setPaginaAtual] = useState(1);
  const indexInicio = (paginaAtual - 1) * itensPorPagina;
  const indexFim = indexInicio + itensPorPagina;

  const [pesquisa, setPesquisa] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [nome, setNome] = useState("");

  const salasDoBloco = listaSalas.filter((sala) => {
    return Number(sala.bloco) === Number(blocoIdNumber);
  });

  const [isSalaModalOpen, setIsSalaModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [salaSelecionada, setSalaSelecionada] = useState<number | null>(null);
  const [isSuccesModalOpen, setIsSuccesModalOpen] = useState(false);
  const [isPopUpErrorOpen, setIsPopUpErrorOpen] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  console.log("Salas:", salasDoBloco);

  const salasFiltradas = isSearching
    ? salasDoBloco.filter((sala) =>
        sala.nome.toLowerCase().includes(pesquisa.toLowerCase())
      )
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
      setIsEditModalOpen(true);
    }
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
  }

  // função para requisição do método post
  async function adicionarSalaAPI() {
    const novaSala = {
      nome,
      bloco: blocoNumero,
    };
    if (novaSala.nome === null) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    } else {
      try {
        const response = await api.post("/chameco/api/v1/salas/", novaSala);

        if (response) {
          setListaSalas((prevSalas) => [...prevSalas, response.data]);
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

  const { id, nome, bloco} = salaSelecionadaObj;

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
      const response = await api.put(`/chameco/api/v1/salas/${salaSelecionada.id}/`, {
        nome: salaSelecionada.nome,
        bloco: salaSelecionada.bloco,
      });

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

      setListaSalas((prev) =>
        prev.map((s) => (s.id === novaSala.id ? novaSala : s))
      );

      editarSalaAPI(novaSala);
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
            {nomeDoBloco}
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

                          <p className="text-center px-2">
                            Essa ação é{" "}
                            <strong className="font-semibold ">
                              definitiva
                            </strong>{" "}
                            e não pode ser desfeita.{" "}
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
                    {/* <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 sm:flex-1 sm:w-[70%] w-[60%]">
                      Descrição da sala
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {itensAtuais.map((sala) => (
                    <tr
                      key={sala.id}
                      className={`hover:bg-[#d5d8f1] cursor-pointer px-2 ${
                        salaSelecionada === sala.id ? "bg-gray-200" : ""
                      }`}
                      onClick={() => statusSala(sala.id)}
                    >
                      <td className="align-top p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] max-w-[96px] tablet:max-w-[200px] laptop:max-w-[400px] break-words ">
                        {sala.nome}
                      </td>
                      {/* <td className="align-top p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-2/4 max-w-[124px] tablet:max-w-[200px] laptop:max-w-[400px] break-words">
                        {sala.descricao}
                      </td> */}
                    </tr>
                  ))}
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
      {/* fim parte informativa tela salas */}
    </div>
  );
}
