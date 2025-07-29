import { LayoutDashboard, X, Plus, TriangleAlert } from "lucide-react";
import { PassadorPagina } from "../components/passadorPagina";
import { Pesquisa } from "../components/pesquisa";
import { MenuTopo } from "../components/menuTopo";
import { BotaoAdicionar } from "../components/botaoAdicionar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { PopUpdeSucesso } from "../components/popups/PopUpdeSucesso";
import { PopUpError } from "../components/popups/PopUpError";
import { AxiosError } from "axios";

export interface Blocos {
  id: number;
  nome: string;
}

export function Blocos() {
  const navigate = useNavigate();

  const [blocos, setBlocos] = useState<Blocos[]>([]);
  const [nome, setNome] = useState("");
  const [isSuccesModalOpen, setIsSuccesModalOpen] = useState(false);
  const [isPopUpErrorOpen, setIsPopUpErrorOpen] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  //Começo da integração
  useEffect(() => {
    obterBlocos();
  }, []);

  //Função para requisição get (obter blocos)
  async function obterBlocos() {
    try {
      const response = await api.get("/chameco/api/v1/blocos/", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = response.data;

        if (data.results && Array.isArray(data.results)) {
          const blocos = (data.results as Blocos[]).map((bloco) => ({
            id: bloco.id,
            nome: bloco.nome,

            // descricao: bloco.descricao,
            // token: bloco.token,
          }));
          console.log("Blocos:", blocos)
          setBlocos(blocos);
        } else {
          setBlocos([]);
        }
      }
    } catch (error) {
      setBlocos([]);
      console.error("Erro ao obter blocos:", error);
    }
  }

  // Adicionando funcionalidade ao botão de blocos + função para requisição do método post
  async function adicionarBloco() {
    const novoBloco = {
      nome,
    };

    if (novoBloco.nome === null) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    } else {
      try {
        const response = await api.post("/chameco/api/v1/blocos/", novoBloco);

        if (response) {
          setBlocos((prevBlocos) => [...prevBlocos, response.data]);
          setIsSuccesModalOpen(!isSuccesModalOpen);
          setNome("");
          closeAdicionarBlocoModal();
        }

        setMensagemSucesso("Bloco adicionado com sucesso!")
      } catch (error) {
        const errorResponse = error as AxiosError<{ message?: string }>;

        const mensagem =
          errorResponse.response?.data?.message || "Erro ao criar bloco.";

        console.error(
          "Erro ao criar bloco:",
          errorResponse.response?.data || errorResponse.message
        );

        setMensagemErro(mensagem);
        setIsPopUpErrorOpen(true); // Abre o pop-up de erro de forma segura
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

  // Adicionando funcionalidade ao botão de paginação
  const itensPorPagina = 12;
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
        (blocos) => blocos.nome.toLowerCase().includes(pesquisa.toLowerCase())
        // blocos.descricao.toLowerCase().includes(pesquisa.toLowerCase())
      )
    : blocos;
  const itensAtuais = blocosFiltrados.slice(indexInicio, indexFim);

  // Adicionando função de abrir e fechar modal do botão de adicionar bloco
  const [isAdicionarBlocoModalOpen, setIsAdicionarBlocoModalOpen] =
    useState(false);

  // const [descricao, setDescricao] = useState("");

  function openAdicionarBlocoModal() {
    setIsAdicionarBlocoModalOpen(true);
  }

  function closeAdicionarBlocoModal() {
    setNome("");
    // setDescricao("");
    setIsAdicionarBlocoModalOpen(false);
  }

  // Adicionando função de abrir e fechar pop up dos blocos a ao j
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

  // Adicionando função de abrir e fechar modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  function openEditModal() {
    if (blocoSelecionado) {
      setNome(blocoSelecionado.nome);
      // setDescricao(blocoSelecionado.descricao);
      setIsEditModalOpen(true);
    }
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
  }

  // adicionando função de editar informações de um bloco + função para requisição PATCH
  async function editarBlocoAPI(blocoSelecionado: Blocos) {
    try {
      const response = await api.put(`/chameco/api/v1/blocos/${blocoSelecionado.id}/`, {
        nome: blocoSelecionado.nome,
      });

      if (response.status === 200) {
        console.log("Bloco editado", response.data)
        return response.data;
      }
    } catch (error: unknown) {
      console.error("Erro ao editar bloco.", error);
    }
  }

  //função de editar bloco
  function editarBloco(e: React.FormEvent) {
    e.preventDefault();

    if (!blocoSelecionado) {
      console.error("Nenhum bloco selecionado.");
      return;
    }

    blocos.forEach((bloco) => {
      if (bloco.id === blocoSelecionado.id) {
        if (nome) {
          bloco.nome = nome;
        }
      }
    });

    editarBlocoAPI(blocoSelecionado);
    setNome("");
    closeEditModal();
  }

  //Adicionando função de excluir bloco + função para requisição delete
  async function excluirBlocoAPI(id: number, nome: string) {
    try {
      const response = await api.delete(`/chameco/api/v1/blocos/${id}/`, {
        data: { nome },
      });

      if (response.status === 200) {
        console.log("Bloco excluido", response.data)
        return response.data;
      }

    } catch (error: unknown) {
      console.error("Erro ao excluir bloco:", error);
    }
  }

  //função para remover bloco
  function removeBloco(e: React.FormEvent) {
    e.preventDefault();

    if (!blocoSelecionado) {
      console.error("Nenhum bloco selecionado para excluir.");
      return;
    }

    try {
      excluirBlocoAPI(blocoSelecionado.id, blocoSelecionado.nome);
      setBlocos((prevBlocos) =>
        prevBlocos.filter((bloco) => bloco.id !== blocoSelecionado.id)
      );
      setBlocoSelecionado(null);
      closeDeleteModal();
    } catch (error) {
      console.error("Erro ao excluir bloco:", error);
    }
  }

  //Adicionando funcão de abrir e fechar modal de excluir blocos
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  function openDeleteModal() {
    if (blocoSelecionado !== null) {
      setIsDeleteModalOpen(true);
    }
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  const handleBlockSelect = (blocoSelecionado: Blocos) => {
    // Navegando para a tela de salas com o bloco selecionado
    navigate(`/salas?bloco=${blocoSelecionado.id}`);
  };

  return (
    <div className="items-center justify-center flex h-screen flex-shrink-0 bg-tijolos">
      {isSuccesModalOpen && <PopUpdeSucesso mensagem={mensagemSucesso}/>}
      {isPopUpErrorOpen && <PopUpError mensagem={mensagemErro} />}
      {/* Adicionando barra de navegação */}
      <MenuTopo text="MENU" backRoute="/menu" />
      {/* Adicionando container */}
      {/* Adicionando container que irá conter as informações sobre os blocos */}
      <div className="relative bg-white w-full max-w-[960px] rounded-3xl px-6  py-2 tablet:py-3 desktop:py-6 m-12 top-8  tablet:top-6 tablet:h-[480px] h-[90%]">
        {/* Adicionando div com botão de voltar ao menu e h1 blocos */}
        <div className="flex flex-col tablet:flex-row justify-center tablet:items-start">
          <h1 className="text-2xl font-semibold mx-auto p-3 text-[#02006C] shadow-gray-800">
            BLOCOS
          </h1>
        </div>
        {/* fim da div de h1 e botão voltar */}

        {/* adicionar bloco + pesquisa */}
        <div className="flex justify-center items-center min-w-[220px] flex-wrap gap-2 flex-1 mobile:justify-between">
          {/* input de pesquisa */}
          <Pesquisa
            pesquisa={pesquisa}
            setIsSearching={setIsSearching}
            setPesquisa={setPesquisa}
          />
          {/* fim input de pesquisa */}

          {/* Adicionando botão de adicionar bloco */}
          <BotaoAdicionar
            text="ADICIONAR BLOCO"
            onClick={openAdicionarBlocoModal}
          />
          {/* fim do botão de adicionar bloco */}

          {/* Adicionando modal de adicionar blocos */}
          {isAdicionarBlocoModalOpen && (
            <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
              {/* inicio do formulario de adicionar bloco */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  adicionarBloco();
                }}
                className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px]"
              >
                {/* div com o paragrafo de adicionar bloco + botão de sair do pop up */}
                <div className="flex justify-center mx-auto w-full max-w-[90%]">
                  <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                    ADICIONAR BLOCO
                  </p>
                  <button
                    onClick={closeAdicionarBlocoModal}
                    type="submit"
                    className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                  >
                    <X className=" mb-[5px] text-[#192160]" />
                  </button>
                </div>
                {/* fim da div com o paragrafo de adicionar bloco + botão de sair do pop up */}

                {/* inicio da div com input de digitar nome do bloco */}
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

                <div className="flex justify-center items-center mt-[10px] w-full">
                  <button
                    type="submit"
                    className="px-3 py-2 border-[3px] rounded-xl font-semibold  text-sm flex gap-[4px] justify-center items-center  bg-[#16C34D] text-[#FFF]"
                  >
                    <Plus className="h-10px" /> CRIAR NOVO BLOCO
                  </button>
                </div>
                {/* fim da div que tera botao de criar novo bloco */}
              </form>
              {/* fim do formulario de adicionar bloco */}
            </div>
            // fim da div que irá conter o modal de adicionar bloco
          )}
        </div>
        {/* fim da div que irá conter barra de pesquisa + botão de adicionar bloco */}

        {/* Adicionando div que irá conter os blocos*/}
        <div className="flex flex-col items-center w-full overflow-y-auto mt-[20px]">
          {/* Adicionando blocos de A-J */}
          <div className="flex flex-wrap justify-center gap-[75px] h-[270px] gap-y-[10px]">
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
                {/* inicio da div com a estrutura do pop up */}
                <div className="container flex flex-col gap-2 w-[90%] max-w-[450px] p-[10px] h-auto max-h-[80vh] overflow-y-auto rounded-[15px] bg-white relative">
                  <p className="text-[#192160] items-start text-[22px] font-semibold p-[10px]">
                    {blocoSelecionado.nome}
                  </p>

                  {/* Botão de fechar pop up */}
                  <button
                    onClick={closeBlocoPopUp}
                    type="button"
                    className="absolute right-2 top-2 p-1"
                  >
                    <X className="text-[#192160]" />
                  </button>
                  {/* fim do botão de fechar pop up */}

                  {/* inicio da div que terá os botoes de ver salas, editar e excluir */}
                  <div className="flex justify-center items-center gap-4 self-stretch ">
                    <button
                      className="flex w-[37%] h-[35px] text-[12px] justify-center items-center gap-[4px] font-medium border-[3px] rounded-lg border-[#B8BCE0] bg-[#0078a7] text-[#FFF] hover:bg-[#4c8399]"
                      onClick={() => handleBlockSelect(blocoSelecionado)}
                    >
                      <svg
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 gap-10"
                      >
                        <mask
                          id="mask0_1465_2729"
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="25"
                          height="24"
                        >
                          <rect x="0.5" width="24" height="24" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_1465_2729)">
                          <path
                            d="M2.5 20V16H6.5V20H2.5ZM8.5 20V16H22.5V20H8.5ZM2.5 14V10H6.5V14H2.5ZM8.5 14V10H22.5V14H8.5ZM2.5 8V4H6.5V8H2.5ZM8.5 8V4H22.5V8H8.5Z"
                            fill="white"
                          />
                        </g>
                      </svg>
                      VER SALAS
                    </button>

                    <button
                      onClick={() => openEditModal()}
                      className="flex gap-1 justify-center items-center font-medium text-sm md:text-base text-[#646999] underline"
                    >
                      <img src="fi-rr-pencil (1).svg" alt="" />
                      Editar
                    </button>

                    {/* Começo do pop up de editar bloco */}
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
                              Digite o novo nome do bloco
                            </p>

                            <input
                              className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                              type="text"
                              placeholder="Bloco"
                              value={nome}
                              onChange={(e) => setNome(e.target.value)}
                            />
                          </div>

                          {/* <div className="justify-center items-center ml-[40px] mr-8">
                            <p className="text-[#192160] text-sm font-medium mb-1 mt-2">
                              Informe a nova descrição do bloco
                            </p>
                            <textarea
                              className="w-full px-2 py-1 rounded-[10px] border border-[#646999] text-[#777DAA] focus:outline-none text-xs font-medium"
                              placeholder="Descrição do detalhamento sobre a sala"
                              value={descricao}
                              onChange={(e) => setDescricao(e.target.value)}
                            />
                          </div> */}

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
                    {/* Fim do pop up de editar bloco */}

                    <button
                      onClick={openDeleteModal}
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

                    {/* Adicionando pop up de deletar bloco */}
                    {isDeleteModalOpen && (
                      <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                        <form
                          onSubmit={removeBloco}
                          className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px] justify-center items-center"
                        >
                          <div className="flex justify-center mx-auto w-full max-w-[90%]">
                            <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] h-max">
                              EXCLUIR BLOCO
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
                  {/* fim da div que terá os botoes de ver salas, editar e excluir */}
                </div>
                {/* fim da div de estrtura do pop up */}
              </div>
            )}
            {/* fim do pop up de blocos */}
          </div>
        </div>
        {/* fim da div que irá conter os blocos*/}

        {/* passador de página */}
        <PassadorPagina
          avancarPagina={avancarPagina}
          voltarPagina={voltarPagina}
          totalPaginas={totalPaginas}
          paginaAtual={paginaAtual}
        />
        {/* fim passador de página */}

        {/* logo chameco lateral */}
        <div className="flex justify-start bottom-2 left-2 absolute sm:hidden ">
          <img
            className="sm:w-[200px] w-32"
            src="\logo_lateral.png"
            alt="logo chameco"
          />
        </div>
        {/* fim logo chameco lateral */}
      </div>
      {/* fim do container com informações dos blocos */}
    </div>
  );
}
