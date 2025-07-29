import { IoptionChaves } from "../components/inputs/FilterableInputChaves";
import { ISala } from "../pages/chaves";

export function buscarNomeChavePorIdSala(idSala: number | null, chaves: IoptionChaves[], salas: ISala[]): string {
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
