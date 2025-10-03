import { useEffect, useState } from "react";
import { IUsuario } from "../../pages/chaves";
import api from "../../services/api";
import { totalPaginas } from "../../utils/filters/users/userFilter";

export interface IApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IUsuario[];
}

const useGenericGetUsers = ( nome = "", ) => {
  const [page, setPage] = useState(1);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([])
  const [temMais, setTemMais] = useState(true); // permanece interno como no seu código
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);


  useEffect(() => {
    const fetchUsuarios = async (pagina: number) => {

      try {

        const url = `/chameco/api/v1/usuarios/?pagination=${5}&?page=${pagina}&nome=${nome}`;

        const response = await api.get<IApiResponse>(url);

        const { results, next } = response.data;

        // console.log("Generic: ", results)
        setUsuarios(results)
        setTemMais(Boolean(next));
      } catch (err: any) {
        // ignora erros de cancelamento
        // console.log("erro ao listar usuários")
      }
    };

    fetchUsuarios(page);

  }, [page, nome]);

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
    loading,
    error
  };
};

export default useGenericGetUsers;

