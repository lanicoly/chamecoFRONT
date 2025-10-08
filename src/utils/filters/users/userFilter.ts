import { useEffect, useState } from "react";
import { IUsuario } from "../../../pages/chaves";
import api from "../../../services/api";

const itensPorPagina = 5;

export var totalPaginas = 1;

export const userFilter = (
  pesquisa: string,
  tipoUsuario?: string,
  page?: number,
) => {
  const [insidePage, setInsidePage] = useState(1);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true); // Verifica se há mais dados
  // const [totalPaginas, setTotalPaginas] = useState<number>(1)

  const fetchUsuarios = async (pesquisa: string, tipo?: string, page?: number) => {
    setLoading(true);

    try {
      const response = await api.get(
        `/chameco/api/v1/usuarios/?pagination=${5}&page=${page}&nome=${pesquisa}&tipo=${tipo}`
      );
      const { results, count } = response.data;

      if (results.length < 5) {
        setHasMore(false); // Se o número de resultados for menor que 5, significa que não há mais dados
      }

      setUsuarios(results)
      totalPaginas = (Math.max(1, Math.ceil(count/itensPorPagina)));
      // console.log("Aqui:", results)
    } catch (error) {
      console.error("Erro na requisição:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pesquisa || tipoUsuario) {
      setUsuarios([]); // Resetando os usuários sempre que houver nova pesquisa ou filtro
      // setInsidePage(1); // Volta para a página inicial
      setHasMore(true); // Reinicia a verificação de mais registros
    }
  }, [pesquisa, tipoUsuario]);


  useEffect(() => {
    if (pesquisa || tipoUsuario) {

      if (tipoUsuario === "todos") {
        fetchUsuarios(pesquisa, "", page);
      } else {
        fetchUsuarios(pesquisa, tipoUsuario, page);
      }
    }
  }, [pesquisa, tipoUsuario, page]);


  if (usuarios) {
    return usuarios?.filter((usuario) => {
      const nomeMatch = usuario.nome.toLowerCase().includes(pesquisa.toLowerCase());
      //   const setorMatch = usuario.setor.toLowerCase().includes(pesquisa.toLowerCase());
      const filtroMatch = tipoUsuario === "todos" || usuario.tipo.toLowerCase() === tipoUsuario.toLowerCase();

      if (!pesquisa) {
        return filtroMatch;
      }

      return (nomeMatch) && filtroMatch;
    })
  }
};
