import { BrowserRouter, Routes, Route, Navigate, useLocation} from "react-router-dom";
import { useState,useEffect } from "react";

//separei as outras telas em um arquivo de componentes e a única diferença delas pro app é o nome que exporto no arquivo e que eu tenho que chamar elas aqui para mexer com elas, pois a navegação ocorre inicializando o que tem no app
import { Menu } from "./pages/menu";
import { Blocos } from "./pages/blocos";
import { Salas } from "./pages/salas";
import { Chaves } from "./pages/chaves";
import { Login } from "./pages/login";
import { Usuarios } from "./pages/usuarios";
import { StatusChaves } from "./pages/statusChaves";
import { Emprestimos } from "./pages/emprestimos";
import { PrivateRoute } from "./components/PrivateRoutes";

const isTokenValid = () => {
  const token = localStorage.getItem("authToken");
  return !!token && token !== "undefined" && token !== "null";
}; //verificando se o token não é inválido

const Private = ({ element }: { element: JSX.Element }) => { //está alinhado com a natureza dos arquivos jsx
  
  const location = useLocation(); //localização atuAL(PATH)

  if (!isTokenValid()) { //caso for token invalido, retorna o location que segundo a prox const é login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return element; //caso seja valido retorna o elemento
};


const AuthListener = ({ children }: { children: React.ReactNode }) => {
  const [, forceUpdate] = useState({});// força uma atualização do componente
  
  useEffect(() => {
    //usando forceUpdate para forçar atualização quando o storage mudar
    const handleStorageChange = () => {
      forceUpdate({});
  };
    
    window.addEventListener('storage', handleStorageChange); //ouve mudanças no storage

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.addEventListener('storage', handleStorageChange); 
    };
  }, []);
  
  return <>{children}</>;
};

export function App() {
  return (
    // <BrowserRouter>
    //  <AuthListener>
    //   <Routes>
    //     <Route path="/" element={<Navigate to="/login" />} />
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/menu" element={
    //       <PrivateRoute allowedTypes={["adm", "professor", "aluno"]}>
    //         <Menu />
    //       </PrivateRoute>
    //     } />
    //     <Route path="/blocos" element={<Private element={<Blocos />} />} />
    //     <Route path="/salas" element={<Private element={<Salas />} />} />
    //     <Route path="/chaves" element={<Private element={<Chaves />} />} />
    //     <Route path="/usuarios" element={<Private element={<Usuarios />} />} />
    //     <Route path="/statusChaves" element={<Private element={<StatusChaves />} />} />
    //     <Route path="/emprestimos" element={<Private element={<Emprestimos />} />} />
    //     <Route path="*" element={<Login />} />
    //   </Routes>
    //  </AuthListener>
    // </BrowserRouter>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/menu" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/blocos" element={<Blocos />} />
        <Route path="/salas" element={<Salas />} />
        <Route path="/chaves" element={<Chaves />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/statusChaves" element={<StatusChaves />} />
        <Route path="/emprestimos" element={<Emprestimos />} />
      </Routes>
    </BrowserRouter>
  );
}
