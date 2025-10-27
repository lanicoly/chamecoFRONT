import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import api from "../services/api";
import Spinner from "./spinner";

interface PrivateRoutePropsDTO {
  children: JSX.Element;
  allowedTypes: string[];
  redirectTo?: string; // padrão: "/"
}

// Decodifica payload do JWT sem libs (assume formato base64url)
function decodeJwtPayload<T = any>(token: string): T | null {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

function isJwtExpired(token: string): boolean {
  const payload = decodeJwtPayload<{ exp?: number }>(token);
  if (!payload?.exp) return true;
  // exp em segundos → comparar com agora em segundos
  return Date.now() / 1000 >= payload.exp;
}

export function PrivateRoute({
  children,
  allowedTypes,
  redirectTo = "/",
}: PrivateRoutePropsDTO) {
  const location = useLocation();
  const token = localStorage.getItem("authToken");
  const userType = localStorage.getItem("userType");

  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  // 1) Checagem local (instantânea): se expirou, já bloqueia
  const locallyExpired = useMemo(() => {
    if (!token) return true;
    return isJwtExpired(token);
  }, [token]);

  useEffect(() => {
    // Sem token ou expirado localmente → nem chama a API
    if (!token || locallyExpired) {
      setIsValidToken(false);
      return;
    }

    // 2) (Opcional) validação remota — útil se o servidor pode invalidar tokens antes de expirar
    let aborted = false;
    (async () => {
      try {
        const resp = await api.post("/chameco/api/v1/verify-token/", { token });
        if (!aborted) setIsValidToken(resp.status === 200);
      } catch (err) {
        if (!aborted) {
          // Trate 401/403 explicitamente como inválido/expirado
          if (isAxiosError(err)) {
            const status = err.response?.status;
            if (status === 401 || status === 403) {
              setIsValidToken(false);
            } else {
              // erro de rede/servidor — tome a decisão que preferir (aqui, bloqueia)
              setIsValidToken(false);
            }
          } else {
            setIsValidToken(false);
          }
        }
      }
    })();

    return () => {
      aborted = true;
    };
  }, [token, locallyExpired]);

  // Loading inicial
  if (isValidToken === null && !locallyExpired && token) {
    return <Spinner className="h-screen" />;
  }

  const canEnter =
    !!token &&
    !locallyExpired &&
    isValidToken === true &&
    !!userType &&
    allowedTypes.includes(userType);

  if (canEnter) return children;

  // Bloqueado → limpa somente o necessário e redireciona para a "tela inicial"
  localStorage.removeItem("authToken");
  // se userType vem do próprio token, nem precisa manter no storage
  localStorage.removeItem("userType");

  return <Navigate to={redirectTo} state={{ from: location }} replace />;
}
