import { useLocation, Navigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useState, useEffect } from "react";
import api from "../services/api";
import Spinner from "./spinner";

interface PrivateRoutePropsDTO {
  children: JSX.Element; //será exibido se o acesso for permitido
  allowedTypes: string[]; //lista de tipos usuários que podem acessar
}

export function PrivateRoute({ children, allowedTypes }: PrivateRoutePropsDTO) {
  const location = useLocation();

  //adicionei essas duas constantes, mas tirarei depois dos testes
  const urlParams = new URLSearchParams(window.location.search);
  const isTesteMaze = urlParams.get("teste") === "true";

  const token = localStorage.getItem("authToken");
  const userType = localStorage.getItem("userType");

  //criando estado para validar o token
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    //adicionei essa verificação
    if (isTesteMaze) {
      localStorage.setItem("authToken", "token_fake_maze_2026");
      localStorage.setItem("userType", "coordenador");
      setIsValidToken(true);
      return;
    }
    if (!token) {
      //se não tiver token seta falso
      setIsValidToken(false);
      return;
    }

    //validar token
    const validateToken = async () => {
      try {
        const response = await api.post("/chameco/api/v1/verify-token/", {
          token: token,
        });

        if (response.status === 200) setIsValidToken(true);
      } catch (err) {
        if (isAxiosError(err)) {
          console.error("Erro na validação do token:", err.response?.data);
        } else {
          console.error("Erro desconhecido:", err);
        }
        setIsValidToken(false);
      }
    };

    validateToken();
  }, [token, isTesteMaze]);
  //Adicionei o isTesteMaze como dependência para garantir que o efeito seja reexecutado quando o teste for ativado ou desativado

  //Adicionei essa linha
  if (isTesteMaze) {
    return children;
  }

  if (isValidToken === null) {
    return <Spinner className="h-screen"></Spinner>;
  }

  // sem = redireciona para login
  // verifica lista de tipo(se não corresponde) e redireciona para login

  if (isValidToken && userType && allowedTypes.includes(userType)) {
    return children;
  } else {
    if (!isValidToken || !userType || !allowedTypes.includes(userType)) {
      localStorage.clear();
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }
}
