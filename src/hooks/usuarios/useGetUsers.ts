import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { IUsuario } from "../../pages/chaves";

const useGetUsuarios = (limit = 5) => {  
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [temMais, setTemMais] = useState(true);

  const fetchUsuarios = useCallback(async (pagina: number) => {

    setLoading(true);

    try {

      const cacheKey = `usuarios_page_${pagina}_limit_${limit}`;
      const cachedData = JSON.parse(localStorage.getItem(cacheKey) || '[]');

      if (cachedData.length > 0) { 
        console.log(`Carregando dados da página ${pagina} do cache`);
        setUsuarios(cachedData);
        setLoading(false);
        return;
      } else {

        const url = `/chameco/api/v1/usuarios/?limit=${limit}&page=${pagina}`;
        const response = await api.get(url);

        if (!response.data) throw new Error("Erro ao puxar os usuários");

        const { results, count, next } = response.data;

        localStorage.setItem(cacheKey, JSON.stringify(results));

        // Atualiza os estados com os dados
        setUsuarios(results);
        setTotalPaginas(Math.ceil(count / limit));  // Total de páginas calculado corretamente
        setTemMais(!!next); // Se houver 'next', há mais páginas
      }

    } catch (err) {
      console.error("Erro na requisição:", err);
      setError(err instanceof Error ? err : new Error("Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchUsuarios(page);
  }, [page, fetchUsuarios]);

  const nextPage = () => {
    if (temMais) setPage((prev) => prev + 1); 
  };

  const prevPage = () => {
    if (page > 1) setPage((prev) => prev - 1); 
  };

  return {
    usuarios,
    loading,
    error,
    page,
    totalPaginas,
    nextPage,
    prevPage,
    temMais
  };
};

export default useGetUsuarios;

