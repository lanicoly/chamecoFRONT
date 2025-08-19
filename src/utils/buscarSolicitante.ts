import { IUsuario } from "../pages/chaves";

export const buscarSolicitante = (id: number | null, solicitantes: IUsuario[]) => {
    const solicitante = solicitantes.find( solicitante => solicitante.id === id );
    return solicitante ? `${solicitante.nome} | ${solicitante.id}` : "";
};