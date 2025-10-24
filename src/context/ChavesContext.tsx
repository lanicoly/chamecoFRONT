import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { IChave } from "../pages/chaves";

interface ChavesContextType {
  chaves: IChave[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const ChavesContext = createContext<ChavesContextType | undefined>(undefined);

export const ChavesProvider = ({ children }: { children: React.ReactNode }) => {
  const [chaves, setChaves] = useState<IChave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllPages = useCallback(async () => {
    setLoading(true);
    setError(null);
    let allChaves: IChave[] = [];

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError(new Error("Token não encontrado"));
      setLoading(false);
      return;
    }

    try {
      let nextUrl = `/chameco/api/v1/chaves/?pagination=100`;
      while (nextUrl) {
        const response = await api.get(nextUrl);
        const data = response.data;

        allChaves = [...allChaves, ...(data.results || [])];
        nextUrl = data.next ? data.next.replace(api.defaults.baseURL || "", "") : null; 
      }

      setChaves(allChaves);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllPages();
  }, [fetchAllPages]);

  return (
    <ChavesContext.Provider value={{ chaves, loading, error, refetch: fetchAllPages }}>
      {children}
    </ChavesContext.Provider>
  );
};

export const useChaves = () => {
  const context = useContext(ChavesContext);
  if (!context) {
    throw new Error("useChaves deve ser usado dentro de ChavesProvider");
  }
  return context;
};
