import { useNomeSolicitante } from "../utils/useNomeSolicitante";


export function NomeSolicitanteCell({ id }: { id?: number | null }) {
  const nome = useNomeSolicitante(id);
  return <span>{nome}</span>;
}