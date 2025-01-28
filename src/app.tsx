import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

//separei as outras telas em um arquivo de componentes e a única diferença delas pro app é o nome que exporto no arquivo e que eu tenho que chamar elas aqui para mexer com elas, pois a navegação ocorre inicializando o que tem no app
import { Menu } from "./componentes/telas/menu";
import { Blocos } from "./componentes/telas/blocos";
import { Salas } from "./componentes/telas/salas";
import { Chaves } from "./componentes/telas/chaves";
import { Login } from "./componentes/telas/login";
import { Usuarios } from "./componentes/telas/usuarios";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/blocos" element={<Blocos />} />
        <Route path="/salas" element={<Salas />} />
        <Route path="/chaves" element={<Chaves />} />
        <Route path="/usuarios" element={<Usuarios />} />
      </Routes>
    </BrowserRouter>
  );
}
