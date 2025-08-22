import { useEffect, useState } from "react";
import api from "../../services/api";
import { ISala } from "../../pages/chaves";

export interface IApiResponseSalas {
  count: number;
  next: string | null;
  previous: string | null;
  results: ISala[];
}

interface IUseSalasProps {
  nome?: string;
  blocoId?: number; 
}

const useGenericGetSalas = ({ nome = "", blocoId }: IUseSalasProps = {}) => {
  const [salas, setSalas] = useState<ISala[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAllSalas = async () => {
      setLoading(true);
      setError(false);

      try {
        let allSalas: ISala[] = [];
        let page = 1;
        let next: string | null = null;

        do {
          const url = `/chameco/api/v1/salas/?limit=50&page=${page}&nome=${nome}`;
          const response = await api.get<IApiResponseSalas>(url);

          let results = response.data.results;

          if (blocoId !== undefined) {
            results = results.filter((sala) => sala.bloco === blocoId);
          }

          const novosIds = results.map((r) => r.id);
          const existentesIds = allSalas.map((s) => s.id);
          const filteredResults = results.filter((r) => !existentesIds.includes(r.id));

          allSalas = [...allSalas, ...filteredResults];
          next = response.data.next;
          page++;
        } while (next);

        setSalas(allSalas);
      } catch (err) {
        console.error("Erro ao listar salas", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSalas();
  }, [nome, blocoId]);

  return { salas, loading, error };
};

export default useGenericGetSalas;
