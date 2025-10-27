import { IChave, ISala } from "../pages/chaves";

export function buscarNomeSalaPorIdChave(idChave: number | null, listaChaves: any[], listaSalas: any[]) {
    const chave = listaChaves.find(chave => chave.id === idChave);
    if (!chave) return 'Carregando chave...';

    const sala = listaSalas.find(sala => sala.id === chave.sala);
    return sala ? sala.nome : 'Carregando sala...';
}

/** Cria buscador rápido com índices pré-computados */
export function makeBuscadorSalaPorChave(
    listaChaves: IChave[],
    listaSalas: ISala[]
) {
    const chaveById = Object.fromEntries(listaChaves.map(c => [c.id, c]));
    const salaById = Object.fromEntries(listaSalas.map(s => [s.id, s]));

    return function buscarNomeSalaPorIdChave(idChave: number | null) {
        if (idChave == null) return "Carregando chave...";
        const chave = chaveById[idChave];
        if (!chave) return "Chave não encontrada";
        return salaById[chave.sala]?.nome ?? "Sala não encontrada";
    }

}