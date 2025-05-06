import { useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

interface PrivateRouteProps {
  children: JSX.Element;
  allowedTypes: string[];
}


export function PrivateRoute({ children, allowedTypes }: PrivateRouteProps) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  const url_base = "https://chamecoapi.pythonanywhere.com/";

  //criando estado para validar o token
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    if(!token){
      setIsValidToken(false);
      return;
    }

    //validar token
    const validateToken = async () => {
      try {
        const response =await axios.get(url_base + "/chameco/api/v1/login/", {
          headers: {Authorization: 'Bearer ${token}'},
        });
        setIsValidToken(response.status === 200);
      } catch(error){
        // Tratamento seguro com TypeScript
        if (axios.isAxiosError(error)) {
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
  if (!token || token === "undefined" || token === "null") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // verifica lista de tipo(se não corresponde) e redireciona para login
  if (!userType || !allowedTypes.includes(userType)) {
    return <Navigate to="/login" replace />;
  }

  // se o tipo existir renderiza o componente
  return children;
}