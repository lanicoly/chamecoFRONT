// import axios from "axios";
import { useEffect, useState } from "react";
import api from "../../services/api";



const CACHE_TTL = 60 * 5; // 5 minutes



const useGetResponsaveis = () => {
  const [responsaveis, setResponsaveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchResponsaveis = async () => {
      const token = localStorage.getItem("authToken");
      const cache = localStorage.getItem("responsaveis");
      const cachTimestamp = localStorage.getItem("responsaveisTimestamp");

      if (!token) {
        setError(new Error("Token não encontrado"));
        setLoading(false);
        return;
      }

      const isCacheValid = cachTimestamp && (Date.now() - parseInt(cachTimestamp)) < CACHE_TTL;

      // verifica se já existe no localStorage
      if (isCacheValid) {
        setResponsaveis(JSON.parse(cache || "[]"));
        setLoading(false);
        return; 

      } else {
        const params = new URLSearchParams({ token });
        const url = `/chameco/api/v1/responsaveis/?${params.toString()}`;

        try {
          const response = await api.get(url);

          if (!response) throw new Error("Erro ao puxar os responsáveis");

          setResponsaveis(response.data.results || []);

          localStorage.setItem("responsaveis", JSON.stringify(response.data.results || []));
          localStorage.setItem("responsaveisTimestamp", Date.now().toString());

        } catch (err) {
          console.error("Erro na requisição:", err);
          setError(err as Error);

        } finally {
          setLoading(false);
        }
        }
    };

    fetchResponsaveis();
  }, []);

  return { responsaveis, loading, error };
};

export default useGetResponsaveis;