import { useEffect, useState } from "react";
import api from "../../services/api";
import { IUsuario } from "../../components/inputs/FilterableInputResponsaveis";

const superUsuariosIds = [1554, 1553, 633, 634];


const useGetResponsaveis = (id?: number) => {
  const [responsaveis, setResponsaveis] = useState<IUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchResponsaveis = async () => {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");
      const superusuario = userData ? Number(userData) : null;

      if (!token) {
        setError(new Error("Token não encontrado"));
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      if (superusuario !== null && superUsuariosIds.includes(superusuario)) {
        params.set("superusuario", String(superusuario));
      }
      params.set("token", token);

      const url = id ? `/chameco/api/v1/responsaveis/${id}/` : `/chameco/api/v1/responsaveis/`;

      try {
        const response = await api.get(url, { 
          params,
          timeout: 15000 
        });
        
        let data = response.data.results || response.data;
        if (!Array.isArray(data)) {
          data = [data];
        }

        setResponsaveis(data);
      } catch (err) {
        console.error("Erro na requisição:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponsaveis();
  }, [id, refresh]);

  return { responsaveis, loading, error, reload: () => setRefresh(prev => prev + 1) };
};

export default useGetResponsaveis;