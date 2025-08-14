import { useEffect, useState } from "react";
import { IUsuario } from "../pages/chaves";
import api from "../services/api";

// precisamos dar um jeito de atualizar o array

export   const useNomeSolicitante = (idSolicitante: number | null | undefined, solicitantes: IUsuario[]) => idSolicitante != null
      ? solicitantes.find((s) => s.id === idSolicitante)?.nome || ""
      : "";

