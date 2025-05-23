import { ChevronRight, Plus, X, TriangleAlert } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PassadorPagina } from "../components/passadorPagina";
import { Pesquisa } from "../components/pesquisa";
import { BotaoAdicionar } from "../components/botaoAdicionar";
import axios from "axios";
import { MenuTopo } from "../components/menuTopo";
import api from "../services/api";

export interface Chaves {
  id: number;
  sala: number;
  disponivel: boolean;
  token: string;
  usuarios: number[];
}

interface Sala {
  id: number;
  nome: string;
}

export function Chaves() {
  const navigate = useNavigate();
  useEffect(() => {
    obterChaves();
  }, []);

  //integracao

  const API_URL =
    "https://chamecoapi.pythonanywhere.com/chameco/api/v1/chaves/";
  const token =
    "b0cc46ac70bed2584a425bfb318d2aa96cc0bd1d3d205a1947188c31493aaf2d";

  const [chaves, setChaves] = useState<Chaves[]>([]);
  const [nextId, setNextId] = useState(1);
  const [selectedSala, setSelectedSala] = useState<number | null>(null);
  const [chaveSelecionada, setChaveSelecionada] = useState<Chaves | null>(null);

  //Funcao para a requisicao GET
  async function obterChaves() {
    try {
      const response = await api.get(`${API_URL}?token=${token}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const statusResponse = response.status;
      const data = response.data;

      if (statusResponse === 200) {
                
        const chaves = [];

        if (Array.isArray(data.results)) {
          for (const chave of data.results) {
            chaves.push({
              sala: chave.sala,
              id: chave.id,
              disponivel: chave.disponivel,
              usuarios: chave.usuarios || [],
              token: chave.token,
            });
          }
          setChaves(chaves);
          setItensAtuais(response.data.results);
        }
      }
    } catch (error: unknown) {
      console.error("Erro ao obter chaves:", error);
      setChaves([]);
    }
  }

  //Adicionando integracao entre chaves locais e api (POST)
  async function adicionarChaveAPI(novaChave: Chaves) {
    try {
      const response = await api.post(
        `${API_URL}?token=${token}`,
        novaChave,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Atualiza a lista de chaves após adicionar e mostra na tela
      obterChaves();
    } catch (error: unknown) {
      console.error("Erro ao adicionar chave:", error);
    }
  }

  function addChaves(e: React.FormEvent) {
    e.preventDefault();

    const novaChave: Chaves = {
      sala: Number(selectedSala),
      disponivel: true,
      usuarios: [],
      token: token,
      id: nextId,
    };

    // Adiciona a chave à API
    adicionarChaveAPI(novaChave);

    // Atualiza o estado local
    setChaves([...chaves, novaChave]);
    setItensAtuais([...listaChaves, novaChave]);
    setNextId(nextId + 1);

    // Reseta os campos
    setSelectedSala(null);
    closeChavesModal();
    closeUserModal();
  }

  // Função para realizar a requisição PATCH
  async function atualizarChaveAPI(chaveAtualizada: Chaves) {
    try {
      const response = await api.put(
        `${API_URL}${chaveAtualizada.id}/`,
        {
          sala: chaveAtualizada.sala,                         
          disponivel: chaveAtualizada.disponivel,             
          usuarios_autorizados: chaveAtualizada.usuarios,      
          token: token                                         
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: unknown) {
      console.error("Erro ao atualizar chave na API:", error);
    }
  }
  
  

  //Função para realizar a requisicao DELETE

  async function excluirChaveAPI(
    chaveId: number,
    sala: number,
    disponivel: boolean,
    usuarios: number[]
  ) {
    try {
      const response = await api.delete(
        `${API_URL}${chaveId}/`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          data: {
            sala,
            disponivel,
            usuarios_autorizados: usuarios,
            token,
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        ""      }
    } catch (error: unknown) {
      console.error("Erro ao excluir chave:", error);
    }
  }

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChavesModalOpen, setIsChavesModalOpen] = useState(false);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const salas: Sala[] = [
    { id: 1, nome: "Sala 101" },
    { id: 2, nome: "Sala 202" },
    { id: 3, nome: "Sala E09" },
    { id: 4, nome: "Sala E10" },
    { id: 5, nome: "Sala E11" },
    { id: 6, nome: "Sala E12" },
  ];

  const [listaChaves, setItensAtuais] = useState<Chaves[]>([]);

  const [isSearching, setIsSearching] = useState(false);
  const [pesquisa, setPesquisa] = useState("");

  const chavesFiltradas = isSearching
    ? listaChaves.filter(
        (chave) => chave.sala.toString().includes(pesquisa) //||
        //chave.blocos.toLowerCase().includes(pesquisa.toLowerCase())
        //chave.qntd.toString().toLowerCase().includes(pesquisa.toLowerCase())
      )
    : listaChaves;

  // Adicionando funcionalidade ao passador de página
  const itensPorPagina = 4;
  const [paginaAtual, setPaginaAtual] = useState(1);
  const totalPaginas = Math.max(
    1,
    Math.ceil(listaChaves.length / itensPorPagina)
  );
  const indexInicio = (paginaAtual - 1) * itensPorPagina;
  const indexFim = indexInicio + itensPorPagina;

  const itensAtuais = chavesFiltradas.slice(indexInicio, indexFim);

  // adicionando modal de excluir chave
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  function statusSelecao(id: number) {
    const chave = listaChaves.find((chave) => chave.id === id) || null;
    setChaveSelecionada(chave);
  }

  function openChavesModal() {
    setIsChavesModalOpen(true);
  }

  /* function openDescricaoModal() {
    setIsDescricaoModalOpen(true);
  }
  function closeDescricaoModal() {
    setDescricao("");
    setIsDescricaoModalOpen(false);
  }*/

  function openEditModal() {
    const chave = listaChaves.find(
      (chave) => chave.id === chaveSelecionada?.id
    );
    if (chave) {
      setSelectedSala(chave.sala);
      setIsEditModalOpen(true);
    }
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
  }

  function editarChave(e: React.FormEvent) {
    e.preventDefault();
  
    if (chaveSelecionada !== null) {
      const chaveAtualizada: Chaves = {
        ...chaveSelecionada,
        sala: selectedSala as number, 
        disponivel: chaveSelecionada.disponivel, 
        usuarios: chaveSelecionada.usuarios, 
      };
  
      // Chama a função de requisição para atualizar a chave na API
      atualizarChaveAPI(chaveAtualizada);
  
      // Atualizando estado local após a atualização na API
      setChaves((prevChaves) =>
        prevChaves.map((chave) =>
          chave.id === chaveSelecionada.id ? chaveAtualizada : chave
        )
      );
  
      setItensAtuais((prevLista) =>
        prevLista.map((chave) =>
          chave.id === chaveSelecionada.id ? chaveAtualizada : chave
        )
      );
  
      // Resetando os campos e fechando o modal
      setChaveSelecionada(null);
      setSelectedSala(0);
      closeEditModal();
    }
  }
  
  
  //  function adicionarUsuarios(chaveId: number, novoUsuario: string) {
  //    setItensAtuais((prevLista) => {
  //     return prevLista.map((chave) => {
  //        if (chave.id === chaveId) {
  //          return {
  //            ...chave,
  //            usuarios: [...chave.usuarios, novoUsuario],
  //          };
  //        }
  //        return chave;
  //      });
  //    });
  //  }

  function openUserModal(chave: Chaves) {
    setChaveSelecionada(chave);
    setIsUserModalOpen(true);
  }

  function closeUserModal() {
    setIsUserModalOpen(false);
    setChaveSelecionada(null);
  }

  function closeChavesModal() {
    setSelectedSala(0);
    setIsChavesModalOpen(false);
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

  function openDeleteModal() {
    if (chaveSelecionada !== null) {
      setIsDeleteModalOpen(true);
    }
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  // adicionando função de excluir chave
  function removeChave(e: React.FormEvent) {
    e.preventDefault();

    if (chaveSelecionada) {
      excluirChaveAPI(
        chaveSelecionada.id,
        chaveSelecionada.sala,
        chaveSelecionada.disponivel,
        chaveSelecionada.usuarios
      )
        .then(() => {
          setItensAtuais((prevLista) =>
            prevLista.filter((chave) => chave.id !== chaveSelecionada.id)
          );
          setChaveSelecionada(null);
          closeDeleteModal();
        })
        .catch((error) => {
          console.error("Erro ao excluir a chave:", error);
        });
    }
  }

  // const [error, setError] = useState<string>("");
  // {
  //   /*garantir que qntd seja um número */
  // }
  // function handleQntdChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   const value = e.target.value;

  //   {
  //     /* Verifica se o valor é um número*/
  //   }
  //   if (!/^\d*$/.test(value)) {
  //     setError("Por favor, insira apenas números.");
  //   } else {
  //     setError("");
  //     setQntd(Number(value));
  //   }
  // }

  return (
    <div className="bg-cover flex flex-col items-center min-h-screen justify-center font-montserrat bg-chaves">
      {/* background */}
      <MenuTopo text="MENU" backRoute="/menu" />
      {/* container */}
      <div className="relative bg-white w-full max-w-[960px] rounded-3xl px-2 py-2 tablet:py-4 desktop:py-6 m-12 top-8 tablet:top-6 tablet:h-[480px] h-[90%]">
        {/* título chaves */}
        <div className="relative flex w-full gap-2 mt-5 justify-center items-center content-center flex-wrap tablet:flex-row mb-[30px]">
          <h1 className="flex justify-center text-3xl text-[#081683] font-semibold">
            CHAVES
          </h1>
          {/* Adicionando botão de status */}
          <div
            onClick={() => navigate("/statusChaves")}
            className="absolute right-0 top-0 flex items-center gap-2 mb-[15px] text-[#02006C] font-medium mt-[35px] tablet:mb-0"
          >
            <span className="font-semibold text-[20px]">STATUS DE CHAVE</span>
            <button onClick={() => navigate("/statusChaves")}>
              <ChevronRight className="w-[25px] h-[25px] tablet:w-[35px] tablet:h-[35px]" />
            </button>
          </div>
        </div>

        <main className="flex flex-col mobile:px-8  py-3 w-auto justify-center gap-3">
          {/* inputs + botão */}
          <div className="relative flex flex-wrap justify-between items-center gap-2">
            {/* Filtros de busca */}
            <div className="h-fit items-center w-full tablet:w-auto">
              {/* input de pesquisa */}
              <Pesquisa
                pesquisa={pesquisa}
                setIsSearching={setIsSearching}
                setPesquisa={setPesquisa}
              />
            </div>

            {/* botão de + chaves */}
            <div className="flex items-center w-full gap-10 tablet:w-auto">
              <button
                onClick={openDeleteModal}
                className="flex gap-1 items-center font-medium text-sm text-rose-600 underline"
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
              {isDeleteModalOpen && (
                <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                  <form
                    onSubmit={removeChave}
                    className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px] justify-center items-center"
                  >
                    <div className="flex justify-center mx-auto w-full max-w-[90%]">
                      <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] h-max">
                        EXCLUIR CHAVE
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
              {/* Fim adicionando pop up de deletar cahve */}

              <BotaoAdicionar
                text="ADICIONAR CHAVE"
                onClick={openChavesModal}
              />

              {/* Adicionando pop up de adicionar chaves */}
              {isChavesModalOpen && (
                <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                  <form
                    onSubmit={addChaves}
                    className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px]"
                  >
                    <div className="flex justify-center mx-auto w-full max-w-[90%]">
                      <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                        ADICIONAR CHAVE
                      </p>
                      <button
                        onClick={closeChavesModal}
                        type="button"
                        className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                      >
                        <X className=" mb-[5px] text-[#192160]" />
                      </button>
                    </div>

                    <div className="justify-center items-center ml-[40px] mr-8">
                      <p className="text-[#192160] text-sm font-medium mb-1 mt-2">
                        Selecione uma sala
                      </p>
                      <select
                        className="w-full p-2 rounded-[10px] cursor-pointer border border-[#646999] focus:outline-none text-[#777DAA]"
                        value={selectedSala === null ? "" : selectedSala}
                        onChange={(e) => {
                          setSelectedSala(Number(e.target.value));
                        }}
                      >
                        <option
                          className="text-[#777DAA] text-xs font-medium"
                          value=""
                          disabled
                        >
                          Selecione uma sala
                        </option>
                        {salas.map((sala) => (
                          <option
                            key={sala.id}
                            value={sala.id}
                            className="text-center bg-[#B8BCE0]"
                          >
                            {sala.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* 
                    <div className="justify-center items-center ml-[40px] mr-8">
                      <p className="text-[#192160] text-sm font-medium mb-1 mt-2">
                        Selecione um bloco
                      </p>
                      <select
                        className="w-full p-2 rounded-[10px] cursor-pointer border border-[#646999] focus:outline-none text-[#777DAA] "
                        value={selectedBloco}
                        onChange={(e) => setSelectedBloco(e.target.value)}
                        required
                      >
                        <option
                          className="text-[#777DAA] text-xs font-medium"
                          value=""
                          disabled
                        >
                          Selecione um Bloco
                        </option>
                        {blocos.map((bloco, index) => (
                          <option
                            key={index}
                            value={bloco}
                            className="text-center bg-[#B8BCE0]"
                          >
                            {bloco}
                          </option>
                        ))}
                      </select>
                    </div> */}

                    {/* <div className="justify-center items-center ml-[40px] mr-8">
                      <p className="text-[#192160] text-sm font-medium mb-1">
                        Informe a quantidade de chaves
                      </p>

                      <input
                        className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                        type="text"
                        placeholder="Quantidade de chaves"
                        value={qntd}
                        min="0"
                        step="1"
                        onChange={handleQntdChange}
                        required
                      />
                      {/* Exibe a mensagem de erro se houver um erro */}
                    {/* {error && (
                        <p className="text-red-500 text-xs mt-1">{error}</p>
                      )}
                    </div> */}

                    {/*<div className="justify-center items-center ml-[40px] mr-8">
                      <p className="text-[#192160] text-sm font-medium mb-1">
                        Descreva os detalhes sobre a chave
                      </p>
                      <textarea
                        className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                        placeholder="Descrição do detalhamento sobre a chave"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        required
                      />
                    </div>*/}

                    <div className="flex justify-center items-center mt-[10px] w-full">
                      <button
                        type="submit"
                        className="px-3 py-2 border-[3px] rounded-xl font-semibold  text-sm flex gap-[4px] justify-center items-center  bg-[#16C34D] text-[#FFF]"
                      >
                        <Plus className="h-10px" /> CRIAR NOVA CHAVE
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/*lista de chaves */}
          <div className="overflow-y-auto h-auto max-h-[248px] tablet:max-h-64 desktop:max-h-96">
            <table className="w-auto h-auto border-separate border-spacing-y-2 tablet:mb-6 bg-white">
              <thead className="bg-white sticky top-0 z-10">
                <tr>
                  <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900  w-[25%]">
                    Salas
                  </th>
                  <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 flex-1 w-[25%]">
                    Blocos
                  </th>
                  <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 flex-1 w-[10%]">
                    Quantidade
                  </th>
                  <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 flex-1 w-[20%]">
                    Lista de pessoas autorizadas
                  </th>
                  <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[10%]">
                    Disponível
                  </th>
                </tr>
              </thead>
              <tbody>
                {itensAtuais.map((chaves) => (
                  <tr
                    key={chaves.id}
                    className={`hover:bg-[#d5d8f1] cursor-pointer px-2 ${
                      chaveSelecionada && chaveSelecionada.id === chaves.id
                        ? "bg-gray-200"
                        : ""
                    }`}
                    onClick={() => statusSelecao(chaves.id)}
                  >
                    <td className="align-center p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[20%] ">
                      <p className="text-[#646999] text-center  text-[15px] font-semibold leading-normal">
                        {salas.find((sala) => sala.id === chaves.sala)?.nome ||
                          "Sala não encontrada"}
                      </p>
                    </td>
                    <td className="align-center p-0.5 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[20%] tablet:max-w-[200px] laptop:max-w-[400px] break-words ">
                      <div className=" flex justify-center items-center">
                        <img
                          className="size-6 ml-2 mr-2"
                          src="/bloco-chave.svg"
                          alt="icon bloco"
                        />
                        <p className="text-[#646999] text-center  text-[15px] font-semibold leading-normal truncate">
                          {/*chaves.blocos*/}
                        </p>
                      </div>
                    </td>
                    <td className="align-center p-0.5 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[20%] tablet:max-w-[200px] laptop:max-w-[400px] break-words ">
                      <div className="flex justify-center items-center ">
                        <svg
                          className="size-6 ml-2 mr-2  "
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="29"
                          viewBox="0 0 30 29"
                          fill="none"
                        >
                          <g clip-path="url(#clip0_1757_570)">
                            <path
                              d="M27.0832 -0.000473685H24.4587C23.9824 -0.00183001 23.5107 0.0913538 23.0707 0.273676C22.6308 0.455998 22.2314 0.723832 21.8958 1.06165L11.7929 11.1633C9.85869 10.6643 7.81403 10.815 5.9739 11.5923C4.13376 12.3695 2.60021 13.7302 1.60948 15.4648C0.618743 17.1994 0.225778 19.2116 0.491112 21.1914C0.756446 23.1713 1.66536 25.009 3.07785 26.4215C4.49035 27.834 6.32806 28.7429 8.30792 29.0082C10.2878 29.2736 12.3 28.8806 14.0345 27.8899C15.7691 26.8991 17.1298 25.3656 17.9071 23.5254C18.6844 21.6853 18.8351 19.6407 18.336 17.7064L19.8332 16.2093V13.2912H23.4582V9.66619H26.3751L28.4377 7.60357C28.7754 7.26757 29.0431 6.86796 29.2254 6.42785C29.4077 5.98774 29.501 5.51586 29.4998 5.03948V2.41619C29.4998 1.77525 29.2452 1.16056 28.792 0.707352C28.3388 0.254139 27.7241 -0.000473685 27.0832 -0.000473685ZM27.0832 5.03948C27.0833 5.19836 27.0521 5.35569 26.9913 5.50249C26.9306 5.64929 26.8415 5.78266 26.7291 5.89498L25.3746 7.24953H21.0415V10.8745H17.4165V15.2064L15.5496 17.0733C15.9748 17.9686 16.1995 18.9459 16.2082 19.937C16.2082 21.2514 15.8184 22.5363 15.0881 23.6292C14.3579 24.7222 13.3199 25.574 12.1056 26.077C10.8912 26.58 9.55495 26.7116 8.26579 26.4552C6.97662 26.1987 5.79245 25.5658 4.86301 24.6363C3.93357 23.7069 3.30062 22.5227 3.04419 21.2336C2.78776 19.9444 2.91937 18.6081 3.42237 17.3938C3.92538 16.1794 4.77719 15.1415 5.87009 14.4112C6.963 13.681 8.2479 13.2912 9.56232 13.2912C10.5602 13.226 11.5554 13.4545 12.4249 13.9485L23.6044 2.77023C23.8316 2.54462 24.1384 2.41744 24.4587 2.41619H27.0832V5.03948ZM6.54149 21.7495C6.54149 21.9885 6.61236 22.2221 6.74513 22.4208C6.8779 22.6195 7.06662 22.7744 7.28741 22.8659C7.50821 22.9573 7.75116 22.9813 7.98556 22.9346C8.21995 22.888 8.43526 22.7729 8.60424 22.6039C8.77323 22.435 8.88831 22.2197 8.93494 21.9853C8.98156 21.7509 8.95763 21.5079 8.86618 21.2871C8.77472 21.0663 8.61985 20.8776 8.42114 20.7448C8.22243 20.6121 7.98881 20.5412 7.74982 20.5412C7.42935 20.5412 7.12201 20.6685 6.8954 20.8951C6.6688 21.1217 6.54149 21.4291 6.54149 21.7495Z"
                              fill="#565D8F"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_1757_570">
                              <rect
                                width="29"
                                height="29"
                                fill="white"
                                transform="translate(0.5)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        <p className="text-[#646999] text-center  text-[15px] font-semibold leading-normal truncate">
                          1
                        </p>
                      </div>
                    </td>
                    <button className="border-2 border-[#B8BCE0] border-solid bg-[#081683] ">
                      <td className="align-center p-0.5 font-semibold  w-[40%] tablet:max-w-[200px] laptop:max-w-[400px] break-words ">
                        <div className=" flex justify-center items-center mr-1">
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
                          <p className=" text-xs text-[#FFFF] text-center  text-[15px] font-semibold leading-normal truncate">
                            Pessoas autorizadas
                          </p>
                        </div>
                      </td>
                    </button>
                    <td
                      className={` text-center p-2 text-sm text-white font-semibold border-2 border-solid border-[#B8BCE0]  break-words min-w-8 w-20 ${
                        chaves.disponivel === true
                          ? "bg-[#22b350]"
                          : "bg-red-700"
                      }`}
                    >
                      {chaves.disponivel}
                    </td>

                    <td className="align-center p-0.5 tablet:max-w-[200px] laptop:max-w-[400px] break-words">
                      <div className="flex w-[96px] h-[20px] pr-[2px] justify-center items-start gap-[2px] flex-shrink-0">
                        <svg
                          className="size-4 ml-1 mr-0"
                          xmlns="http://www.w3.org/2000/svg"
                          width="19"
                          height="19"
                          viewBox="0 0 19 18"
                          fill="none"
                        >
                          <g clip-path="url(#clip0_1781_442)">
                            <path
                              d="M9.5 0C7.71997 0 5.97991 0.527841 4.49987 1.51677C3.01983 2.50571 1.86628 3.91131 1.18509 5.55585C0.5039 7.20038 0.32567 9.00998 0.672937 10.7558C1.0202 12.5016 1.87737 14.1053 3.13604 15.364C4.39472 16.6226 5.99836 17.4798 7.74419 17.8271C9.49002 18.1743 11.2996 17.9961 12.9442 17.3149C14.5887 16.6337 15.9943 15.4802 16.9832 14.0001C17.9722 12.5201 18.5 10.78 18.5 9C18.4974 6.61384 17.5484 4.32616 15.8611 2.63889C14.1738 0.951621 11.8862 0.00258081 9.5 0V0ZM9.5 16.5C8.01664 16.5 6.5666 16.0601 5.33323 15.236C4.09986 14.4119 3.13856 13.2406 2.57091 11.8701C2.00325 10.4997 1.85473 8.99168 2.14411 7.53682C2.4335 6.08197 3.14781 4.74559 4.1967 3.6967C5.2456 2.64781 6.58197 1.9335 8.03683 1.64411C9.49168 1.35472 10.9997 1.50325 12.3701 2.0709C13.7406 2.63856 14.9119 3.59985 15.736 4.83322C16.5601 6.06659 17 7.51664 17 9C16.9978 10.9885 16.2069 12.8948 14.8009 14.3009C13.3948 15.7069 11.4885 16.4978 9.5 16.5Z"
                              fill="#646999"
                            />
                            <path
                              d="M9.5 7.5H8.75C8.55109 7.5 8.36032 7.57902 8.21967 7.71967C8.07902 7.86032 8 8.05109 8 8.25C8 8.44891 8.07902 8.63968 8.21967 8.78033C8.36032 8.92098 8.55109 9 8.75 9H9.5V13.5C9.5 13.6989 9.57901 13.8897 9.71967 14.0303C9.86032 14.171 10.0511 14.25 10.25 14.25C10.4489 14.25 10.6397 14.171 10.7803 14.0303C10.921 13.8897 11 13.6989 11 13.5V9C11 8.60218 10.842 8.22064 10.5607 7.93934C10.2794 7.65804 9.89782 7.5 9.5 7.5Z"
                              fill="#646999"
                            />
                            <path
                              d="M9.5 6C10.1213 6 10.625 5.49632 10.625 4.875C10.625 4.25368 10.1213 3.75 9.5 3.75C8.87868 3.75 8.375 4.25368 8.375 4.875C8.375 5.49632 8.87868 6 9.5 6Z"
                              fill="#646999"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_1781_442">
                              <rect
                                width="18"
                                height="18"
                                fill="white"
                                transform="translate(0.5)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        <p
                          //onClick={openDescricaoModal}
                          className="text-[#646999] font-montserrat text-[11px] font-medium underline"
                        >
                          Ver mais
                        </p>
                      </div>
                      <button
                        onClick={() => openEditModal()}
                        className="ml-3 flex gap-1 justify-center items-center font-medium text-sm text-[#646999] underline"
                      >
                        <img src="fi-rr-pencil (1).svg" alt="" />
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/*editar modal */}
          {isEditModalOpen && (
            <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
              <form
                onSubmit={editarChave}
                className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px]"
              >
                <div className="flex justify-center mx-auto w-full max-w-[90%]">
                  <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                    EDITAR CHAVE
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
                  <p className="text-[#192160] text-sm font-medium mb-1 mt-2">
                    Selecione uma sala
                  </p>
                  <select
                    className="w-full p-2 rounded-[10px] cursor-pointer border border-[#646999] focus:outline-none text-[#777DAA]"
                    value={selectedSala === null ? "" : selectedSala}
                    onChange={(e) => {
                      setSelectedSala(Number(e.target.value));
                    }}
                  >
                    <option
                      className="text-[#777DAA] text-xs font-medium"
                      value=""
                      disabled
                    >
                      Selecione uma sala
                    </option>
                    {salas.map((sala) => (
                      <option
                        key={sala.id}
                        value={sala.id}
                        className="text-center bg-[#B8BCE0]"
                      >
                        {sala.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* <div className="justify-center items-center ml-[40px] mr-8">
                      <p className="text-[#192160] text-sm font-medium mb-1 mt-2">
                        Selecione um bloco
                      </p>
                      <select
                        className="w-full p-2 rounded-[10px] cursor-pointer border border-[#646999] focus:outline-none text-[#777DAA] "
                        value={selectedBloco}
                        onChange={(e) => setSelectedBloco(e.target.value)}
                        required
                      >
                        <option
                          className="text-[#777DAA] text-xs font-medium"
                          value=""
                          disabled
                        >
                          Selecione um Bloco
                        </option>
                        {blocos.map((bloco, index) => (
                          <option
                            key={index}
                            value={bloco}
                            className="text-center bg-[#B8BCE0]"
                          >
                            {bloco}
                          </option>
                        ))}
                      </select>
                    </div> */}

                {/* <div className="justify-center items-center ml-[40px] mr-8">
                      <p className="text-[#192160] text-sm font-medium mb-1">
                        Informe a quantidade de chaves
                      </p>

                      <input
                        className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                        type="text"
                        placeholder="Quantidade de chaves"
                        value={qntd}
                        min="0"
                        step="1"
                        onChange={handleQntdChange}
                        required
                      />
                      {/* Exibe a mensagem de erro se houver um erro */}
                {/* {error && (
                        <p className="text-red-500 text-xs mt-1">{error}</p>
                      )}
                    </div> 
                    <div className="justify-center items-center ml-[40px] mr-8">
                      <p className="text-[#192160] text-sm font-medium mb-1">
                        Descreva os detalhes sobre a chave
                      </p>
                      <textarea
                        className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                        placeholder="Descrição do detalhamento sobre a chave"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        required
                      />
                    </div>*/}
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

          {/*fim modal editar chave 
          {isDescricaoModalOpen && chaveSelecionada && (
            <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
              <div className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px]">
                <div className="flex justify-center mx-auto w-full max-w-[90%]">
                  <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                    Descrição sobre chaves
                  </p>
                  <button
                    onClick={closeDescricaoModal}
                    type="button"
                    className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                  >
                    <X className=" mb-[5px] text-[#192160]" />
                  </button>
                </div>
                <div className=" rounded-[10px] bg-[#B8BCE0] p-4">
                  <div
                    key={chaveSelecionada.id}
                    className="rounded-[10px] bg-[#B8BCE0] p-4"
                  >
                    <p className="text-[#192160] text-center text-[20px] font-semibold ml-[10px] w-[85%]">
                      {chaveSelecionada.descricao}{" "}
                      
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}*/}
        </main>

        

        {/* Logo Chameco lateral */}
        <div className="flex justify-start mt-2 sm:hidden">
          <img
            className="sm:w-[200px] w-32"
            src="\logo_lateral.png"
            alt="logo chameco"
          />
        </div>
        <div className="mt-2">
          <PassadorPagina
            avancarPagina={avancarPagina}
            voltarPagina={voltarPagina}
            totalPaginas={totalPaginas}
            paginaAtual={paginaAtual}
          />
        </div>
        {/* Fim passador de página */}
      </div>
    </div>
  );
}
