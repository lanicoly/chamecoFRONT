
export function buscarNomeSalaPorIdChave(idChave: number | null, listaChaves: any[], listaSalas: any[]) {
    const chave = listaChaves.find(chave => chave.id === idChave);
    if (!chave) return 'Chave não encontrada';
  
    const sala = listaSalas.find(sala => sala.id === chave.sala);
    return sala ? sala.nome : 'Sala não encontrada';
}