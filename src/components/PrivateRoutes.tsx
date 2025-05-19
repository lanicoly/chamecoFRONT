import { useLocation, Navigate } from 'react-router-dom';
import axios, { isAxiosError } from "axios";
import { useState, useEffect } from 'react';
import api from "../services/api";

interface PrivateRouteProps {
  children: JSX.Element; //será exibido se o acesso for permitido
  allowedTypes: string[]; //lista de tipos usuários que podem acessar
}


export function PrivateRoute({ children, allowedTypes}: PrivateRouteProps) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  

  //criando estado para validar o token
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    if(!token){ //se não tiver token seta falso
      setIsValidToken(false);
      return;
    }

    //validar token
    const validateToken = async () => {
      try {
        const response = await api.post("/chameco/api/v1/verify-token/", {
          token: token,
        });
        setIsValidToken(response.status === 200);
      } catch(error){
        // Tratamento seguro com TypeScript
        if (isAxiosError(error)) {
          // Erro específico do Axios
          console.error('Erro na validação do token:', error.response?.data);
        } else {
          // Erro genérico (ex: rede falhou)
          console.error('Erro desconhecido:', error);
        }
        setIsValidToken(false);
      }
    };

    validateToken();
  }, [token]);

  if (isValidToken === null) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  // sem = redireciona para login
   // verifica lista de tipo(se não corresponde) e redireciona para login
    if (!isValidToken || !userType || !allowedTypes.includes(userType)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // se o tipo existir renderiza o componente
  return children;
}