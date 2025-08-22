import { useEffect, useState } from "react";
import api from "../../services/api";

export interface IBloco {
  id: number;
  nome: string;
}

export interface IApiResponseBlocos {
  count: number;
  next: string | null;
  previous: string | null;
  results: IBloco[];
}

const useGetBlocos = () => {
  const [bloco, setBlocos] = useState<IBloco[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBlocos = async () => {
      setLoading(true);
      setError(false);

      try {
        let allBlocos: IBloco[] = [];
        let page = 1;
        let next: string | null = null;

        do {
          const url = `/chameco/api/v1/blocos/?limit=50&page=${page}`;
          const response = await api.get<IApiResponseBlocos>(url);

          const results = response.data.results.map((bloco) => ({
            id: bloco.id,
            nome: bloco.nome,
          }));

          // evita duplicados
          const novosIds = results.map((r) => r.id);
          const existentesIds = allBlocos.map((b) => b.id);
          const filteredResults = results.filter(
            (r) => !existentesIds.includes(r.id)
          );

          allBlocos = [...allBlocos, ...filteredResults];
          next = response.data.next;
          page++;
        } while (next);

        setBlocos(allBlocos);
      } catch (err) {
        console.error("Erro ao listar blocos", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBlocos();
  }, []);

  return { bloco, loading, error };
};

export default useGetBlocos;
