import { Info, Check, Plus, X} from "lucide-react";
import { useMemo, useState } from "react";
import { MenuTopo } from "../components/menuTopo";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { ptBR } from 'date-fns/locale';

import { Pesquisa } from "../components/pesquisa";
// import { PassadorPagina } from "../passadorPagina";

// deixei o passador comentado pois são duas estruturas para passar página, então so copiei a estrutura, mas assim que forem atualizadas as tabelas deve-se usar esse elemento!!!!!!!

// import { BotaoAdicionar } from "../botaoAdicionar";

export interface Emprestimo {
    id: number;
    chave: string;
    solicitante: string;
    responsavel: string;
    observacao: string | null;
    dataRetirada: string; //não coloquei Date para facilitar a estilização inicial
    horaRetirada: string;
    horaDevolucao: string | null;
}

export interface FiltroEmprestimo {
    setFiltroDataEmprestimo: (dates: DateRange | undefined) => void;
    filtroDataEmprestimo: DateRange | undefined
}

const salas = [
    { id: 1, nome: 'Sala A' },
    { id: 2, nome: 'Sala B' },
    { id: 3, nome: 'Sala C' },
    { id: 4, nome: 'Sala E9' }
];

export function Emprestimos({ filtroDataEmprestimo, setFiltroDataEmprestimo }: FiltroEmprestimo) {

    function criarEmprestimo() {
        console.log("Emprestimo criado!")
    }
    

    const [pesquisa, setPesquisa] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const [isFiltroModalOpen, setIsFiltroModalOpen] = useState(false);

    function openFiltroModal() {
        setIsFiltroModalOpen(true)
    }

    function closeFiltroModal() {
        setIsFiltroModalOpen(false)
    }
    const [isObservacaoModalOpen, setIsObservacaoModalOpen] = useState(false);

    function openObservacaoModal() {
        setIsObservacaoModalOpen(true)
    }

    function closeObservacaoModal() {
        setIsObservacaoModalOpen(false)
    }

    const [isDetalhesModalOpen, setIsDetalhesModalOpen] = useState(false);

    function openDetalhesModal() {
        setIsDetalhesModalOpen(true)
    }

    function closeDetalhesModal() {
        setIsDetalhesModalOpen(false)
    }

    const today = new Date();

    const [busca,setBusca] = useState('');
    const [salaSelecionadaId, setSalaSelecionadaId] = useState<number | null>(null);
    const [mostrarBusca, setMostrarBusca]= useState(false);

    const salasFiltradas = useMemo(() => {
        const lowerBusca = busca.toLowerCase();
        return salas.filter((sala) => 
          sala.nome.toLowerCase().includes(lowerBusca)
        ); 
      }, [busca]); 


    return (
        <div className="flex items-center justify-center bg-tijolos h-full bg-no-repeat bg-cover">

            <MenuTopo text="MENU" backRoute="/menu" />


            {/* parte informativa tela de empréstimo */}
            <div className="relative bg-white w-full max-w-[80%] rounded-3xl px-6  py-2 tablet:py-3 desktop:py-6 m-12 top-8 tablet:top-10 desktop:top-8">

                {/* cabeçalho tela de empréstimo*/}
                <div className="flex w-full gap-2">

                    <h1 className="flex w-full justify-center text-sky-900 text-2xl font-semibold">EMPRÉSTIMOS</h1>
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
                            {/* pesquisa + filtro */}
                            <div className="flex justify-center items-center w-full flex-wrap gap-2 flex-1 mobile:justify-end">

                                    {/* Adicionando pop up de filtrar emprestimos */}
                                    {isFiltroModalOpen && (
                                        <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                                            <form
                                                //   onSubmit={filtrarEmprestimos}
                                                className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px]"
                                            >
                                                {/*cabeçalho modal filtrar emprestimo*/}
                                                <div className="flex justify-center mx-auto w-full max-w-[90%]">
                                                    <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                                                        FILTRAR EMPRÉSTIMOS
                                                    </p>
                                                    <button
                                                        onClick={closeFiltroModal}
                                                        type="button"
                                                        className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                                                    >
                                                        <X className=" mb-[5px] text-[#192160]" />
                                                    </button>
                                                </div>
                                                {/* fim cabeçalho modal filtrar emprestimo*/}

                                                <div className="space-y-3 justify-center items-center ml-[40px] mr-8">

                                                    {/* seção data */}

                                                    <div className='flex justify-center items-center'>

                                                        <DayPicker animate mode="range" selected={filtroDataEmprestimo} onSelect={setFiltroDataEmprestimo} locale={ptBR}
                                                            endMonth={new Date(today)}

                                                        />

                                                    </div>

                                                    {/* fim seção data */}

                                                </div>

                                                {/* botão salvar filtro*/}
                                                <div className="flex justify-center items-center mt-[10px] w-full">
                                                    <button
                                                        type="submit"
                                                        className="px-3 py-2 border-[3px] rounded-xl font-semibold  text-sm flex gap-[4px] justify-center items-center  bg-[#16C34D] text-[#FFF]"
                                                    >
                                                        <Plus className="h-10px" /> FILTRAR
                                                    </button>
                                                </div>
                                                {/* fim botão salvar filtro*/}

                                            </form>
                                        </div>
                                    )}

                            </div>
                            {/* fim pesquisa + filtro */}
                        </div>

                        {/* tabela de criacao de emprestimo */}
                        <div className=" max-h-[248px] tablet:max-h-64 desktop:max-h-96">
                            <table className="w-full border-separate border-spacing-y-2 tablet:mb-2 bg-white">
                                <thead className="bg-white sticky top-0 z-11">
                                    <tr>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[13%]">Informe a sala</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[13%]">Informe a chave</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 flex-1 min-w-10 w-[20%] ">Informe quem solicitou</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[19%] ">Informe quem entregou</th>
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
                                                    onChange={(ev) =>{
                                                        setBusca(ev.target.value)
                                                        setMostrarBusca(true); }}
                                                        onFocus={() => setMostrarBusca(true)}
                                                />
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#64748b" className="bi bi-search" viewBox="0 0 16 16">
                                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                                </svg>
                                                {/* Renderiza a lista apenas quando há texto na busca */}
                                                {mostrarBusca && busca && (
                                                    <ul className="absolute top-full left-0 right-0 bg-white shadow-md z-20 ">
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
                                                // value={chave}
                                                required
                                            />
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#64748b" className="bi bi-search" viewBox="0 0 16 16">
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
                                                    // value={solicitante}
                                                    required
                                                />
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#64748b" className="bi bi-search" viewBox="0 0 16 16">
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
                                                // value={responsavel}
                                                required
                                            />
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#64748b" className="bi bi-search" viewBox="0 0 16 16">
                                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                            </svg>
                                        </div>
                                        </td>

                                        <td onClick={openObservacaoModal} className="border-2 border-[#B8BCE0] border-solid bg-[#0240E1]  p-0.5 font-semibold break-words cursor-pointer">
                                            <div className=" flex justify-center items-center mr-1 gap-2">
                                                <Plus color="white" size={18} />
                                                <p className=" text-sm text-[#FFFF] text-center font-semibold leading-normal truncate">
                                                    OBSERVAÇÃO
                                                </p>
                                            </div>

                                        </td>
                                        <td onClick={criarEmprestimo} className="border-2 border-[#B8BCE0] border-solid bg-[#18C64F]  p-0.5 font-semibold break-words cursor-pointer">
                                            <div className=" flex justify-center items-center mr-1 gap-2">
                                                <Plus color="white" size={18} />
                                                <p className=" text-sm text-[#FFFF] text-center font-semibold leading-normal truncate">
                                                    CRIAR EMPRÉSTIMO
                                                </p>
                                            </div>

                                        </td>

                                        {/* Adicionando pop up de observação do empréstimo */}
                                        {(isObservacaoModalOpen
                                            //  && emprestimo.id === emprestimoSelecionado) 
                                            && (
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
                                                                Detalhadamento sobre o empréstimo que será criado, como pessoa que autorizou aluno, entre outros.
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
                                            ))}

                                        {/* Fim adicionando pop up de observacao do emprestimo */}

                                    </tr>
                                </tbody>
                            </table>
                            <hr className="text-[#646999] mt-4 p-3 border-t-2 font-extrabold"/>
                        </div>
                        {/* fim tabela de criacao de emprestimo */}
                        <div className="flex gap-2 flex-wrap justify-between items-center">

                        <h2 className="text-red-500 items-center font-semibold text-xl mt-2">
                            Empréstimos pendentes
                        </h2>
                                            
                                    {/* input de pesquisa */}
                                    <Pesquisa
                                        pesquisa={pesquisa}
                                        setIsSearching={setIsSearching}
                                        setPesquisa={setPesquisa}
                                    />
                                    {/* fim input de pesquisa */}

                                    {/*{/* input de filtro 

                                    <div className="h-fit items-center w-full tablet:w-auto cursor-pointer min-w-[200px]">
                                        <div onClick={openFiltroModal}
                                            className="flex justify-between items-center px-2 py-1 border-solid border-[1px] border-slate-500 rounded-md gap-4 text-sky-900 text-sm font-medium ">
                                                <p>
                                            Filtrar...
                                                </p>
                                            <SlidersHorizontal size={14} />
                                        </div>

                                    </div>
                                    */}
                                    
                        </div>

                        {/* tabela com emprestimo pendente */}
                        <div className="overflow-y-auto max-h-[248px] tablet:max-h-64 desktop:max-h-96">
                            <table className="w-full border-separate border-spacing-y-2 bg-white">
                                <thead className="bg-white relative top-0 z-10">
                                    <tr>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[25%]">Nome da sala</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 flex-1  w-[15%]">Solicitante</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[15%] ">Responsável</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[10%]">Data retirada</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 pl-2 w-[10%]">Hora retirada</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[15%]   "></th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 pl-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[25%]">
                                            Laboratório Y
                                        </td>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[15%] break-words flex-1 text-center">
                                            Emilia Nunes
                                        </td>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[15%] break-words flex-1 text-center">
                                            Zezinho
                                        </td>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[10%] break-words flex-1 text-center">
                                            02/03/2025
                                        </td>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[10%] break-words flex-1 text-center">
                                            07:02
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

                                            <button onClick={openDetalhesModal} className="flex gap-1 justify-start items-center font-medium text-[#646999] underline text-xs">
                                                <Info className="size-3 text-[#646999]" />
                                                Ver mais
                                            </button>
                                        </td>


                                        {/* Adicionando pop up de detalhes do empréstimo */}
                                        {(isDetalhesModalOpen
                                            //  && emprestimo.id === emprestimoSelecionado) 
                                            && (
                                                <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                                                    <form className="container flex flex-col gap-2 w-full px-4 py-4 h-auto rounded-[15px] bg-white mx-5 max-w-[500px]">
                                                        <div className="flex justify-between w-full px-3">
                                                            <p className="text-[#192160] text-left text-[20px] font-semibold pr-6">
                                                                DETALHES
                                                            </p>
                                                            <div className="flex justify-center items-center gap-3">

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
                                                                <button
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
                                                            </div>
                                                            <button
                                                                onClick={closeDetalhesModal}
                                                                type="button"
                                                                className="px-2 py-1 rounded flex-shrink-0 "
                                                            >
                                                                <X  className=" mb-[5px] text-[#192160]" />
                                                            </button>
                                                        </div>

                                                        <div className="flex w-full h-auto px-[10px] py-2 mb-4 flex-col rounded-lg bg-[#B8BCE0]">
                                                            <p className="text-[#192160] font-medium p-1">
                                                                Detalhes a cerca do empréstimo.
                                                            </p>

                                                        </div>

                                                    </form>
                                                </div>
                                            ))}
                                        {/* Fim adicionando pop up de detalhes do emprestimo */}

                                    </tr>
                                    <tr>
                                        <td className="p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[25%]">
                                            Laboratório Y
                                        </td>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[15%] break-words flex-1 text-center">
                                            Emilia Nunes
                                        </td>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[15%] break-words flex-1 text-center">
                                            Zezinho
                                        </td>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[10%] break-words flex-1 text-center">
                                            02/03/2025
                                        </td>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[10%] break-words flex-1 text-center">
                                            07:02
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

                                            <button className="flex gap-1 justify-start items-center font-medium text-[#646999] underline text-xs">
                                                <Info className="size-3 text-[#646999]" />
                                                Ver mais
                                            </button>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[25%]">
                                            Laboratório Y
                                        </td>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[15%] break-words flex-1 text-center">
                                            Emilia Nunes
                                        </td>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[15%] break-words flex-1 text-center">
                                            Zezinho
                                        </td>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[10%] break-words flex-1 text-center">
                                            02/03/2025
                                        </td>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[10%] break-words flex-1 text-center">
                                            07:02
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

                                            <button className="flex gap-1 justify-start items-center font-medium text-[#646999] underline text-xs">
                                                <Info className="size-3 text-[#646999]" />
                                                Ver mais
                                            </button>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                        {/* fim tabela de emprestimo pendente */}

                        {/* passador de página OBS: quando adaptar as tabelas, ADICIONAR O COMPONENTE */}
                        <div className=" mt-2 flex justify-end items-center">

                            <button className="size-[22px] rounded-sm text-white text-sm flex items-center justify-center font-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#075985" className="bi bi-chevron-left" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                                </svg>
                            </button>

                            <div className="w-auto gap-1.5 px-1 py-1 flex items-center justify-center">
                                <div className="size-[28px] rounded-full bg-[#8d93c9] text-white text-sm flex items-center justify-center font-semibold">1</div>
                                <div className="text-base text-sky-800 font-semibold">de <strong className="font-bold">5</strong></div>
                            </div>

                            <button className="size-[22px] rounded-sm text-white text-sm flex items-center justify-center font-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#075985" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
                                </svg>
                            </button>

                        </div>

                        {/* fim passador de página */}


                        <h2 className="text-[#0240E1] items-center font-semibold text-xl mt-2">
                            Empréstimos concluídos
                        </h2>

                        {/* tabela com emprestimo concluido */}
                        <div className="overflow-y-auto max-h-[248px] tablet:max-h-64 desktop:max-h-96">
                            <table className="w-full border-separate border-spacing-y-2 bg-white">
                                <thead className="bg-white sticky top-0 z-10">
                                    <tr>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 pl-2 w-[10%]">Hora retirada</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[10%]">Hora devolução</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[10%]">Data</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[25%]">Nome da sala</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 flex-1  w-[20%]">Solicitante</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[15%] ">Responsável</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 pl-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className=" p-2 text-xs text-white bg-[#16C34D] font-semibold border-2 border-solid border-[#B8BCE0] w-[10%] break-words flex-1 text-center">
                                            07:02
                                        </td>
                                        <td className=" p-2 text-xs text-white bg-[#0240E1] font-semibold border-2 border-solid border-[#B8BCE0] w-[10%] break-words flex-1 text-center">
                                            07:02
                                        </td>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[10%] break-words flex-1 text-center">
                                            02/03/2025
                                        </td>
                                        <td className="p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[25%]">
                                            Laboratório Y
                                        </td>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[20%] break-words flex-1 text-center">
                                            Emilia Nunes
                                        </td>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[15%] break-words flex-1 text-center">
                                            Zezinho
                                        </td>

                                        <td className="pl-2">

                                            <button className="flex gap-1 justify-start items-center font-medium text-[#646999] underline text-xs">
                                                <Info className="size-3 text-[#646999]" />
                                                Ver mais
                                            </button>
                                        </td>


                                        </tr>
                                    <tr>
                                        <td className=" p-2 text-xs text-white bg-[#16C34D] font-semibold border-2 border-solid border-[#B8BCE0] w-[10%] break-words flex-1 text-center">
                                            07:02
                                        </td>
                                        <td className=" p-2 text-xs text-white bg-[#0240E1] font-semibold border-2 border-solid border-[#B8BCE0] w-[10%] break-words flex-1 text-center">
                                            07:02
                                        </td>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[10%] break-words flex-1 text-center">
                                            02/03/2025
                                        </td>
                                        <td className="p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[25%]">
                                            Laboratório Y
                                        </td>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[20%] break-words flex-1 text-center">
                                            Emilia Nunes
                                        </td>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[15%] break-words flex-1 text-center">
                                            Zezinho
                                        </td>

                                        <td className="pl-2">

                                            <button className="flex gap-1 justify-start items-center font-medium text-[#646999] underline text-xs">
                                                <Info className="size-3 text-[#646999]" />
                                                Ver mais
                                            </button>
                                        </td>

                                    </tr>

                                </tbody>
                            </table>
                        </div>

                        {/* fim tabela com emprestimo concluido */}


                        {/* passador de página */}
                        <div className=" mt-2 flex justify-end items-center">

                            <button className="size-[22px] rounded-sm text-white text-sm flex items-center justify-center font-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#075985" className="bi bi-chevron-left" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                                </svg>
                            </button>

                            <div className="w-auto gap-1.5 px-1 py-1 flex items-center justify-center">
                                <div className="size-[28px] rounded-full bg-[#8d93c9] text-white text-sm flex items-center justify-center font-semibold">1</div>
                                <div className="text-base text-sky-800 font-semibold">de <strong className="font-bold">5</strong></div>
                            </div>

                            <button className="size-[22px] rounded-sm text-white text-sm flex items-center justify-center font-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#075985" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
                                </svg>
                            </button>

                        </div>

                        {/* fim passador de página */}
                        {/* fim tabela de emprestimo concluido */}


                    </div>
                    {/* fim conteudo central tabela*/}
                </div>
                {/* fim conteudo central tela de empréstimo */}

                {/* logo chameco lateral */}
                <div className="flex justify-start bottom-4 absolute sm:hidden">
                    <img className="sm:w-[200px] w-32" src="\logo_lateral.png" alt="logo chameco" />
                </div>
                {/* fim logo chameco lateral */}
            </div>
            {/* fim parte informativa tela de empréstimo */}
        </div>

    )
}