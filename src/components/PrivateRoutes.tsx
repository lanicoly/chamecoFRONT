import { useLocation, Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: JSX.Element;
  allowedTypes: string[];
}

export function PrivateRoute({ children, allowedTypes }: PrivateRouteProps) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  // Se não tiver token, redireciona para login
  if (!token || token === "undefined" || token === "null") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se o tipo do usuário não estiver permitido, redireciona para o menu
  if (!userType || !allowedTypes.includes(userType)) {
    return <Navigate to="/menu" replace />;
  }

  // Se tudo estiver ok, renderiza o componente
  return children;
}