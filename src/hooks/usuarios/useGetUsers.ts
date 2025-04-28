import axios from "axios";
import { useEffect, useState } from "react";

const url_base = "https://chamecoapi.pythonanywhere.com/";

console.log("useGetUsuarios.ts");

const useGetUsuarios = () => {

    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [usuariosLocalStorage, setUsuariosLocalStorage] = useState<string | null>(localStorage.getItem("usuarios"));
    
    useEffect(() => {
        const fetchResponsaveis = async () => {
          const token = localStorage.getItem("authToken");
    
          if (!token) {
            setError(new Error("Token não encontrado"));
            setLoading(false);
            return;
          }

          if (usuariosLocalStorage) {
            setUsuarios(JSON.parse(usuariosLocalStorage));
            setLoading(false);
            return; 

          } else {

            const params = new URLSearchParams({ token });
            const url = `${url_base}/chameco/api/v1/usuarios/?${params.toString()}`;
      
            try {
              const response = await axios.get(url, {
                headers: {
                  "Content-Type": "application/json"
                }
              });
      
              if (!response) throw new Error("Erro ao puxar os usuários");
      
              setUsuarios(response.data.results || []);
              localStorage.setItem("usuarios", JSON.stringify(response.data.results || []));

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
    
      return { usuarios, loading, error };
}

export default useGetUsuarios;