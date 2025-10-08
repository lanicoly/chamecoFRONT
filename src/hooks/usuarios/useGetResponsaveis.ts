// import axios from "axios";
import { useEffect, useState } from "react";
import api from "../../services/api";

const superUsuariosIds = [1554, 1553, 633, 634]

const useGetResponsaveis = () => {
  const [responsaveis, setResponsaveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

      const url = `/chameco/api/v1/responsaveis/?${params.toString()}`;

      try {
        // console.log(url)
        const response = await api.get(url);

        if (!response) throw new Error("Erro ao puxar os responsáveis");

        setResponsaveis(response.data.results || []);

      } catch (err) {
        console.error("Erro na requisição:", err);
        setError(err as Error);

      } finally {
        setLoading(false);
      }
    };

    fetchResponsaveis();
  }, []);

  return { responsaveis, loading, error };
};

export default useGetResponsaveis;