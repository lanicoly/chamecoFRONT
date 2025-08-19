import React, { createContext, useCallback, useContext, useEffect, useState} from "react";
import api from "../services/api";
import { IChave } from "../pages/chaves";


const ChavesContext = createContext<any>([]);

export const ChavesProvider = React.memo(({children}: {children: React.ReactNode}) => {
    const [chaves, setChaves] = useState<IChave[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchChaves = useCallback(async () => {
        console.log("Rodando chaves...")
        setLoading(true);

        const token = localStorage.getItem("authToken");
        if (!token) {
            setError(new Error("Token não encontrado"));
            setLoading(false);
            return;
        }

        try {
            const response = await api.get(`/chameco/api/v1/chaves/`);
            setChaves(response.data.results || []);

        } catch (error) {
            setError(error as Error)
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, []);

    useEffect(() => {
        fetchChaves();
    }, [fetchChaves]);

    return (
        <ChavesContext.Provider value={{chaves, loading, error, refetch: fetchChaves}}>
            {children}
        </ChavesContext.Provider>
    )
})

export const useChaves = () => useContext(ChavesContext);
