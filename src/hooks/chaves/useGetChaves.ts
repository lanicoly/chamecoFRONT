import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";


const CACHE_TTL = 60 * 1 ; 

// Interface para a estrutura de Chave (baseado no que a API retorna)
interface IChave {
  id: number;
  sala: number; 
  disponivel: boolean;
  usuarios: { id: number; nome: string }[]; 
  descricao?: string | null;
}

const useGetChaves = () => {
  const [chaves, setChaves] = useState<IChave[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Usando useCallback para memoizar a função fetchChaves
  const fetchChaves = useCallback(async (forceRefresh = false) => {
    setLoading(true); // Inicia o carregamento sempre que buscar
    setError(null); // Limpa erros anteriores

    const token = localStorage.getItem("authToken");
    const cache = localStorage.getItem("chaves");
    const cacheTimestamp = localStorage.getItem("chavesTimestamp");

    if (!token) {
      setError(new Error("Token não encontrado."));
      setLoading(false);
      setChaves([]); // lista vazia se não houver token
      return;
    }

    const now = Date.now();
    const isCacheValid = !forceRefresh && // Só considera cache se não for forçado refresh
      cache && 
      cacheTimestamp && 
      (now - parseInt(cacheTimestamp)) < CACHE_TTL;

    if (isCacheValid) {
      try {
        setChaves(JSON.parse(cache || "[]"));
      } catch (parseError) {
        console.error("Erro ao parsear cache:", parseError);
        setError(new Error("Erro ao ler dados do cache."));
        localStorage.removeItem("chaves"); 
        localStorage.removeItem("chavesTimestamp");
      }
      setLoading(false);
      return;
    }

    // Se o cache não for válido ou forceRefresh for true, busca da API
    console.log(forceRefresh ? "Forçando refresh, buscando chaves da API..." : "Cache inválido ou ausente, buscando chaves da API...");
    try {
      const response = await api.get<{ results: IChave[] }>("/chameco/api/v1/chaves/", {
        params: { token: token }
      });

      
      const chavesData = response.data.results || (Array.isArray(response.data) ? response.data : []);
      
      setChaves(chavesData);
      localStorage.setItem("chaves", JSON.stringify(chavesData));
      localStorage.setItem("chavesTimestamp", now.toString());
      console.log("Chaves buscadas da API e cacheadas.");

    } catch (err: unknown) {
      console.error("Erro na requisição API para buscar chave:", err);
      setError(err as Error);
      setChaves([]); // Limpa chaves em caso de erro na API
    } finally {
      setLoading(false);
    }
  }, []); 

  // useEffect para buscar os dados na montagem inicial do hook
  useEffect(() => {
    fetchChaves(); 
  }, [fetchChaves]); 


  return { 
    chaves, 
    loading, 
    error, 
    refetch: fetchChaves 
  };
};

export default useGetChaves;

