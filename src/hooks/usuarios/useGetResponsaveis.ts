import axios from "axios";
import { useEffect, useState } from "react";

const url_base = "https://chamecoapi.pythonanywhere.com/";

console.log("useGetResponsaveis.ts");


const useGetResponsaveis = () => {
  const [responsaveis, setResponsaveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [responsaveisLocalStorage, setResponsaveisLocalStorage] = useState<string | null>(localStorage.getItem("responsaveis"));

  useEffect(() => {
    const fetchResponsaveis = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError(new Error("Token não encontrado"));
        setLoading(false);
        return;
      }

      // verifica se já existe no localStorage
      if (responsaveisLocalStorage) {
        setResponsaveis(JSON.parse(responsaveisLocalStorage));
        setLoading(false);
        return; 

      } else {
        const params = new URLSearchParams({ token });
        const url = `${url_base}/chameco/api/v1/responsaveis/?${params.toString()}`;

        try {
          const response = await axios.get(url, {
            headers: {
              "Content-Type": "application/json"
            }
          });

          if (!response) throw new Error("Erro ao puxar os responsáveis");

          setResponsaveis(response.data.results || []);

          localStorage.setItem("responsaveis", JSON.stringify(response.data.results || []));

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

  return { responsaveis, loading, error };
};

export default useGetResponsaveis;