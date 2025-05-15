import { IusuarioResponsavel } from "../components/emprestimoPendente";

//função para buscar o nome do usuario responsável pelo id
export function buscarNomeUsuarioPorId(id: number | null, listaUsuarios: IusuarioResponsavel[]) {
    const usuario = listaUsuarios.find(usuario => usuario.id === id);
    return usuario ? usuario.nome : 'Responsável não encontrado';
}