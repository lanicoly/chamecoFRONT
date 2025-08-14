import { useState, useEffect } from "react";
import api from "../../services/api";
import { IUsuario } from "../../pages/chaves";
import { Iemprestimo } from "../../pages/emprestimos";

export function useGetSolicitantes(new_emprestimos: Iemprestimo[]) {
  const [nomesSolicitantesMap, setNomesSolicitantesMap] = useState<Record<number, string>>({});

  useEffect(() => {
    const idsExistentes = new Set(Object.keys(nomesSolicitantesMap).map(Number));

    const idsParaBuscar = new_emprestimos
      .map((e) => e.usuario_solicitante)
      .filter((id): id is number => id != null && !idsExistentes.has(id));

    idsParaBuscar.forEach(async (id) => {
      try {
        const response = await api.get<IUsuario>(`/chameco/api/v1/usuarios/${id}/`);
        setNomesSolicitantesMap((prev) => ({
          ...prev,
          [id]: response.data.nome,
        }));
      } catch {
        setNomesSolicitantesMap((prev) => ({
          ...prev,
          [id]: "Solicitante não informado",
        }));
      }
    });
  }, [new_emprestimos]); 

  return nomesSolicitantesMap;
}
