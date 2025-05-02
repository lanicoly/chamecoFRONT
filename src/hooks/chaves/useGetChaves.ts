import axios from "axios";
import { useEffect, useState } from "react";

const url_base = "https://chamecoapi.pythonanywhere.com/";

const CACHE_TTL = 60 * 5; // 5 minutes

console.log("useGetChaves.ts");

const useGetChaves = () => {

    const [chaves, setChaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    
    useEffect(() => {
        const fetchChaves = async () => {
          const token = localStorage.getItem("authToken");
          const cache = localStorage.getItem("chaves");
          const cachTimestamp = localStorage.getItem("chavesTimestamp");
    
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
            const url = `${url_base}/chameco/api/v1/chaves/?${params.toString()}`;
    
            try {
              const response = await axios.get(url);
    
              if (!response) throw new Error("Erro ao puxar as chaves");
    
              setChaves(response.data.results || []);
    
              localStorage.setItem("chaves", JSON.stringify(response.data.results || []));
              localStorage.setItem("chavesTimestamp", Date.now().toString());
    
            } catch (err) {
              console.error("Erro na requisição:", err);
              setError(err as Error);
            } finally {
              setLoading(false);
            }
          }
        };
    
        fetchChaves();
      }, []);
    
      return { chaves, loading, error };
}

export default useGetChaves