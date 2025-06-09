import { Check, Plus, TriangleAlert, X } from "lucide-react";
import { useEffect, useState } from "react";
import { MenuTopo } from "../components/menuTopo";
import { Pesquisa } from "../components/pesquisa";
import { PassadorPagina } from "../components/passadorPagina";
import { BotaoAdicionar } from "../components/botaoAdicionar";
import useGetUsuarios from "../hooks/usuarios/useGetUsers";
import AdicionarUsuarioForm from "../components/forms/AdicionarUsuarioForm";
import SelectTipoUsuario from "../components/inputs/tipo_usuario/SelectTipoUsuario";
import { PopUpEditarUsuario } from "../components/popups/usuario/PopUpEditarUsuario";
import { PopUpDeleteUsuario } from "../components/popups/usuario/PopUpDeleteUsuario";
import { TabelaDeUsuarios } from "../components/tables/TabelaDeUsuarios";
import { useChaves } from "../context/ChavesContext";

interface Ichaves {
  id: number,
  nome: string
}

export interface Iusuario {
  autorizado_emprestimo: boolean,
  chaves: Ichaves[];
  id: number,
  id_cortex: number,
  nome: string,
  setor: string,
  tipo: string,
}

//essa interface props serve para eu herdar variáveis e funções do componante pai (que nesse caso é o arquivo app.tsx)

//estou usando essa interface para que eu consiga usar a função criada no "App" em todos os arquivos que eu chamar ela e importar do componente pai, realizando uma breve navegação entre as telas

export function Usuarios() {
  const { usuarios } = useGetUsuarios();
  const [listaUsers, setListaUsers] = useState<Iusuario[]>([]);
  const itensPorPagina = 5;
  const [paginaAtual, setPaginaAtual] = useState(1);
  const totalPaginas = Math.max(
    1,
    Math.round(listaUsers.length / itensPorPagina)
  );
  const indexInicio = (paginaAtual - 1) * itensPorPagina;
  const indexFim = indexInicio + itensPorPagina;

  const [pesquisa, setPesquisa] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    setListaUsers(usuarios);
  }, [usuarios]);

  const filtrarUsuario =  listaUsers.filter((usuario) => {
    const nomeMatch = usuario.nome.toLowerCase().includes(pesquisa.toLowerCase());
    const setorMatch = usuario.setor.toLowerCase().includes(pesquisa.toLowerCase());
    const filtroMatch = filtro === "todos" || usuario.tipo.toLowerCase() === filtro.toLowerCase();

    if (!pesquisa) {
      return filtroMatch;
    }

    return (nomeMatch || setorMatch) && filtroMatch;
  });
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState("");

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userSelecionado, setUserSelecionado] = useState<number | null>(null);

  function openUserModal() {
    setIsUserModalOpen(true);
  }

  function closeUserModal() {
    setNome("");
    setEmail("");
    setTipo("");
    setIsUserModalOpen(false);
  }

  function openEditModal() {
    const usuario = listaUsers.find((user) => user.id === userSelecionado);
    if (usuario) {
      setNome(usuario.nome);
      setEmail(usuario.setor);
      setTipo(usuario.tipo);
      setIsEditModalOpen(true);
    }
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
  }

  function openDeleteModal() {
    if (userSelecionado !== null) {
      setIsDeleteModalOpen(true);
    }
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  function removeUser(e: React.FormEvent) {
    e.preventDefault();
    setListaUsers(
      listaUsers.filter((usuario) => usuario.id !== userSelecionado)
    );
    setUserSelecionado(null);
    closeDeleteModal();
  }

  function editaUser(e: React.FormEvent) {
    e.preventDefault();
    if (userSelecionado !== null) {
      listaUsers.map((usuario) => {
        if (usuario.id === userSelecionado) {
          if (nome) {
            usuario.nome = nome;
          }
          // if (email) {
          //   usuario.email = email;
          // }
          if (tipo) {
            usuario.tipo = tipo;
          }
        }
      });
      setUserSelecionado(null);
    }
    setNome("");
    setEmail("");
    setTipo("");
    closeEditModal();
  }

  function statusSelecao(id: number) {
    if (userSelecionado !== null) {
      desseleciona();
    } else {
      seleciona(id);
    }
  }

  function seleciona(id: number) {
    setUserSelecionado(id);
  }

  function desseleciona() {
    setUserSelecionado(null);
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
      <MenuTopo text = "MENU" backRoute="/menu" />

      {/* parte informativa tela usuarios */}
      <div className="relative bg-white w-full max-w-[960px] rounded-3xl px-6  py-2 tablet:py-3 desktop:py-6 m-12 top-8  tablet:top-6 tablet:h-[480px] h-[90%]">
        {/* cabeçalho tela usuarios */}
        <div className="flex w-full gap-2">
          <h1 className="flex w-full justify-center text-sky-900 text-2xl font-semibold">
            USUÁRIOS
          </h1>
        </div>
        {/* fim cabeçalho tela usuarios */}

        {/* conteudo central tela usuarios */}
        <div className="flex flex-col mobile:px-8 px-4 py-3 w-auto justify-center gap-3">
          {/* adicionar usuario + pesquisa */}
          <div className="flex justify-center items-center min-w-[220px] flex-wrap gap-2 flex-1 mobile:justify-between">
            <div className="flex gap-2 flex-wrap">

              <Pesquisa
                pesquisa={pesquisa}
                placeholder="Nome ou Setor "
                setIsSearching={setIsSearching}
                setPesquisa={setPesquisa}
              />

              <SelectTipoUsuario filtro={filtro} setFiltro={setFiltro} />
            </div>

            {/* botao adicionar usuairo */}
            <BotaoAdicionar text = "ADICIONAR USUÁRIO" onClick={openUserModal}/>
            {/* fim botao adicionar usuairo */}

            {/* Adicionando pop up de adicionar usuarios */}
            {isUserModalOpen && (
              <AdicionarUsuarioForm closeUserModal={closeUserModal}/>
            )}

            {/* Fim adicionando pop up de adicionar usuarios */}
          </div>
          {/* fim adicionar usuario + pesquisa */}

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

              {/* Adicionando pop up de editar usuario */}
              {isEditModalOpen && (
                  <PopUpEditarUsuario 
                    editaUser={editaUser} 
                    closeEditModal={closeEditModal}
                    nome={nome}
                    setNome={setNome}
                    email={email}
                    setEmail={setEmail}
                    tipo={tipo}
                    setTipo={setTipo}
                  />
              )}
              {/* Fim adicionando pop up de editar usuario */}

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

              {/* Adicionando pop up de deletar usuario */}
              {isDeleteModalOpen && (
                  <PopUpDeleteUsuario removeUser={removeUser} closeDeleteModal={closeDeleteModal}/>
              )}
              {/* Fim adicionando pop up de deletar usuario */}
            </div>
            {/* fim botões editar e excluir */}

            {/* tabela com todos os usuarios */}
            {/* <div className="overflow-y-auto max-h-[248px] tablet:max-h-64 desktop:max-h-96">
              <table className="w-full border-separate border-spacing-y-2 tablet:mb-6 bg-white">
                <thead className="bg-white sticky top-0 z-10">
                  <tr>
                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[45%]">
                      Nome de usuário
                    </th>
                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 flex-1 w-[30%]">
                      Setor
                    </th>
                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 ">
                      Tipo de Usuario
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtrarUsuario.map((usuario: Iusuario) => (
                    <tr
                      key={usuario.id}
                      className={`hover:bg-[#d5d8f1] cursor-pointer px-2 ${
                        userSelecionado === usuario.id ? "bg-gray-200" : ""
                      }`}
                      onClick={() => statusSelecao(usuario.id)}
                    >
                      <td className="align-top p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[45%]">
                        {usuario.nome}
                      </td>
                      <td className="align-top p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[30%] break-words flex-1">
                        {usuario.setor !== "" ? usuario.setor : "Não informado"}
                      </td>
                      <td className="align-top p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[25%] tablet:max-w-[200px] laptop:max-w-[400px] break-words">
                        {usuario.tipo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> */}
            <TabelaDeUsuarios filtrarUsuario={filtrarUsuario} userSelecionado={userSelecionado} statusSelecao={statusSelecao}/>
            {/* fim tabela com todos os usuarios */}

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
        {/* fim conteudo central tela usuarios */}

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
      {/* fim parte informativa tela usuarios */}
    </div>
  );
}
