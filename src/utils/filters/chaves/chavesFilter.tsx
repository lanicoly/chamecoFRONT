import { useEffect, useState } from "react";
import { IUsuario } from "../../../pages/chaves";
import api from "../../../services/api";

interface IChave {
  id: number;
  sala: number | null;
  nome_sala: string;
  disponivel: boolean;
  usuarios: IUsuario[];
  descricao?: string | null;
}

const itensPorPagina = 5;

export var totalPaginas = 1;

export const chavesFilter = (
  nome: string,
  tipoUsuario?: string,
  page?: number,
) => {
  const [insidePage, setInsidePage] = useState(1);
  const [chaves, setChaves] = useState<IChave[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true); // Verifica se há mais dados
  // const [totalPaginas, setTotalPaginas] = useState<number>(1)

  const fetchUsuarios = async (nome: string, tipo?: string, page?: number) => {
    setLoading(true);
    
    try {
      const response = await api.get(
        `/chameco/api/v1/chaves/?pagination=${5}&page=${page}&sala=${nome}&disponivel=true`
      );
      const { results, count } = response.data;

      if (results.length < 5) {
        setHasMore(false); // Se o número de resultados for menor que 5, significa que não há mais dados
      }

      setChaves(results)
      totalPaginas = (Math.max(1, Math.ceil(count/itensPorPagina)));
      console.log("Aqui as chaves:", results)
    } catch (error) {
      console.error("Erro na requisição:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (nome || tipoUsuario) {
      setChaves([]); // Resetando os usuários sempre que houver nova pesquisa ou filtro
      setHasMore(true); // Reinicia a verificação de mais registros
    }
  }, [nome, tipoUsuario]);


  useEffect(() => {
    if (nome || tipoUsuario) {

      if (tipoUsuario === "todos") {
          fetchUsuarios(nome, "", page);
      } else {
          fetchUsuarios(nome, tipoUsuario, page);
      }
    }
  }, [nome, tipoUsuario, page]);


  if (chaves) {
    return chaves?.filter((chave) => {
      const nomeMatch = chave.nome_sala.toLowerCase().includes(nome.toLowerCase());
    //   const setorMatch = usuario.setor.toLowerCase().includes(pesquisa.toLowerCase());
      const filtroMatch = tipoUsuario === "todos";

      if (!nome) {
        return filtroMatch;
      }

      return (nomeMatch) && filtroMatch;
    })
  }
};
