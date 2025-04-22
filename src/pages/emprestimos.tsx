import { Info, Check, Plus, X, TriangleAlert } from "lucide-react";
import React, { useState, useMemo } from "react";
import { MenuTopo } from "../components/menuTopo";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { ptBR } from "date-fns/locale";
import { Pesquisa } from "../components/pesquisa";
import { PassadorPagina } from "../components/passadorPagina";
import { FiltroModal } from "../components/filtragemModal";
// import { set } from "date-fns";

// deixei o passador comentado pois são duas estruturas para passar página, então so copiei a estrutura, mas assim que forem atualizadas as tabelas deve-se usar esse elemento!!!!!!!

export interface Emprestimo {
  id: number;
  sala: number;
  chave: string;
  solicitante: string;
  responsavel: string;
  observacao: string | null;
  dataRetirada: string; //não coloquei Date para facilitar a estilização inicial
  horaRetirada: string;
  dataDevolucao: string | null;
  horaDevolucao: string | null;
}

export interface FiltroEmprestimo {
  setFiltroDataEmprestimo: (dates: DateRange | undefined) => void;
  filtroDataEmprestimo: DateRange | undefined;
}

const salas = [
  { id: 1, nome: "Sala A" },
  { id: 2, nome: "Sala B" },
  { id: 3, nome: "Sala C" },
  { id: 4, nome: "Sala E9" },
];

export function Emprestimos() {
  // { filtroDataEmprestimo, setFiltroDataEmprestimo }: FiltroEmprestimo
  const [filtroDataEmprestimo, setFiltroDataEmprestimo] = useState<
    DateRange | undefined
  >();
  const [emprestimosConcluidos] = useState<Emprestimo[]>([
    {
      id: 1,
      sala: 2,
      chave: "Reserva",
      solicitante: "Emilia Nunes",
      responsavel: "Zezinho",
      observacao: null,
      dataRetirada: "02/03/2025",
      horaRetirada: "07:02",
      dataDevolucao: "02/03/2025",
      horaDevolucao: "07:02",
    },
    {
      id: 3,
      sala: 2,
      chave: "Reserva",
      solicitante: "Emilia Nunes",
      responsavel: "Zezinho",
      observacao: null,
      dataRetirada: "02/03/2025",
      horaRetirada: "07:02",
      dataDevolucao: "02/03/2025",
      horaDevolucao: "07:02",
    },
    {
      id: 5,
      sala: 2,
      chave: "Principal",
      solicitante: "Emilia Nunes",
      responsavel: "Zezinho",
      observacao: null,
      dataRetirada: "02/03/2025",
      horaRetirada: "07:02",
      dataDevolucao: "02/03/2025",
      horaDevolucao: "07:02",
    },
    {
      id: 2,
      sala: 2,
      chave: "Principal",
      solicitante: "Emilia Nunes",
      responsavel: "Zezinho",
      observacao: null,
      dataRetirada: "02/03/2025",
      horaRetirada: "07:02",
      dataDevolucao: "02/03/2025",
      horaDevolucao: "07:02",
    },
  ]);

  //data atual
  function obterDataAtual(): string {
    const dataAtual = new Date();
    const dia = String(dataAtual.getDate()).padStart(2, "0");
    const mes = String(dataAtual.getMonth() + 1).padStart(2, "0");
    const ano = dataAtual.getFullYear();
    const dataFormatada = `${dia}/${mes}/${ano}`;
    return dataFormatada;
  }
  //hora atual
  function obterHoraAtual(): string {
    const dataAtual = new Date();
    const hora = String(dataAtual.getHours()).padStart(2, "0");
    const minutos = String(dataAtual.getMinutes()).padStart(2, "0");
    const horaFormatada = `${hora}:${minutos}`;
    return horaFormatada;
  }

  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);

  const [salaSelecionadaId, setSalaSelecionadaId] = useState<number | null>(
    null
  );

  function criarEmprestimo() {
    const novoEmprestimo: Emprestimo = {
      id: Math.floor(Math.random() * 10000),
      sala: salaSelecionadaId,
      chave: chave,
      solicitante: solicitante,
      responsavel: responsavel,
      observacao: observacao,
      dataRetirada: obterDataAtual(),
      horaRetirada: obterHoraAtual(),
      horaDevolucao: null,
      dataDevolucao: null,
    };
    setEmprestimos([...emprestimos, novoEmprestimo]);
    console.log("Emprestimo criado!", novoEmprestimo);

    setSalaSelecionadaId(null); // Melhor que 0 para indicar "não selecionado"
    setSala("");
    setChave("");
    setSolicitante("");
    setResponsavel(""); // Removida a duplicação
    setObservacao("");
  }
  //estados p receberem do formulário
  const [sala, setSala] = useState("");
  const [chave, setChave] = useState("");
  const [solicitante, setSolicitante] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [observacao, setObservacao] = useState<string | null>(null);
  const [pesquisa, setPesquisa] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Adicionando funcionalidade de filtragem para emprestimos pendentes e concluidos
  const [filtroPendente, setFiltroPendente] = useState({
    sala: "",
    chave: "",
    solicitante: "",
    responsavel: "",
    dataRetirada: "",
    horaRetirada: "",
  });

  const [filtroConcluido, setFiltroConcluido] = useState({
    sala: "",
    chave: "",
    solicitante: "",
    responsavel: "",
    dataRetirada: "",
    horaRetirada: "",
    dataDevolucao: "",
    horaDevolucao: "",
  });
  const [isFiltroPendente, setIsFiltroPendente] = useState(true);
  const [isFiltroConcluido, setIsFiltroConcluido] = useState(true);

  function converterDataBRparaDate(dataStr: string): Date {
    const [dia, mes, ano] = dataStr.split("/");
    return new Date(Number(ano), Number(mes) - 1, Number(dia));
  }

  //filtrando emprestimos pendentes
  const emprestimosFiltradosPendentes = emprestimos
    .filter((emprestimo) => {
      if (!isSearching) return true;
      return (
        emprestimo.solicitante
          ?.toLowerCase()
          .includes(pesquisa.toLowerCase()) ||
        emprestimo.chave?.toLowerCase().includes(pesquisa.toLowerCase()) ||
        emprestimo.responsavel
          ?.toLowerCase()
          .includes(pesquisa.toLowerCase()) ||
        emprestimo.dataRetirada
          ?.toLowerCase()
          .includes(pesquisa.toLowerCase()) ||
        emprestimo.horaRetirada
          ?.toLowerCase()
          .includes(pesquisa.toLowerCase()) ||
        emprestimo.observacao?.toLowerCase().includes(pesquisa.toLowerCase())
      );
    })

    .filter((emprestimo) => {
      if (!isFiltroPendente) return true;

      return (
        (filtroPendente.chave === "" ||
          emprestimo.chave
            ?.toLowerCase()
            .includes(filtroPendente.chave.toLowerCase())) &&
        (filtroPendente.solicitante === "" ||
          emprestimo.solicitante
            ?.toLowerCase()
            .includes(filtroPendente.solicitante.toLowerCase())) &&
        (filtroPendente.responsavel === "" ||
          emprestimo.responsavel
            ?.toLowerCase()
            .includes(filtroPendente.responsavel.toLowerCase())) &&
        (filtroPendente.horaRetirada === "" ||
          emprestimo.horaRetirada
            ?.toLowerCase()
            .includes(filtroPendente.horaRetirada.toLowerCase()))
      );
    })

    .filter((emprestimo) => {
      if (
        !isFiltroPendente ||
        !filtroDataEmprestimo?.from ||
        !filtroDataEmprestimo?.to
      )
        return true;

      const dataEmprestimo = converterDataBRparaDate(emprestimo.dataRetirada);

      return (
        dataEmprestimo >= filtroDataEmprestimo.from &&
        dataEmprestimo <= filtroDataEmprestimo.to
      );
    });

  //filtrando emprestimos concluidos
  const emprestimosFiltradosConcluidos = emprestimosConcluidos
    .filter((emprestimos) => {
      if (!isSearching) return true;
      return (
        // emprestimosConcluidos.sala
        //   .toLowerCase()
        //   .includes(pesquisa.toLowerCase()) ||
        emprestimos.chave.toLowerCase().includes(pesquisa.toLowerCase()) ||
        emprestimos.solicitante
          .toLowerCase()
          .includes(pesquisa.toLowerCase()) ||
        emprestimos.responsavel
          .toLowerCase()
          .includes(pesquisa.toLowerCase()) ||
        emprestimos.dataRetirada
          .toLowerCase()
          .includes(pesquisa.toLowerCase()) ||
        emprestimos.horaRetirada
          .toLowerCase()
          .includes(pesquisa.toLowerCase()) ||
        emprestimos.observacao?.toLowerCase().includes(pesquisa.toLowerCase())
      );
    })
    .filter((emprestimo) => {
      if (!isFiltroConcluido) return true;
      return (
        // (filtroConcluido.sala === "" ||
        //   emprestimo.sala
        //     ?.toLowerCase()
        //     .includes(filtroConcluido.sala.toLowerCase())) &&
        (filtroConcluido.chave === "" ||
          emprestimo.chave
            ?.toLowerCase()
            .includes(filtroConcluido.chave.toLowerCase())) &&
        (filtroConcluido.solicitante === "" ||
          emprestimo.solicitante
            ?.toLowerCase()
            .includes(filtroConcluido.solicitante.toLowerCase())) &&
        (filtroConcluido.responsavel === "" ||
          emprestimo.responsavel
            ?.toLowerCase()
            .includes(filtroConcluido.responsavel.toLowerCase())) &&
        (filtroConcluido.dataRetirada === "" ||
          emprestimo.dataRetirada
            ?.toLowerCase()
            .includes(filtroConcluido.dataRetirada.toLowerCase())) &&
        (filtroConcluido.horaRetirada === "" ||
          emprestimo.horaRetirada
            ?.toLowerCase()
            .includes(filtroConcluido.horaRetirada.toLowerCase())) &&
            (filtroConcluido.horaDevolucao === "" ||
              emprestimo.horaDevolucao
                ?.toLowerCase()
                .includes(filtroConcluido.horaDevolucao.toLowerCase()))
      );
    })
    .filter((emprestimo) => {
      if (
        !isFiltroConcluido ||
        !filtroDataEmprestimo?.from ||
        !filtroDataEmprestimo?.to
      )
        return true;

      const dataEmprestimo = converterDataBRparaDate(emprestimo.dataRetirada);

      return (
        !filtroDataEmprestimo?.from ||
        !filtroDataEmprestimo?.to ||
        (dataEmprestimo >= filtroDataEmprestimo.from &&
          dataEmprestimo <= filtroDataEmprestimo.to)
      );
    });

  const itensAtuaisPendentes = emprestimosFiltradosPendentes.slice();
  const itensAtuaisConcluidos = emprestimosFiltradosConcluidos.slice();

  // Adicionando funcionalidade ao passador de página
  const itensPorPaginaPendente = 3;
  const [paginaAtualPendente, setPaginaAtualPendente] = useState(1);
  const totalPaginasPendentes = Math.max(
    1,
    Math.ceil(emprestimos.length / itensPorPaginaPendente)
  );

  function avancarPaginaPendente() {
    if (paginaAtualPendente < totalPaginasPendentes) {
      setPaginaAtualPendente(paginaAtualPendente + 1);
    }
  }

  function voltarPaginaPendente() {
    if (paginaAtualPendente > 1) {
      setPaginaAtualPendente(paginaAtualPendente - 1);
    }
  }
  //fim função passador

  //passador p seção concluídos
  const itensPorPaginaConcluidos = 3;
  const [paginaAtualConcluidos, setPaginaAtualConcluidos] = useState(1);
  const totalPaginasConcluidos = Math.max(
    1,
    Math.ceil(emprestimosConcluidos.length / itensPorPaginaConcluidos)
  );

  function avancarPaginaConcluidos() {
    if (paginaAtualConcluidos < totalPaginasConcluidos) {
      setPaginaAtualConcluidos(paginaAtualConcluidos + 1);
    }
  }

  function voltarPaginaConcluidos() {
    if (paginaAtualConcluidos > 1) {
      setPaginaAtualConcluidos(paginaAtualConcluidos - 1);
    }
  }
  //fim passador p seção concluídos

  // function openFiltroModal() {
  //   setIsFiltroModalOpen(true);
  // }

  // function closeFiltroModal() {
  //   setIsFiltroModalOpen(false);
  // }

  // function openInputFiltroModal() {
  //   setIsInputFiltroModalOpen(true);
  // }

  // function closeInputFiltroModal() {
  //   setIsInputFiltroModalOpen(false);
  // }

  const [isObservacaoModalOpen, setIsObservacaoModalOpen] = useState(false);

  function openObservacaoModal() {
    setIsObservacaoModalOpen(true);
  }

  function closeObservacaoModal() {
    setIsObservacaoModalOpen(false);
  }

  const [isDetalhesModalOpen, setIsDetalhesModalOpen] = useState(false);

  const [emprestimoSelecionado, setEmprestimoSelecionado] =
    useState<Emprestimo | null>(null);

  function openDetalhesModal(emprestimos: Emprestimo) {
    setEmprestimoSelecionado(emprestimos);
    setIsDetalhesModalOpen(true);
  }

  function closeDetalhesModal() {
    setIsDetalhesModalOpen(false);
  }

  //Adicionando funcão de abrir e fechar modal de excluir observacao de emprestimos
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  function openDeleteModal() {
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  //criando função de excluir observação de emprestimos
  function removeObservacao(e: React.FormEvent) {
    e.preventDefault();
    if (emprestimoSelecionado) {
      emprestimoSelecionado.observacao = "";
    }
    setObservacao("");
    closeDeleteModal();
  }

  // Adicionando função de abrir e fechar modal de editar observacao de um emprestimo
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  function openEditModal() {
    if (emprestimoSelecionado) {
      setObservacao(emprestimoSelecionado.observacao);
      setIsEditModalOpen(true);
    }
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
  }

  // adicionando função de editar observação de um emprestimo
  function editarObservacao(e: React.FormEvent) {
    e.preventDefault();
    if (emprestimoSelecionado && observacao) {
      emprestimoSelecionado.observacao = observacao;
    }
    setObservacao("");
    closeEditModal();
  }

  // Deixando o botão de alternar entre empréstimos pendentes e concluídos funcional
  const [exibirEmprestimosPendentes, setExibirEmprestimosPendentes] =
    useState(true);
  const alternarEmprestimos = () => {
    setExibirEmprestimosPendentes(
      (exibirEmprestimoAtual) => !exibirEmprestimoAtual
    );
  };

  const today = new Date();

  const [busca, setBusca] = useState("");
  const [mostrarBusca, setMostrarBusca] = useState(false);

  const salasFiltradas = useMemo(() => {
    const lowerBusca = busca.toLowerCase();
    return salas.filter((sala) => sala.nome.toLowerCase().includes(lowerBusca));
  }, [busca]);

  const [campoFiltroAberto, setCampoFiltroAberto] = useState<string | null>(
    null
  );

  return (
    <div className="flex-col min-h-screen flex items-center justify-center bg-tijolos h-full bg-no-repeat bg-cover">
      <MenuTopo text="MENU" backRoute="/menu" />

      {/* parte informativa tela de empréstimo */}
      <div className="relative bg-white w-full max-w-[80%] rounded-3xl px-6  py-2 tablet:py-3 desktop:py-6 m-12 top-8 tablet:top-10 desktop:top-8">
        {/* cabeçalho tela de empréstimo*/}
        <div className="flex w-full">
          <h1 className="flex w-full justify-center text-sky-900 text-2xl font-semibold">
            EMPRÉSTIMOS
          </h1>

          <button>
            <svg
              width="30"
              height="30"
              viewBox="0 0 38 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="30"
                height="30"
                transform="translate(0.5)"
                fill="white"
              />
              <g clip-path="url(#clip0_2169_2594)">
                <path
                  d="M36.1128 25.0627L32.4671 11.923C31.6886 9.11219 29.9923 6.64257 27.6482 4.90717C25.3041 3.17176 22.4469 2.27029 19.5313 2.34623C16.6157 2.42217 13.8093 3.47116 11.5587 5.32624C9.30811 7.18133 7.74269 9.7359 7.11159 12.5834L4.29182 25.2731C4.15538 25.8878 4.1587 26.5254 4.30156 27.1387C4.44441 27.752 4.72314 28.3254 5.11719 28.8166C5.51123 29.3079 6.01054 29.7043 6.57826 29.9768C7.14599 30.2493 7.76765 30.3908 8.39738 30.391H13.455C13.7768 31.9759 14.6367 33.4007 15.8888 34.4242C17.141 35.4476 18.7085 36.0067 20.3257 36.0067C21.9429 36.0067 23.5104 35.4476 24.7625 34.4242C26.0147 33.4007 26.8745 31.9759 27.1963 30.391H32.0619C32.7098 30.3907 33.349 30.2407 33.9294 29.9528C34.5099 29.6648 35.0159 29.2466 35.4082 28.7309C35.8004 28.2151 36.0682 27.6157 36.1907 26.9795C36.3131 26.3432 36.2869 25.6872 36.1142 25.0627H36.1128ZM20.3257 33.1953C19.4588 33.1917 18.6141 32.9204 17.9073 32.4184C17.2006 31.9164 16.6661 31.2083 16.3772 30.391H24.2742C23.9852 31.2083 23.4508 31.9164 22.744 32.4184C22.0372 32.9204 21.1926 33.1917 20.3257 33.1953ZM33.1766 27.0328C33.0458 27.2062 32.8762 27.3466 32.6814 27.4428C32.4867 27.539 32.2721 27.5882 32.0549 27.5866H8.39738C8.18742 27.5866 7.98015 27.5394 7.79087 27.4486C7.60158 27.3577 7.43512 27.2255 7.30376 27.0617C7.1724 26.8979 7.07951 26.7067 7.03193 26.5022C6.98435 26.2977 6.9833 26.0852 7.02886 25.8802L9.84863 13.1905C10.3455 10.9558 11.5751 8.9512 13.3421 7.49552C15.109 6.03985 17.3119 5.2166 19.6004 5.15665C21.889 5.0967 24.1319 5.80348 25.9727 7.16464C27.8134 8.5258 29.1463 10.4632 29.7595 12.6689L33.4052 25.8087C33.4647 26.0165 33.475 26.2352 33.4353 26.4477C33.3957 26.6602 33.3071 26.8605 33.1766 27.0328Z"
                  fill="#C6191A"
                />
              </g>
              <defs>
                <clipPath id="clip0_2169_2594">
                  <rect
                    width="33.6522"
                    height="33.6522"
                    fill="white"
                    transform="translate(3.5 2.34766)"
                  />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
        {/* fim cabeçalho tela de empréstimo */}

        {/* conteudo central tela de empréstimo */}
        <div className="flex flex-col px-4 py-1 w-auto justify-center gap-1">
          {/* conteudo central tabela*/}
          <div>
            <div className="flex items-center justify-between mt-2">
              <h2 className="text-[#16C34D] items-center font-semibold text-xl shadow-none">
                Criar novo empréstimo
              </h2>
            </div>

            {/* tabela de criacao de emprestimo */}
            <div className=" max-h-[248px] tablet:max-h-64 desktop:max-h-96">
              <table className="w-full border-separate border-spacing-y-2 tablet:mb-2 bg-white">
                <thead className="bg-white sticky top-0 z-11">
                  <tr>
                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[13%]">
                      Informe a sala
                    </th>
                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[13%]">
                      Informe a chave
                    </th>
                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 flex-1 min-w-10 w-[20%] ">
                      Informe quem solicitou
                    </th>
                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[19%] ">
                      Informe quem entregou
                    </th>
                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[20%]   "></th>
                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 pl-2"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[20%]">
                      <div className="flex justify-between items-center mr-3 relative">
                        <input
                          className="w-full p-3 rounded-[10px] border-none focus:outline-none placeholder-[#646999] text-sm font-medium "
                          type="text"
                          placeholder="Sala"
                          value={busca}
                          required
                          onChange={(ev) => {
                            setBusca(ev.target.value);
                            setMostrarBusca(true);
                          }}
                          onFocus={() => setMostrarBusca(true)}
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          fill="#64748b"
                          className="bi bi-search"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                        </svg>
                        {mostrarBusca && busca && (
                          <ul className="absolute top-full left-0 right-0 bg-white shadow-md z-19 ">
                            {salasFiltradas.map((sala) => (
                              <li
                                key={sala.id}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setSalaSelecionadaId(sala.id);
                                  setBusca(sala.nome);
                                  setMostrarBusca(false);
                                }}
                              >
                                {sala.nome}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </td>
                    <td className="text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[20%]">
                      <div className="flex justify-between items-center mr-3">
                        <input
                          className="w-full p-3 rounded-[10px] border-none focus:outline-none placeholder-[#646999] text-sm font-medium "
                          type="text"
                          placeholder="Chave"
                          value={chave}
                          onChange={(e) => setChave(e.target.value)}
                          required
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          fill="#64748b"
                          className="bi bi-search"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                        </svg>
                      </div>
                    </td>
                    <td className="text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] min-w-10 w-24 break-words flex-1 text-center">
                      <div className="flex justify-between items-center mr-3">
                        <input
                          className="w-full p-3 rounded-[10px] border-none focus:outline-none placeholder-[#646999] text-sm font-medium "
                          type="text"
                          placeholder="Solicitante"
                          value={solicitante}
                          onChange={(e) => setSolicitante(e.target.value)}
                          required
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          fill="#64748b"
                          className="bi bi-search"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                        </svg>
                      </div>
                    </td>
                    <td className="text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[15%]">
                      <div className="flex justify-between items-center mr-3">
                        <input
                          className="w-full p-3 rounded-[10px] border-none focus:outline-none placeholder-[#646999] text-sm font-medium "
                          type="text"
                          placeholder="Responsável"
                          value={responsavel}
                          onChange={(e) => setResponsavel(e.target.value)}
                          required
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          fill="#64748b"
                          className="bi bi-search"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                        </svg>
                      </div>
                    </td>

                    <td
                      onClick={openObservacaoModal}
                      className="border-2 border-[#B8BCE0] border-solid bg-[#0240E1]  p-0.5 font-semibold break-words cursor-pointer"
                    >
                      <div className=" flex justify-center items-center mr-1 gap-2">
                        <Plus color="white" size={18} />
                        <p className=" text-sm text-[#FFFF] text-center font-semibold leading-normal truncate">
                          OBSERVAÇÃO
                        </p>
                      </div>
                    </td>
                    <td
                      onClick={criarEmprestimo}
                      className="border-2 border-[#B8BCE0] border-solid bg-[#18C64F]  p-0.5 font-semibold break-words cursor-pointer"
                    >
                      <div className=" flex justify-center items-center mr-1 gap-2">
                        <Plus color="white" size={18} />
                        <p className=" text-sm text-[#FFFF] text-center font-semibold leading-normal truncate">
                          CRIAR EMPRÉSTIMO
                        </p>
                      </div>
                    </td>

                    {/* Adicionando pop up de observação do empréstimo */}
                    {isObservacaoModalOpen && (
                      //  && emprestimo.id === emprestimoSelecionado)
                      <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                        <form className="container flex flex-col gap-2 w-full px-4 py-4 h-auto rounded-[15px] bg-white mx-5 max-w-[500px]">
                          <div className="flex justify-center w-full ">
                            <p className="text-[#192160] text-center text-[20px] font-semibold w-[85%]">
                              OBSERVAÇÃO DO EMPRÉSTIMO
                            </p>
                            <button
                              onClick={closeObservacaoModal}
                              type="button"
                              className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                            >
                              <X className=" mb-[5px] text-[#192160] ml-auto" />
                            </button>
                          </div>

                          <div className="flex w-full h-auto px-[10px] py-2 mb-4 flex-col rounded-lg bg-[#B8BCE0]">
                            <p className="text-[#192160] font-medium p-1">
                              Detalhadamento sobre o empréstimo que será criado,
                              como pessoa que autorizou aluno, entre outros.
                            </p>
                            <button
                              // onClick={openEditObservacaoModal}
                              className="flex gap-1 justify-end items-center font-medium text-sm text-[#646999] underline"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                fill="#646999"
                                className="bi bi-pen"
                                viewBox="0 0 16 16"
                              >
                                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                              </svg>
                              Editar
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Fim adicionando pop up de observacao do emprestimo */}
                  </tr>
                </tbody>
              </table>
              <hr className="text-[#646999] p-2 border-t-2 font-extrabold" />
            </div>
            {/* fim tabela de criacao de emprestimo */}

            <div className=" flex gap-2 flex-wrap justify-between items-center">
              <div className="flex items-center gap-4">
                <h2
                  className={`${
                    exibirEmprestimosPendentes
                      ? "text-red-500"
                      : "text-[#0240E1]"
                  } items-center font-semibold text-xl mt-2`}
                >
                  Empréstimos{" "}
                  {exibirEmprestimosPendentes ? "pendentes" : "concluídos"}
                </h2>

                <button
                  onClick={alternarEmprestimos}
                  className="flex w-[280px] h-[30px] p-3 justify-center items-center gap-2 rounded-[12px] bg-[#B8C1FF]  mt-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 28 29"
                    fill="none"
                  >
                    <mask
                      id="mask0_2194_4255"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="28"
                      height="29"
                    >
                      <rect y="0.5" width="28" height="28" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_2194_4255)">
                      <path
                        d="M14.0582 23.8334C11.4526 23.8334 9.23595 22.9292 7.40817 21.1209C5.58039 19.3126 4.6665 17.1056 4.6665 14.5001V14.2959L2.79984 16.1626L1.1665 14.5292L5.83317 9.86258L10.4998 14.5292L8.8665 16.1626L6.99984 14.2959V14.5001C6.99984 16.4445 7.68525 18.0973 9.05609 19.4584C10.4269 20.8195 12.0943 21.5001 14.0582 21.5001C14.5637 21.5001 15.0596 21.4417 15.5457 21.3251C16.0318 21.2084 16.5082 21.0334 16.9748 20.8001L18.7248 22.5501C17.9859 22.9779 17.2276 23.2987 16.4498 23.5126C15.6721 23.7265 14.8748 23.8334 14.0582 23.8334ZM22.1665 19.1376L17.4998 14.4709L19.1332 12.8376L20.9998 14.7042V14.5001C20.9998 12.5556 20.3144 10.9029 18.9436 9.54175C17.5728 8.18064 15.9054 7.50008 13.9415 7.50008C13.4359 7.50008 12.9401 7.55841 12.454 7.67508C11.9679 7.79175 11.4915 7.96675 11.0248 8.20008L9.27484 6.45008C10.0137 6.0223 10.7721 5.70147 11.5498 5.48758C12.3276 5.27369 13.1248 5.16675 13.9415 5.16675C16.5471 5.16675 18.7637 6.07091 20.5915 7.87925C22.4193 9.68758 23.3332 11.8945 23.3332 14.5001V14.7042L25.1998 12.8376L26.8332 14.4709L22.1665 19.1376Z"
                        fill="#565D8F"
                      />
                    </g>
                  </svg>
                  <p className="items-center text-[#565D8F] text-[15px] font-semibold">
                    Ver empréstimos{" "}
                    {exibirEmprestimosPendentes ? "concluídos" : "pendentes"}
                  </p>
                </button>
              </div>

              {/* input de pesquisa */}
              <div>
                <Pesquisa
                  pesquisa={pesquisa}
                  setIsSearching={setIsSearching}
                  setPesquisa={setPesquisa}
                />
              </div>
              {/* fim input de pesquisa */}
            </div>

            {/* tabela com emprestimo pendente */}
            <div
              className={`overflow-y-auto max-h-[248px] tablet:max-h-64 desktop:max-h-96 ${
                exibirEmprestimosPendentes ? "block" : "hidden"
              }`}
            >
              <table className=" w-full border-separate border-spacing-y-2 bg-white">
                <thead className="bg-white top-0 ">
                  <tr>
                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[15%]">
                      <div className="flex items-center gap-1">
                        Nome da sala
                        <img src="src/assets/filter_list.svg" alt="" />
                      </div>
                    </th>

                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[15%] align-top">
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-1">
                          Tipo de chave
                          <button onClick={() => setCampoFiltroAberto("chave")}>
                            <img
                              src="src/assets/filter_list.svg"
                              alt="Filtro"
                              className="w-4 h-4"
                            />
                          </button>
                        </div>

                        <FiltroModal
                          isOpen={campoFiltroAberto === "chave"}
                          onClose={() => setCampoFiltroAberto(null)}
                          onSubmit={(e) => {
                            e.preventDefault();
                            setCampoFiltroAberto(null); // Fecha o modal após o submit
                          }}
                          titulo="FILTRAR POR TIPO DE CHAVE"
                        >
                          <input
                            type="text"
                            placeholder="Filtrar..."
                            className="border-[2px] px-2 py-1 rounded focus:outline-none text-sm w-full border-[#B8BCE0]"
                            value={filtroPendente.chave}
                            onChange={(e) =>
                              setFiltroPendente({
                                ...filtroPendente,
                                chave: e.target.value,
                              })
                            }
                          />
                        </FiltroModal>
                      </div>
                    </th>

                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[15%] align-top">
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-1">
                          Solicitante
                          <button
                            onClick={() => setCampoFiltroAberto("solicitante")}
                          >
                            <img
                              src="src/assets/filter_list.svg"
                              alt="Filtro"
                              className="w-4 h-4"
                            />
                          </button>
                        </div>

                        <FiltroModal
                          isOpen={campoFiltroAberto === "solicitante"}
                          onClose={() => setCampoFiltroAberto(null)}
                          onSubmit={(e) => {
                            e.preventDefault();
                            setCampoFiltroAberto(null); // Fecha o modal após o submit
                          }}
                          titulo="FILTRAR POR SOLICITANTE"
                        >
                          <input
                            type="text"
                            placeholder="Filtrar..."
                            className="border-[2px] px-2 py-1 rounded focus:outline-none text-sm w-full border-[#B8BCE0]"
                            value={filtroPendente.solicitante}
                            onChange={(e) =>
                              setFiltroPendente({
                                ...filtroPendente,
                                solicitante: e.target.value,
                              })
                            }
                          />
                        </FiltroModal>
                      </div>
                    </th>

                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[15%] align-top">
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-1">
                          Responsável
                          <button
                            onClick={() => setCampoFiltroAberto("responsavel")}
                          >
                            <img
                              src="src/assets/filter_list.svg"
                              alt="Filtro"
                              className="w-4 h-4"
                            />
                          </button>
                        </div>

                        <FiltroModal
                          isOpen={campoFiltroAberto === "responsavel"}
                          onClose={() => setCampoFiltroAberto(null)}
                          onSubmit={(e) => {
                            e.preventDefault();
                            setCampoFiltroAberto(null);
                          }}
                          titulo="FILTRAR POR RESPONSÁVEL"
                        >
                          <input
                            type="text"
                            placeholder="Filtrar..."
                            className="border-[2px] px-2 py-1 rounded focus:outline-none text-sm w-full border-[#B8BCE0]"
                            value={filtroPendente.responsavel}
                            onChange={(e) =>
                              setFiltroPendente({
                                ...filtroPendente,
                                responsavel: e.target.value,
                              })
                            }
                          />
                        </FiltroModal>
                      </div>
                    </th>

                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[15%]">
                      <div className="flex items-center gap-1">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_2194_2464)">
                            <path
                              d="M12.6667 1.33333H12V0.666667C12 0.489856 11.9298 0.320286 11.8047 0.195262C11.6797 0.0702379 11.5101 0 11.3333 0C11.1565 0 10.987 0.0702379 10.8619 0.195262C10.7369 0.320286 10.6667 0.489856 10.6667 0.666667V1.33333H5.33333V0.666667C5.33333 0.489856 5.2631 0.320286 5.13807 0.195262C5.01305 0.0702379 4.84348 0 4.66667 0C4.48986 0 4.32029 0.0702379 4.19526 0.195262C4.07024 0.320286 4 0.489856 4 0.666667V1.33333H3.33333C2.4496 1.33439 1.60237 1.68592 0.97748 2.31081C0.352588 2.93571 0.00105857 3.78294 0 4.66667L0 12.6667C0.00105857 13.5504 0.352588 14.3976 0.97748 15.0225C1.60237 15.6474 2.4496 15.9989 3.33333 16H12.6667C13.5504 15.9989 14.3976 15.6474 15.0225 15.0225C15.6474 14.3976 15.9989 13.5504 16 12.6667V4.66667C15.9989 3.78294 15.6474 2.93571 15.0225 2.31081C14.3976 1.68592 13.5504 1.33439 12.6667 1.33333ZM1.33333 4.66667C1.33333 4.13623 1.54405 3.62753 1.91912 3.25245C2.29419 2.87738 2.8029 2.66667 3.33333 2.66667H12.6667C13.1971 2.66667 13.7058 2.87738 14.0809 3.25245C14.456 3.62753 14.6667 4.13623 14.6667 4.66667V5.33333H1.33333V4.66667ZM12.6667 14.6667H3.33333C2.8029 14.6667 2.29419 14.456 1.91912 14.0809C1.54405 13.7058 1.33333 13.1971 1.33333 12.6667V6.66667H14.6667V12.6667C14.6667 13.1971 14.456 13.7058 14.0809 14.0809C13.7058 14.456 13.1971 14.6667 12.6667 14.6667Z"
                              fill="#081683"
                            />
                            <path
                              d="M8 11C8.55228 11 9 10.5523 9 10C9 9.44772 8.55228 9 8 9C7.44772 9 7 9.44772 7 10C7 10.5523 7.44772 11 8 11Z"
                              fill="#081683"
                            />
                            <path
                              d="M4.6665 11C5.21879 11 5.6665 10.5523 5.6665 10C5.6665 9.44772 5.21879 9 4.6665 9C4.11422 9 3.6665 9.44772 3.6665 10C3.6665 10.5523 4.11422 11 4.6665 11Z"
                              fill="#081683"
                            />
                            <path
                              d="M11.3335 11C11.8858 11 12.3335 10.5523 12.3335 10C12.3335 9.44772 11.8858 9 11.3335 9C10.7812 9 10.3335 9.44772 10.3335 10C10.3335 10.5523 10.7812 11 11.3335 11Z"
                              fill="#081683"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_2194_2464">
                              <rect width="16" height="16" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        Data retirada
                        <button
                          onClick={() => setCampoFiltroAberto("dataRetirada")}
                        >
                          <img src="src/assets/filter_list.svg" alt="" />
                        </button>
                        {/* Adicionando pop up de filtrar emprestimos */}
                        <FiltroModal
                          isOpen={campoFiltroAberto === "dataRetirada"}
                          onClose={() => setCampoFiltroAberto(null)}
                          onSubmit={(e) => {
                            e.preventDefault();
                            setCampoFiltroAberto(null);
                          }}
                          titulo="FILTRAR POR DATA"
                        >
                          <DayPicker
                            animate
                            mode="range"
                            selected={filtroDataEmprestimo}
                            onSelect={setFiltroDataEmprestimo}
                            locale={ptBR}
                            endMonth={new Date()}
                          />
                        </FiltroModal>
                      </div>
                    </th>

                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 pl-2 w-[18%]">
                      <div className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 17 16"
                          fill="none"
                        >
                          <g clip-path="url(#clip0_2194_2439)">
                            <path
                              d="M15.5698 12.0004H13.5698V10.0004C13.5698 9.8236 13.4996 9.65403 13.3746 9.529C13.2495 9.40398 13.08 9.33374 12.9032 9.33374C12.7263 9.33374 12.5568 9.40398 12.4318 9.529C12.3067 9.65403 12.2365 9.8236 12.2365 10.0004V12.0004H10.2365C10.0597 12.0004 9.89011 12.0706 9.76509 12.1957C9.64006 12.3207 9.56982 12.4903 9.56982 12.6671C9.56982 12.8439 9.64006 13.0135 9.76509 13.1385C9.89011 13.2635 10.0597 13.3337 10.2365 13.3337H12.2365V15.3337C12.2365 15.5106 12.3067 15.6801 12.4318 15.8051C12.5568 15.9302 12.7263 16.0004 12.9032 16.0004C13.08 16.0004 13.2495 15.9302 13.3746 15.8051C13.4996 15.6801 13.5698 15.5106 13.5698 15.3337V13.3337H15.5698C15.7466 13.3337 15.9162 13.2635 16.0412 13.1385C16.1663 13.0135 16.2365 12.8439 16.2365 12.6671C16.2365 12.4903 16.1663 12.3207 16.0412 12.1957C15.9162 12.0706 15.7466 12.0004 15.5698 12.0004Z"
                              fill="#081683"
                            />
                            <path
                              d="M7.56971 4.66667V7.724L5.76505 9.52866C5.70138 9.59016 5.65059 9.66372 5.61565 9.74506C5.58071 9.82639 5.56232 9.91387 5.56155 10.0024C5.56078 10.0909 5.57765 10.1787 5.61117 10.2606C5.64469 10.3426 5.69419 10.417 5.75679 10.4796C5.81938 10.5422 5.89381 10.5917 5.97575 10.6252C6.05768 10.6587 6.14546 10.6756 6.23398 10.6748C6.3225 10.6741 6.40998 10.6557 6.49132 10.6207C6.57265 10.5858 6.64621 10.535 6.70771 10.4713L8.70771 8.47133C8.83274 8.34633 8.903 8.17679 8.90304 7.99999V4.66667C8.90304 4.48986 8.8328 4.32029 8.70778 4.19526C8.58275 4.07024 8.41319 4 8.23637 4C8.05956 4 7.89 4.07024 7.76497 4.19526C7.63995 4.32029 7.56971 4.48986 7.56971 4.66667Z"
                              fill="#081683"
                            />
                            <path
                              d="M10.0549 14.4162C8.63725 14.8157 7.12707 14.7338 5.76092 14.1832C4.39477 13.6326 3.24981 12.6445 2.50536 11.3735C1.76091 10.1026 1.45901 8.62063 1.64695 7.15974C1.83488 5.69886 2.50204 4.34156 3.54393 3.30042C4.58583 2.25929 5.94361 1.59311 7.40463 1.40623C8.86565 1.21936 10.3474 1.52233 11.6178 2.2677C12.8882 3.01308 13.8755 4.15875 14.4251 5.5253C14.9747 6.89185 15.0555 8.40209 14.6549 9.81949C14.6278 9.90471 14.6181 9.9945 14.6265 10.0835C14.6348 10.1726 14.6609 10.259 14.7033 10.3378C14.7457 10.4165 14.8035 10.4859 14.8733 10.5418C14.9431 10.5977 15.0234 10.639 15.1095 10.6633C15.1955 10.6875 15.2856 10.6942 15.3743 10.6829C15.463 10.6717 15.5486 10.6426 15.6258 10.5976C15.7031 10.5526 15.7705 10.4925 15.8241 10.4209C15.8776 10.3493 15.9162 10.2677 15.9376 10.1808C16.4186 8.47868 16.3213 6.66508 15.6611 5.02413C15.0008 3.38319 13.8149 2.00761 12.2891 1.11288C10.7633 0.218155 8.9838 -0.145166 7.22938 0.0798335C5.47496 0.304833 3.84473 1.10544 2.59408 2.35624C1.34344 3.60704 0.543024 5.23736 0.318236 6.99181C0.0934483 8.74626 0.456985 10.5257 1.35189 12.0514C2.2468 13.5771 3.62253 14.7628 5.26355 15.4229C6.90458 16.0829 8.71819 16.18 10.4203 15.6988C10.5064 15.6767 10.5872 15.6376 10.6579 15.5837C10.7287 15.5299 10.7879 15.4625 10.8322 15.3854C10.8765 15.3084 10.905 15.2232 10.9159 15.135C10.9268 15.0468 10.92 14.9573 10.8958 14.8718C10.8716 14.7862 10.8306 14.7064 10.7751 14.637C10.7196 14.5675 10.6508 14.5099 10.5727 14.4674C10.4946 14.425 10.4088 14.3986 10.3203 14.3898C10.2319 14.381 10.1425 14.3899 10.0576 14.4162H10.0549Z"
                              fill="#081683"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_2194_2439">
                              <rect
                                width="16"
                                height="16"
                                fill="white"
                                transform="translate(0.236328)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        Hora da retirada
                        <button onClick={() => setCampoFiltroAberto("horaRetirada")}>
                        <img src="src/assets/filter_list.svg" alt="" />
                        </button>
                        <FiltroModal
                          isOpen={campoFiltroAberto === "horaRetirada"}

                          onClose={() => setCampoFiltroAberto(null)}
                          onSubmit={(e) => {
                            e.preventDefault();
                            setCampoFiltroAberto(null);
                          }}
                          titulo="FILTRAR POR HORA"
                        >
                          <input
                            type="text"
                            placeholder="Filtrar..."
                            className="border-[2px] px-2 py-1 rounded focus:outline-none text-sm w-full border-[#B8BCE0]"
                            value={filtroPendente.horaRetirada}
                            onChange={(e) =>
                              setFiltroPendente({
                                ...filtroPendente,
                                horaRetirada: e.target.value,
                              })
                            }
                          />
                        </FiltroModal>
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {itensAtuaisPendentes.length > 0 ? (
                    emprestimosFiltradosPendentes
                      .slice(
                        (paginaAtualPendente - 1) * itensPorPaginaPendente,
                        paginaAtualPendente * itensPorPaginaPendente
                      )
                      .map((emprestimo, index) => (
                        <tr key={index}>
                          <td className="p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[15%]">
                            <p className="text-[#646999] text-center  text-[15px] font-semibold leading-normal">
                              {salaSelecionadaId
                                ? salas.find(
                                    (sala) => sala.id === salaSelecionadaId
                                  )?.nome
                                : "Selecione uma sala"}
                            </p>
                          </td>
                          <td className="p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[15%]">
                            {emprestimo.chave}
                          </td>
                          <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[15%] break-words flex-1 text-center">
                            {emprestimo.solicitante}
                          </td>
                          <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[15%] break-words flex-1 text-center">
                            {emprestimo.responsavel}
                          </td>
                          <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[15%] break-words flex-1 text-center">
                            {emprestimo.dataRetirada}
                          </td>
                          <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[18%] break-words flex-1 text-center">
                            {emprestimo.horaRetirada}
                          </td>
                          <td className="border-2 border-[#B8BCE0] border-solid bg-[#0240E1]  p-0.5 font-semibold break-words">
                            <div className=" flex justify-center items-center mr-1 gap-2 p-1">
                              <Check color="white" size={18} />
                              <p className=" text-xs text-[#FFFF] text-center font-semibold leading-normal truncate">
                                DEVOLVER
                              </p>
                            </div>
                          </td>
                          <td className="pl-2">
                            <button
                              onClick={() => openDetalhesModal(emprestimo)}
                              className="flex gap-1 justify-start items-center font-medium text-[#646999] underline text-xs"
                            >
                              <Info className="size-5 text-[#646999]" />
                            </button>
                          </td>

                          {/* Adicionando pop up de detalhes do empréstimo */}
                          {isDetalhesModalOpen &&
                            emprestimo.id === emprestimoSelecionado?.id && (
                              // emprestimo.id === emprestimoSelecionado?.id &&
                              <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                                <form className="container flex flex-col gap-2 w-full px-4 py-4 h-auto rounded-[15px] bg-white mx-5 max-w-[500px]">
                                  <div className="flex justify-between w-full px-3">
                                    <p className="text-[#192160] text-left text-[20px] font-semibold pr-6">
                                      DETALHES
                                    </p>
                                    <div className="flex justify-center items-center gap-3">
                                      <button
                                        type="button"
                                        onClick={openEditModal}
                                        className="flex gap-1 justify-end items-center font-medium text-sm text-[#646999] underline"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="12"
                                          height="12"
                                          fill="#646999"
                                          className="bi bi-pen"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                                        </svg>
                                        Editar
                                      </button>

                                      {/* Começo do pop up de editar emprestimo */}
                                      {isEditModalOpen && (
                                        <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                                          <form
                                            // onSubmit={editarObservacao}
                                            className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px]"
                                          >
                                            <div className="flex justify-center mx-auto w-full max-w-[90%]">
                                              <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                                                EDITAR OBSERVAÇÃO
                                              </p>

                                              <button
                                                onClick={closeEditModal}
                                                type="button"
                                                className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                                              >
                                                <X className=" mb-[5px] text-[#192160]" />
                                              </button>
                                            </div>

                                            <div className="justify-center items-center ml-[40px] mr-8">
                                              <p className="text-[#192160] text-sm font-medium mb-1">
                                                Digite a nova observação
                                              </p>

                                              <input
                                                className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                                                type="text"
                                                placeholder="Observação"
                                                value={
                                                  observacao !== null
                                                    ? observacao
                                                    : ""
                                                }
                                                onChange={(e) =>
                                                  setObservacao(e.target.value)
                                                }
                                              />
                                            </div>

                                            <div className="flex justify-center items-center mt-[10px] w-full">
                                              <button
                                                type="submit"
                                                onClick={editarObservacao}
                                                className="px-3 py-2 border-[3px] rounded-xl font-semibold  text-sm flex gap-[4px] justify-center items-center  bg-[#16C34D] text-[#FFF]"
                                              >
                                                SALVAR ALTERAÇÕES
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                      )}
                                      {/* Fim do pop up de editar emprestimo */}

                                      <button
                                        type="button"
                                        onClick={openDeleteModal}
                                        className="flex gap-1 justify-start items-center font-medium text-sm text-rose-600 underline"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="12"
                                          height="12"
                                          fill="#e11d48"
                                          className="bi bi-x-lg"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                                        </svg>
                                        Excluir
                                      </button>

                                      {/* Adicionando pop up de deletar emprestimo */}
                                      {isDeleteModalOpen && (
                                        <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                                          <form
                                            onSubmit={removeObservacao}
                                            className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px] justify-center items-center"
                                          >
                                            <div className="flex justify-center mx-auto w-full max-w-[90%]">
                                              <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] h-max">
                                                EXCLUIR OBSERVAÇÃO
                                              </p>
                                              <button
                                                onClick={closeDeleteModal}
                                                type="button"
                                                className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                                              >
                                                <X className=" text-[#192160]" />
                                              </button>
                                            </div>
                                            <TriangleAlert className="size-16 text-red-700" />

                                            <p className="text-center px-2">
                                              Essa ação é{" "}
                                              <strong className="font-semibold ">
                                                definitiva
                                              </strong>{" "}
                                              e não pode ser desfeita.{" "}
                                              <strong className="font-semibold">
                                                Tem certeza disso?
                                              </strong>
                                            </p>
                                            <div className="flex justify-center items-center mt-[10px] w-full gap-3">
                                              <button
                                                onClick={closeDeleteModal}
                                                type="button"
                                                className="px-4 py-2 border-[3px] rounded-xl font-semibold  text-sm flex gap-[4px] justify-center items-center  bg-slate-500 text-[#FFF]"
                                              >
                                                CANCELAR
                                              </button>
                                              <button
                                                type="submit"
                                                onClick={removeObservacao}
                                                className="px-4 py-2 border-[3px] rounded-xl font-semibold  text-sm flex gap-[4px] justify-center items-center  bg-red-700 text-[#FFF]"
                                              >
                                                EXCLUIR
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                      )}
                                    </div>
                                    <button
                                      onClick={closeDetalhesModal}
                                      type="button"
                                      className="px-2 py-1 rounded flex-shrink-0 "
                                    >
                                      <X className=" mb-[5px] text-[#192160]" />
                                    </button>
                                  </div>

                                  <div className="flex w-full h-auto px-[10px] py-2 mb-4 flex-col rounded-lg bg-[#B8BCE0]">
                                    <p className="text-[#192160] font-medium p-1">
                                      {emprestimoSelecionado.observacao ||
                                        "Detalhes sobre o empréstimo"}
                                    </p>
                                  </div>
                                </form>
                              </div>
                            )}
                          {/* Fim adicionando pop up de detalhes do emprestimo */}
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-4 text-center text-[#646999]"
                      >
                        Nenhum empréstimo pendente encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* fim tabela de emprestimo pendente */}

              {/* passador de página OBS: quando adaptar as tabelas, ADICIONAR O COMPONENTE */}
              <div className=" mt-5 flex justify-end items-center">
                <PassadorPagina
                  avancarPagina={avancarPaginaPendente}
                  voltarPagina={voltarPaginaPendente}
                  totalPaginas={totalPaginasPendentes}
                  paginaAtual={paginaAtualPendente}
                />
              </div>
            </div>
            {/* fim passador de página */}

            {/* tabela com emprestimo concluido */}
            <div
              className={`overflow-y-auto max-h-[248px] tablet:max-h-64 desktop:max-h-96 ${
                !exibirEmprestimosPendentes ? "block" : "hidden"
              }`}
            >
              <table className="w-full table-fixed border-separate border-spacing-y-2 bg-white">
                <thead className="bg-white  top-0 z-10">
                  <tr>
                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[13%]">
                      <div className="flex items-center gap-1">
                        Nome da sala
                        <img src="src/assets/filter_list.svg" alt="" />
                      </div>
                    </th>

                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[13%] align-top">
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-1">
                          Tipo de chave
                          <button onClick={() => setCampoFiltroAberto("chave")}>
                            <img
                              src="src/assets/filter_list.svg"
                              alt="Filtro"
                              className="w-4 h-4"
                            />
                          </button>
                        </div>

                        <FiltroModal
                          isOpen={campoFiltroAberto === "chave"}
                          onClose={() => setCampoFiltroAberto(null)}
                          onSubmit={(e) => {
                            e.preventDefault();
                            setCampoFiltroAberto(null);
                          }}
                          titulo="FILTRAR POR TIPO DE CHAVE"
                        >
                          <input
                            type="text"
                            placeholder="Filtrar..."
                            className="border-[2px] px-2 py-1 rounded focus:outline-none text-sm w-full border-[#B8BCE0]"
                            value={filtroConcluido.chave}
                            onChange={(e) =>
                              setFiltroConcluido({
                                ...filtroConcluido,
                                chave: e.target.value,
                              })
                            }
                          />
                        </FiltroModal>
                      </div>
                    </th>

                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[12%] align-top">
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-1">
                          Solicitante
                          <button
                            onClick={() => setCampoFiltroAberto("solicitante")}
                          >
                            <img
                              src="src/assets/filter_list.svg"
                              alt="Filtro"
                              className="w-4 h-4"
                            />
                          </button>
                        </div>

                        <FiltroModal
                          isOpen={campoFiltroAberto === "solicitante"}
                          onClose={() => setCampoFiltroAberto(null)}
                          onSubmit={(e) => {
                            e.preventDefault();
                            setCampoFiltroAberto(null);
                          }}
                          titulo="FILTRAR POR SOLICITANTE"
                        >
                          <input
                            type="text"
                            placeholder="Filtrar..."
                            className="border-[2px] px-2 py-1 rounded focus:outline-none text-sm w-full border-[#B8BCE0]"
                            value={filtroConcluido.solicitante}
                            onChange={(e) =>
                              setFiltroConcluido({
                                ...filtroConcluido,
                                solicitante: e.target.value,
                              })
                            }
                          />
                        </FiltroModal>
                      </div>
                    </th>

                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[12%] align-top">
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-1">
                          Responsável
                          <button
                            onClick={() => setCampoFiltroAberto("responsavel")}
                          >
                            <img
                              src="src/assets/filter_list.svg"
                              alt="Filtro"
                              className="w-4 h-4"
                            />
                          </button>
                        </div>

                        <FiltroModal
                          isOpen={campoFiltroAberto === "responsavel"}
                          onClose={() => setCampoFiltroAberto(null)}
                          onSubmit={(e) => {
                            e.preventDefault();
                            setCampoFiltroAberto(null);
                          }}
                          titulo="FILTRAR POR RESPONSÁVEL"
                        >
                          <input
                            type="text"
                            placeholder="Filtrar..."
                            className="border-[2px] px-2 py-1 rounded focus:outline-none text-sm w-full border-[#B8BCE0]"
                            value={filtroConcluido.responsavel}
                            onChange={(e) =>
                              setFiltroConcluido({
                                ...filtroConcluido,
                                responsavel: e.target.value,
                              })
                            }
                          />
                        </FiltroModal>
                      </div>
                    </th>

                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[10%]">
                      <div className="flex items-center">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_2194_2464)">
                            <path
                              d="M12.6667 1.33333H12V0.666667C12 0.489856 11.9298 0.320286 11.8047 0.195262C11.6797 0.0702379 11.5101 0 11.3333 0C11.1565 0 10.987 0.0702379 10.8619 0.195262C10.7369 0.320286 10.6667 0.489856 10.6667 0.666667V1.33333H5.33333V0.666667C5.33333 0.489856 5.2631 0.320286 5.13807 0.195262C5.01305 0.0702379 4.84348 0 4.66667 0C4.48986 0 4.32029 0.0702379 4.19526 0.195262C4.07024 0.320286 4 0.489856 4 0.666667V1.33333H3.33333C2.4496 1.33439 1.60237 1.68592 0.97748 2.31081C0.352588 2.93571 0.00105857 3.78294 0 4.66667L0 12.6667C0.00105857 13.5504 0.352588 14.3976 0.97748 15.0225C1.60237 15.6474 2.4496 15.9989 3.33333 16H12.6667C13.5504 15.9989 14.3976 15.6474 15.0225 15.0225C15.6474 14.3976 15.9989 13.5504 16 12.6667V4.66667C15.9989 3.78294 15.6474 2.93571 15.0225 2.31081C14.3976 1.68592 13.5504 1.33439 12.6667 1.33333ZM1.33333 4.66667C1.33333 4.13623 1.54405 3.62753 1.91912 3.25245C2.29419 2.87738 2.8029 2.66667 3.33333 2.66667H12.6667C13.1971 2.66667 13.7058 2.87738 14.0809 3.25245C14.456 3.62753 14.6667 4.13623 14.6667 4.66667V5.33333H1.33333V4.66667ZM12.6667 14.6667H3.33333C2.8029 14.6667 2.29419 14.456 1.91912 14.0809C1.54405 13.7058 1.33333 13.1971 1.33333 12.6667V6.66667H14.6667V12.6667C14.6667 13.1971 14.456 13.7058 14.0809 14.0809C13.7058 14.456 13.1971 14.6667 12.6667 14.6667Z"
                              fill="#081683"
                            />
                            <path
                              d="M8 11C8.55228 11 9 10.5523 9 10C9 9.44772 8.55228 9 8 9C7.44772 9 7 9.44772 7 10C7 10.5523 7.44772 11 8 11Z"
                              fill="#081683"
                            />
                            <path
                              d="M4.6665 11C5.21879 11 5.6665 10.5523 5.6665 10C5.6665 9.44772 5.21879 9 4.6665 9C4.11422 9 3.6665 9.44772 3.6665 10C3.6665 10.5523 4.11422 11 4.6665 11Z"
                              fill="#081683"
                            />
                            <path
                              d="M11.3335 11C11.8858 11 12.3335 10.5523 12.3335 10C12.3335 9.44772 11.8858 9 11.3335 9C10.7812 9 10.3335 9.44772 10.3335 10C10.3335 10.5523 10.7812 11 11.3335 11Z"
                              fill="#081683"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_2194_2464">
                              <rect width="16" height="16" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        Retirada
                        <button
                          onClick={() => setCampoFiltroAberto("dataRetirada")}
                        >
                          <img src="src/assets/filter_list.svg" alt="" />
                        </button>
                        {/* Adicionando pop up de filtrar emprestimos */}
                        <FiltroModal
                          isOpen={campoFiltroAberto === "dataRetirada"}
                          onClose={() => setCampoFiltroAberto(null)}
                          onSubmit={(e) => {
                            e.preventDefault();
                            setCampoFiltroAberto(null);
                          }}
                          titulo="FILTRAR POR DATA"
                        >
                          <DayPicker
                            animate
                            mode="range"
                            selected={filtroDataEmprestimo}
                            onSelect={setFiltroDataEmprestimo}
                            locale={ptBR}
                            endMonth={new Date()}
                          />
                        </FiltroModal>
                      </div>
                    </th>

                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[12%]">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 17 16"
                          fill="none"
                        >
                          <g clip-path="url(#clip0_2194_2439)">
                            <path
                              d="M15.5698 12.0004H13.5698V10.0004C13.5698 9.8236 13.4996 9.65403 13.3746 9.529C13.2495 9.40398 13.08 9.33374 12.9032 9.33374C12.7263 9.33374 12.5568 9.40398 12.4318 9.529C12.3067 9.65403 12.2365 9.8236 12.2365 10.0004V12.0004H10.2365C10.0597 12.0004 9.89011 12.0706 9.76509 12.1957C9.64006 12.3207 9.56982 12.4903 9.56982 12.6671C9.56982 12.8439 9.64006 13.0135 9.76509 13.1385C9.89011 13.2635 10.0597 13.3337 10.2365 13.3337H12.2365V15.3337C12.2365 15.5106 12.3067 15.6801 12.4318 15.8051C12.5568 15.9302 12.7263 16.0004 12.9032 16.0004C13.08 16.0004 13.2495 15.9302 13.3746 15.8051C13.4996 15.6801 13.5698 15.5106 13.5698 15.3337V13.3337H15.5698C15.7466 13.3337 15.9162 13.2635 16.0412 13.1385C16.1663 13.0135 16.2365 12.8439 16.2365 12.6671C16.2365 12.4903 16.1663 12.3207 16.0412 12.1957C15.9162 12.0706 15.7466 12.0004 15.5698 12.0004Z"
                              fill="#081683"
                            />
                            <path
                              d="M7.56971 4.66667V7.724L5.76505 9.52866C5.70138 9.59016 5.65059 9.66372 5.61565 9.74506C5.58071 9.82639 5.56232 9.91387 5.56155 10.0024C5.56078 10.0909 5.57765 10.1787 5.61117 10.2606C5.64469 10.3426 5.69419 10.417 5.75679 10.4796C5.81938 10.5422 5.89381 10.5917 5.97575 10.6252C6.05768 10.6587 6.14546 10.6756 6.23398 10.6748C6.3225 10.6741 6.40998 10.6557 6.49132 10.6207C6.57265 10.5858 6.64621 10.535 6.70771 10.4713L8.70771 8.47133C8.83274 8.34633 8.903 8.17679 8.90304 7.99999V4.66667C8.90304 4.48986 8.8328 4.32029 8.70778 4.19526C8.58275 4.07024 8.41319 4 8.23637 4C8.05956 4 7.89 4.07024 7.76497 4.19526C7.63995 4.32029 7.56971 4.48986 7.56971 4.66667Z"
                              fill="#081683"
                            />
                            <path
                              d="M10.0549 14.4162C8.63725 14.8157 7.12707 14.7338 5.76092 14.1832C4.39477 13.6326 3.24981 12.6445 2.50536 11.3735C1.76091 10.1026 1.45901 8.62063 1.64695 7.15974C1.83488 5.69886 2.50204 4.34156 3.54393 3.30042C4.58583 2.25929 5.94361 1.59311 7.40463 1.40623C8.86565 1.21936 10.3474 1.52233 11.6178 2.2677C12.8882 3.01308 13.8755 4.15875 14.4251 5.5253C14.9747 6.89185 15.0555 8.40209 14.6549 9.81949C14.6278 9.90471 14.6181 9.9945 14.6265 10.0835C14.6348 10.1726 14.6609 10.259 14.7033 10.3378C14.7457 10.4165 14.8035 10.4859 14.8733 10.5418C14.9431 10.5977 15.0234 10.639 15.1095 10.6633C15.1955 10.6875 15.2856 10.6942 15.3743 10.6829C15.463 10.6717 15.5486 10.6426 15.6258 10.5976C15.7031 10.5526 15.7705 10.4925 15.8241 10.4209C15.8776 10.3493 15.9162 10.2677 15.9376 10.1808C16.4186 8.47868 16.3213 6.66508 15.6611 5.02413C15.0008 3.38319 13.8149 2.00761 12.2891 1.11288C10.7633 0.218155 8.9838 -0.145166 7.22938 0.0798335C5.47496 0.304833 3.84473 1.10544 2.59408 2.35624C1.34344 3.60704 0.543024 5.23736 0.318236 6.99181C0.0934483 8.74626 0.456985 10.5257 1.35189 12.0514C2.2468 13.5771 3.62253 14.7628 5.26355 15.4229C6.90458 16.0829 8.71819 16.18 10.4203 15.6988C10.5064 15.6767 10.5872 15.6376 10.6579 15.5837C10.7287 15.5299 10.7879 15.4625 10.8322 15.3854C10.8765 15.3084 10.905 15.2232 10.9159 15.135C10.9268 15.0468 10.92 14.9573 10.8958 14.8718C10.8716 14.7862 10.8306 14.7064 10.7751 14.637C10.7196 14.5675 10.6508 14.5099 10.5727 14.4674C10.4946 14.425 10.4088 14.3986 10.3203 14.3898C10.2319 14.381 10.1425 14.3899 10.0576 14.4162H10.0549Z"
                              fill="#081683"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_2194_2439">
                              <rect
                                width="16"
                                height="16"
                                fill="white"
                                transform="translate(0.236328)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        Hora retirada
                        <button onClick={() => setCampoFiltroAberto("horaRetirada")}>
                        <img src="src/assets/filter_list.svg" alt="" />
                        </button>
                        <FiltroModal
                          isOpen={campoFiltroAberto === "horaRetirada"}

                          onClose={() => setCampoFiltroAberto(null)}
                          onSubmit={(e) => {
                            e.preventDefault();
                            setCampoFiltroAberto(null);
                          }}
                          titulo="FILTRAR POR HORA"
                        >
                          <input
                            type="text"
                            placeholder="Filtrar..."
                            className="border-[2px] px-2 py-1 rounded focus:outline-none text-sm w-full border-[#B8BCE0]"
                            value={filtroConcluido.horaRetirada}
                            onChange={(e) =>
                              setFiltroConcluido({
                                ...filtroConcluido,
                                horaRetirada: e.target.value,
                              })
                            }
                          />
                        </FiltroModal>
                      </div>
                    </th>

                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[10%]">
                      <div className="flex items-center">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_2194_2464)">
                            <path
                              d="M12.6667 1.33333H12V0.666667C12 0.489856 11.9298 0.320286 11.8047 0.195262C11.6797 0.0702379 11.5101 0 11.3333 0C11.1565 0 10.987 0.0702379 10.8619 0.195262C10.7369 0.320286 10.6667 0.489856 10.6667 0.666667V1.33333H5.33333V0.666667C5.33333 0.489856 5.2631 0.320286 5.13807 0.195262C5.01305 0.0702379 4.84348 0 4.66667 0C4.48986 0 4.32029 0.0702379 4.19526 0.195262C4.07024 0.320286 4 0.489856 4 0.666667V1.33333H3.33333C2.4496 1.33439 1.60237 1.68592 0.97748 2.31081C0.352588 2.93571 0.00105857 3.78294 0 4.66667L0 12.6667C0.00105857 13.5504 0.352588 14.3976 0.97748 15.0225C1.60237 15.6474 2.4496 15.9989 3.33333 16H12.6667C13.5504 15.9989 14.3976 15.6474 15.0225 15.0225C15.6474 14.3976 15.9989 13.5504 16 12.6667V4.66667C15.9989 3.78294 15.6474 2.93571 15.0225 2.31081C14.3976 1.68592 13.5504 1.33439 12.6667 1.33333ZM1.33333 4.66667C1.33333 4.13623 1.54405 3.62753 1.91912 3.25245C2.29419 2.87738 2.8029 2.66667 3.33333 2.66667H12.6667C13.1971 2.66667 13.7058 2.87738 14.0809 3.25245C14.456 3.62753 14.6667 4.13623 14.6667 4.66667V5.33333H1.33333V4.66667ZM12.6667 14.6667H3.33333C2.8029 14.6667 2.29419 14.456 1.91912 14.0809C1.54405 13.7058 1.33333 13.1971 1.33333 12.6667V6.66667H14.6667V12.6667C14.6667 13.1971 14.456 13.7058 14.0809 14.0809C13.7058 14.456 13.1971 14.6667 12.6667 14.6667Z"
                              fill="#081683"
                            />
                            <path
                              d="M8 11C8.55228 11 9 10.5523 9 10C9 9.44772 8.55228 9 8 9C7.44772 9 7 9.44772 7 10C7 10.5523 7.44772 11 8 11Z"
                              fill="#081683"
                            />
                            <path
                              d="M4.6665 11C5.21879 11 5.6665 10.5523 5.6665 10C5.6665 9.44772 5.21879 9 4.6665 9C4.11422 9 3.6665 9.44772 3.6665 10C3.6665 10.5523 4.11422 11 4.6665 11Z"
                              fill="#081683"
                            />
                            <path
                              d="M11.3335 11C11.8858 11 12.3335 10.5523 12.3335 10C12.3335 9.44772 11.8858 9 11.3335 9C10.7812 9 10.3335 9.44772 10.3335 10C10.3335 10.5523 10.7812 11 11.3335 11Z"
                              fill="#081683"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_2194_2464">
                              <rect width="16" height="16" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        Devolução
                        <button
                          onClick={() => setCampoFiltroAberto("dataDevolucao")}
                        >
                          <img src="src/assets/filter_list.svg" alt="" />
                        </button>
                        {/* Adicionando pop up de filtrar emprestimos */}
                        <FiltroModal
                          isOpen={campoFiltroAberto === "dataDevolucao"}
                          onClose={() => setCampoFiltroAberto(null)}
                          onSubmit={(e) => {
                            e.preventDefault();
                            setCampoFiltroAberto(null);
                          }}
                          titulo="FILTRAR POR DATA"
                        >
                          <DayPicker
                            animate
                            mode="range"
                            selected={filtroDataEmprestimo}
                            onSelect={setFiltroDataEmprestimo}
                            locale={ptBR}
                            endMonth={new Date()}
                          />
                        </FiltroModal>
                      </div>
                    </th>

                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[14%]">
                      <div className="flex items-center">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 17 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_2194_2451)">
                            <path
                              d="M16.0408 10.8827C15.9158 10.7577 15.7462 10.6875 15.5695 10.6875C15.3927 10.6875 15.2232 10.7577 15.0981 10.8827L11.3468 14.6347L9.5548 12.866C9.43104 12.7392 9.26194 12.6667 9.08472 12.6645C8.9075 12.6623 8.73667 12.7306 8.6098 12.8544C8.48294 12.9781 8.41044 13.1472 8.40825 13.3244C8.40607 13.5017 8.47437 13.6725 8.59814 13.7994L10.4275 15.5994C10.5422 15.7231 10.6808 15.8223 10.8349 15.891C10.989 15.9598 11.1554 15.9966 11.3241 15.9994H11.3461C11.5115 15.9999 11.6753 15.9676 11.8281 15.9043C11.9809 15.841 12.1196 15.748 12.2361 15.6307L16.0408 11.8254C16.1658 11.7003 16.236 11.5308 16.236 11.354C16.236 11.1772 16.1658 11.0077 16.0408 10.8827Z"
                              fill="#081683"
                            />
                            <path
                              d="M7.62966 14.6387C6.34236 14.5211 5.11701 14.0317 4.10281 13.2302C3.08861 12.4287 2.3293 11.3497 1.91731 10.1244C1.50533 8.89915 1.45844 7.58054 1.78237 6.32911C2.10629 5.07769 2.78705 3.94743 3.74177 3.07593C4.69649 2.20443 5.88398 1.62929 7.15968 1.42053C8.43538 1.21177 9.74426 1.37839 10.927 1.9001C12.1097 2.42182 13.1152 3.27613 13.8211 4.35902C14.5271 5.44192 14.9029 6.70669 14.903 7.99936C14.903 8.20402 14.893 8.40669 14.8757 8.60669C14.8675 8.6941 14.8767 8.78226 14.9027 8.86611C14.9287 8.94996 14.971 9.02784 15.0272 9.0953C15.0834 9.16276 15.1523 9.21845 15.2301 9.25919C15.3078 9.29993 15.3929 9.32491 15.4803 9.33269C15.5677 9.34148 15.656 9.33273 15.7399 9.30694C15.8239 9.28116 15.9018 9.23886 15.9692 9.18253C16.0366 9.12621 16.092 9.05699 16.1323 8.97894C16.1726 8.90089 16.1968 8.81558 16.2037 8.72802C16.225 8.48602 16.2363 8.24402 16.2363 7.99936C16.2362 6.4481 15.7852 4.93032 14.938 3.63082C14.0908 2.33131 12.8841 1.30614 11.4648 0.680123C10.0454 0.0541021 8.47473 -0.145764 6.94385 0.104858C5.41297 0.35548 3.98797 1.04578 2.84236 2.09171C1.69674 3.13764 0.879927 4.49408 0.491362 5.99589C0.102797 7.4977 0.159243 9.08008 0.653828 10.5504C1.14841 12.0207 2.0598 13.3155 3.27703 14.2771C4.49426 15.2388 5.96482 15.8258 7.50966 15.9667H7.57033C7.74714 15.9746 7.91984 15.9119 8.05042 15.7924C8.18101 15.6729 8.25879 15.5065 8.26666 15.3297C8.27453 15.1529 8.21184 14.9802 8.09238 14.8496C7.97292 14.719 7.80647 14.6412 7.62966 14.6334V14.6387Z"
                              fill="#081683"
                            />
                            <path
                              d="M7.56971 4.66667V7.724L5.76505 9.52866C5.70138 9.59016 5.65059 9.66372 5.61565 9.74506C5.58071 9.82639 5.56232 9.91387 5.56155 10.0024C5.56078 10.0909 5.57765 10.1787 5.61117 10.2606C5.64469 10.3426 5.69419 10.417 5.75679 10.4796C5.81938 10.5422 5.89381 10.5917 5.97575 10.6252C6.05768 10.6587 6.14546 10.6756 6.23398 10.6748C6.3225 10.6741 6.40998 10.6557 6.49132 10.6207C6.57265 10.5858 6.64621 10.535 6.70771 10.4713L8.70771 8.47133C8.83274 8.34633 8.903 8.17679 8.90304 7.99999V4.66667C8.90304 4.48986 8.8328 4.32029 8.70778 4.19526C8.58275 4.07024 8.41319 4 8.23637 4C8.05956 4 7.89 4.07024 7.76497 4.19526C7.63995 4.32029 7.56971 4.48986 7.56971 4.66667Z"
                              fill="#081683"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_2194_2451">
                              <rect
                                width="16"
                                height="16"
                                fill="white"
                                transform="translate(0.236328)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        Hora devolução
                        <button onClick={() => setCampoFiltroAberto("horaDevolucao")}>
                        <img src="src/assets/filter_list.svg" alt="" />
                        </button>
                        <FiltroModal
                          isOpen={campoFiltroAberto === "horaDevolucao"}

                          onClose={() => setCampoFiltroAberto(null)}
                          onSubmit={(e) => {
                            e.preventDefault();
                            setCampoFiltroAberto(null);
                          }}
                          titulo="FILTRAR POR HORA"
                        >
                          <input
                            type="text"
                            placeholder="Filtrar..."
                            className="border-[2px] px-2 py-1 rounded focus:outline-none text-sm w-full border-[#B8BCE0]"
                            value={filtroConcluido.horaDevolucao}
                            onChange={(e) =>
                              setFiltroConcluido({
                                ...filtroConcluido,
                                horaDevolucao: e.target.value,
                              })
                            }
                          />
                        </FiltroModal>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {itensAtuaisConcluidos.length > 0 ? (
                    emprestimosFiltradosConcluidos
                      .slice(
                        (paginaAtualConcluidos - 1) * itensPorPaginaConcluidos,
                        paginaAtualConcluidos * itensPorPaginaConcluidos
                      )
                      .map((emprestimo, index) => (
                        <tr key={index}>
                          <td className="p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[13%]">
                            {emprestimo.sala}
                          </td>
                          <td className="p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[13%]">
                            {emprestimo.chave}
                          </td>
                          <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[12%] break-words flex-1 text-center">
                            {emprestimo.solicitante}
                          </td>
                          <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[12%] break-words flex-1 text-center">
                            {emprestimo.responsavel}
                          </td>
                          <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[10%] break-words flex-1 text-center">
                            {emprestimo.dataRetirada}
                          </td>
                          <td className=" p-2 text-xs text-white bg-[#16C34D] font-semibold border-2 border-solid border-[#B8BCE0] w-[13%] break-words flex-1 text-center">
                            {emprestimo.horaRetirada}
                          </td>
                          <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[10%] break-words flex-1 text-center">
                            {emprestimo.dataDevolucao}
                          </td>
                          <td className=" p-2 text-xs text-white bg-[#0240E1] font-semibold border-2 border-solid border-[#B8BCE0] w-[13%] break-words flex-1 text-center">
                            {emprestimo.horaDevolucao}
                          </td>

                          <td className="pl-2">
                            <button
                              onClick={() => openDetalhesModal(emprestimo)}
                              className="flex gap-1 justify-start items-center font-medium text-[#646999] underline text-xs"
                            >
                              <Info className="size-5 text-[#646999]" />
                            </button>
                          </td>
                          {/* Adicionando pop up de detalhes do empréstimo */}
                          {isDetalhesModalOpen &&
                            emprestimo.id === emprestimoSelecionado?.id && (
                              // emprestimo.id === emprestimoSelecionado?.id &&
                              <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                                <form className="container flex flex-col gap-2 w-full px-4 py-4 h-auto rounded-[15px] bg-white mx-5 max-w-[500px]">
                                  <div className="flex justify-between w-full px-3">
                                    <p className="text-[#192160] text-left text-[20px] font-semibold pr-6">
                                      DETALHES
                                    </p>
                                    <div className="flex justify-center items-center gap-3">
                                      <button
                                        type="button"
                                        onClick={openEditModal}
                                        className="flex gap-1 justify-end items-center font-medium text-sm text-[#646999] underline"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="12"
                                          height="12"
                                          fill="#646999"
                                          className="bi bi-pen"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                                        </svg>
                                        Editar
                                      </button>

                                      {/* Começo do pop up de editar emprestimo */}
                                      {isEditModalOpen && (
                                        <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                                          <form
                                            // onSubmit={editarObservacao}
                                            className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px]"
                                          >
                                            <div className="flex justify-center mx-auto w-full max-w-[90%]">
                                              <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                                                EDITAR OBSERVAÇÃO
                                              </p>

                                              <button
                                                onClick={closeEditModal}
                                                type="button"
                                                className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                                              >
                                                <X className=" mb-[5px] text-[#192160]" />
                                              </button>
                                            </div>

                                            <div className="justify-center items-center ml-[40px] mr-8">
                                              <p className="text-[#192160] text-sm font-medium mb-1">
                                                Digite a nova observação
                                              </p>

                                              <input
                                                className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                                                type="text"
                                                placeholder="Observação"
                                                value={
                                                  observacao !== null
                                                    ? observacao
                                                    : ""
                                                }
                                                onChange={(e) =>
                                                  setObservacao(e.target.value)
                                                }
                                              />
                                            </div>

                                            <div className="flex justify-center items-center mt-[10px] w-full">
                                              <button
                                                type="submit"
                                                onClick={editarObservacao}
                                                className="px-3 py-2 border-[3px] rounded-xl font-semibold  text-sm flex gap-[4px] justify-center items-center  bg-[#16C34D] text-[#FFF]"
                                              >
                                                SALVAR ALTERAÇÕES
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                      )}
                                      {/* Fim do pop up de editar emprestimo */}

                                      <button
                                        type="button"
                                        onClick={openDeleteModal}
                                        className="flex gap-1 justify-start items-center font-medium text-sm text-rose-600 underline"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="12"
                                          height="12"
                                          fill="#e11d48"
                                          className="bi bi-x-lg"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                                        </svg>
                                        Excluir
                                      </button>

                                      {/* Adicionando pop up de deletar emprestimo */}
                                      {isDeleteModalOpen && (
                                        <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                                          <form
                                            onSubmit={removeObservacao}
                                            className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px] justify-center items-center"
                                          >
                                            <div className="flex justify-center mx-auto w-full max-w-[90%]">
                                              <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] h-max">
                                                EXCLUIR OBSERVAÇÃO
                                              </p>
                                              <button
                                                onClick={closeDeleteModal}
                                                type="button"
                                                className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                                              >
                                                <X className=" text-[#192160]" />
                                              </button>
                                            </div>
                                            <TriangleAlert className="size-16 text-red-700" />

                                            <p className="text-center px-2">
                                              Essa ação é{" "}
                                              <strong className="font-semibold ">
                                                definitiva
                                              </strong>{" "}
                                              e não pode ser desfeita.{" "}
                                              <strong className="font-semibold">
                                                Tem certeza disso?
                                              </strong>
                                            </p>
                                            <div className="flex justify-center items-center mt-[10px] w-full gap-3">
                                              <button
                                                onClick={closeDeleteModal}
                                                type="button"
                                                className="px-4 py-2 border-[3px] rounded-xl font-semibold  text-sm flex gap-[4px] justify-center items-center  bg-slate-500 text-[#FFF]"
                                              >
                                                CANCELAR
                                              </button>
                                              <button
                                                type="submit"
                                                onClick={removeObservacao}
                                                className="px-4 py-2 border-[3px] rounded-xl font-semibold  text-sm flex gap-[4px] justify-center items-center  bg-red-700 text-[#FFF]"
                                              >
                                                EXCLUIR
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                      )}
                                    </div>
                                    <button
                                      onClick={closeDetalhesModal}
                                      type="button"
                                      className="px-2 py-1 rounded flex-shrink-0 "
                                    >
                                      <X className=" mb-[5px] text-[#192160]" />
                                    </button>
                                  </div>

                                  <div className="flex w-full h-auto px-[10px] py-2 mb-4 flex-col rounded-lg bg-[#B8BCE0]">
                                    <p className="text-[#192160] font-medium p-1">
                                      {emprestimoSelecionado.observacao ||
                                        "Detalhes sobre o empréstimo"}
                                    </p>
                                  </div>
                                </form>
                              </div>
                            )}
                          {/* Fim adicionando pop up de detalhes do emprestimo */}
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-4 text-center text-[#646999]"
                      >
                        Nenhum empréstimo concluído encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* fim tabela com emprestimo concluido */}

              {/* passador de página */}
              <div className=" mt-5 flex justify-end items-center">
                <PassadorPagina
                  avancarPagina={avancarPaginaConcluidos}
                  voltarPagina={voltarPaginaConcluidos}
                  totalPaginas={totalPaginasConcluidos}
                  paginaAtual={paginaAtualConcluidos}
                />
              </div>
              {/* fim passador de página */}
            </div>
            {/* fim tabela de emprestimo concluido */}
          </div>
          {/* fim conteudo central tabela*/}
        </div>
        {/* fim conteudo central tela de empréstimo */}

        {/* logo chameco lateral */}
        <div className="flex justify-start bottom-4 absolute sm:hidden">
          <img
            className="sm:w-[200px] w-32"
            src="\logo_lateral.png"
            alt="logo chameco"
          />
        </div>
        {/* fim logo chameco lateral */}
      </div>
      {/* fim parte informativa tela de empréstimo */}
    </div>
  );
}
