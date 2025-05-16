// import axios from "axios";
import { ca } from "date-fns/locale";
import { useEffect, useState } from "react";
import api from "../../services/api";



const CACHE_TTL = 60 * 5; // 5 minutes


const useGetUsuarios = () => {

    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    
    useEffect(() => {
        const fetchResponsaveis = async () => {
          const token = localStorage.getItem("authToken");
          const cache = localStorage.getItem("usuarios");
          const cachTimestamp = localStorage.getItem("usuariosTimestamp");
    
          if (!token) {
            setError(new Error("Token não encontrado"));
            setLoading(false);
            return;
          }

          const isCacheValid = cachTimestamp && (Date.now() - parseInt(cachTimestamp)) < CACHE_TTL;

          if (isCacheValid) {
            setUsuarios(JSON.parse(cache || "[]"));
            setLoading(false);
            return; 

          } else {
            const params = new URLSearchParams({ token });
            const url = `/chameco/api/v1/usuarios/?${params.toString()}`;
      
            try {
              const response = await api.get(url);
      
              if (!response) throw new Error("Erro ao puxar os usuários");
      
              setUsuarios(response.data.results || []);
              localStorage.setItem("usuarios", JSON.stringify(response.data.results || []));
              localStorage.setItem("usuariosTimestamp", Date.now().toString());

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