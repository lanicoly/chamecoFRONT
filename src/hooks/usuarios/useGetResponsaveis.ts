// import axios from "axios";
import { useEffect, useState } from "react";
import api from "../../services/api";
// import { id } from "date-fns/locale";

const superUsuariosIds = [1554, 1553, 633, 634]

const useGetResponsaveis = (id: number) => {
  const [responsaveis, setResponsaveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchResponsaveis = async () => {
      const token = localStorage.getItem("authToken");
      const superusuario = Number(localStorage.getItem("userData"));

      if (!token) {
        setError(new Error("Token não encontrado"));
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();

      if (superusuario != null && Number.isFinite(superusuario)) {
        // garanta que a lista é de números; se for de strings, converta/compare como string
        if (superUsuariosIds.includes(superusuario)) {
          params.set("superusuario", String(superusuario));
        }
      }

      if (token) params.set("token", token);

      const url = `/chameco/api/v1/responsaveis/?${id}/`;

      try {
        // console.log(url)
        const response = await api.get(url);

        const data = id ? [response.data] : (response.data.results || response.data);
        setResponsaveis(data);

      } catch (err) {
        console.error("Erro na requisição:", err);
        setError(err as Error);

      } finally {
        setLoading(false);
      }
    };

    fetchResponsaveis();
  }, [ id, refresh]);

  return { responsaveis, loading, error, reload: () => setRefresh(prev => prev + 1)};
};

export default useGetResponsaveis;