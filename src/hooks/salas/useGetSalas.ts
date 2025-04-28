import axios from "axios";
import { useEffect, useState } from "react";

const url_base = "https://chamecoapi.pythonanywhere.com/";

console.log("useGetSalas.ts");

const useGetSalas = () => {

    const [salas, setSalas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [salasLocalStorage, setSalasLocalStorage] = useState<string | null>(localStorage.getItem("salas"));
   
    useEffect(() => {
        const fetchResponsaveis = async () => {
            const token = localStorage.getItem("authToken");
    
            if (!token) {
                setError(new Error("Token não encontrado"));
                setLoading(false);
                return;
            }

            if (salasLocalStorage) {
                setSalas(JSON.parse(salasLocalStorage));
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