
import { useEffect, useState } from "react";
import api from "../../services/api";

export interface IUsuario {
  autorizado_emprestimo: boolean,
  chaves: IChave[];
  id: number,
  id_cortex: number,
  nome: string,
  setor: string,
  tipo: string,
  superusuario?: number
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

const useGenericGetChaves = () => {
  const [chaves, setChaves] = useState<IChave[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Função para buscar todas as páginas da API
  const fetchAllChaves = async () => {
    try {
      setLoading(true);
      setError(false);
      const currentToken = localStorage.getItem("authToken");
      
      let allChaves: IChave[] = [];
      let nextUrl: string | null = "/chameco/api/v1/chaves/";
      
      // Loop para buscar todas as páginas
      while (nextUrl) {
        const response = await api.get<IApiResponseChaves>(nextUrl, {
          params: { token: currentToken }
        });
        
        const { results, next } = response.data;
        allChaves = [...allChaves, ...results];
        
        // Se next for uma URL completa, extrair apenas o path
        if (next) {
          const url = new URL(next);
          nextUrl = url.pathname + url.search;
        } else {
          nextUrl = null;
        }
      }
      
      console.log(`Total de chaves carregadas: ${allChaves.length}`);
      setChaves(allChaves);
      
    } catch (err: any) {
      setError(true);
      console.error("Erro ao listar chaves:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllChaves();
  }, []);

  // Função refetch também busca todas as páginas
  const refetch = (forceRefresh = false) => {
    if (forceRefresh || chaves.length === 0) {
      fetchAllChaves();
    }
  };

  return {
    chaves,
    loading,
    error,
    refetch
  };
};

export default useGenericGetChaves;