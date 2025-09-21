import { useEffect, useState } from "react";
import api from "../../services/api";
import { ISala } from "../../pages/chaves";
import { Iusuario } from "../../pages/usuarios";

export interface IApiResponseSalas {
  count: number;
  next: string | null;
  previous: string | null;
  results: ISala[];
}

interface IUseSalasProps {
  nome?: string;
  blocoId?: number; 
  nome_bloco?: string;
  usuarios?: Iusuario[];
}

const useGenericGetSalas = ({ nome = "", blocoId }: IUseSalasProps = {}) => {
  const [salas, setSalas] = useState<ISala[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSalas = async () => {
      setLoading(true);
      setError(false);

      try {
        let allSalas: ISala[] = [];
        let url = `/chameco/api/v1/salas/?pagination=50&nome=${nome}`;
        if (blocoId !== undefined) {
          url += `&bloco=${blocoId}`;
        }
        
        let next: string | null = url;

        while (next) {
          const response = await api.get<IApiResponseSalas>(next);
          allSalas = [...allSalas, ...response.data.results];
          next = response.data.next;
        }

        const uniqueSalas = Array.from(new Set(allSalas.map(s => s.id)))
            .map(id => {
                return allSalas.find(s => s.id === id);
            });
        
        setSalas(uniqueSalas as ISala[]); 

      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSalas();
  }, [nome, blocoId]);


  return { salas, loading, error };
};

export default useGenericGetSalas;