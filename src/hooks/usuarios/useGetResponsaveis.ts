// import axios from "axios";
import { useEffect, useState } from "react";
import api from "../../services/api";

const useGetResponsaveis = (superusuario: number | null = null) => {
  const [responsaveis, setResponsaveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchResponsaveis = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError(new Error("Token não encontrado"));
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({ token });
      const url = `/chameco/api/v1/responsaveis/?${params.toString()}&superusuario=${superusuario}`;

      try {
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