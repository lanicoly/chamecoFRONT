import { IusuarioResponsavel } from "../components/emprestimoPendente";

//função para buscar o nome do usuario responsável pelo id
export function buscarNomeUsuarioPorId(id: number | null, listaUsuarios: IusuarioResponsavel[]) {
    if (id === null || id === undefined) return "Sem responsável";
    const usuario = listaUsuarios.find(usuario => usuario.id === id);
    return usuario ? usuario.nome : 'Carregando responsável...';
}