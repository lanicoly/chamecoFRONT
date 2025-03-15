import { Info, Check, Plus } from "lucide-react";
// import { useState } from "react";
import { MenuTopo } from "../elementosVisuais/menuTopo";
// import { Pesquisa } from "../elementosVisuais/pesquisa";
// import { PassadorPagina } from "../elementosVisuais/passadorPagina";
// import { BotaoAdicionar } from "../elementosVisuais/botaoAdicionar";

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

// const [pesquisa, setPesquisa] = useState('');
// const [isSearching, setIsSearching] = useState(false);


function criarEmprestimo() {
    console.log("Emprestimo criado!")
}


export function Emprestimos() {

    return (
        <div className="flex items-center justify-center bg-tijolos h-full bg-no-repeat bg-cover">

            <MenuTopo text="MENU" backRoute="/menu" />


            {/* parte informativa tela de empréstimo */}
            <div className="relative bg-white w-full max-w-[80%] rounded-3xl px-6  py-2 tablet:py-3 desktop:py-6 m-12 top-8  tablet:top-10 desktop:top-8">

                {/* cabeçalho tela de empréstimo*/}
                <div className="flex w-full gap-2">

                    <h1 className="flex w-full justify-center text-sky-900 text-2xl font-semibold">EMPRÉSTIMOS</h1>
                </div>
                {/* fim cabeçalho tela de empréstimo */}

                {/* conteudo central tela de empréstimo */}
                <div className="flex flex-col px-4 py-1 w-auto justify-center gap-1">

                    {/* pesquisa + filtro */}
                    <div className="flex justify-center items-center min-w-[220px] flex-wrap gap-2 flex-1 mobile:justify-between">

                        <div className="flex gap-2 flex-wrap">

                            {/* input de pesquisa */}
                            {/* <Pesquisa
                                pesquisa={pesquisa}
                                setIsSearching={setIsSearching}
                                setPesquisa={setPesquisa}
                            /> */}
                            {/* fim input de pesquisa */}

                        </div>

                    </div>
                    {/* fim pesquisa + filtro */}


                    {/* conteudo central tabela*/}
                    <div>
                        <h2 className="text-[#16C34D] items-center font-semibold text-xl shadow-none">
                            Criar novo empréstimo
                        </h2>

                        {/* tabela de criacao de emprestimo */}
                        <div className="overflow-y-auto max-h-[248px] tablet:max-h-64 desktop:max-h-96">
                            <table className="w-full border-separate border-spacing-y-2 tablet:mb-2 bg-white">
                                <thead className="bg-white sticky top-0 z-10">
                                    <tr>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[15%]">Informe a sala</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 flex-1 min-w-10 w-[20%] ">Informe quem solicitou</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[15%] ">Informe quem entregou</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[20%]   "></th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 pl-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[20%]">
                                            <select
                                                name="chave_sala"
                                                id="chave_sala"
                                                //   value={chave}
                                                className=" justify-between items-start px-2 py-[5px] border-none text-[#646999] text-sm font-medium h-fit w-[95%]"
                                            >
                                                <option value="">Selecionar sala</option>
                                                <option value="todos">Sala E01</option>
                                                <option value="administrativo">Sala E02</option>
                                                <option value="codis">Lab de Info</option>
                                                <option value="guarita">Lab de bio</option>
                                            </select>
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
                                            <select
                                                name="responsavel"
                                                id="responsavel"
                                                //   value={responsavel}
                                                className=" justify-between items-start px-2 py-[5px] border-none text-[#646999] text-sm font-medium h-fit w-[95%]"
                                            >
                                                <option value="todos">Zezinho</option>
                                                <option value="administrativo">Maria</option>
                                                <option value="codis">Pedro</option>
                                            </select>
                                        </td>
                                        <td className="border-2 border-[#B8BCE0] border-solid bg-[#0240E1]  p-0.5 font-semibold break-words">
                                                <div className=" flex justify-center items-center mr-1 gap-2">
                                                    <Plus color="white" size={18}/>
                                                    <p className=" text-sm text-[#FFFF] text-center font-semibold leading-normal truncate">
                                                        OBSERVAÇÃO
                                                    </p>
                                                </div>
                                            
                                        </td>
                                        <td className="border-2 border-[#B8BCE0] border-solid bg-[#18C64F]  p-0.5 font-semibold break-words">
                                                <div className=" flex justify-center items-center mr-1 gap-2">
                                                    <Plus color="white" size={18}/>
                                                    <p className=" text-sm text-[#FFFF] text-center font-semibold leading-normal truncate">
                                                        CRIAR EMPRÉSTIMO
                                                    </p>
                                                </div>
                                            
                                        </td>

                                        {/* Adicionando pop up de observação do empréstimo */}
                                        {/* {(isObservacaoModalOpen && emprestimo.id === emprestimoSelecionado) &&  (
                                                <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                                                    <form className="container flex flex-col gap-2 w-full px-1 py-4 h-auto rounded-[15px] bg-white mx-5 max-w-[400px]">
                                                        <div className="flex justify-center mx-auto w-full max-w-[90%]">
                                                            <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                                                                Observação
                                                            </p>
                                                            <button
                                                                onClick={closeObservacaoModal}
                                                                type="button"
                                                                className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                                                            >
                                                                <X className=" mb-[5px] text-[#192160]" />
                                                            </button>
                                                        </div>

                                                        <div className="space-y-2 justify-center items-center ml-[40px] mr-8">

                                                            <p className="text-[#192160] text-sm font-medium mb-1">
                                                                observacao do emprestimo
                                                            </p>

                                                        </div>

                                                    </form>
                                                </div>
                                            )} */}
                                        {/* Fim adicionando pop up de observacao do emprestimo */}

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* fim tabela de criacao de emprestimo */}


                        <h2 className="text-red-500 items-center font-semibold text-xl mt-2">
                            Empréstimos pendentes
                        </h2>

                        {/* tabela com emprestimo pendente */}
                        <div className="overflow-y-auto max-h-[248px] tablet:max-h-64 desktop:max-h-96">
                            <table className="w-full border-separate border-spacing-y-2 tablet:mb-2 bg-white">
                                <thead className="bg-white sticky top-0 z-10">
                                    <tr>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[20%]">Nome da sala</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 flex-1  w-[15%]">Solicitante</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[15%] ">Responsável</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[10%]">Data de retirada</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 pl-2 w-[15%]">Hora de retirada</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[15%]   "></th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 pl-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[20%]">
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
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[15%] break-words flex-1 text-center">
                                            07:02
                                        </td>
                                        <td className="border-2 border-[#B8BCE0] border-solid bg-[#0240E1]  p-0.5 font-semibold break-words">
                                                <div className=" flex justify-center items-center mr-1 gap-2 p-1">
                                                    <Check color="white" size={18}/>
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


                                        {/* Adicionando pop up de observação do empréstimo */}
                                        {/* {(isObservacaoModalOpen && emprestimo.id === emprestimoSelecionado) &&  (
                                                <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                                                    <form className="container flex flex-col gap-2 w-full px-1 py-4 h-auto rounded-[15px] bg-white mx-5 max-w-[400px]">
                                                        <div className="flex justify-center mx-auto w-full max-w-[90%]">
                                                            <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                                                                Observação
                                                            </p>
                                                            <button
                                                                onClick={closeObservacaoModal}
                                                                type="button"
                                                                className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                                                            >
                                                                <X className=" mb-[5px] text-[#192160]" />
                                                            </button>
                                                        </div>

                                                        <div className="space-y-2 justify-center items-center ml-[40px] mr-8">

                                                            <p className="text-[#192160] text-sm font-medium mb-1">
                                                                observacao do emprestimo
                                                            </p>

                                                        </div>

                                                    </form>
                                                </div>
                                            )} */}
                                        {/* Fim adicionando pop up de observacao do emprestimo */}
                                    </tr>
                                    <tr>
                                        <td className="p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[20%]">
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
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[15%] break-words flex-1 text-center">
                                            07:02
                                        </td>
                                        <td className="border-2 border-[#B8BCE0] border-solid bg-[#0240E1]  p-0.5 font-semibold break-words">
                                                <div className=" flex justify-center items-center mr-1 gap-2 p-1">
                                                    <Check color="white" size={18}/>
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


                                        {/* Adicionando pop up de observação do empréstimo */}
                                        {/* {(isObservacaoModalOpen && emprestimo.id === emprestimoSelecionado) &&  (
                                                <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                                                    <form className="container flex flex-col gap-2 w-full px-1 py-4 h-auto rounded-[15px] bg-white mx-5 max-w-[400px]">
                                                        <div className="flex justify-center mx-auto w-full max-w-[90%]">
                                                            <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                                                                Observação
                                                            </p>
                                                            <button
                                                                onClick={closeObservacaoModal}
                                                                type="button"
                                                                className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                                                            >
                                                                <X className=" mb-[5px] text-[#192160]" />
                                                            </button>
                                                        </div>

                                                        <div className="space-y-2 justify-center items-center ml-[40px] mr-8">

                                                            <p className="text-[#192160] text-sm font-medium mb-1">
                                                                observacao do emprestimo
                                                            </p>

                                                        </div>

                                                    </form>
                                                </div>
                                            )} */}
                                        {/* Fim adicionando pop up de observacao do emprestimo */}
                                    </tr>
                                    
                                </tbody>
                            </table>
                        </div>
                        {/* fim tabela de emprestimo pendente */}

                        {/* passador de página */}
                        <div className=" mt-2 flex justify-start items-center">

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
                            <table className="w-full border-separate border-spacing-y-2 tablet:mb-2 bg-white">
                                <thead className="bg-white sticky top-0 z-10">
                                    <tr>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 pl-2 w-[15%]">Hora retirada</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[15%]">Hora devolução</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[10%]">Data</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[20%]">Nome da sala</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 flex-1  w-[15%]">Solicitante</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[15%] ">Responsável</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 pl-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[15%] break-words flex-1 text-center">
                                            07:02
                                        </td>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[15%] break-words flex-1 text-center">
                                            07:02
                                        </td>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[10%] break-words flex-1 text-center">
                                            02/03/2025
                                        </td>
                                        <td className="p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[20%]">
                                            Laboratório Y
                                        </td>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[15%] break-words flex-1 text-center">
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


                                        {/* Adicionando pop up de observação do empréstimo */}
                                        {/* {(isObservacaoModalOpen && emprestimo.id === emprestimoSelecionado) &&  (
                                                <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                                                    <form className="container flex flex-col gap-2 w-full px-1 py-4 h-auto rounded-[15px] bg-white mx-5 max-w-[400px]">
                                                        <div className="flex justify-center mx-auto w-full max-w-[90%]">
                                                            <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                                                                Observação
                                                            </p>
                                                            <button
                                                                onClick={closeObservacaoModal}
                                                                type="button"
                                                                className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                                                            >
                                                                <X className=" mb-[5px] text-[#192160]" />
                                                            </button>
                                                        </div>

                                                        <div className="space-y-2 justify-center items-center ml-[40px] mr-8">

                                                            <p className="text-[#192160] text-sm font-medium mb-1">
                                                                observacao do emprestimo
                                                            </p>

                                                        </div>

                                                    </form>
                                                </div>
                                            )} */}
                                        {/* Fim adicionando pop up de observacao do emprestimo */}
                                    </tr>
                                    <tr>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[15%] break-words flex-1 text-center">
                                            07:02
                                        </td>
                                        
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[15%] break-words flex-1 text-center">
                                            07:02
                                        </td>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[10%] break-words flex-1 text-center">
                                            02/03/2025
                                        </td>
                                        <td className="p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[20%]">
                                            Laboratório Y
                                        </td>
                                        <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[15%] break-words flex-1 text-center">
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


                                        {/* Adicionando pop up de observação do empréstimo */}
                                        {/* {(isObservacaoModalOpen && emprestimo.id === emprestimoSelecionado) &&  (
                                                <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                                                    <form className="container flex flex-col gap-2 w-full px-1 py-4 h-auto rounded-[15px] bg-white mx-5 max-w-[400px]">
                                                        <div className="flex justify-center mx-auto w-full max-w-[90%]">
                                                            <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                                                                Observação
                                                            </p>
                                                            <button
                                                                onClick={closeObservacaoModal}
                                                                type="button"
                                                                className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                                                            >
                                                                <X className=" mb-[5px] text-[#192160]" />
                                                            </button>
                                                        </div>

                                                        <div className="space-y-2 justify-center items-center ml-[40px] mr-8">

                                                            <p className="text-[#192160] text-sm font-medium mb-1">
                                                                observacao do emprestimo
                                                            </p>

                                                        </div>

                                                    </form>
                                                </div>
                                            )} */}
                                        {/* Fim adicionando pop up de observacao do emprestimo */}
                                    </tr>
                                    
                                </tbody>
                            </table>
                        </div>

                        {/* fim tabela com emprestimo concluido */}


                        {/* passador de página */}
                        <div className=" mt-2 flex justify-start items-center">

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