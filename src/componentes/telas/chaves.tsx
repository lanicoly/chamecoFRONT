import { ChevronRight, Plus, X } from "lucide-react";
import { useState } from "react";
import { MenuTopo } from "../elementosVisuais/menuTopo";
import { PassadorPagina } from "../elementosVisuais/passadorPagina";
import { Pesquisa } from "../elementosVisuais/pesquisa";

export interface Chaves {
  id: number;
  salas: string;
  qntd: number | string;
  descricao: string;
  pessoas: string;
  blocos: string;
}

//essa interface props serve para eu herdar variáveis e funções do componante pai (que nesse caso é o arquivo app.tsx)

//estou usando essa interface para que eu consiga usar a função criada no "App" em todos os arquivos que eu chamar ela e importar do componente pai, realizando uma breve navegação entre as telas

interface ChavesProps {
  mudarTela: (index: number) => void;
}

export function Chaves({ mudarTela }: ChavesProps) {
  // Adicionando funcionalidade ao button adicionar bloco
  const [chaves, setChaves] = useState<Chaves[]>([]);
  const [nextId, setNextId] = useState(1);
  const [descricao, setDescricao] = useState("");
  const [blocos, setBlocos] = useState("");
  const [pessoas, setPessoas] = useState("");
  {
    /*adicionando a função de adicionar chaves*/
  }
  const [selectedSala, setSelectedSala] = useState("");
  {
    /*aceitando apenas numeros na variavel qntd */
  }
  const [qntd, setQntd] = useState<number | string>("");

  // Adicionando função de abrir e fechar pop up
  const [isChavesModalOpen, setIsChavesModalOpen] = useState(false);

  const salas = ["Sala E09", "Sala E08", "Sala E07", "Sala F06", "Sala F05"];

  {
    /*adiocionando lista chaves */
  }
  const [chaveSelecionada, setChaveSelecionada] = useState<number | null>(null);
  const [listaChaves, setListaChaves] = useState<Chaves[]>([]);

  function addChaves(e: React.FormEvent) {
    e.preventDefault();
    const novaChave: Chaves = {
      id: nextId,
      salas: selectedSala,
      qntd,
      descricao,
      blocos,
      pessoas,
    };
    setChaves([...chaves, novaChave]);
    setListaChaves([...listaChaves, novaChave]);
    setNextId(nextId + 1);
    setQntd(0);
    setDescricao("");
    setSelectedSala("");
    setPessoas("");
    setBlocos("");
    closeChavesModal();
  }

  function statusSelecao(id: number) {
    setChaveSelecionada(id);
  }

  function openChavesModal() {
    setIsChavesModalOpen(true);
  }

  function closeChavesModal() {
    setQntd(0);
    setDescricao("");
    setSelectedSala("");
    setBlocos("");
    setPessoas("");
    setIsChavesModalOpen(false);
  }

  const [isSearching, setIsSearching] = useState(false);
  const [pesquisa, setPesquisa] = useState("");

  const chavesFiltradas = isSearching
    ? listaChaves.filter(
        (chave) =>
          chave.salas.toLowerCase().includes(pesquisa.toLowerCase()) ||
          chave.blocos.toLowerCase().includes(pesquisa.toLowerCase()) ||
          chave.descricao.toLowerCase().includes(pesquisa.toLowerCase()) ||
          chave.pessoas.toLowerCase().includes(pesquisa.toLowerCase())
      )
    : listaChaves;

  // Adicionando funcionalidade ao passador de página
  const itensPorPagina = 4;
  const [paginaAtual, setPaginaAtual] = useState(1);
  const totalPaginas = Math.max(
    1,
    Math.ceil(listaChaves.length / itensPorPagina)
  );
  const indexInicio = (paginaAtual - 1) * itensPorPagina;
  const indexFim = indexInicio + itensPorPagina;

  function avancarPagina() {
    if (paginaAtual < totalPaginas) {
      setPaginaAtual(paginaAtual + 1);
    }
  }

  function voltarPagina() {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1);
    }
  }
  const itensAtuais = chavesFiltradas.slice(indexInicio, indexFim);

  return (
    <div className="bg-cover flex flex-col items-center min-h-screen justify-center font-montserrat bg-chaves">
      {/*background*/}
      {/*header*/}
      <MenuTopo mudarTela={mudarTela} />

      {/*container */}
      <div className="relative bg-white w-full max-w-[960px] rounded-3xl px-6 py-2 tablet:py-3 desktop:py-6 m-12 top-8 tablet:top-6 tablet:h-[480px] h-[90%]">
        {/* titulo chaves*/}
        <div className="relative flex w-full gap-2 mt-5 mb-6 justify-center items-center content-center self-stretch flex-wrap">
          <h1 className="flex justify-center text-3xl text-[#081683] font-semibold">
            CHAVES
          </h1>
          {/*Adicionando botao de status */}
          <div className="absolute right-0 top-0 flex items-center gap-2 mb-[15px] text-[#02006C] font-medium tablet:mb-0">
            <span className="font-semibold text-[20px]">STATUS DE CHAVE</span>
            <button>
              <ChevronRight className="w-[25px] h-[25px] tablet:w-[35px] tablet:h-[35px]" />
            </button>
          </div>
        </div>

        <main className="flex flex-col mobile:px-8 px-4 py-3 w-auto justify-center gap-3">
          {/*inputs+botão */}
          <div className="relative flex justify-center items-center min-w-[220px] flex-wrap gap-2 flex-1 mobile:justify-between">
            <div className="flex gap-2 flex-wrap">
              {/* Filtros de busca */}
              <Pesquisa
                pesquisa={pesquisa}
                setIsSearching={setIsSearching}
                setPesquisa={setPesquisa}
              />
              {/* fim input de busca */}
              {/* input de filtro */}
              <div className="flex justify-between items-center px-2 py-1 border-solid border-[1px] border-slate-500 rounded-md ">
                <input
                  type="text"
                  placeholder="Filtrar..."
                  className="placeholder-sky-900 text-sm font-medium outline-none "
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <g opacity="0.4" clip-path="url(#clip0_1696_2859)">
                    <path
                      d="M1.36424 3.46891H3.06818C3.20185 3.96249 3.49365 4.39822 3.89856 4.70887C4.30346 5.01952 4.79898 5.18782 5.30865 5.18782C5.81833 5.18782 6.31384 5.01952 6.71875 4.70887C7.12365 4.39822 7.41545 3.96249 7.54912 3.46891H15.0655C15.2307 3.46891 15.3891 3.40306 15.5059 3.28585C15.6227 3.16864 15.6883 3.00967 15.6883 2.84391C15.6883 2.67815 15.6227 2.51918 15.5059 2.40197C15.3891 2.28476 15.2307 2.21891 15.0655 2.21891H7.54912C7.41545 1.72533 7.12365 1.2896 6.71875 0.978955C6.31384 0.668307 5.81833 0.5 5.30865 0.5C4.79898 0.5 4.30346 0.668307 3.89856 0.978955C3.49365 1.2896 3.20185 1.72533 3.06818 2.21891H1.36424C1.19907 2.21891 1.04066 2.28476 0.923865 2.40197C0.80707 2.51918 0.741455 2.67815 0.741455 2.84391C0.741455 3.00967 0.80707 3.16864 0.923865 3.28585C1.04066 3.40306 1.19907 3.46891 1.36424 3.46891ZM5.30834 1.75016C5.5239 1.75016 5.73461 1.81431 5.91384 1.93449C6.09307 2.05467 6.23276 2.2255 6.31525 2.42535C6.39774 2.62521 6.41933 2.84513 6.37727 3.05729C6.33522 3.26946 6.23142 3.46435 6.079 3.61731C5.92658 3.77027 5.73238 3.87444 5.52097 3.91665C5.30955 3.95885 5.09041 3.93719 4.89126 3.85441C4.69212 3.77162 4.5219 3.63143 4.40214 3.45157C4.28239 3.2717 4.21847 3.06024 4.21847 2.84391C4.2188 2.55393 4.33373 2.27593 4.53805 2.07088C4.74237 1.86583 5.01939 1.75049 5.30834 1.75016Z"
                      fill="#081683"
                    />
                    <path
                      d="M15.0655 7.3743H13.3616C13.2281 6.88061 12.9365 6.44472 12.5316 6.13395C12.1267 5.82317 11.6311 5.65479 11.1214 5.65479C10.6117 5.65479 10.1161 5.82317 9.71127 6.13395C9.30639 6.44472 9.01471 6.88061 8.88126 7.3743H1.36424C1.19907 7.3743 1.04066 7.44015 0.923865 7.55736C0.80707 7.67457 0.741455 7.83354 0.741455 7.9993C0.741455 8.16506 0.80707 8.32403 0.923865 8.44124C1.04066 8.55845 1.19907 8.6243 1.36424 8.6243H8.88126C9.01471 9.118 9.30639 9.55388 9.71127 9.86466C10.1161 10.1754 10.6117 10.3438 11.1214 10.3438C11.6311 10.3438 12.1267 10.1754 12.5316 9.86466C12.9365 9.55388 13.2281 9.118 13.3616 8.6243H15.0655C15.2307 8.6243 15.3891 8.55845 15.5059 8.44124C15.6227 8.32403 15.6883 8.16506 15.6883 7.9993C15.6883 7.83354 15.6227 7.67457 15.5059 7.55736C15.3891 7.44015 15.2307 7.3743 15.0655 7.3743ZM11.1214 9.09305C10.9059 9.09305 10.6951 9.0289 10.5159 8.90872C10.3367 8.78854 10.197 8.61772 10.1145 8.41786C10.032 8.21801 10.0104 7.99809 10.0525 7.78592C10.0945 7.57376 10.1983 7.37887 10.3508 7.22591C10.5032 7.07294 10.6974 6.96877 10.9088 6.92657C11.1202 6.88437 11.3394 6.90603 11.5385 6.98881C11.7376 7.07159 11.9079 7.21178 12.0276 7.39165C12.1474 7.57151 12.2113 7.78298 12.2113 7.9993C12.211 8.28928 12.096 8.56729 11.8917 8.77233C11.6874 8.97738 11.4104 9.09272 11.1214 9.09305Z"
                      fill="#081683"
                    />
                    <path
                      d="M15.0655 12.5314H7.54912C7.41545 12.0378 7.12365 11.6021 6.71875 11.2915C6.31384 10.9808 5.81833 10.8125 5.30865 10.8125C4.79898 10.8125 4.30346 10.9808 3.89856 11.2915C3.49365 11.6021 3.20185 12.0378 3.06818 12.5314H1.36424C1.19907 12.5314 1.04066 12.5973 0.923865 12.7145C0.80707 12.8317 0.741455 12.9906 0.741455 13.1564C0.741455 13.3222 0.80707 13.4811 0.923865 13.5983C1.04066 13.7156 1.19907 13.7814 1.36424 13.7814H3.06818C3.20185 14.275 3.49365 14.7107 3.89856 15.0214C4.30346 15.332 4.79898 15.5003 5.30865 15.5003C5.81833 15.5003 6.31384 15.332 6.71875 15.0214C7.12365 14.7107 7.41545 14.275 7.54912 13.7814H15.0655C15.2307 13.7814 15.3891 13.7156 15.5059 13.5983C15.6227 13.4811 15.6883 13.3222 15.6883 13.1564C15.6883 12.9906 15.6227 12.8317 15.5059 12.7145C15.3891 12.5973 15.2307 12.5314 15.0655 12.5314ZM5.30834 14.2501C5.09278 14.2501 4.88207 14.186 4.70284 14.0658C4.52361 13.9456 4.38392 13.7748 4.30143 13.575C4.21894 13.3751 4.19736 13.1552 4.23941 12.943C4.28146 12.7309 4.38526 12.536 4.53768 12.383C4.69011 12.23 4.8843 12.1259 5.09572 12.0837C5.30713 12.0415 5.52627 12.0631 5.72542 12.1459C5.92457 12.2287 6.09478 12.3689 6.21454 12.5488C6.3343 12.7286 6.39822 12.9401 6.39822 13.1564C6.39772 13.4463 6.28274 13.7242 6.07845 13.9293C5.87417 14.1343 5.59724 14.2497 5.30834 14.2501Z"
                      fill="#081683"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1696_2859">
                      <rect
                        width="14.9469"
                        height="15"
                        fill="white"
                        transform="translate(0.741455 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              {/* fim input de filtro */}
              {/*adicionando botão de + chaves*/}
              <button
                onClick={openChavesModal}
                className="absolute right-0 top-0 px-4 py-1.5 bg-[#18C64F] text-white font-medium flex gap-2 justify-center items-center hover:bg-[#56ab71] rounded-md w-full tablet:w-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="#ffffff"
                  className="bi bi-plus-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>
                ADICIONAR CHAVE
              </button>
              {/* Adicionando pop up de adicionar chaves */}
              {isChavesModalOpen && (
                <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                  <form
                    onSubmit={addChaves}
                    className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px]"
                  >
                    <div className="flex justify-center mx-auto w-full max-w-[90%]">
                      <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                        ADICIONAR CHAVE
                      </p>
                      <button
                        onClick={closeChavesModal}
                        type="button"
                        className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                      >
                        <X className=" mb-[5px] text-[#192160]" />
                      </button>
                    </div>

                    <div className="justify-center items-center ml-[40px] mr-8">
                      <p className="text-[#192160] text-sm font-medium mb-1">
                        Selecione uma sala
                      </p>
                      <select
                        className="w-full p-2 rounded-[10px] cursor-pointer border border-[#646999] focus:outline-none text-[#777DAA] "
                        value={selectedSala}
                        onChange={(e) => setSelectedSala(e.target.value)}
                        required
                      >
                        <option
                          className="text-[#777DAA] text-xs font-medium"
                          value=""
                          disabled
                        >
                          Selecione uma sala
                        </option>
                        {salas.map((sala, index) => (
                          <option
                            key={index}
                            value={sala}
                            className="text-center bg-[#B8BCE0]"
                          >
                            {sala}
                          </option>
                        ))}
                      </select>
                      <select
                        className="w-full p-2 rounded-[10px] cursor-pointer border  border-[#646999] focus:outline-none text-[#777DAA] appearance-none"
                        value={selectedSala}
                        onChange={(e) => setSelectedSala(e.target.value)}
                        required // Adicionado aqui
                      >
                        {salas.map((sala, index) => (
                          <option
                            key={index}
                            value={sala}
                            className="text-center bg-[#B8BCE0]"
                          >
                            {sala}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="justify-center items-center ml-[40px] mr-8">
                      <p className="text-[#192160] text-sm font-medium mb-1 mt-2">
                        Digite o bloco
                      </p>
                      <input
                        type="text"
                        className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                        placeholder="Bloco"
                        value={blocos}
                        onChange={(e) => setBlocos(e.target.value)}
                        required
                      />
                    </div>
                    <div className="justify-center items-center ml-[40px] mr-8">
                      <p className="text-[#192160] text-sm font-medium mb-1 mt-2">
                        Pessoas Autorizadas
                      </p>
                      <input
                        type="text"
                        className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                        placeholder="Descrição de pessoas autorizadas"
                        value={pessoas}
                        onChange={(e) => setPessoas(e.target.value)}
                        required
                      />
                    </div>
                    <div className="justify-center items-center ml-[40px] mr-8">
                      <p className="text-[#192160] text-sm font-medium mb-1">
                        Informe a quantidade de chaves
                      </p>

                      <input
                        className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                        type="text"
                        placeholder="Quantidade de chaves"
                        value={qntd}
                        min="0"
                        step="1"
                        onChange={(e) => setQntd(e.target.value)}
                        required
                      />
                    </div>

                    <div className="justify-center items-center ml-[40px] mr-8">
                      <p className="text-[#192160] text-sm font-medium mb-1 mt-2">
                        Descreva os detalhes sobre a chave
                      </p>
                      <textarea
                        className="w-full px-2 py-1 rounded-[10px] border border-[#646999] text-[#777DAA] focus:outline-none text-xs font-medium"
                        placeholder="Descrição do detalhamento sobre as chaves"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex justify-center items-center mt-[10px] w-full">
                      <button
                        type="submit"
                        className="px-3 py-2 border-[3px] rounded-xl font-semibold  text-sm flex gap-[4px] justify-center items-center  bg-[#16C34D] text-[#FFF]"
                      >
                        <Plus className="h-10px" /> CRIAR NOVA CHAVE
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
          {/*lista de chaves */}
          <div className="overflow-y-auto max-h-[248px] tablet:max-h-64 desktop:max-h-96">
            <table className="w-full border-separate border-spacing-y-2 tablet:mb-6 bg-white">
              <thead className="bg-white sticky top-0 z-10">
                <tr>
                  <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[45%]">
                    Salas
                  </th>
                  <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 flex-1 w-[30%]">
                    Blocos
                  </th>
                  <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 flex-1 w-[30%]">
                    Quantidade de chaves
                  </th>
                  <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 flex-1 w-[30%]">
                    Pessoas autorizadas
                  </th>
                  <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 ">
                    Descrição
                  </th>
                </tr>
              </thead>
              <tbody>
                {itensAtuais.map((chaves) => (
                  <tr
                    key={chaves.id}
                    className={`hover:bg-[#d5d8f1] cursor-pointer px-2 ${
                      chaveSelecionada === chaves.id ? "bg-gray-200" : ""
                    }`}
                    onClick={() => statusSelecao(chaves.id)}
                  >
                    <td className="align-center p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[45%] h-12">
                      <div className="flex justify-center items-center ">
                        <svg
                          className="size-6 ml-2 mr-2  "
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="29"
                          viewBox="0 0 30 29"
                          fill="none"
                        >
                          <g clip-path="url(#clip0_1757_570)">
                            <path
                              d="M27.0832 -0.000473685H24.4587C23.9824 -0.00183001 23.5107 0.0913538 23.0707 0.273676C22.6308 0.455998 22.2314 0.723832 21.8958 1.06165L11.7929 11.1633C9.85869 10.6643 7.81403 10.815 5.9739 11.5923C4.13376 12.3695 2.60021 13.7302 1.60948 15.4648C0.618743 17.1994 0.225778 19.2116 0.491112 21.1914C0.756446 23.1713 1.66536 25.009 3.07785 26.4215C4.49035 27.834 6.32806 28.7429 8.30792 29.0082C10.2878 29.2736 12.3 28.8806 14.0345 27.8899C15.7691 26.8991 17.1298 25.3656 17.9071 23.5254C18.6844 21.6853 18.8351 19.6407 18.336 17.7064L19.8332 16.2093V13.2912H23.4582V9.66619H26.3751L28.4377 7.60357C28.7754 7.26757 29.0431 6.86796 29.2254 6.42785C29.4077 5.98774 29.501 5.51586 29.4998 5.03948V2.41619C29.4998 1.77525 29.2452 1.16056 28.792 0.707352C28.3388 0.254139 27.7241 -0.000473685 27.0832 -0.000473685ZM27.0832 5.03948C27.0833 5.19836 27.0521 5.35569 26.9913 5.50249C26.9306 5.64929 26.8415 5.78266 26.7291 5.89498L25.3746 7.24953H21.0415V10.8745H17.4165V15.2064L15.5496 17.0733C15.9748 17.9686 16.1995 18.9459 16.2082 19.937C16.2082 21.2514 15.8184 22.5363 15.0881 23.6292C14.3579 24.7222 13.3199 25.574 12.1056 26.077C10.8912 26.58 9.55495 26.7116 8.26579 26.4552C6.97662 26.1987 5.79245 25.5658 4.86301 24.6363C3.93357 23.7069 3.30062 22.5227 3.04419 21.2336C2.78776 19.9444 2.91937 18.6081 3.42237 17.3938C3.92538 16.1794 4.77719 15.1415 5.87009 14.4112C6.963 13.681 8.2479 13.2912 9.56232 13.2912C10.5602 13.226 11.5554 13.4545 12.4249 13.9485L23.6044 2.77023C23.8316 2.54462 24.1384 2.41744 24.4587 2.41619H27.0832V5.03948ZM6.54149 21.7495C6.54149 21.9885 6.61236 22.2221 6.74513 22.4208C6.8779 22.6195 7.06662 22.7744 7.28741 22.8659C7.50821 22.9573 7.75116 22.9813 7.98556 22.9346C8.21995 22.888 8.43526 22.7729 8.60424 22.6039C8.77323 22.435 8.88831 22.2197 8.93494 21.9853C8.98156 21.7509 8.95763 21.5079 8.86618 21.2871C8.77472 21.0663 8.61985 20.8776 8.42114 20.7448C8.22243 20.6121 7.98881 20.5412 7.74982 20.5412C7.42935 20.5412 7.12201 20.6685 6.8954 20.8951C6.6688 21.1217 6.54149 21.4291 6.54149 21.7495Z"
                              fill="#565D8F"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_1757_570">
                              <rect
                                width="29"
                                height="29"
                                fill="white"
                                transform="translate(0.5)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        <p className="text-[#646999] text-center  text-[15px] font-semibold leading-normal">
                          {chaves.salas}
                        </p>
                      </div>
                    </td>
                    <td className="align-center p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[25%] tablet:max-w-[200px] laptop:max-w-[400px] break-words h-12">
                      <p className="text-[#646999] text-center  text-[15px] font-semibold leading-normal truncate">
                        {chaves.blocos}
                      </p>
                    </td>
                    <td className="align-center p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[25%] tablet:max-w-[200px] laptop:max-w-[400px] break-words h-12">
                      <p className="text-[#646999] text-center  text-[15px] font-semibold leading-normal truncate">
                        {chaves.qntd}
                      </p>
                    </td>
                    <td className="align-center p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[25%] tablet:max-w-[200px] laptop:max-w-[400px] break-words h-12">
                      <p className="text-[#646999] text-center  text-[15px] font-semibold leading-normal truncate">
                        {chaves.pessoas}
                      </p>
                    </td>
                    <td className="align-center p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[25%] tablet:max-w-[200px] laptop:max-w-[400px] break-words h-12">
                      <p className="text-[#646999] text-center  text-[15px] font-semibold leading-normal truncate">
                        {chaves.descricao}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* passador de página */}
            <PassadorPagina
              avancarPagina={avancarPagina}
              voltarPagina={voltarPagina}
              totalPaginas={totalPaginas}
              paginaAtual={paginaAtual}
            />
            {/* fim passador de página */}
          </div>
        </main>
      </div>
    </div>
  );
}
