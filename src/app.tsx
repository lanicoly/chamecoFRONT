import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
//import { useState, useEffect } from "react";

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

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/menu"
          element={
            <PrivateRoute allowedTypes={["admin", "diretor.geral"]}>
              <Menu />
            </PrivateRoute>
          }
        />
        <Route
          path="/blocos"
          element={
            <PrivateRoute allowedTypes={["admin", "diretor.geral"]}>
              <Blocos />
            </PrivateRoute>
          }
        />
        <Route
          path="/salas"
          element={
            <PrivateRoute allowedTypes={["admin", "diretor.geral"]}>
              <Salas />
            </PrivateRoute>
          }
        />
        <Route
          path="/chaves"
          element={
            <PrivateRoute allowedTypes={["admin", "diretor.geral"]}>
              <Chaves />
            </PrivateRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <PrivateRoute allowedTypes={["admin", "diretor.geral"]}>
              <Usuarios />
            </PrivateRoute>
          }
        />
        <Route
          path="/statusChaves"
          element={
            <PrivateRoute allowedTypes={["admin", "diretor.geral"]}>
              <StatusChaves />
            </PrivateRoute>
          }
        />
        <Route
          path="/emprestimos"
          element={
            <PrivateRoute allowedTypes={["admin", "serv.terceirizado", "diretor.geral"]}>
              <Emprestimos />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

{
  /*serv.terceirizado é a guarita*/
}
