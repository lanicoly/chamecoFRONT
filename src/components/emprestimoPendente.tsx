import { useState } from "react";
import { Iemprestimo } from "../pages/emprestimos";
import { IoptionSolicitantes } from "./inputs/FilterableInputSolicitantes";
import { Info, Check } from "lucide-react";
import { FiltroModal } from "../components/filtragemModal";
import { ptBR } from "date-fns/locale";
import { DateRange, DayPicker } from "react-day-picker";
import { PassadorPagina } from "./passadorPagina";
import api from "../services/api";
import { PopUpdeDevolucao } from "./popups/PopUpdeDevolucao";
import { IsDetalhesModal } from "./popups/detalhes/IsDetalhesModal";
import useGetSalas from "../hooks/salas/useGetSalas";
import { formatarDataHora } from "../utils/formatarDarahora";
import { buscarNomeSalaPorIdChave } from "../utils/buscarNomeSalaPorIdChave";
import { buscarNomeUsuarioPorId } from "../utils/buscarNomeUsuarioPorId";
import { getNomeSolicitante } from "../utils/getNomeSolicitante";
import useGetResponsaveis from "../hooks/usuarios/useGetResponsaveis";
import { useChaves } from "../context/ChavesContext";
import { PopUpError } from "../components/popups/PopUpError";
import { AxiosError } from "axios";
import { IChave, ISala, IUsuario } from "../pages/chaves";

interface EmprestimosPendentesProps {
  new_emprestimos: Iemprestimo[];
  salas: ISala[];
  chaves: IChave[];
  responsaveis: IUsuario[];
  solicitantes: IoptionSolicitantes[];
  observacao: string | null;
  dataRetirada: string;
  horario_emprestimo: string;
  pesquisa: string;
  refreshCounter: number;
  setRefreshCounter: React.Dispatch<React.SetStateAction<number>>;
}

export interface IusuarioResponsavel {
  id: number;
  nome: string;
  superusuario: number;
}

export function EmprestimosPendentes({
  new_emprestimos,
  solicitantes,
  setRefreshCounter
}: EmprestimosPendentesProps) {
  const [emprestimoSelecionado, setEmprestimoSelecionado] =
    useState<Iemprestimo | null>(null);

  const [filtroDataEmprestimoRetirada, setFiltroDataEmprestimoRetirada] =
    useState<DateRange | undefined>();

  // const { usuarios } = useGetUsuarios();
  const { salas: salasData } = useGetSalas();
  // const { chaves: chavesData } = useGetChaves();
  const {chaves: chavesData, refetch} = useChaves();
  const { responsaveis } = useGetResponsaveis();

  const [filtroPendente, setFiltroPendente] = useState({
    sala: "",
    chave: "",
    solicitante: "",
    responsavel: "",
    dataRetirada: "",
    horaRetirada: "",
  });
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  //filtrando emprestimos pendentes
  const emprestimosFiltradosPendentes = new_emprestimos
    .filter((emprestimos) => {
      const salaNome = buscarNomeSalaPorIdChave(
        emprestimos.chave,
        chavesData,
        salasData
      );
      const chaveNome = `Chave ${buscarNomeSalaPorIdChave(
        emprestimos.chave,
        chavesData,
        salasData
      )}`;
      const responsavelNome = buscarNomeUsuarioPorId(
        emprestimos.usuario_responsavel,
        responsaveis
      );
      const solicitanteNome = getNomeSolicitante(
        emprestimos.usuario_solicitante,
        solicitantes
      );
      const dataHoraRetirada = emprestimos.horario_emprestimo
        ? formatarDataHora(emprestimos.horario_emprestimo)
        : { data: "", hora: "" };

      return (
        (filtroPendente.sala === "" ||
          salaNome.toLowerCase().includes(filtroPendente.sala.toLowerCase())) &&
        (filtroPendente.chave === "" ||
          chaveNome
            .toLowerCase()
            .includes(filtroPendente.chave.toLowerCase())) &&
        (filtroPendente.solicitante === "" ||
          solicitanteNome
            .toLowerCase()
            .includes(filtroPendente.solicitante.toLowerCase())) &&
        (filtroPendente.responsavel === "" ||
          responsavelNome
            .toLowerCase()
            .includes(filtroPendente.responsavel.toLowerCase())) &&
        (filtroPendente.horaRetirada === "" ||
          dataHoraRetirada.hora
            ?.toLowerCase()
            .includes(filtroPendente.horaRetirada.toLowerCase()))
      );
    })
    .filter((emp) => {
      if (
        !filtroDataEmprestimoRetirada?.from ||
        !filtroDataEmprestimoRetirada?.to
      )
        return true;

      if (!emp.horario_emprestimo) return false;

      const dataDevolucao = new Date(emp.horario_emprestimo);

      const dataRetiradaSemHora = new Date(
        dataDevolucao.getFullYear(),
        dataDevolucao.getMonth(),
        dataDevolucao.getDate()
      );

      const from = new Date(
        filtroDataEmprestimoRetirada.from.getFullYear(),
        filtroDataEmprestimoRetirada.from.getMonth(),
        filtroDataEmprestimoRetirada.from.getDate()
      );

      const to = new Date(
        filtroDataEmprestimoRetirada.to.getFullYear(),
        filtroDataEmprestimoRetirada.to.getMonth(),
        filtroDataEmprestimoRetirada.to.getDate()
      );

      return dataRetiradaSemHora >= from && dataRetiradaSemHora <= to;
    });

  const [campoFiltroAberto, setCampoFiltroAberto] = useState<string | null>(
    null
  );

  //paginação para emprestimos pendentes
  const itensAtuaisPendentes = emprestimosFiltradosPendentes.slice();
  const [paginaAtualPendente, setPaginaAtualPendente] = useState(1);
  const itensPorPaginaPendente = 5;
  const totalPaginasPendentes = Math.max(
    1,
    Math.ceil(new_emprestimos.length / itensPorPaginaPendente)
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
  //fim paginação para emprestimos pendentes

  const [isDetalhesModalOpen, setIsDetalhesModalOpen] = useState(false);

  function openDetalhesModal(emprestimos: Iemprestimo) {
    setEmprestimoSelecionado(emprestimos);
    setIsDetalhesModalOpen(true);
  }

  const closeDetalhesModal = () => {
    setIsDetalhesModalOpen(false);
    console.log("fechou");
  };

  //funcao para editarObservacao
  const [observacao, setObservacao] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  function openDeleteModal() {
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  const [isPopUpErrorOpen, setIsPopUpErrorOpen] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  async function finalizarEmprestimo(emprestimo: number | undefined | null) {
    try {
      const response = await api.post("/chameco/api/v1/finalizar-emprestimo/", {
        id_emprestimo: emprestimo,
      });

      if (!response) {
        console.error("Erro ao finalizar o empréstimo");
        return;
      }

      console.log("Empréstimo finalizado com sucesso!", response.data);

      //Colocando esse incremento no lugar do reload
      setRefreshCounter((contadorAtual) => contadorAtual + 1);
      setIsSuccessModalOpen(true);
      refetch();
      
    } catch (error: unknown) {
      const statusResponse = error as AxiosError<{ message?: string }>;
      const status = statusResponse.response?.status;

      if (status === 400) {
        const mensagem = "Empréstimo já finalizado!";
        console.log(mensagem, statusResponse.response?.data);
        setMensagemErro(mensagem);
        setIsPopUpErrorOpen(true);
        return;
      }
      if (status === 401) {
        const mensagem = "Empréstimo não encontrado!";
        console.log(mensagem);
        setMensagemErro(mensagem);
        setIsPopUpErrorOpen(true);
        return;
      }
      if (status === 403) {
        const mensagem = "Você não tem permissão para finalizar este empréstimo!";
        console.log(mensagem);
        setMensagemErro(mensagem);
        setIsPopUpErrorOpen(true);
        return;
      }
    } finally {
      handleCloseModalAndReload();
    }
  }

  const handleCloseModalAndReload = () => {
    setTimeout(() => {
      setIsSuccessModalOpen(false);
      // window.location.reload();
    }, 5000);
  };


  function emprestimoPendenteAlerta(emprestimo: {
    horario_emprestimo?: string;
    horario_devolucao?: string | null;
  }) {
    if (!emprestimo.horario_emprestimo || emprestimo.horario_devolucao)
      return false;

    const retirada = new Date(emprestimo.horario_emprestimo);
    const agora = new Date();
    const diferencaHoras = agora.getTime() - retirada.getTime();

    return diferencaHoras > 24 * 60 * 60 * 1000;
  }

  return (
    <>
      <table className=" w-full border-separate border-spacing-y-2 bg-white">
        {isSuccessModalOpen && <PopUpdeDevolucao />}
        {isPopUpErrorOpen && <PopUpError mensagem={mensagemErro}/>}

        <thead className="bg-white top-0 ">
          <tr>
            <th className="text-left text-[13px] sm:text-[13px] font-medium text-sky-900 w-[15%]">
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-1">
                  Nome da sala
                  <button onClick={() => setCampoFiltroAberto("sala")}>
                    <img
                      src="src/assets/filter_list.svg"
                      alt="Filtro"
                      className="w-4 h-4"
                    />
                  </button>
                </div>

                <FiltroModal
                  isOpen={campoFiltroAberto === "sala"}
                  onClose={() => setCampoFiltroAberto(null)}
                  onSubmit={(e) => {
                    e.preventDefault();
                    setCampoFiltroAberto(null);
                  }}
                  textoInformativo="Digite o nome da sala"
                  titulo="Filtrar por sala"
                >
                  <input
                    type="text"
                    placeholder="Filtrar por sala"
                    className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-sm font-medium "
                    value={filtroPendente.sala}
                    onChange={(e) =>
                      setFiltroPendente({
                        ...filtroPendente,
                        sala: e.target.value,
                      })
                    }
                  />
                </FiltroModal>
              </div>
            </th>

            <th className="text-left text-[13px] sm:text-[13px] font-medium text-sky-900 w-[15%] align-top">
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
                  textoInformativo="Digite o tipo de chave"
                  titulo="Filtrar por tipo de chave"
                >
                  <input
                    type="text"
                    placeholder="Filtrar por tipo de chave"
                    className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-sm font-medium "
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

            <th className="text-left text-[13px] sm:text-[13px] font-medium text-sky-900 w-[15%] align-top">
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-1">
                  Solicitante
                  <button onClick={() => setCampoFiltroAberto("solicitante")}>
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
                  textoInformativo="Digite o solicitante"
                  titulo="Filtrar por solicitante"
                >
                  <input
                    type="text"
                    placeholder="Filtrar por solicitante"
                    className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-sm font-medium "
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

            <th className="text-left text-[13px] sm:text-[13px] font-medium text-sky-900 w-[15%] align-top">
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-1">
                  Responsável
                  <button onClick={() => setCampoFiltroAberto("responsavel")}>
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
                  textoInformativo="Digite o responsável"
                  titulo="Filtrar por responsável"
                >
                  <input
                    type="text"
                    placeholder="Filtrar por responsável"
                    className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-sm font-medium "
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

            <th className="text-left text-[13px] sm:text-[13px] font-medium text-sky-900 w-[15%]">
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
                <button onClick={() => setCampoFiltroAberto("dataRetirada")}>
                  <img src="src/assets/filter_list.svg" alt="" />
                </button>
                <FiltroModal
                  isOpen={campoFiltroAberto === "dataRetirada"}
                  onClose={() => setCampoFiltroAberto(null)}
                  onSubmit={(e) => {
                    e.preventDefault();
                    setCampoFiltroAberto(null);
                  }}
                  titulo="Filtrar por data de retirada"
                >
                  <DayPicker
                    animate
                    mode="range"
                    selected={filtroDataEmprestimoRetirada}
                    onSelect={setFiltroDataEmprestimoRetirada}
                    locale={ptBR}
                    endMonth={new Date()}
                  />
                </FiltroModal>
              </div>
            </th>

            <th className="text-left text-[13px] sm:text-[13px] font-medium text-sky-900 pl-2 w-[18%]">
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
                  textoInformativo="Digite a hora de retirada"
                  titulo="Filtrar por hora de retirada"
                >
                  <input
                    type="text"
                    placeholder="Filtrar por hora de retirada"
                    className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-sm font-medium "
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
                  <td
                    className={`p-2 text-xs font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[15%] ${
                      emprestimoPendenteAlerta(emprestimo)
                        ? "border-t-red-500 border-b-red-500 border-l-red-500"
                        : "border-[#B8BCE0]"
                    }`}
                  >
                    <p className="text-[#646999] text-center  text-sm font-semibold leading-normal">
                      {buscarNomeSalaPorIdChave(
                        emprestimo.chave,
                        chavesData,
                        salasData
                      )}
                    </p>
                  </td>
                  <td
                    className={`p-2 text-xs font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[15%] ${
                      emprestimoPendenteAlerta(emprestimo)
                        ? "border-t-red-500 border-b-red-500"
                        : "border-[#B8BCE0]"
                    }`}
                  >
                    <p className="text-[#646999] text-center  text-sm font-semibold leading-normal">
                      {`Chave ${buscarNomeSalaPorIdChave(
                        emprestimo.chave,
                        chavesData,
                        salasData
                      )}`}
                    </p>
                  </td>
                  <td
                    className={`p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[15%] break-words flex-1 text-center ${
                      emprestimoPendenteAlerta(emprestimo)
                        ? "border-t-red-500 border-b-red-500"
                        : "border-[#B8BCE0] "
                    }`}
                  >
                    <p className="text-[#646999] text-center  text-sm font-semibold leading-normal">
                      {getNomeSolicitante(
                        emprestimo.usuario_solicitante,
                        solicitantes
                      ) || "Solicitante não encontrado"}
                    </p>
                  </td>
                  <td
                    className={`p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[15%] break-words flex-1 text-center ${
                      emprestimoPendenteAlerta(emprestimo)
                        ? "border-t-red-500 border-b-red-500"
                        : "border-[#B8BCE0]"
                    }`}
                  >
                    <p className="text-[#646999] text-center  text-sm font-semibold leading-normal">
                      {buscarNomeUsuarioPorId(
                        emprestimo.usuario_responsavel,
                        responsaveis
                      ) || "Responsavel não encontrado"}
                    </p>
                  </td>
                  <td
                    className={`p-2 text-sm text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[15%] break-words flex-1 text-center ${
                      emprestimoPendenteAlerta(emprestimo)
                        ? "border-t-red-500 border-b-red-500"
                        : "border-[#B8BCE0]"
                    }`}
                  >
                    {emprestimo.horario_emprestimo
                      ? formatarDataHora(emprestimo.horario_emprestimo).data
                      : ""}
                  </td>
                  <td
                    className={`p-2 text-sm text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[18%] break-words flex-1 text-center ${
                      emprestimoPendenteAlerta(emprestimo)
                        ? "border-t-red-500 border-b-red-500"
                        : "border-[#B8BCE0]"
                    }`}
                  >
                    {emprestimo.horario_emprestimo
                      ? formatarDataHora(emprestimo.horario_emprestimo).hora
                      : ""}
                  </td>
                  <td
                    className={`border-2 border-solid bg-[#0240E1] border-[#B8BCE0]  p-0.5 font-semibold break-words ${
                      emprestimoPendenteAlerta(emprestimo)
                        ? " border-r-red-500 border-t-red-500 border-b-red-500"
                        : "border-[#B8BCE0]"
                    }`}
                  >
                    <div
                      onClick={() => finalizarEmprestimo(emprestimo.id)}
                      className=" flex justify-center items-center mr-1 gap-2 p-1 cursor-pointer"
                    >
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
                  {isDetalhesModalOpen && (
                    // emprestimo.id === emprestimoSelecionado?.id &&
                    <IsDetalhesModal
                      observacao={observacao}
                      setObservacao={setObservacao}
                      emprestimoSelecionado={emprestimoSelecionado}
                      closeDetalhesModal={closeDetalhesModal}
                      openDeleteModal={openDeleteModal}
                      closeDeleteModal={closeDeleteModal}
                      isDeleteModalOpen={isDeleteModalOpen}
                    />
                  )}
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan={7} className="p-4 text-center text-[#646999]">
                Nenhum empréstimo pendente encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Começo do passador de página */}
      <div className=" mt-5 flex justify-end items-center">
        <PassadorPagina
          avancarPagina={avancarPaginaPendente}
          voltarPagina={voltarPaginaPendente}
          totalPaginas={totalPaginasPendentes}
          paginaAtual={paginaAtualPendente}
        />
      </div>
      {/* Fim do passador de página */}
    </>
  );
}
