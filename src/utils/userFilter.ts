import { IUsuario } from "../pages/chaves";

export const userFilter = (listaUsers: IUsuario[], pesquisa: string, filtro: string, indexInicio: number, indexFim: number) => { 
    
    return listaUsers.filter((usuario) => {
        const nomeMatch = usuario.nome.toLowerCase().includes(pesquisa.toLowerCase());
        const setorMatch = usuario.setor.toLowerCase().includes(pesquisa.toLowerCase());
        const filtroMatch = filtro === "todos" || usuario.tipo.toLowerCase() === filtro.toLowerCase();

        if (!pesquisa) {
            return filtroMatch;
        }

        return (nomeMatch || setorMatch) && filtroMatch;
    }).slice(indexInicio, indexFim); // paginação
};