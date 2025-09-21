import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { ISala } from "../../pages/chaves";
// import { IChave } from "../../pages/chaves";

export interface IUsuario {
  autorizado_emprestimo: boolean;
  salas_autorizadas: ISala[];
  id: number;
  id_cortex: number;
  nome: string;
  setor: string;
  tipo: string;
  superusuario?: number;
}

export interface IChave {
  id: number;
  sala: number | null;
  disponivel: boolean;
  usuarios: IUsuario[];
  descricao?: string | null;
}

export interface IApiResponseChaves {
  count: number;
  next: string | null;
  previous: string | null;
  results: IChave[];
}

interface IUseChavesProps {
  disponivel?: boolean;
  nome?: string;
  pagination?: number;
}

const useGenericGetChaves = ({ disponivel, pagination = 50 }: IUseChavesProps = {}) => {
  const [chaves, setChaves] = useState<IChave[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchChaves = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(false);

    try {
      const currentToken = localStorage.getItem("authToken");
      let allChaves: IChave[] = [];
      let nextUrl: string | null = `/chameco/api/v1/chaves/?pagination=${pagination}`;
      if (disponivel !== undefined) {
        nextUrl += `&disponivel=${disponivel}`;
      }

      while (nextUrl) {
        const response = await api.get<IApiResponseChaves>(nextUrl, {
          params: { token: currentToken },
        });

        allChaves = [...allChaves, ...response.data.results];

        if (response.data.next) {
          const url: URL = new URL(response.data.next);
          nextUrl = url.pathname + url.search;
        } else {
          nextUrl = null;
        }
      }

      const uniqueChaves = Array.from(new Set(allChaves.map(c => c.id)))
        .map(id => allChaves.find(c => c.id === id)) as IChave[];

      setChaves(uniqueChaves);
      console.log(`Total de chaves carregadas: ${uniqueChaves.length}`);
    } catch (err) {
      console.error("Erro ao listar chaves:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [disponivel, pagination]);

  useEffect(() => {
    fetchChaves();
  }, [fetchChaves]);

  const refetch = (forceRefresh = false): void => {
    if (forceRefresh || chaves.length === 0) {
      fetchChaves();
    }
  };

  return { chaves, loading, error, refetch };
};

export default useGenericGetChaves;
