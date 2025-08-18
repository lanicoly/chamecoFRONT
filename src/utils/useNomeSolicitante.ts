import { useMemo } from "react";
import { IUsuario } from "../pages/chaves";

export function useNomeSolicitante(
  idSolicitante: number | null | undefined,
  solicitantes: IUsuario[]
): string {
  return useMemo(() => {
    if (idSolicitante == null) return "";
    return solicitantes.find((s) => s.id === idSolicitante)?.nome || "";
  }, [idSolicitante, solicitantes]);
}

