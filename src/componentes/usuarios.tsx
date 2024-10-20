import { Check, Plus, TriangleAlert, X } from "lucide-react";
import { useState } from "react"

export interface Usuario {
    id: number;
    nome: string;
    email: string;
    tipo: string;
}

//essa interface props serve para eu herdar variáveis e funções do componante pai (que nesse caso é o arquivo app.tsx)

//estou usando essa interface para que eu consiga usar a função criada no "App" em todos os arquivos que eu chamar ela e importar do componente pai, realizando uma breve navegação entre as telas

interface UsuariosProps {
    mudarTela: (index: number) => void
}

export function Usuarios({ mudarTela }: UsuariosProps) {

    const [listaUsers, setListaUsers] = useState<Usuario[]>([]);
    const itensPorPagina = 5;
    const [paginaAtual, setPaginaAtual] = useState(1);
    const totalPaginas = Math.max(1, Math.ceil(listaUsers.length / itensPorPagina));
    const indexInicio = (paginaAtual - 1) * itensPorPagina;
    const indexFim = indexInicio + itensPorPagina;

    const [pesquisa, setPesquisa] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [filtro, setFiltro] = useState('todos');

    const filtrarUsuario = filtro !== "todos" ?
    listaUsers.filter(usuario =>
        usuario.tipo.toLowerCase() === filtro.toLowerCase()
    )
    : listaUsers

    const usuariosFiltrados = isSearching || filtro
        ? filtrarUsuario.filter(usuario =>
            usuario.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
            usuario.email.toLowerCase().includes(pesquisa.toLowerCase())
        )
        : filtrarUsuario

    

    const itensAtuais = usuariosFiltrados.slice(indexInicio, indexFim);
    const [nextId, setNextId] = useState(1);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [tipo, setTipo] = useState('');

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userSelecionado, setUserSelecionado] = useState<number | null>(null);

    function openUserModal() {
        setIsUserModalOpen(true);
    }

    function closeUserModal() {
        setNome('');
        setEmail('');
        setTipo('');
        setIsUserModalOpen(false);
    }

    
    function openEditModal() {
        const usuario = listaUsers.find(user => user.id === userSelecionado);
        if (usuario) {
            setNome(usuario.nome);
            setEmail(usuario.email);
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

    function addUser(e: React.FormEvent) {
        e.preventDefault();
        const usuario: Usuario = {
            id: nextId,
            nome,
            email,
            tipo
        };
        console.log(tipo)
        setListaUsers([...listaUsers, usuario]);
        setNextId(nextId + 1);
        setNome('');
        setEmail('');
        setTipo('');
        closeUserModal();
    }


    function removeUser(e: React.FormEvent) {
        e.preventDefault();
        setListaUsers(listaUsers.filter(usuario => usuario.id !== userSelecionado));
        setUserSelecionado(null);
        closeDeleteModal();
    };


    function editaUser(e: React.FormEvent) {
        e.preventDefault();
        if (userSelecionado !== null) {
            listaUsers.map(usuario => {
                if (usuario.id === userSelecionado) {
                    if (nome) {
                        usuario.nome = nome
                    }
                    if (email) {
                        usuario.email = email
                    }
                    if (tipo) {
                        usuario.tipo = tipo
                    }
                }
            })
            setUserSelecionado(null);
        }
        setNome('');
        setEmail('');
        setTipo('');
        closeEditModal();
    };

    function statusSelecao(id: number) {
        if (userSelecionado !== null) {
            desseleciona()
        } else {
            seleciona(id)
        }
    }

    function seleciona(id: number) {
        setUserSelecionado(id);
    };

    function desseleciona() {
        setUserSelecionado(null)
    }

    function avancarPagina() {
        if (paginaAtual < totalPaginas) {
            setPaginaAtual(paginaAtual + 1);
        }
    };

    function voltarPagina() {
        if (paginaAtual > 1) {
            setPaginaAtual(paginaAtual - 1);
        }
    };

    return (
        <div className="flex items-center justify-center bg-tijolos h-screen bg-no-repeat bg-cover">

            {/* menu topo */}
            <nav className="flex justify-between px-4 py-2 bg-white fixed top-0 w-full z-10 items-center">
                <button onClick={() => mudarTela(2)} className="flex gap-2 justify-start items-center font-medium text-lg text-sky-900 w-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#082f49" className="bi bi-chevron-left" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                    </svg>
                    MENU
                </button>

                {/* logo chameco lateral */}
                <div className="sm:flex hidden justify-start bottom-4">
                    <img className="w-[150px]" src="\logo_lateral.png" alt="logo chameco" />
                </div>
                {/* fim logo chameco lateral */}

                <div className="flex">
                    <button className="flex justify-center items-center gap-1 text-[#565D8F] font-semibold text-base bg-[#B8C1FF] rounded-l-md p-2 h-max w-max">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi    bi-person-circle" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                        </svg>
                        Usuário
                    </button>
                    <button className="text-white flex justify-center items-center gap-1.5 w-max font-medium text-base bg-[#565D8F] rounded-r-md p-2 h-max">
                        Sair
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                            <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                        </svg>
                    </button>
                </div>


            </nav>
            {/* menu topo */}

            {/* parte informativa tela usuarios */}
            <div className="relative bg-white w-full max-w-[960px] rounded-3xl px-6  py-2 tablet:py-3 desktop:py-6 m-12 top-8  tablet:top-6 tablet:h-[480px] h-[90%]">

                {/* cabeçalho tela usuarios */}
                <div className="flex w-full gap-2">

                    <h1 className="flex w-full justify-center text-sky-900 text-2xl font-semibold">USUÁRIOS</h1>
                </div>
                {/* fim cabeçalho tela usuarios */}


                {/* conteudo central tela usuarios */}
                <div className="flex flex-col mobile:px-8 px-4 py-3 w-auto justify-center gap-3">

                    {/* adicionar usuario + pesquisa */}
                    <div className="flex justify-center items-center min-w-[220px] flex-wrap gap-2 flex-1 mobile:justify-between">


                        <div className="flex gap-2 flex-wrap">


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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#64748b" className="bi bi-search" viewBox="0 0 16 16">
                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                    </svg>
                                </div>

                            </div>
                            {/* fim input de pesquisa */}


                            {/* input de filtro */}
                                <div >

                                    <select
                                    name="filtrar_tipo_usuario" 
                                    id="filtrar_tipo_usuario"
                                    value={filtro}
                                        onChange={(e) => {
                                            setFiltro(e.target.value);
                                        }}
                                    className=" justify-between items-center px-2 py-[5px] border-solid border-[1px] border-slate-500 rounded-md text-sky-900 text-sm font-medium h-fit">
                                        <option value="todos">Todos</option>
                                        <option value="administrativo">Administrativo</option>
                                        <option value="codis">CODIS</option>
                                        <option value="guarita">Guarita</option>
                                        <option value="servidor">Servidor</option>
                                        <option value="aluno">Aluno</option>
                                    </select>
                                   
                                </div>
                            {/* fim input de filtro */}
                        </div>
                        <button onClick={openUserModal} className="min-w-60 px-4 py-1.5 bg-[#18C64F] text-white font-medium flex gap-2 justify-center items-center hover:bg-[#56ab71] rounded-md w-full tablet:w-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffffff" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                            </svg>
                            ADICIONAR USUÁRIO
                        </button>

                        {/* Adicionando pop up de adicionar usuarios */}
                        {isUserModalOpen && (
                            <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                                <form onSubmit={addUser} className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px]">
                                    <div className="flex justify-center mx-auto w-full max-w-[90%]">
                                        <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                                            ADICIONAR USUÁRIO
                                        </p>
                                        <button
                                            onClick={closeUserModal}
                                            type="button"
                                            className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                                        >
                                            <X className=" mb-[5px] text-[#192160]" />
                                        </button>
                                    </div>

                                    <div className="space-y-3 justify-center items-center ml-[40px] mr-8">
                                        <div>

                                        <p className="text-[#192160] text-sm font-medium mb-1">
                                            Digite o nome do usuário
                                        </p>

                                        
                                        <input
                                        className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                                        type="text"
                                        placeholder="Nome do usuário"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        required
                                        />
                                        </div>
                                        
                                        <div>
                                        <p className="text-[#192160] text-sm font-medium mb-1">
                                            Digite o e-mail do usuário
                                        </p>
                                        <input
                                            className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                                            type="text"
                                            placeholder="Email do usuário"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        </div>
                                        <div>

                                        <p className="text-[#192160] text-sm font-medium mb-1">
                                                Selecione o tipo do usuário
                                        </p>
                                        <select name="tipo_usuario" id="tipo_usuario" 
                                        className=" justify-between items-center px-2 py-[5px] border-solid border-[1px] border-slate-500 rounded-md text-[#777DAA] text-xs font-medium w-full"
                                        value={tipo} onChange={(e) => setTipo(e.target.value)} required>
                                            <option value="">Tipo de usuário</option>
                                            <option value="administrativo">Administrativo</option>
                                            <option value="codis">CODIS</option>
                                            <option value="guarita">Guarita</option>
                                            <option value="servidor">Servidor</option>
                                            <option value="aluno">Aluno</option>
                                        </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-center items-center mt-[10px] w-full">
                                        <button
                                            type="submit"
                                            className="px-3 py-2 border-[3px] rounded-xl font-semibold  text-sm flex gap-[4px] justify-center items-center  bg-[#16C34D] text-[#FFF]"
                                        >
                                            <Plus className="h-10px" /> CRIAR USUÁRIO
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Fim adicionando pop up de adicionar usuarios */}

                    </div>
                    {/* fim adicionar usuario + pesquisa */}


                    {/* conteudo central tabela*/}
                    <div>

                        {/* botões editar e excluir */}
                        <div className="flex gap-4 justify-end my-2">
                            <button onClick={openEditModal} className="flex gap-1 justify-start items-center font-medium text-sm text-[#646999] underline">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#646999" className="bi bi-pen" viewBox="0 0 16 16">
                                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                                </svg>
                                Editar
                            </button>
                            {/* Adicionando pop up de editar usuario */}
                            {isEditModalOpen && (
                               <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                               <form onSubmit={editaUser} className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px]">
                                   <div className="flex justify-center mx-auto w-full max-w-[90%]">
                                       <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                                           EDITAR USUÁRIO
                                       </p>
                                       <button
                                            onClick={closeEditModal}
                                            type="button"
                                            className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                                        >
                                            <X className=" mb-[5px] text-[#192160]" />
                                        </button>
                                   </div>

                                   <div className="space-y-3 justify-center items-center ml-[40px] mr-8">
                                       <p className="text-[#192160] text-sm font-medium mb-1">
                                           Digite o novo nome do usuário
                                       </p>
                                       

                                       <input
                                            value={nome}
                                           className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                                           type="text"
                                           placeholder="Nome do usuário"
                                           onChange={(e) => setNome(e.target.value)}
                                           required
                                       />
                                       
                                       <div>
                                       <p className="text-[#192160] text-sm font-medium mb-1">
                                           Digite o novo email do usuário
                                       </p>

                                       <input
                                           className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                                           type="text"
                                           placeholder="Email do usuário"
                                           value={email}
                                           onChange={(e) => setEmail(e.target.value)}
                                           required
                                           />
                                        </div>
                            
                                    <div>
                                    <p className="text-[#192160] text-sm font-medium mb-1">
                                           Selecione o novo tipo de usuário
                                       </p>
                                   <select name="tipo_usuario" id="tipo_usuario"
                                   className=" justify-between items-center px-2 py-[5px] border-solid border-[1px] border-slate-500 rounded-md text-[#777DAA] text-xs font-medium w-full"
                                   value={tipo} onChange={(e) => setTipo(e.target.value)} required>
                                       <option value="">Tipo de usuário</option>
                                       <option value="administrativo">Administrativo</option>
                                       <option value="codis">CODIS</option>
                                       <option value="guarita">Guarita</option>
                                       <option value="servidor">Servidor</option>
                                       <option value="aluno">Aluno</option>
                                   </select>
                                       </div>
                                       </div>

                                   <div className="flex justify-center items-center mt-[10px] w-full">
                                       <button
                                           type="submit"
                                           className="px-3 py-2 border-[3px] rounded-xl font-semibold  text-sm flex gap-[4px] justify-center items-center  bg-[#16C34D] text-[#FFF]"
                                       >
                                            SALVAR ALTERAÇÕES <Check className="size-5" />
                                       </button>
                                   </div>
                               </form>
                           </div>
                            )}

                            {/* Fim adicionando pop up de editar usuario */}

                            <button onClick={openDeleteModal} className="flex gap-1 justify-start items-center font-medium text-sm text-rose-600 underline">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#e11d48" className="bi bi-x-lg" viewBox="0 0 16 16">
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                                </svg>
                                Excluir
                            </button>

                            {/* Adicionando pop up de deletar usuario */}
                            {isDeleteModalOpen && (
                               <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                               <form onSubmit={removeUser} className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px] justify-center items-center">
                                   <div className="flex justify-center mx-auto w-full max-w-[90%]">
                                       <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] h-max">
                                           EXCLUIR USUÁRIO
                                       </p>
                                       <button
                                            onClick={closeDeleteModal}
                                            type="button"
                                            className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                                        >
                                            <X className=" text-[#192160]" />
                                        </button>
                                   </div>
                               <TriangleAlert className="size-16 text-red-700"/>

                                   <p className="text-center px-2">
                                    Essa ação é <strong className="font-semibold ">definitiva</strong> e não pode ser desfeita. <strong className="font-semibold">Tem certeza disso?</strong>
                                   </p>
                                   <div className="flex justify-center items-center mt-[10px] w-full gap-3">
                                       <button onClick={closeDeleteModal}
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

                            {/* Fim adicionando pop up de deletar usuario */}

                        </div>
                        {/* fim botões editar e excluir */}

                        {/* tabela com todos os usuarios */}
                        <div className="overflow-y-auto max-h-[248px] tablet:max-h-64 desktop:max-h-96">
                            <table className="w-full border-separate border-spacing-y-2 tablet:mb-6 bg-white">
                                <thead className="bg-white sticky top-0 z-10">
                                    <tr>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[45%]">Nome de usuário</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 flex-1 w-[30%]">Email</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 ">Tipo de Usuario</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itensAtuais.map(usuario => (
                                        <tr
                                            key={usuario.id}
                                            className={`hover:bg-[#d5d8f1] cursor-pointer px-2 ${userSelecionado === usuario.id ? "bg-gray-200" : ""}`}
                                            onClick={() => statusSelecao(usuario.id)}
                                        >
                                            <td className="align-top p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[45%]">
                                                {usuario.nome}
                                            </td>
                                            <td className="align-top p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[30%] break-words flex-1">
                                                {usuario.email}
                                            </td>
                                            <td className="align-top p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[25%] tablet:max-w-[200px] laptop:max-w-[400px] break-words">
                                                {usuario.tipo}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* fim tabela com todos os usuarios */}

                        {/* passador de página */}
                        <div className=" mt-2 flex justify-end items-center absolute bottom-3 right-8 sm:right-10">

                            <button onClick={voltarPagina} className="size-[22px] rounded-sm text-white text-sm flex items-center justify-center font-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#075985" className="bi bi-chevron-left" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                                </svg>
                            </button>

                            <div className="w-auto gap-1.5 px-1 py-1 flex items-center justify-center">
                                <div className="size-[28px] rounded-full bg-[#8d93c9] text-white text-sm flex items-center justify-center font-semibold">{paginaAtual}</div>
                                <div className="text-base text-sky-800 font-semibold">de <strong className="font-bold">{totalPaginas}</strong></div>
                            </div>

                            <button onClick={avancarPagina} className="size-[22px] rounded-sm text-white text-sm flex items-center justify-center font-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#075985" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
                                </svg>
                            </button>

                        </div>
                        {/* fim passador de página */}

                    </div>
                    {/* fim conteudo central tabela*/}
                </div>
                {/* fim conteudo central tela usuarios */}

                {/* logo chameco lateral */}
                <div className="flex justify-start bottom-4 absolute sm:hidden">
                    <img className="sm:w-[200px] w-32" src="\logo_lateral.png" alt="logo chameco" />
                </div>
                {/* fim logo chameco lateral */}
            </div>
            {/* fim parte informativa tela usuarios */}
        </div>

    )
}