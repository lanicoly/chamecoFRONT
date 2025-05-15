import { IoptionSolicitantes } from "../components/inputs/FilterableInputSolicitantes";


export   const getNomeSolicitante = (idSolicitante: number | null | undefined, solicitantes: IoptionSolicitantes[]) => idSolicitante != null
      ? solicitantes.find((s) => s.id === idSolicitante)?.nome || ""
      : "";