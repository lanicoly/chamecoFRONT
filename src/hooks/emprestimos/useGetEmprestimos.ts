// import axios from "axios";
import { useEffect, useState } from "react";
import api from "../../services/api";

const CACHE_TTL = 60 * 1; // 5 minutes


const useGetEmprestimos = (finalizados?: boolean, refreshTrigger?: number) => {
  const [emprestimos, setChaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEmprestimos = async () => {
      const token = localStorage.getItem("authToken");
      const cache = localStorage.getItem("emprestimos");
      const cachTimestamp = localStorage.getItem("emprestimosTimestamp");

      if (!token) {
        setError(new Error("Token não encontrado"));
        setLoading(false);
        return;
      }

      const isCacheValid = cachTimestamp && (Date.now() - parseInt(cachTimestamp)) < CACHE_TTL;

      if (isCacheValid) {
        setChaves(JSON.parse(cache || "[]"));
        setLoading(false);
        return;
      } else {
        const params = new URLSearchParams({ token });
        if (finalizados !== undefined) {
          params.append("finalizados", finalizados.toString()); 
        }

        const url = `/chameco/api/v1/emprestimos/?${params.toString()}`;

        try {
          const response = await api.get(url);

          if (!response) throw new Error("Erro ao puxar as chaves");

          setChaves(response.data.results || []);


          localStorage.setItem("emprestimos", JSON.stringify(response.data.results || []));
          localStorage.setItem("emprestimosTimestamp", Date.now().toString());
          ""        } catch (err) {
          console.error("Erro na requisição:", err);
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEmprestimos();
  }, [finalizados, refreshTrigger]); 

  return { new_emprestimos: emprestimos, loading, error };
}

export default useGetEmprestimos;
