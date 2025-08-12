import { useEffect, useRef, useState } from "react";
import { IUsuario } from "../../pages/chaves";
import api from "../../services/api";

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IUsuario[];
}

const useGetUsers = (limit = 5) => {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [temMais, setTemMais] = useState(true); // permanece interno como no seu código


  useEffect(() => {
    const fetchUsuarios = async (pagina: number, pageSize: number) => {
      setLoading(true);
      setError(null);

      try {

        const url = `/chameco/api/v1/usuarios/?page=${pagina}`;

        const response = await api.get<ApiResponse>(url);

        const { results, count, next } = response.data;

        console.log("Response: ", response.data)
        setUsuarios(results); // sobrescreve: paginação normal
        setTotalPaginas(Math.max(1, Math.ceil(count / pageSize)));
        setTemMais(Boolean(next));
      } catch (err: any) {
        // ignora erros de cancelamento
        if (err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
          setError(err?.message ?? new Error("Erro ao carregar usuários"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios(page, limit);

  }, [page, limit]);

  const nextPage = () => {
    console.log(`Avançou para ${page + 1}`);
    if (temMais) setPage((p) => p + 1);
  };

  const prevPage = () => {
    console.log(`Voltou para ${page - 1}`);
    if (page > 1) setPage((p) => p - 1);
  };

  return {
    usuarios,
    loading,
    error,
    page,
    totalPaginas,
    nextPage,
    prevPage,
  };
};

export default useGetUsers;

