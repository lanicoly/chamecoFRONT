import { IoptionChaves } from "../components/inputs/FilterableInputChaves";

interface Isala {
    id: number;
    bloco: number;
    nome: string;
}

export function buscarNomeChavePorIdSala(idSala: number, chaves: IoptionChaves[], salas: Isala[]): string {
  // Encontra a chave que está associada à sala com o id fornecido
  const chave = chaves.find(chave => chave.sala === idSala);

  const nomeandoChave = salas.find(sala => sala.id === chave?.sala);

  // Verifica se a chave foi encontrada
  if (nomeandoChave) {
    return `Chave ${nomeandoChave.nome.toLowerCase()}`; // Retorna o nome da sala ao qual a chave está associada
  } else {
    return 'Chave não encontrada para a sala fornecida';
  }
}
