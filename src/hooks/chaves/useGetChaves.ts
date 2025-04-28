import axios from "axios";
import { useEffect, useState } from "react";

const url_base = "https://chamecoapi.pythonanywhere.com/";

console.log("useGetChaves.ts");

const useGetChaves = () => {

    const [chaves, setChaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [chavesLocalStorage, setChavesLocalStorage] = useState<string | null>(localStorage.getItem("chaves"));
    
    useEffect(() => {
        const fetchResponsaveis = async () => {
          const token = localStorage.getItem("authToken");
    
          if (!token) {
            setError(new Error("Token não encontrado"));
            setLoading(false);
            return;
          }

          if (chavesLocalStorage) {
            setChaves(JSON.parse(chavesLocalStorage));
            setLoading(false);
            return; 

          } else {
            const params = new URLSearchParams({ token });
            const url = `${url_base}/chameco/api/v1/chaves/?${params.toString()}`;
    
            try {
              const response = await axios.get(url, {
                headers: {
                  "Content-Type": "application/json"
                }
              });
    
              if (!response) throw new Error("Erro ao puxar as chaves");
    
              setChaves(response.data.results || []);
    
              localStorage.setItem("chaves", JSON.stringify(response.data.results || []));
    
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
    
      return { chaves, loading, error };
}

export default useGetChaves