import axios from "axios";
import { useEffect, useState } from "react";

const url_base = "https://chamecoapi.pythonanywhere.com/";

const CACHE_TTL = 60 * 5; // 5 minutes

console.log("useGetSalas.ts");

const useGetSalas = () => {

    const [salas, setSalas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
   
    useEffect(() => {
        const fetchResponsaveis = async () => {
            const token = localStorage.getItem("authToken");
            const cache = localStorage.getItem("salas");
            const cachTimestamp = localStorage.getItem("salasTimestamp");
    
            if (!token) {
                setError(new Error("Token não encontrado"));
                setLoading(false);
                return;
            }

            const isCacheValid = cachTimestamp && (Date.now() - parseInt(cachTimestamp)) < CACHE_TTL;

            if (isCacheValid) {
                setSalas(JSON.parse(cache || "[]"));
                setLoading(false);
                return; 

            } else {
                
                const params = new URLSearchParams({ token });
                const url = `${url_base}/chameco/api/v1/salas/?${params.toString()}`;
        
                try {
                    const response = await axios.get(url, {
                        headers: {
                        "Content-Type": "application/json"
                        }
                    });
            
                    if (!response) throw new Error("Erro ao puxar as salas");
            
                    setSalas(response.data.results || []);
                    localStorage.setItem("salas", JSON.stringify(response.data.results || []));
                    localStorage.setItem("salasTimestamp", Date.now().toString());

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
   
     return { salas, loading, error };
}

export default useGetSalas;