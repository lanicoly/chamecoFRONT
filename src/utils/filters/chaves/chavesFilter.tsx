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

export let totalPaginas = 1;

export const useChavesFilter = (
  nome: string,
  tipoUsuario?: string,
  page?: number,
) => {
  const [chaves, setChaves] = useState<IChave[]>([]);
  const [, setLoading] = useState<boolean>(false);
  const [, setHasMore] = useState<boolean>(true);

  const fetchUsuarios = async (nome: string, page?: number) => {
    setLoading(true);

    try {
      const response = await api.get(
        `/chameco/api/v1/chaves/?pagination=${5}&page=${page}&sala=${nome}&disponivel=true`,
      );
      const { results, count } = response.data;

      if (results.length < 5) {
        setHasMore(false);
      }

      setChaves(results);
      totalPaginas = Math.max(1, Math.ceil(count / itensPorPagina));
    } catch (error) {
      console.error("Erro na requisição:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (nome || tipoUsuario) {
      setChaves([]);
      setHasMore(true);
    }
  }, [nome, tipoUsuario]);

  useEffect(() => {
    if (nome || tipoUsuario) {
      fetchUsuarios(nome, page);
    }
  }, [nome, tipoUsuario, page]);

  const normalizar = (texto: string) =>
    texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  if (chaves) {
    const termoNormalizado = normalizar(nome);

    return chaves?.filter((chave) => {
      const nomeMatch = normalizar(chave.nome_sala || "").includes(
        termoNormalizado,
      );
      const filtroMatch = tipoUsuario === "todos";

      if (!nome) {
        return filtroMatch;
      }

      return nomeMatch && filtroMatch;
    });
  }
};
