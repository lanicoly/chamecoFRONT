import { useEffect, useState } from "react";
import { IUsuario } from "../../pages/chaves";
import api from "../../services/api";
import { totalPaginas } from "../../utils/userFilter";

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IUsuario[];
}

const useGenericGetUsers = () => {
  const [page, setPage] = useState(1);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([])
  const [temMais, setTemMais] = useState(true); // permanece interno como no seu código


  useEffect(() => {
    const fetchUsuarios = async (pagina: number) => {

      try {

        const url = `/chameco/api/v1/usuarios/?page=${pagina}`;

        const response = await api.get<ApiResponse>(url);

        const { results, next } = response.data;

        setUsuarios(results)
        setTemMais(Boolean(next));
      } catch (err: any) {
        // ignora erros de cancelamento
        console.log("erro ao listar usuários")
      }
    };

    fetchUsuarios(page);

  }, [page]);

  const nextPage = () => {
    if (temMais && page !== totalPaginas) setPage((p) => p + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  return {
    usuarios,
    page,
    nextPage,
    prevPage,
  };
};

export default useGenericGetUsers;

