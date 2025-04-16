import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

//separei as outras telas em um arquivo de componentes e a única diferença delas pro app é o nome que exporto no arquivo e que eu tenho que chamar elas aqui para mexer com elas, pois a navegação ocorre inicializando o que tem no app
import { Menu } from "./pages/menu";
import { Blocos } from "./pages/blocos";
import { Salas } from "./pages/salas";
import { Chaves } from "./pages/chaves";
import { Login } from "./pages/login";
import { Usuarios } from "./pages/usuarios";
import { StatusChaves } from "./pages/statusChaves";
import { Emprestimos } from "./pages/emprestimos";

export function App() {
  return (
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
