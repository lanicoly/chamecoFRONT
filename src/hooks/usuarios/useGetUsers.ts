import { useEffect, useState } from "react";
import api from "../../services/api";
import { IUsuario } from "../../pages/chaves";

const CACHE_TTL = 60 * 5 * 1000; // 5 minutos em milissegundos

const useGetUsuarios = () => {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [temMais, setTemMais] = useState(true);
  const [totalPaginas, setTotalPaginas] = useState(20);
  const limit = 20;


  useEffect(() => {
    const fetchUsuarios = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError(new Error("Token não encontrado"));
        setLoading(false);
        return;
      }

      const cacheKey = `usuarios_page_${page}`;
      const timestampKey = `usuarios_timestamp_page_${page}`;
      const cache = localStorage.getItem(cacheKey);
      const cacheTimestamp = localStorage.getItem(timestampKey);

      const isCacheValid =
        cacheTimestamp && Date.now() - parseInt(cacheTimestamp) < CACHE_TTL;

      setLoading(true);

      if (isCacheValid && cache) {
        setUsuarios(JSON.parse(cache));
        setLoading(false);
        return;
      }

      try {
        const params = new URLSearchParams({ token });
        const url = `/chameco/api/v1/usuarios/?${params.toString()}&limit=${limit}&page=${page}`;

        const response = await api.get(url);

        if (!response || !response.data) {
          throw new Error("Erro ao puxar os usuários");
        }

        const results = response.data.results || [];
        const total = response.data.count || 0;
        setUsuarios(results);
        setTemMais(results.length === limit); // se retornou menos que 20, provavelmente é a última página
        setTotalPaginas(Math.ceil(total / limit))

        localStorage.setItem(cacheKey, JSON.stringify(results));
        localStorage.setItem(timestampKey, Date.now().toString());
        console.log("Usuários:", response)
      } catch (err) {
        console.error("Erro na requisição:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [page]);

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
    temMais,
  };
};

export default useGetUsuarios;
