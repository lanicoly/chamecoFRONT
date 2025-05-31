import { useEffect, useState } from "react";
import api from "../../services/api.js";

const useGetChaves = () => {
  const [chaves, setChaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchChaves = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      if (!token) {
        setError(new Error("Token não encontrado"));
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/chameco/api/v1/chaves/`);
        setChaves(response.data?.results || []);
      } catch (err) {
        console.error("Erro na requisição:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchChaves(); // Executa uma vez ao montar
  }, []); // NÃO depende de `chaves`

  return { chaves, loading, error };
};

export default useGetChaves;
