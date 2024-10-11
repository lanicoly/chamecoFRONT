
export function App() {
  const [tela, setTela] = useState<number>(1);

  function mudarTela(index: number) {
    setTela(index);
  }


  //fiz essa parte para mudar o que vai ser renderizado conforme a tela escolhida. inicialmente é o menu por enquanto e a medida que eu for usando a função mudarTela, eu mudo o estado da variável tela e exibo a tela corresponde à escolha, passando essa função para os componentes filhos poderem alterar o estado da tela selecionada conforme interação

  let telaAtual: React.ReactNode;
  switch (tela) {
    // case 0:
    //   telaAtual = <Login />;
    //   break;
    case 1:
      telaAtual = <Menu mudarTela={mudarTela} />;
      break;
    case 2:
      telaAtual = <Blocos mudarTela={mudarTela} />;
      break;
    case 3:
      telaAtual = <Salas mudarTela={mudarTela} />;
      break;
    default:
      telaAtual = <Menu mudarTela={mudarTela} />;
  }

  return (
    <h1>Hello World!</h1>
  )
}

