import { useEffect, useState } from "react";
import { IUsuario } from "../../../pages/chaves";
import api from "../../../services/api";

const itensPorPagina = 5;

export let totalPaginas = 1;

export const useUserFilter = (
  pesquisa: string,
  tipoUsuario?: string,
  page?: number,
) => {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [, setLoading] = useState<boolean>(false);
  const [, setHasMore] = useState<boolean>(true);

  const normalizar = (texto: string) =>
    texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const fetchUsuarios = async (
    pesquisa: string,
    tipo?: string,
    page?: number
  ) => {
    setLoading(true);

    try {
      const response = await api.get(
        `/chameco/api/v1/usuarios/?pagination=${5}&page=${page}&nome=${pesquisa}&tipo=${tipo}`
      );

      const { results, count } = response.data;

      if (results.length < 5) {
        setHasMore(false);
      }

      setUsuarios(results);

      totalPaginas = Math.max(
        1,
        Math.ceil(count / itensPorPagina)
      );
    } catch (error) {
      console.error("Erro na requisição:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pesquisa || tipoUsuario) {
      setUsuarios([]);
      setHasMore(true);
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
    return usuarios.filter((usuario) => {
      const nomeMatch = normalizar(usuario.nome || "").includes(
        normalizar(pesquisa || "")
      );

      const tipoAtual = tipoUsuario ?? "todos";

      const filtroMatch =
        tipoAtual === "todos" ||
        usuario.tipo?.toLowerCase() === tipoAtual.toLowerCase();

      if (!pesquisa) {
        return filtroMatch;
      }

      return nomeMatch && filtroMatch;
    });
  }

  return [];
};