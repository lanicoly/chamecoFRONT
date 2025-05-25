import { useLocation, Navigate } from 'react-router-dom';
import { isAxiosError } from "axios";
import { useState, useEffect } from 'react';
import api from "../services/api";
import Spinner from "./spinner"

interface PrivateRouteProps {
  children: JSX.Element; //será exibido se o acesso for permitido
  allowedTypes: string[]; //lista de tipos usuários que podem acessar
}


export function PrivateRoute({ children, allowedTypes}: PrivateRouteProps) {
  const location = useLocation();
  const token = localStorage.getItem("authToken");
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
      } catch(err){
        if (isAxiosError(err)) {
          console.error('Erro na validação do token:', err.response?.data);
        } else {
          console.error('Erro desconhecido:', err);
        }
        setIsValidToken(false);
      }
    };

    validateToken();
  }, [token]);

  if (isValidToken === null) {
    return(
      <Spinner></Spinner>
    );
  }

  // sem = redireciona para login
   // verifica lista de tipo(se não corresponde) e redireciona para login
     
    if (isValidToken &&
      userType === "serv.terceirizado" &&
      location.pathname !== "/emprestimos" //só se ainda não estiver em emprestimos
    ) {
      return <Navigate to="/emprestimos" state={{ from: location }} replace />;
    }
      else{ 
        if (!isValidToken || !userType || !allowedTypes.includes(userType)) {
          return <Navigate to="/login" state={{ from: location }} replace />;
        }
      }
   
  // se o tipo existir renderiza o componente
  return children;
}