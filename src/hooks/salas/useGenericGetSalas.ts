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
  next: string | null;      // pode vir absoluto
  previous: string | null;
  results: ISala[];
}

interface IUseSalasProps {
  nome?: string;
  blocoId?: number;
}

// cache em memória por chave de consulta
const salasCache = new Map<string, ISala[]>();

// util: debouncer simples (300ms por padrão)
function useDebounced<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

const useGenericGetSalas = ({ nome = "", blocoId }: IUseSalasProps = {}) => {
  const [salas, setSalas] = useState<ISala[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(false);

  // debounce para evitar flood ao digitar
  const debouncedNome = useDebounced(nome, 300);

  // chave única do cache para esta busca
  const cacheKey = useMemo(
    () => JSON.stringify({ nome: debouncedNome, blocoId }),
    [debouncedNome, blocoId]
  );

  // para cancelar requisição anterior
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // 1) serve do cache se existir
    const cached = salasCache.get(cacheKey);
    if (cached) {
      setSalas(cached);
      setLoading(false);
      setError(false);
      return; // evita novo fetch
    }

    // 2) aborta requisição anterior
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    const fetchSalas = async () => {
      setLoading(true);
      setError(false);

      try {
        // monta URL inicial (encode do nome é importante)
        const nomeParam = encodeURIComponent(debouncedNome ?? "");
        let next: string | null = `/chameco/api/v1/salas/?pagination=50&nome=${nomeParam}${
          blocoId !== undefined ? `&bloco_id=${blocoId}` : ""
        }`;

        let all: ISala[] = [];

        while (next) {
          // se "next" vier absoluto, o axios com baseURL ainda aceita; se não aceitar, remova a base:
          // const relative = next.startsWith("http") ? next.replace(api.defaults.baseURL!, "") : next;
          const { data } = await api.get<IApiResponseSalas>(next, {
            signal: ac.signal,
          });
          all.push(...data.results);
          next = data.next;
        }

        // dedup O(n)
        const unique = Array.from(new Map(all.map(s => [s.id, s])).values());

        // preenche estado e cache
        salasCache.set(cacheKey, unique);
        setSalas(unique);
        setError(false);
      } catch (e: any) {
        if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED") return;
        setError(e);
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    };

    fetchSalas();
    return () => ac.abort();
  }, [cacheKey, debouncedNome, blocoId]);

  return { salas, loading, error };
};

export default useGenericGetSalas;
