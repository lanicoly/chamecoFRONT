import { Info, X } from "lucide-react";
import { useState } from "react";
import { MenuTopo } from "../components/menuTopo";
import { Pesquisa } from "../components/pesquisa";
import { PassadorPagina } from "../components/passadorPagina";

export interface Chave {
    id: number;
    sala: string;
    bloco: string;
    tipo: string;
    descricao: string;
    posse: string;
    status: string;
}

export function StatusChaves() {

    const [listaChaves] = useState<Chave[]>([
        { id: 1, sala: "Laboratório Y", bloco: "E", tipo: "Principal", descricao:"Chave do lab 2 do bloco H", posse: "Em uso pela prof. Aryane", status: "INDISPONÍVEL"},
        { id: 2, sala: "Laboratório X", bloco: "E",  tipo: "Secundária", descricao:"Chave do lab 1 do bloco H", posse:"Não está em uso no momento", status: "DISPONÍVEL"},
    ]);
    const itensPorPagina = 5;
    const [paginaAtual, setPaginaAtual] = useState(1);
    const totalPaginas = Math.max(1, Math.ceil(listaChaves.length / itensPorPagina));
    const indexInicio = (paginaAtual - 1) * itensPorPagina;
    const indexFim = indexInicio + itensPorPagina;

    const [pesquisa, setPesquisa] = useState('');
    const [isSearching, setIsSearching] = useState(false);


    const chavesFiltradas = isSearching
        ? listaChaves.filter(chave =>
            chave.sala.toLowerCase().includes(pesquisa.toLowerCase()) ||
            chave.bloco.toLowerCase().includes(pesquisa.toLowerCase())
        )
        : listaChaves

    const itensAtuais = chavesFiltradas.slice(indexInicio, indexFim);

    const [isChaveModalOpen, setIsChaveModalOpen] = useState(false);
    // const [isAutorizaModalOpen, setIsAutorizaModalOpen] = useState(false);
    const [ChaveSelecionada, setChaveSelecionada] = useState<number | null>(null);

    function openChaveModal(id: number) {
        setIsChaveModalOpen(true);
        seleciona(id);
    }

    function closeChaveModal() {
        setIsChaveModalOpen(false);
    }
    // function openAutorizaModal() {
    //     setIsAutorizaModalOpen(true);
    // }

    // function closeAutorizaModal() {
    //     setIsAutorizaModalOpen(false);
    // }

    function seleciona(id: number) {
        setChaveSelecionada(id);
    };

    // function desseleciona() {
    //     setChaveSelecionada(null)
    // }

    function avancarPagina() {
        if (paginaAtual < totalPaginas) {
            setPaginaAtual(paginaAtual + 1);
        }
    };

    function voltarPagina() {
        if (paginaAtual > 1) {
            setPaginaAtual(paginaAtual - 1);
        }
    };

    return (
        <div className="flex items-center justify-center bg-tijolos h-screen bg-no-repeat bg-cover">

        <MenuTopo text = "VOLTAR" backRoute="/chaves" />


            {/* parte informativa tela status chaves */}
            <div className="relative bg-white w-full max-w-[800px] rounded-3xl px-6  py-2 tablet:py-3 desktop:py-6 m-12 top-8  tablet:top-10 desktop:top-6 tablet:h-[480px] h-[90%]">

                {/* cabeçalho tela status chaves */}
                <div className="flex w-full gap-2">

                    <h1 className="flex w-full justify-center text-sky-900 text-2xl font-semibold">STATUS DE CHAVES</h1>
                </div>
                {/* fim cabeçalho tela status chaves */}

                {/* conteudo central tela status chaves */}
                <div className="flex flex-col px-4 py-3 w-auto justify-center gap-3">

                    {/* pesquisa + filtro */}
                    <div className="flex justify-center items-center min-w-[220px] flex-wrap gap-2 flex-1 mobile:justify-between">

                        <div className="flex gap-2 flex-wrap">

                            {/* input de pesquisa */}
                            <Pesquisa
                                pesquisa={pesquisa}
                                setIsSearching={setIsSearching}
                                setPesquisa={setPesquisa}
                            />
                            {/* fim input de pesquisa */}

                        </div>

                    </div>
                    {/* fim pesquisa + filtro */}


                    {/* conteudo central tabela*/}
                    <div>

                        {/* tabela com todas as chaves */}
                        <div className="overflow-y-auto max-h-[248px] tablet:max-h-64 desktop:max-h-96">
                            <table className="w-full border-separate border-spacing-y-2 tablet:mb-6 bg-white">
                                <thead className="bg-white sticky top-0 z-10">
                                    <tr>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[40%]">Sala</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 flex-1 min-w-10 w-24">Tipo</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-20 tablet:w-28 "></th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-20  ">Status</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 pl-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itensAtuais.map(chave => (
                                        <tr
                                            key={chave.id}
                                        >
                                            <td className="p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[40%]">
                                                {chave.sala}
                                            </td>
                                            <td className=" p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] min-w-10 w-24 break-words flex-1 text-center">
                                                {chave.tipo}
                                            </td>
                                            <div className="border-2 border-[#B8BCE0] border-solid bg-[#081683]">
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
                                            <td className={` text-center p-2 text-sm text-white font-semibold border-2 border-solid border-[#B8BCE0]  break-words min-w-8 w-20 ${chave.status === 'DISPONÍVEL' ? 'bg-[#22b350]' : 'bg-red-700'}`}>
                                                {chave.status}
                                            </td>

                                            <td className="pl-2">

                                                <button onClick={() => openChaveModal(chave.id)} className="flex gap-1 justify-start items-center font-medium text-[#646999] underline text-xs">
                                                    <Info className="size-3 text-[#646999]"/>
                                                    Descrição
                                                </button>
                                            </td>
                                            {/* Adicionando pop up de descricao da chave */}
                                            {(isChaveModalOpen && chave.id === ChaveSelecionada) &&  (
                                                <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                                                    <form className="container flex flex-col gap-2 w-full px-1 py-4 h-auto rounded-[15px] bg-white mx-5 max-w-[400px]">
                                                        <div className="flex justify-center mx-auto w-full max-w-[90%]">
                                                            <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                                                                Descrição da chave
                                                            </p>
                                                            <button
                                                                onClick={closeChaveModal}
                                                                type="button"
                                                                className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                                                            >
                                                                <X className=" mb-[5px] text-[#192160]" />
                                                            </button>
                                                        </div>

                                                        <div className="space-y-2 justify-center items-center ml-[40px] mr-8">

                                                            <p className="text-[#192160] text-sm font-medium mb-1">
                                                                {chave.descricao}
                                                            </p>

                                                            <p className="text-[#192160] text-sm font-medium mb-1">
                                                                <strong>Status: </strong>{chave.posse}
                                                            </p>

                                                        </div>

                                                    </form>
                                                </div>
                                            )}
                                            {/* Fim adicionando pop up de descricao da chave */}

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* fim tabela com todas as chaves */}

                        {/* passador de página */}
                        <PassadorPagina
                            avancarPagina={avancarPagina}
                            voltarPagina={voltarPagina}
                            totalPaginas={totalPaginas}
                            paginaAtual={paginaAtual}
                        />
                        {/* fim passador de página */}

                    </div>
                    {/* fim conteudo central tabela*/}
                </div>
                {/* fim conteudo central tela status chaves */}

                {/* logo chameco lateral */}
                <div className="flex justify-start bottom-4 absolute sm:hidden">
                    <img className="sm:w-[200px] w-32" src="\logo_lateral.png" alt="logo chameco" />
                </div>
                {/* fim logo chameco lateral */}
            </div>
            {/* fim parte informativa tela status chaves */}
        </div>

    )
}