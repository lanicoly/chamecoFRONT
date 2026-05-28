import { useState, useEffect, useMemo } from "react";
import api from "../../services/api";
import { IUsuario } from "../../pages/chaves";
import { Iemprestimo } from "../../pages/emprestimos";

export function useGetSolicitantes(new_emprestimos: Iemprestimo[]) {
  const [nomesSolicitantesMap, setNomesSolicitantesMap] = useState<Record<number, string>>({});

  const idsString = useMemo(() => {
    const arraySemDuplicatas = new Set<number>();
    for (const emprestimo of new_emprestimos) {
      if (emprestimo?.usuario_solicitante != null) {
        arraySemDuplicatas.add(emprestimo.usuario_solicitante);
      }
    }
    return Array.from(arraySemDuplicatas).join(",");
  }, [new_emprestimos]);

  useEffect(() => {
    if (!idsString) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const uniqueIds = idsString.split(",").map(Number);

    const chunkSize = 6;
    const chunks: number[][] = [];
    for (let i = 0; i < uniqueIds.length; i += chunkSize) {
      chunks.push(uniqueIds.slice(i, i + chunkSize));
    }

    (async () => {
      const acc: Record<number, string> = {};
      try {
        for (const ids of chunks) {
          const promises = ids.map(async (id) => {
            try {
              const resp = await api.get<IUsuario>(`/chameco/api/v1/usuarios/${id}/`, { signal });
              acc[id] = resp.data.nome;
            } catch (err) {
              if (signal.aborted) return;
              acc[id] = "Solicitante não informado";
            }
          });
          await Promise.allSettled(promises);
        }
      } finally {
        if (!signal.aborted && Object.keys(acc).length > 0) {
          setNomesSolicitantesMap((prev) => {
            const novosNomes: Record<number, string> = {};
            Object.keys(acc).forEach((key) => {
              const id = Number(key);
              if (prev[id] === undefined) {
                novosNomes[id] = acc[id];
              }
            });

            if (Object.keys(novosNomes).length === 0) return prev;
            return { ...prev, ...novosNomes };
          });
        }
      }
    })();

    return () => controller.abort();
  }, [idsString]); 

  return nomesSolicitantesMap;
}