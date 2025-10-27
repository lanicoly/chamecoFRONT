import { useState, useEffect, useMemo } from "react";
import api from "../../services/api";
import { IUsuario } from "../../pages/chaves";
import { Iemprestimo } from "../../pages/emprestimos";

export function useGetSolicitantes(new_emprestimos: Iemprestimo[]) {
  const [nomesSolicitantesMap, setNomesSolicitantesMap] = useState<Record<number, string>>({});

  // ids únicos presentes na lista
  const uniqueIds = useMemo(() => {
    const arraySemDuplicatas = new Set<number>();
    for (const emprestimo of new_emprestimos) {
      if (emprestimo?.usuario_solicitante != null) arraySemDuplicatas.add(emprestimo.usuario_solicitante);
    }
    return Array.from(arraySemDuplicatas);
  }, [new_emprestimos]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    // quais ainda não temos no cache local
    const missing = uniqueIds.filter((id) => nomesSolicitantesMap[id] === undefined);
    if (missing.length === 0) return;

    // opcional: limitar concorrência simples por “chunks”
    const chunkSize = 6; // ajuste conforme back-end
    const chunks: number[][] = [];
    for (let i = 0; i < missing.length; i += chunkSize) chunks.push(missing.slice(i, i + chunkSize));

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
        if (!signal.aborted && Object.keys(acc).length) {
          // faz apenas UM setState
          setNomesSolicitantesMap((prev) => ({ ...prev, ...acc }));
        }
      }
    })();

    return () => controller.abort();
  }, [uniqueIds, nomesSolicitantesMap]); // OK: reexecuta só quando entra ID novo

  return nomesSolicitantesMap;
}
