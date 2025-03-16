import { Plus, TriangleAlert, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BotaoAdicionar } from "../elementosVisuais/botaoAdicionar";
import { MenuTopo } from "../elementosVisuais/menuTopo";
import { PassadorPagina } from "../elementosVisuais/passadorPagina";
import { Pesquisa } from "../elementosVisuais/pesquisa";

export interface Sala {
  id: number;
  nome: string;
  descricao: string;
}

//essa interface props serve para eu herdar variáveis e funções do componante pai (que nesse caso é o arquivo app.tsx)

//estou usando essa interface para que eu consiga usar a função criada no "App" em todos os arquivos que eu chamar ela e importar do componente pai, realizando uma breve navegação entre as telas

export function Salas() {
  const navigate = useNavigate();

  const [listaSalas, setListaSalas] = useState<Sala[]>([]);
  const itensPorPagina = 5;
  const [paginaAtual, setPaginaAtual] = useState(1);
  const totalPaginas = Math.max(
    1,
    Math.ceil(listaSalas.length / itensPorPagina)
  );
  const indexInicio = (paginaAtual - 1) * itensPorPagina;
  const indexFim = indexInicio + itensPorPagina;

  const [pesquisa, setPesquisa] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const salasFiltradas = isSearching
    ? listaSalas.filter(
        (sala) =>
          sala.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
          sala.descricao.toLowerCase().includes(pesquisa.toLowerCase())
      )
    : listaSalas;
  const itensAtuais = salasFiltradas.slice(indexInicio, indexFim);
  const [nextId, setNextId] = useState(1);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const [isSalaModalOpen, setIsSalaModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [salaSelecionada, setSalaSelecionada] = useState<number | null>(null);

  function openSalaModal() {
    setIsSalaModalOpen(true);
  }

  function closeSalaModal() {
    setNome("");
    setDescricao("");
    setIsSalaModalOpen(false);
  }

  function openEditModal() {
    if (salaSelecionada) {
      const sala = listaSalas.find((sala) => sala.id === salaSelecionada);
      if (sala) {
        setNome(sala.nome);
        setDescricao(sala.descricao);
        setIsEditModalOpen(true);
      }
    }
  }

  function closeEditModal() {
    setNome("");
    setDescricao("");
    setIsEditModalOpen(false);
  }

  function openDeleteModal() {
    if (salaSelecionada !== null) {
      setIsDeleteModalOpen(true);
    }
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  function addSala(e: React.FormEvent) {
    e.preventDefault();
    const sala: Sala = {
      id: nextId,
      nome,
      descricao,
    };
    setListaSalas([...listaSalas, sala]);
    setNextId(nextId + 1);
    setNome("");
    setDescricao("");
    closeSalaModal();
  }

  function removeSala() {
    if (salaSelecionada !== null) {
      setListaSalas(listaSalas.filter((sala) => sala.id !== salaSelecionada));
      setSalaSelecionada(null);
    }
  }

  function editaSala(e: React.FormEvent) {
    e.preventDefault();
    if (salaSelecionada !== null) {
      listaSalas.map((sala) => {
        if (sala.id === salaSelecionada) {
          if (nome) {
            sala.nome = nome;
          }
          if (descricao) {
            sala.descricao = descricao;
          }
        }
      });
      setSalaSelecionada(null);
    }
    setNome("");
    setDescricao("");
    closeEditModal();
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

  return (
    <div className="flex items-center justify-center bg-tijolos h-screen bg-no-repeat bg-cover">
      {/* menu topo */}
      <MenuTopo text = "VOLTAR" backRoute="/blocos" />

      {/* menu topo */}

      {/* parte informativa tela salas */}
      <div className="relative bg-white w-full max-w-[960px] rounded-3xl px-6  py-2 tablet:py-3 desktop:py-6 m-12 top-8  tablet:top-6 tablet:h-[480px] h-[90%]">
        {/* cabeçalho tela salas */}
        <div className="flex w-full gap-2">
          <h1 className="flex w-full justify-center text-sky-900 text-2xl font-semibold">
            BLOCO X
          </h1>
        </div>
        {/* fim cabeçalho tela salas */}

        {/* conteudo central tela salas */}
        <div className="flex flex-col mobile:px-8 px-4 py-3 w-auto justify-center gap-3">
          {/* adicionar sala + pesquisa */}
          <div className="flex justify-center items-center min-w-[220px] flex-wrap gap-2 flex-1 mobile:justify-between">
            {/* input de pesquisa */}
            <div className="h-fit items-center w-full tablet:w-auto">
              {/* input de pesquisa */}
              <Pesquisa
                pesquisa={pesquisa}
                setIsSearching={setIsSearching}
                setPesquisa={setPesquisa}
              />
            </div>
            {/* fim input de pesquisa */}
            <BotaoAdicionar text="ADICIONAR SALA" onClick={openSalaModal}/>
            </div>

            {/* Adicionando pop up de adicionar salas */}
            {isSalaModalOpen && (
              <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                <form
                  onSubmit={addSala}
                  className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px]"
                >
                  <div className="flex justify-center mx-auto w-full max-w-[90%]">
                    <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                      ADICIONAR SALA
                    </p>
                    <button
                      onClick={closeSalaModal}
                      type="button"
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

                  <div className="justify-center items-center ml-[40px] mr-8">
                    <p className="text-[#192160] text-sm font-medium mb-1 mt-2">
                      Descreva os detalhes sobre a sala
                    </p>
                    <textarea
                      className="w-full px-2 py-1 rounded-[10px] border border-[#646999] text-[#777DAA] focus:outline-none text-xs font-medium"
                      placeholder="Descrição do detalhamento sobre a sala"
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
                      <Plus className="h-10px" /> CRIAR NOVA SALA
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Fim adicionando pop up de adicionar salas */}

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

                    <div className="justify-center items-center ml-[40px] mr-8">
                      <p className="text-[#192160] text-sm font-medium mb-1 mt-2">
                        Informe a nova descrição da sala
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

              {/* Adicionando pop up de deletar sala */}
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
              {/* Fim adicionando pop up de deletar sala */}
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
                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 sm:flex-1 sm:w-[70%] w-[60%]">
                      Descrição da sala
                    </th>
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
                      <td className="align-top p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-2/4 max-w-[124px] tablet:max-w-[200px] laptop:max-w-[400px] break-words">
                        {sala.descricao}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* fim tabela com todas as salas */}

            <PassadorPagina
              avancarPagina={avancarPagina}
              voltarPagina={voltarPagina}
              totalPaginas={totalPaginas}
              paginaAtual={paginaAtual}
            />
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