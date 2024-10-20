import React, { useState } from "react";

//separei as outras telas em um arquivo de componentes e a única diferença delas pro app é o nome que exporto no arquivo e que eu tenho que chamar elas aqui para mexer com elas, pois a navegação ocorre inicializando o que tem no app
import { Menu } from "./componentes/telas/menu";
import { Blocos } from "./componentes/telas/blocos";
import { Salas } from "./componentes/telas/salas";
import { Chaves } from "./componentes/telas/chaves";
import { Login } from "./componentes/telas/login";
import { Usuarios } from "./componentes/telas/usuarios";

export function App() {
  const [tela, setTela] = useState<number>(0);

  function mudarTela(index: number) {
    setTela(index);
  }
  
  //fiz essa parte para mudar o que vai ser renderizado conforme a tela escolhida. inicialmente é o menu por enquanto e a medida que eu for usando a função mudarTela, eu mudo o estado da variável tela e exibo a tela corresponde à escolha, passando essa função para os componentes filhos poderem alterar o estado da tela selecionada conforme interação

  let telaAtual: React.ReactNode;
  switch (tela) {
    case 0:
      telaAtual = <Login mudarTela={mudarTela}/>;
      break;
    case 1:
      telaAtual = <Menu mudarTela={mudarTela} />;
      break;
    case 2:
      telaAtual = <Blocos mudarTela={mudarTela} />;
      break;
    case 3:
      telaAtual = <Salas mudarTela={mudarTela} />;
      break;
    case 4:
      telaAtual = <Chaves mudarTela={mudarTela} />;
      break;
    case 5:
      telaAtual = <Usuarios mudarTela={mudarTela}/>;
      break
    default:
      telaAtual = <Login mudarTela={mudarTela} />;
  }

  return (
    //aqui irá renderizar o estado atual da variável, a qual será modificada conforme tela escolhida
     <div>{telaAtual}</div>
  );

}
