import {ChevronRight,Plus,X,Check}from "lucide-react";
import { useState } from "react";
import { MenuTopo } from "../elementosVisuais/menuTopo";
import { PassadorPagina } from "../elementosVisuais/passadorPagina";
import { Pesquisa } from "../elementosVisuais/pesquisa"

export interface Chaves {
  id: number;
  salas:string;
  qntd: number | string;
  blocos:string;
  descricao:string;
  pessoasAutorizadas:string[];
}

  //essa interface props serve para eu herdar variáveis e funções do componante pai (que nesse caso é o arquivo app.tsx)

  //estou usando essa interface para que eu consiga usar a função criada no "App" em todos os arquivos que eu chamar ela e importar do componente pai, realizando uma breve navegação entre as telas

  interface ChavesProps {
    mudarTela: (index:number) => void
  }


  export function Chaves({ mudarTela }: ChavesProps) {
    // Adicionando funcionalidade ao button adicionar bloco
    const [chaves, setChaves] = useState<Chaves[]>([]);
    const [nextId, setNextId] = useState(1);
    const [pesquisaModal, setPesquisaModal] = useState<string>("");
    const [isSearchingModal, setIsSearchingModal] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   

    {/*adicionando a função de adicionar chaves*/}
    const [selectedSala, setSelectedSala] = useState("");
    const [selectedBloco, setSelectedBloco] = useState("");
    const[descricao, setDescricao]=useState("");
    {/*aceitando apenas numeros na variavel qntd */}
    const [qntd, setQntd] = useState<number | string>(""); 

    // Adicionando função de abrir e fechar pop up
    const [isChavesModalOpen, setIsChavesModalOpen] = useState(false);
    const [isDescricaoModalOpen, setIsDescricaoModalOpen] = useState(false);

    
    const [isPessoasModalOpen, setIsPessoasModalOpen] = useState(false);
    const [novaPessoa, setNovaPessoa] = useState("");
     const [chaveSelecionada, setChaveSelecionada] = useState<Chaves | null>(null);

    const blocos = [
      "Bloco C",
      "Bloco E",
      "Bloco J",
      "Bloco D",
    ];
    const salas = [
      "Sala E09",
      "Sala E08",
      "Sala E07",
      "Sala F06",
      "Sala F05",
    ];


    {/*adiocionando lista chaves */}
    const [listaChaves, setItensAtuais] = useState<Chaves[]>([]);
    
    function addChaves(e: React.FormEvent) {
      e.preventDefault();
      const novaChave: Chaves = {
        id: nextId,
        salas: selectedSala,
        qntd,
        blocos:selectedBloco,
        descricao,
        pessoasAutorizadas:[],
        
      };
      setChaves([...chaves, novaChave]);
      setItensAtuais([...itensAtuais, novaChave]);  
      setNextId(nextId + 1);
      setQntd(0);
      setSelectedSala("");
      setSelectedBloco("");
      setDescricao("");
      closeChavesModal();
      closePessoasModal();
    }
    
   
    

    function statusSelecao(id: number) {
      const chave = listaChaves.find(chave => chave.id === id) || null;
      setChaveSelecionada(chave );
    }

 

    

    
    
      function openChavesModal() {
        setIsChavesModalOpen(true);
      }
      function openDescricaoModal() {
        setIsDescricaoModalOpen(true);
      }
      function closeDescricaoModal() {
        setDescricao("");
        setIsDescricaoModalOpen(false);
      }
      function openEditModal() {
        const chave = listaChaves.find(chave => chave.id === chaveSelecionada?.id);
        if (chave) {
            setSelectedSala(chave.salas);
            setSelectedBloco(chave.blocos);
            setQntd(chave.qntd);
            setDescricao(chave.descricao);
            setIsEditModalOpen(true);
        }
    }
    
    function closeEditModal() {
        setIsEditModalOpen(false);
    }
    function adicionarPessoa(chaveId: number, novaPessoa: string) {
      setItensAtuais((prevLista) => {
        return prevLista.map((chave) => {
          if (chave.id === chaveId) {
            return {
              ...chave,
              pessoasAutorizadas: [...chave.pessoasAutorizadas, novaPessoa],
            };
          }
          return chave;
        });
      });
    }
  

  

      function openPessoasModal(chave: Chaves) {
        setChaveSelecionada(chave);
        setIsPessoasModalOpen(true);
      }
    
      function closePessoasModal() {
        setIsPessoasModalOpen(false);
        setChaveSelecionada(null);
      }
    

      function closeChavesModal() {
        setQntd(0);
        setSelectedSala("");
        setSelectedBloco("");
        setDescricao("");
        setIsChavesModalOpen(false);
      }

      const [isSearching, setIsSearching] = useState(false);
      const [pesquisa, setPesquisa] = useState("");
    
      const chavesFiltradas = isSearching
        ? listaChaves.filter(
            (chave) =>
              chave.salas.toLowerCase().includes(pesquisa.toLowerCase()) ||
              chave.blocos.toLowerCase().includes(pesquisa.toLowerCase()) ||
              chave.qntd.toString().toLowerCase().includes(pesquisa.toLowerCase())
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
      const [error, setError] = useState<string>(""); 
      {/*garantir que qntd seja um número */}
          function handleQntdChange(e: React.ChangeEvent<HTMLInputElement>) {
            const value = e.target.value;
        
            {/* Verifica se o valor é um número*/}
            if (!/^\d*$/.test(value)) {
              setError("Por favor, insira apenas números.");
            } else { 
              setError(""); 
              setQntd(Number(value)); 
            }
          }

    
      return(
          <div className="bg-cover flex flex-col items-center min-h-screen justify-center font-montserrat bg-chaves">
        {/*background*/}
          {/*header*/}
          <MenuTopo mudarTela={mudarTela}/>
        
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
                <div className="h-fit items-center w-full tablet:w-auto">
                    {/* input de pesquisa */}
                    <Pesquisa
                             pesquisa={pesquisa}
                             setIsSearching={setIsSearching}
                             setPesquisa={setPesquisa}
                             />
                            {/* fim input de pesquisa */}
                  
                </div>
                            
                {/*adicionando botão de + chaves*/}
                <button onClick={openChavesModal} className="absolute right-0 top-0 px-4 py-1.5 bg-[#18C64F] text-white font-medium flex gap-2 justify-center items-center hover:bg-[#56ab71] rounded-md w-full tablet:w-auto">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffffff" className="bi bi-plus-circle" viewBox="0 0 16 16">
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
                      <p className="text-[#192160] text-sm font-medium mb-1 mt-2">
                          Selecione uma sala</p>
                          <select
                            className="w-full p-2 rounded-[10px] cursor-pointer border border-[#646999] focus:outline-none text-[#777DAA] "
                            value={selectedSala}
                            onChange={(e) => setSelectedSala(e.target.value)}
                            required 
                          >
                            <option className="text-[#777DAA] text-xs font-medium" value="" disabled>Selecione uma sala</option> 
                            {salas.map((sala, index) => (
                              <option key={index} value={sala} className="text-center bg-[#B8BCE0]">
                                {sala}
                              </option>
                            ))}
                          </select>
                         
                      </div>
                            
                      <div className="justify-center items-center ml-[40px] mr-8">
                      <p className="text-[#192160] text-sm font-medium mb-1 mt-2">
                          Selecione um bloco</p>
                          <select
                            className="w-full p-2 rounded-[10px] cursor-pointer border border-[#646999] focus:outline-none text-[#777DAA] "
                            value={selectedBloco}
                            onChange={(e) => setSelectedBloco(e.target.value)}
                            required 
                          >
                            <option className="text-[#777DAA] text-xs font-medium" value="" disabled>Selecione um Bloco</option> 
                            {blocos.map((bloco, index) => (
                              <option key={index} value={bloco} className="text-center bg-[#B8BCE0]">
                                {bloco}
                              </option>
                            ))}
                          </select>
                         
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
                          onChange={handleQntdChange}
                          required
                        />
                        {/* Exibe a mensagem de erro se houver um erro */}
                       {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                       </div>
                       <div className="justify-center items-center ml-[40px] mr-8">
                        <p className="text-[#192160] text-sm font-medium mb-1">
                        Descreva os detalhes sobre a chave
                        </p>
                        <textarea
                          className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                          placeholder="Descrição do detalhamento sobre a chave"
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
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900  w-[20%]">Salas</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 flex-1 w-[20%]">Blocos</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 flex-1 w-[20%]">Quantidade de chaves</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 flex-1 w-[30%]">Lista de pessoas autorizadas</th>                                 
                                    </tr>
                                </thead>
                                <tbody>
                                    {itensAtuais.map(chaves => (
                                        <tr
                                        key={chaves.id}
                                        className={`hover:bg-[#d5d8f1] cursor-pointer px-2 ${chaveSelecionada && chaveSelecionada.id === chaves.id ? "bg-gray-200" : ""}`}
                                        onClick={() => statusSelecao(chaves.id)}
                                      >
                                      
                                            <td className="align-center p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[20%] ">
                                               
                                                  <p className="text-[#646999] text-center  text-[15px] font-semibold leading-normal">
                                                    {chaves.salas}
                                                  </p>
                                                  
                                                  
                                                
                                            </td>
                                            <td className="align-center p-0.5 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[20%] tablet:max-w-[200px] laptop:max-w-[400px] break-words ">
                                            <div className=" flex justify-center items-center">
                                            <img className="size-6 ml-2 mr-2" src="/bloco-chave.svg" alt="icon bloco" />
                                            <p className="text-[#646999] text-center  text-[15px] font-semibold leading-normal truncate">
                                                    {chaves.blocos}
                                            </p>
                                            </div>
                                            </td>
                                            <td className="align-center p-0.5 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[20%] tablet:max-w-[200px] laptop:max-w-[400px] break-words ">
                                            <div className="flex justify-center items-center ">
                                                  
                                                  <svg className="size-6 ml-2 mr-2  " xmlns="http://www.w3.org/2000/svg" width="30" height="29" viewBox="0 0 30 29" fill="none">
                                                    <g clip-path="url(#clip0_1757_570)">
                                                      <path d="M27.0832 -0.000473685H24.4587C23.9824 -0.00183001 23.5107 0.0913538 23.0707 0.273676C22.6308 0.455998 22.2314 0.723832 21.8958 1.06165L11.7929 11.1633C9.85869 10.6643 7.81403 10.815 5.9739 11.5923C4.13376 12.3695 2.60021 13.7302 1.60948 15.4648C0.618743 17.1994 0.225778 19.2116 0.491112 21.1914C0.756446 23.1713 1.66536 25.009 3.07785 26.4215C4.49035 27.834 6.32806 28.7429 8.30792 29.0082C10.2878 29.2736 12.3 28.8806 14.0345 27.8899C15.7691 26.8991 17.1298 25.3656 17.9071 23.5254C18.6844 21.6853 18.8351 19.6407 18.336 17.7064L19.8332 16.2093V13.2912H23.4582V9.66619H26.3751L28.4377 7.60357C28.7754 7.26757 29.0431 6.86796 29.2254 6.42785C29.4077 5.98774 29.501 5.51586 29.4998 5.03948V2.41619C29.4998 1.77525 29.2452 1.16056 28.792 0.707352C28.3388 0.254139 27.7241 -0.000473685 27.0832 -0.000473685ZM27.0832 5.03948C27.0833 5.19836 27.0521 5.35569 26.9913 5.50249C26.9306 5.64929 26.8415 5.78266 26.7291 5.89498L25.3746 7.24953H21.0415V10.8745H17.4165V15.2064L15.5496 17.0733C15.9748 17.9686 16.1995 18.9459 16.2082 19.937C16.2082 21.2514 15.8184 22.5363 15.0881 23.6292C14.3579 24.7222 13.3199 25.574 12.1056 26.077C10.8912 26.58 9.55495 26.7116 8.26579 26.4552C6.97662 26.1987 5.79245 25.5658 4.86301 24.6363C3.93357 23.7069 3.30062 22.5227 3.04419 21.2336C2.78776 19.9444 2.91937 18.6081 3.42237 17.3938C3.92538 16.1794 4.77719 15.1415 5.87009 14.4112C6.963 13.681 8.2479 13.2912 9.56232 13.2912C10.5602 13.226 11.5554 13.4545 12.4249 13.9485L23.6044 2.77023C23.8316 2.54462 24.1384 2.41744 24.4587 2.41619H27.0832V5.03948ZM6.54149 21.7495C6.54149 21.9885 6.61236 22.2221 6.74513 22.4208C6.8779 22.6195 7.06662 22.7744 7.28741 22.8659C7.50821 22.9573 7.75116 22.9813 7.98556 22.9346C8.21995 22.888 8.43526 22.7729 8.60424 22.6039C8.77323 22.435 8.88831 22.2197 8.93494 21.9853C8.98156 21.7509 8.95763 21.5079 8.86618 21.2871C8.77472 21.0663 8.61985 20.8776 8.42114 20.7448C8.22243 20.6121 7.98881 20.5412 7.74982 20.5412C7.42935 20.5412 7.12201 20.6685 6.8954 20.8951C6.6688 21.1217 6.54149 21.4291 6.54149 21.7495Z" fill="#565D8F"/>
                                                    </g>
                                                    <defs>
                                                      <clipPath id="clip0_1757_570">
                                                        <rect width="29" height="29" fill="white" transform="translate(0.5)"/>
                                                      </clipPath>
                                                    </defs>
                                                  </svg>
                                                  <p className="text-[#646999] text-center  text-[15px] font-semibold leading-normal truncate">
                                                    {chaves.qntd}
                                                  </p>
                                            </div>
                                            </td>
                                            <div onClick={() => openPessoasModal(chaves)} className="border-2 border-[#B8BCE0] border-solid bg-[#565D8F]">
                                              <td className="align-center p-0.5 font-semibold  w-[40%] tablet:max-w-[200px] laptop:max-w-[400px] break-words ">
                                              <div className=" flex justify-center items-center mr-1">
                                              <svg className="size-6 ml-2 mr-2"xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 35" fill="none">
                                              <g clip-path="url(#clip0_1781_438)">
                                                <path d="M18 14.5833C17.1347 14.5833 16.2888 14.3267 15.5694 13.846C14.8499 13.3653 14.2892 12.682 13.958 11.8826C13.6269 11.0831 13.5403 10.2035 13.7091 9.35481C13.8779 8.50615 14.2946 7.7266 14.9064 7.11474C15.5183 6.50289 16.2978 6.08621 17.1465 5.9174C17.9951 5.74859 18.8748 5.83523 19.6742 6.16636C20.4737 6.49749 21.1569 7.05825 21.6377 7.77771C22.1184 8.49718 22.375 9.34304 22.375 10.2083C22.375 11.3687 21.9141 12.4815 21.0936 13.3019C20.2731 14.1224 19.1603 14.5833 18 14.5833ZM25.2917 20.4167C25.2917 19.2563 24.8307 18.1435 24.0103 17.3231C23.1898 16.5026 22.077 16.0417 20.9167 16.0417H15.0833C13.923 16.0417 12.8102 16.5026 11.9897 17.3231C11.1693 18.1435 10.7083 19.2563 10.7083 20.4167V23.3333H13.625V20.4167C13.625 20.0299 13.7786 19.659 14.0521 19.3855C14.3256 19.112 14.6966 18.9583 15.0833 18.9583H20.9167C21.3034 18.9583 21.6744 19.112 21.9479 19.3855C22.2214 19.659 22.375 20.0299 22.375 20.4167V23.3333H25.2917V20.4167ZM18.0131 34.5115C17.2937 34.5119 16.5992 34.2477 16.0619 33.7692L10.596 29.1667H0.5V4.375C0.5 3.21468 0.960936 2.10188 1.78141 1.28141C2.60188 0.460936 3.71468 0 4.875 0L31.125 0C32.2853 0 33.3981 0.460936 34.2186 1.28141C35.0391 2.10188 35.5 3.21468 35.5 4.375V29.1667H25.506L19.8958 33.8042C19.3761 34.2626 18.7061 34.5142 18.0131 34.5115ZM3.41667 26.25H11.6621L17.9694 31.5656L24.459 26.25H32.5833V4.375C32.5833 3.98823 32.4297 3.61729 32.1562 3.3438C31.8827 3.07031 31.5118 2.91667 31.125 2.91667H4.875C4.48823 2.91667 4.11729 3.07031 3.8438 3.3438C3.57031 3.61729 3.41667 3.98823 3.41667 4.375V26.25Z" fill="white"/>
                                              </g>
                                              <defs>
                                                <clipPath id="clip0_1781_438">
                                                  <rect width="35" height="35" fill="white" transform="translate(0.5)"/>
                                                </clipPath>
                                              </defs>
                                            </svg>
                                            <p className=" text-xs text-[#FFFF] text-center  text-[15px] font-semibold leading-normal truncate">
                                                    Pessoas autorizadas
                                              </p>
                                            </div>
                                            </td>
                                            </div>
                                            {isPessoasModalOpen && chaveSelecionada &&(
                                            <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                                              <div
                                                className="container flex flex-col gap-2 w-[90%] max-w-[450px] p-[10px] h-auto max-h-[80vh] overflow-y-auto rounded-[15px] bg-white relative"
                                              >
                                                
                                                <div className="flex justify-center mx-auto w-full max-w-[90%]">
                                                  {/* input de pesquisa */}
                                                  <div className="items-center w-full tablet:w-auto">
                                                  
                                                </div>
                                                  <p className="text-[#192160] text-left text-[20px] font-semibold  ml-[10px] w-[85%] ">
                                                  Pessoas autorizadas - {chaveSelecionada.salas}
                                                  </p>
                                                  <button
                                                    onClick={closePessoasModal}
                                                    type="button"
                                                    className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                                                  >
                                                    <X className=" mb-[5px] text-[#192160]" />
                                                  </button>
                                                  
                                                  </div>
                                                  <div>
                                                  
                                                  <div className="flex justify-center items-center gap-4 self-stretch ml-[200px]">
                                                  

                                                  <button onClick={openEditModal} className="flex gap-1 justify-center items-center font-medium text-sm md:text-base text-[#646999] underline">
                                                  <img src="fi-rr-pencil (1).svg" alt="" />
                                                  Editar
                                                </button>
                                                {/*modal de editar pessoas */}
                                                {isEditModalOpen && (
                                                  <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                                                    <form 
                                                      onSubmit={(e) => {
                                                        e.preventDefault();
                                                        if (chaveSelecionada) {
                                                          adicionarPessoa(chaveSelecionada.id, novaPessoa);
                                                          setNovaPessoa("");
                                                          closeEditModal();
                                                        }
                                                      }}
                                                      className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px]"
                                                    >
                                                      <div className="flex justify-center mx-auto w-full max-w-[90%]">
                                                        <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                                                          ALTERAR PESSOAS AUTORIZADAS
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
                                                        Pessoas Autorizadas
                                                        </p>
                                                        {/* Campo de entrada para nova pessoa */}
                                                        
                                                        <input
                                                          type="text"
                                                          className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                                                          placeholder="Nome da nova pessoa"
                                                          value={novaPessoa}
                                                          onChange={(e) => setNovaPessoa(e.target.value)}
                                                          required
                                                        />
                                                    
                                                      </div>
                                                      

                                                      
                                                      
                                                      <div className="flex justify-center items-center mt-[10px] w-full">
                                                      <button
                                                      type="submit"
                                                      className="px-3 py-2 border-[3px] rounded-xl font-semibold  text-sm flex gap-[4px] justify-center items-center  bg-[#16C34D] text-[#FFF]"
                                                  >
                                                      SALVAR ALTERAÇÕES <Check className="size-5" />
                                                  </button>
                                                      </div>
                                                    </form>
                                                  </div>
                                                )}

                                                  <div className="flex justify-end items-center  px-2 py-1 border-solid border-[1px] border-slate-500 rounded-md ">
                                                    <input
                                                      type="text"
                                                      placeholder="Pesquisar..."
                                                      className="placeholder-sky-900 text-sm font-medium outline-none w-20 mr-2"
                                                      value={pesquisaModal}
                                                      onChange={(e) => {
                                                        const inputValue = e.target.value;
                                                        setPesquisaModal(inputValue);
                                                        setIsSearchingModal(inputValue.trim().length > 0);
                                                      }}
                                                    />
                    
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      width="12"
                                                      height="12"
                                                      fill="#64748b"
                                                      className="bi bi-search"
                                                      viewBox="0 0 16 16"
                                                    >
                                                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                                    </svg>
                                                  </div>
                                                  </div>
                                                  </div>

                                                  <div className=" rounded-[10px] bg-[#B8BCE0] p-4">
                                                  <ul className=" color-[#192160] list-disc pl-5">
                                                  {chaveSelecionada.pessoasAutorizadas
                                                  .filter((pessoa) =>
                                                    isSearchingModal
                                                      ? pessoa.toLowerCase().includes(pesquisaModal.toLowerCase())
                                                      : true
                                                  )
                                                  .map((pessoa, index) => (
                                                  
                                                   <li className="text-[#192160]  text-[15px] font-semibold leading-normal  text-left  " key={index}>
                                                    {pessoa}</li>
                                                     
                                                    ))}
                                                  </ul>
                                                  
                                                </div>
                                                
                                                
                                              </div>
                                            </div>

                                            )}
                                            
                                            
                                            <td className="align-center p-0.5 tablet:max-w-[200px] laptop:max-w-[400px] break-words">
                                            <div className="flex w-[96px] h-[20px] pr-[2px] justify-center items-start gap-[2px] flex-shrink-0">
                                            <svg className="size-4 ml-1 mr-0"xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 18" fill="none">
                                            <g clip-path="url(#clip0_1781_442)">
                                              <path d="M9.5 0C7.71997 0 5.97991 0.527841 4.49987 1.51677C3.01983 2.50571 1.86628 3.91131 1.18509 5.55585C0.5039 7.20038 0.32567 9.00998 0.672937 10.7558C1.0202 12.5016 1.87737 14.1053 3.13604 15.364C4.39472 16.6226 5.99836 17.4798 7.74419 17.8271C9.49002 18.1743 11.2996 17.9961 12.9442 17.3149C14.5887 16.6337 15.9943 15.4802 16.9832 14.0001C17.9722 12.5201 18.5 10.78 18.5 9C18.4974 6.61384 17.5484 4.32616 15.8611 2.63889C14.1738 0.951621 11.8862 0.00258081 9.5 0V0ZM9.5 16.5C8.01664 16.5 6.5666 16.0601 5.33323 15.236C4.09986 14.4119 3.13856 13.2406 2.57091 11.8701C2.00325 10.4997 1.85473 8.99168 2.14411 7.53682C2.4335 6.08197 3.14781 4.74559 4.1967 3.6967C5.2456 2.64781 6.58197 1.9335 8.03683 1.64411C9.49168 1.35472 10.9997 1.50325 12.3701 2.0709C13.7406 2.63856 14.9119 3.59985 15.736 4.83322C16.5601 6.06659 17 7.51664 17 9C16.9978 10.9885 16.2069 12.8948 14.8009 14.3009C13.3948 15.7069 11.4885 16.4978 9.5 16.5Z" fill="#646999"/>
                                              <path d="M9.5 7.5H8.75C8.55109 7.5 8.36032 7.57902 8.21967 7.71967C8.07902 7.86032 8 8.05109 8 8.25C8 8.44891 8.07902 8.63968 8.21967 8.78033C8.36032 8.92098 8.55109 9 8.75 9H9.5V13.5C9.5 13.6989 9.57901 13.8897 9.71967 14.0303C9.86032 14.171 10.0511 14.25 10.25 14.25C10.4489 14.25 10.6397 14.171 10.7803 14.0303C10.921 13.8897 11 13.6989 11 13.5V9C11 8.60218 10.842 8.22064 10.5607 7.93934C10.2794 7.65804 9.89782 7.5 9.5 7.5Z" fill="#646999"/>
                                              <path d="M9.5 6C10.1213 6 10.625 5.49632 10.625 4.875C10.625 4.25368 10.1213 3.75 9.5 3.75C8.87868 3.75 8.375 4.25368 8.375 4.875C8.375 5.49632 8.87868 6 9.5 6Z" fill="#646999"/>
                                            </g>
                                            <defs>
                                              <clipPath id="clip0_1781_442">
                                                <rect width="18" height="18" fill="white" transform="translate(0.5)"/>
                                              </clipPath>
                                            </defs>
                                          </svg>
                                          <p onClick={openDescricaoModal} className="text-[#646999] font-montserrat text-[11px] font-medium underline">Ver mais</p>
                                          
                                            </div>
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
                        {isDescricaoModalOpen && (
                                  <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                                    <div className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px]"
                                              >
                                    
                                                  
                                                  
                                    <div className="flex justify-center mx-auto w-full max-w-[90%]">
                                                  <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                                                    Descrição sobre chaves
                                                  </p>
                                                  <button
                                                    onClick={closeDescricaoModal}
                                                    type="button"
                                                    className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                                                  >
                                                    <X className=" mb-[5px] text-[#192160]" />
                                                  </button>
                                                  
                                                </div>
                                                <div className=" rounded-[10px] bg-[#B8BCE0] p-4">
                                                {chaves.map((chave) => ( // Aqui você deve usar 'chave' em vez de 'descricao'
                                                  <div key={chave.id} className="rounded-[10px] bg-[#B8BCE0] p-4">
                                                    <p className="text-[#192160] text-center text-[20px] font-semibold ml-[10px] w-[85%]">
                                                      {chave.descricao} {/* Aqui você deve acessar a descrição da chave */}
                                                    </p>
                                                  </div>
                                                ))}
                                              
                                                   
                                                </div>
                            
                                                  
                                                  
                                                  
                                              
                                                  </div>
                                                 

                                                  
                                                
                                                
                                          </div>
                                            

                                            )}
          </main>
        </div>
      </div>
          
      );

    }
