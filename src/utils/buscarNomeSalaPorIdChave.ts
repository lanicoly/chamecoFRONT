import { IChave, ISala } from "../pages/chaves";

export function buscarNomeSalaPorIdChave(idChave: number | null, listaChaves: any[], listaSalas: any[]) {
    const chave = listaChaves.find(chave => chave.id === idChave);
    if (!chave) return 'Carregando chave...';

    const sala = listaSalas.find(sala => sala.id === chave.sala);
    return sala ? sala.nome : 'Carregando sala...';
}

export function makeBuscadorSalaPorChave(
    listaChaves: IChave[],
    listaSalas: ISala[]
) {
    const chaveById = Object.fromEntries(listaChaves.map(c => [String(c.id), c]));
    const salaById = Object.fromEntries(listaSalas.map(s => [String(s.id), s]));

    return function buscar(idChave: number | string | null) {
        if (idChave === null || idChave === undefined) return "Sem chave";

        const idStr = String(idChave);
        const chave = chaveById[idStr];

        if (!chave) return "Chave não encontrada";

        const sala = salaById[String(chave.sala)];
        return sala ? sala.nome : "Sala não encontrada";
    }
}