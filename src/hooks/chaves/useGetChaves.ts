import axios from "axios";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { set } from "date-fns";


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
    
            try {
              const response = await api.get(`/chameco/api/v1/chaves/`);
    
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