import { CirclePlus, LayoutDashboard, X, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export interface Blocos {
  id: number;
  nome: string;
  descricao: string;
}

//essa interface props serve para eu herdar variáveis e funções do componante pai (que nesse caso é o arquivo app.tsx)

//estou usando essa interface para que eu consiga usar a função criada no "App" em todos os arquivos que eu chamar ela e importar do componente pai, realizando uma breve navegação entre as telas

const url =
  "https://web-rsi1mpmw72mx.up-de-fra1-k8s-1.apps.run-on-seenode.com/chameco/api/v1/blocos/";

export function Blocos() {
  const navigate = useNavigate();

  // Adicionando funcionalidade ao button adicionar bloco
  const [blocos, setBlocos] = useState<Blocos[]>([]);
  const [nextId, setNextId] = useState(11);

  useEffect(() => {
    obterBlocos();
  }, []);

  async function obterBlocos() {
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const statusResponse = response.status;
      const data = response.data;

      if (statusResponse === 200) {
        const blocos = [];

        if ("bloco" in data.results) {
          for (const bloco of data.results) {
            blocos.push({
              nome: bloco.nome,
              id: bloco.id,
              descricao: `Bloco ${bloco.nome}`,
            });
          }
          setBlocos(blocos);
        }
      }
    } catch (error: unknown) {
      setBlocos([]);
      console.error("Erro ao obter blocos:", error);
    }
  }

  function addBlocos(e: React.FormEvent) {
    e.preventDefault();
    const novoBloco: Blocos = {
      id: nextId,
      nome,
      descricao,
    };
    setBlocos([...blocos, novoBloco]);
    setNextId(nextId + 1);
    setNome("");
    setDescricao("");
    closeBlocoModal();
  }

  // Adicionando funcionalidade ao botão de paginação
  const itensPorPagina = 10;
  const [paginaAtual, setPaginaAtual] = useState(1);
  const totalPaginas = Math.max(1, Math.ceil(blocos.length / itensPorPagina));
  const indexInicio = (paginaAtual - 1) * itensPorPagina;
  const indexFim = indexInicio + itensPorPagina;

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

  // Adicionando função na barra de pesquisa
  const [pesquisa, setPesquisa] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const blocosFiltrados = isSearching
    ? blocos.filter(
        (blocos) =>
          blocos.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
          blocos.descricao.toLowerCase().includes(pesquisa.toLowerCase())
      )
    : blocos;
  const itensAtuais = blocosFiltrados.slice(indexInicio, indexFim);

  // Adicionando função de abrir e fechar pop up
  const [isBlocoModalOpen, setIsBlocoModalOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  function openBlocoModal() {
    setIsBlocoModalOpen(true);
  }

  function closeBlocoModal() {
    setNome("");
    setDescricao("");
    setIsBlocoModalOpen(false);
  }

  // Adicionando pop up dos blocos
  const [isBlocoPopUpOpen, setIsBlocoPopUpOpen] = useState(false);
  const [blocoSelecionado, setBlocoSelecionado] = useState<Blocos | null>(null);

  function openBlocoPopUp(blocos: Blocos) {
    setBlocoSelecionado(blocos);
    setIsBlocoPopUpOpen(true);
  }

  function closeBlocoPopUp() {
    setBlocoSelecionado(null);
    setIsBlocoPopUpOpen(false);
  }

  // Adicionando função de editar nome e descrição de bloco
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  function openEditModal() {
    if (blocoSelecionado) {
      setNome(blocoSelecionado.nome);
      setDescricao(blocoSelecionado.descricao);
      setIsEditModalOpen(true);
    }
  }

  function closeEditModal() {
    setBlocoSelecionado(null);
    setIsEditModalOpen(false);
  }

  function editarBloco(e: React.FormEvent) {
    e.preventDefault();
    if (blocoSelecionado !== null) {
      setBlocos(
        blocos.map((bloco) =>
          bloco.id === blocoSelecionado.id
            ? { ...bloco, nome, descricao }
            : bloco
        )
      );
      setBlocoSelecionado(null);
      setNome("");
      setDescricao("");
      closeEditModal();
    }
  }

  //Adicionando função de excluir bloco

  function removeBloco(id: number) {
    setBlocos((blocosAtuais) =>
      blocosAtuais.filter((bloco) => bloco.id !== id)
    );
    closeEditModal();
  }

  return (
    <div className="items-center justify-center flex h-screen flex-shrink-0 bg-tijolos">
      {/* Adicionando barra de navegação */}
      <nav className="flex justify-between px-4 py-2 bg-white fixed top-0 w-full z-10 items-center">
        <button
          onClick={() => navigate("/menu")}
          className="flex gap-2 justify-start items-center font-medium text-lg text-sky-900 w-auto"
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
        <div className="sm:flex hidden justify-start bottom-4">
          <img
            className="w-[150px]"
            src="\logo_lateral.png"
            alt="logo chameco"
          />
        </div>
        {/* fim logo chameco lateral */}

        <div className="flex">
          <button className="flex justify-center items-center gap-1 text-[#565D8F] font-semibold text-base bg-[#B8C1FF] rounded-l-md p-2 h-max w-max">
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

      {/* Adicionando container */}
      <div className="container w-full tablet:w-3/5 p-4 rounded-[25px] mt-[80px] bg-white min-w-[300px] tablet:min-w-[600px] h-auto">
        {/* Adicionando div com botão de voltar ao menu e h1 blocos */}
        <div className="flex flex-col tablet:flex-row justify-center tablet:items-start">
          <h1 className="text-2xl font-semibold mx-auto p-3 text-[#02006C] shadow-gray-800">
            BLOCOS
          </h1>
        </div>

        {/* adicionar sala + pesquisa */}
        <div className="flex justify-center items-center min-w-[220px] flex-wrap gap-2 flex-1 mobile:justify-between">
          {/* input de pesquisa */}
          <div className="h-fit items-center w-full tablet:w-auto">
            <div className="flex justify-between items-center px-2 py-1 border-solid border-[1px] border-slate-500 rounded-md ">
              <input
                type="text"
                value={pesquisa}
                onChange={(e) => {
                  setPesquisa(e.target.value);
                  setIsSearching(e.target.value.trim().length > 0);
                }}
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
          {/* fim input de pesquisa */}

          <button
            onClick={openBlocoModal}
            className="flex  h-[40px] text-[14px] justify-center items-center mt-[5px] font-medium border-2 border-[#B8BCE0] bg-[#18C64F] text-[#FFF] hover:bg-[#56ab71] w-full tablet:w-auto gap-[5px]"
          >
            <CirclePlus className="w-4" /> ADICIONAR BLOCO
          </button>

          {/* Adicionando pop up de adicionar salas */}
          {isBlocoModalOpen && (
            <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
              <form
                onSubmit={addBlocos}
                className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px]"
              >
                <div className="flex justify-center mx-auto w-full max-w-[90%]">
                  <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                    ADICIONAR BLOCO
                  </p>
                  <button
                    onClick={closeBlocoModal}
                    type="button"
                    className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                  >
                    <X className=" mb-[5px] text-[#192160]" />
                  </button>
                </div>

                <div className="justify-center items-center ml-[40px] mr-8">
                  <p className="text-[#192160] text-sm font-medium mb-1">
                    Digite o nome do bloco
                  </p>

                  <input
                    className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                    type="text"
                    placeholder="Bloco"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>

                <div className="justify-center items-center ml-[40px] mr-8">
                  <p className="text-[#192160] text-sm font-medium mb-1 mt-2">
                    Descreva os detalhes sobre o bloco
                  </p>
                  <textarea
                    className="w-full px-2 py-1 rounded-[10px] border border-[#646999] text-[#777DAA] focus:outline-none text-xs font-medium"
                    placeholder="Descrição do detalhamento sobre o bloco"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-center items-center mt-[10px] w-full">
                  <button
                    type="submit"
                    className="px-3 py-2 border-[3px] rounded-xl font-semibold  text-sm flex gap-[4px] justify-center items-center  bg-[#16C34D] text-[#FFF]"
                  >
                    <Plus className="h-10px" /> CRIAR NOVO BLOCO
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Adicionando div que irá conter os blocos*/}
        <div className="flex flex-wrap justify-center items-center w-full overflow-y-auto mt-[20px]">
          {/* Adicionando blocos de A-J */}
          <div className="flex flex-wrap justify-center gap-[75px] h-[330px] gap-y-[10px]">
            {itensAtuais.map((blocos) => (
              <button
                onClick={() => openBlocoPopUp(blocos)}
                className="text-[#646999] text-[12px] font-semibold"
                key={blocos.id}
              >
                <LayoutDashboard className="w-[70px] h-[70px]  text-[#646999] p-[16px] rounded-[15px] bg-[#D9D9D9] mb-2 hover:bg-[#d5d8f1]" />
                {blocos.nome}
              </button>
            ))}

            {/* Adicionando pop up dos blocos */}
            {isBlocoPopUpOpen && blocoSelecionado && (
              <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50">
                <div className="container flex flex-col gap-2 w-[90%] max-w-[450px] p-[10px] h-auto max-h-[80vh] overflow-y-auto rounded-[15px] bg-white relative">
                  <p className="text-[#192160] items-start text-[22px] font-semibold p-[10px]">
                    {blocoSelecionado.nome}
                  </p>

                  <button
                    onClick={closeBlocoPopUp}
                    type="button"
                    className="absolute right-2 top-2 p-1"
                  >
                    <X className="text-[#192160]" />
                  </button>

                  <div className="flex w-full h-auto px-[12px] mb-4 flex-col rounded-lg bg-[#B8BCE0]">
                    <p className="text-[#192160] font-medium pt-[5px]">
                      {blocoSelecionado.descricao}
                    </p>
                  </div>

                  <div className="flex justify-between pt-[20px] px-[10px]">
                    <button
                      className="flex w-[48%] h-[35px] text-[12px] justify-center items-center gap-[5px] font-medium border-[3px] rounded-lg border-[#B8BCE0] bg-[#0078a7] text-[#FFF] hover:bg-[#56ab71]"
                      onClick={() => navigate("/salas")}
                    >
                      VER SALAS
                    </button>

                    <button
                      onClick={() => openEditModal()}
                      className="flex gap-1 justify-center items-center font-medium text-sm text-[#646999] underline"
                    >
                      <img src="fi-rr-pencil (1).svg" alt="" />
                      Editar
                    </button>

                    <button
                      onClick={() => removeBloco(blocoSelecionado.id)}
                      className="flex gap-1 justify-center items-center font-medium text-sm text-rose-600 underline"
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
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Adicionando pop up de editar bloco */}
        {isEditModalOpen && (
          <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
            <form
              onSubmit={editarBloco}
              className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px]"
            >
              <div className="flex justify-center mx-auto w-full max-w-[90%]">
                <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                  EDITAR BLOCO
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
                  placeholder="Bloco"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="justify-center items-center ml-[40px] mr-8">
                <p className="text-[#192160] text-sm font-medium mb-1 mt-2">
                  Informe a nova descrição do bloco
                </p>
                <textarea
                  className="w-full px-2 py-1 rounded-[10px] border border-[#646999] text-[#777DAA] focus:outline-none text-xs font-medium"
                  placeholder="Descrição do detalhamento sobre a sala"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
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

        {/* Adicionando passador de página */}
        <div className="flex justify-end items-center p-[10px] ">
          <button
            onClick={voltarPagina}
            disabled={paginaAtual === 1}
            className="size-[22px] rounded-sm text-white text-sm flex items-center justify-center font-bold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#075985"
              className="bi bi-chevron-left"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
              />
            </svg>
          </button>

          <div className="w-24 gap-1.5 px-2 py-1 flex items-center justify-center">
            <div className="size-[28px] rounded-full bg-[#8d93c9] text-white text-sm flex items-center justify-center font-semibold">
              {paginaAtual}
            </div>
            <div className="text-base text-sky-800 font-semibold">
              de <strong className="font-bold"> {totalPaginas} </strong>
            </div>
          </div>

          <button
            onClick={avancarPagina}
            disabled={paginaAtual === totalPaginas}
            className="size-[22px] rounded-sm text-white text-sm flex items-center justify-center font-bold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#075985"
              className="bi bi-chevron-right"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
