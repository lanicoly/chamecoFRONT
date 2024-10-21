import { X } from "lucide-react";
import { useState } from "react";
import { MenuTopo } from "../elementosVisuais/menuTopo";
import { Pesquisa } from "../elementosVisuais/pesquisa";
import { PassadorPagina } from "../elementosVisuais/passadorPagina";


export interface Chave {
    id: number;
    sala: string;
    bloco: string;
    descricao: string;
    qtdReservada: number;
    qtdEmprestada: number;
    qtdDisponível: number;
}

//essa interface props serve para eu herdar variáveis e funções do componante pai (que nesse caso é o arquivo app.tsx)

//estou usando essa interface para que eu consiga usar a função criada no "App" em todos os arquivos que eu chamar ela e importar do componente pai, realizando uma breve navegação entre as telas

interface StatusChavesProps {
    mudarTela: (index: number) => void
}

export function StatusChaves({ mudarTela }: StatusChavesProps) {

    const [listaChaves, setListaChaves] = useState<Chave[]>([
        { id: 1, sala: "E04", bloco: "Bloco E", descricao: "Descrição da chave 1", qtdReservada: 1, qtdDisponível: 2, qtdEmprestada: 0 },
        { id: 2, sala: "E05", bloco: "Bloco E", descricao: "Descrição da chave 2", qtdReservada: 0, qtdDisponível: 1, qtdEmprestada: 1 },
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
            chave.bloco.toLowerCase().includes(pesquisa.toLowerCase()) ||
            chave.descricao.toLowerCase().includes(pesquisa.toLowerCase())
        )
        : listaChaves

    const itensAtuais = chavesFiltradas.slice(indexInicio, indexFim);

    const [isChaveModalOpen, setIsChaveModalOpen] = useState(false);
    const [isAutorizaModalOpen, setIsAutorizaModalOpen] = useState(false);
    const [ChaveSelecionada, setChaveSelecionada] = useState<number | null>(null);

    function openChaveModal(id: number) {
        setIsChaveModalOpen(true);
        seleciona(id);
    }

    function closeChaveModal() {
        setIsChaveModalOpen(false);
    }
    function openAutorizaModal() {
        setIsAutorizaModalOpen(true);
    }

    function closeAutorizaModal() {
        setIsAutorizaModalOpen(false);
    }

    function seleciona(id: number) {
        setChaveSelecionada(id);
    };

    function desseleciona() {
        setChaveSelecionada(null)
    }

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

            <MenuTopo mudarTela={mudarTela} />

            {/* parte informativa tela status chaves */}
            <div className="relative bg-white w-full max-w-[960px] rounded-3xl px-6  py-2 tablet:py-3 desktop:py-6 m-12 top-8  tablet:top-6 tablet:h-[480px] h-[90%]">

                {/* cabeçalho tela status chaves */}
                <div className="flex w-full gap-2">

                    <h1 className="flex w-full justify-center text-sky-900 text-2xl font-semibold">STATUS DE CHAVES</h1>
                </div>
                {/* fim cabeçalho tela status chaves */}

                {/* conteudo central tela status chaves */}
                <div className="flex flex-col mobile:px-8 px-4 py-3 w-auto justify-center gap-3">

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

                            {/* input de filtro */}
                            <div >

                                <select
                                    name="filtrar_status"
                                    id="filtrar_status"
                                    // value={filtro}
                                    // onChange={(e) => {
                                    //     setFiltro(e.target.value);
                                    // }}
                                    className=" justify-between items-center px-2 py-[5px] border-solid border-[1px] border-slate-500 rounded-md text-sky-900 text-sm font-medium h-fit">
                                    <option value="todos">Todos</option>
                                </select>

                            </div>
                            {/* fim input de filtro */}
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
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[25%]">Nome da sala</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 flex-1 w-[25%]">Nome do bloco</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-16 ">Qtd. em Uso</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-16">Qtd. Res.</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-16">Qtd. Disp.</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 flex-1">Conceder autorização</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 ">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itensAtuais.map(chave => (
                                        <tr
                                            key={chave.id}
                                        >
                                            <td className="align-top p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words max-w-[25%]">
                                                {chave.sala}
                                            </td>
                                            <td className="align-top p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] max-w-[25%] break-words flex-1">
                                                {chave.bloco}
                                            </td>
                                            <td className="align-top p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-16">
                                                {chave.qtdEmprestada}
                                            </td>
                                            <td className="align-top p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-16">
                                                {chave.qtdReservada}
                                            </td>
                                            <td className="align-top p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0]  break-words w-16">
                                                {chave.qtdDisponível}
                                            </td>
                                            <td className="flex justify-center items-center">

                                                <button onClick={openAutorizaModal} className="bg-sky-900 text-sm text-white font-semibold px-4 py-1 rounded-md mx-2">
                                                    AUTORIZAR
                                                </button>
                                            </td>

                                            {isAutorizaModalOpen &&  (
                                                <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                                                    <form className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px]">
                                                        <div className="flex justify-center mx-auto w-full max-w-[90%]">
                                                            <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                                                                Autorizar
                                                            </p>
                                                            <button
                                                                onClick={closeAutorizaModal}
                                                                type="button"
                                                                className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                                                            >
                                                                <X className=" mb-[5px] text-[#192160]" />
                                                            </button>
                                                        </div>

                                                        <div className="space-y-3 justify-center items-center ml-[40px] mr-8">

                                                            <p className="text-[#192160] text-sm font-medium mb-1">
                                                                teste
                                                            </p>

                                                        </div>

                                                    </form>
                                                </div>
                                            )}

                                            <td>

                                                <button onClick={() => openChaveModal(chave.id)} className="flex gap-1 justify-start items-center font-medium text-sm text-[#646999] underline">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#646999" className="bi bi-pen" viewBox="0 0 16 16">
                                                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                                                    </svg>
                                                    Descrição
                                                </button>
                                            </td>
                                            {/* Adicionando pop up de descricao da chave */}
                                            {(isChaveModalOpen && chave.id === ChaveSelecionada) &&  (
                                                <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                                                    <form className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px]">
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

                                                        <div className="space-y-3 justify-center items-center ml-[40px] mr-8">

                                                            <p className="text-[#192160] text-sm font-medium mb-1">
                                                                {chave.descricao}
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