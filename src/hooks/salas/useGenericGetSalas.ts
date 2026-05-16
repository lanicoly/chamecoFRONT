// import { useEffect, useState } from "react";
// import api from "../../services/api";
// import { ISala } from "../../pages/chaves";

// export interface IApiResponseSalas {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: ISala[];
// }

// interface IUseSalasProps {
//   nome?: string;
//   blocoId?: number; 
// }

// const useGenericGetSalas = ({ nome = "", blocoId }: IUseSalasProps = {}) => {
//   const [salas, setSalas] = useState<ISala[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);

//   useEffect(() => {
//     const fetchSalas = async () => {
//       setLoading(true);
//       setError(false);

//       try {
//         let allSalas: ISala[] = [];
//         let url = `/chameco/api/v1/salas/?pagination=10&nome=${nome}`;
//         if (blocoId !== undefined) {
//           url += `&bloco_id=${blocoId}`;
//         }
        
//         let next: string | null = url;

//         while (next) {
//           const response = await api.get<IApiResponseSalas>(next);
//           allSalas = [...allSalas, ...response.data.results];
//           next = response.data.next;
//         }

//         // o set remove duplicatas da estrutura
//         // const uniqueSalas = Array.from(new Set(allSalas.map(s => s.id)))
//         //     .map(id => {
//         //         return allSalas.find(s => s.id === id);
//         //     });
//         const uniqueSalas = Array.from(new Map(allSalas.map(s => [s.id, s])).values());

        
//         setSalas(uniqueSalas as ISala[]); 

//       } catch (err) {
//         console.error(err);
//         setError(true);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSalas();
//   }, [nome, blocoId]);


//   return { salas, loading, error };
// };

// export default useGenericGetSalas;

import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../services/api";
import { ISala } from "../../pages/chaves";

export interface IApiResponseSalas {
  count: number;
  next: string | null;
  results: ISala[];
}

interface IUseSalasProps {
  nome?: string;
  blocoId?: number;
}

const salasCache = new Map<string, ISala[]>();
export const clearSalasCache = () => salasCache.clear();

const useGenericGetSalas = ({ nome = "", blocoId }: IUseSalasProps = {}) => {
  const [salas, setSalas] = useState<ISala[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(false);

  const cacheKey = useMemo(() => JSON.stringify({ nome, blocoId }), [nome, blocoId]);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (salasCache.has(cacheKey)) {
      setSalas(salasCache.get(cacheKey)!);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    const fetchSalas = async () => {
      setLoading(true);
      setError(false);
      try {
        let allSalas: ISala[] = [];
        let page = 1;
        let hasNext = true;

        while (hasNext) {
          const response = await api.get<IApiResponseSalas>(`/chameco/api/v1/salas/`, {
            signal: ac.signal,
            params: {
              pagination: 50,
              page: page,
              nome: nome || undefined,
              bloco_id: blocoId || undefined,
            }
          });
          
          if (response.data.results) {
            allSalas = [...allSalas, ...response.data.results];
          }

          hasNext = !!response.data.next;
          page++;
          if (page > 20) break; 
        }

        const unique = Array.from(new Map(allSalas.map(s => [s.id, s])).values());

        if (!ac.signal.aborted) {
          salasCache.set(cacheKey, unique);
          setSalas(unique);
        }
      } catch (e: any) {
        if (e?.name === "CanceledError") return;
        console.error("Erro:", e);
        setError(true);
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    };

    const timeout = setTimeout(fetchSalas, 300);
    return () => {
      clearTimeout(timeout);
      ac.abort();
    };
  }, [cacheKey, nome, blocoId]);

  return { salas, loading, error };
};

export default useGenericGetSalas;