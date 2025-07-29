import { useState } from "react";
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
import { userFilter } from "../utils/userFilter";
import { IUsuario } from "./chaves";

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

export function Usuarios() {


    const {
      usuarios,
      page,
      totalPaginas,
      nextPage,
      prevPage,
  } = useGetUsuarios();

  const itensPorPagina = 5;
  const paginaAtual = 1;
  const indexInicio = (paginaAtual - 1) * itensPorPagina;
  const indexFim = indexInicio + itensPorPagina;

  const [pesquisa, setPesquisa] = useState("");
  const [_isSearching, setIsSearching] = useState(false);
  const [filtro, setFiltro] = useState("todos");

  const filtrarUsuario = userFilter(usuarios, pesquisa, filtro, indexInicio, indexFim);

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
    const usuario: IUsuario | undefined = usuarios.find((user) => user.id === userSelecionado);
    if (usuario) {
      setNome(usuario?.nome);
      setEmail(usuario?.setor);
      setTipo(usuario?.tipo);
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
    setUserSelecionado(null);
    closeDeleteModal();
  }

  function editaUser(e: React.FormEvent) {
    e.preventDefault();
    if (userSelecionado !== null) {
      usuarios.map((usuario) => {
        if (usuario.id === userSelecionado) {
          if (nome) {
            usuario.nome = nome;
          }

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

              {isDeleteModalOpen && (
                  <PopUpDeleteUsuario removeUser={removeUser} closeDeleteModal={closeDeleteModal}/>
              )}
            </div>

            <TabelaDeUsuarios 
              filtrarUsuario={filtrarUsuario} 
              userSelecionado={userSelecionado} 
              statusSelecao={statusSelecao}
            />

            <PassadorPagina
              avancarPagina={nextPage}
              voltarPagina={prevPage}
              totalPaginas={totalPaginas}
              paginaAtual={page}
            />
          </div>
        </div>

        <div className="flex justify-start bottom-4 absolute sm:hidden">
          <img
            className="sm:w-[200px] w-32"
            src="\logo_lateral.png"
            alt="logo chameco"
          />
        </div>
      </div>
    </div>
  );
}
