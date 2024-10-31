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
        { id: 1, sala: "Laboratório X", bloco: "E", descricao: "Nenhuma chave em uso no momento", qtdDisponível: 2, qtdEmprestada: 0 },
        { id: 2, sala: "Laboratório Y", bloco: "E", descricao: "Chave em uso pela prof. Aryane", qtdDisponível: 1, qtdEmprestada: 1 },
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

            <MenuTopo mudarTela={mudarTela} />

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
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[55%]">Sala</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 flex-1 min-w-10 w-20">Bloco</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-20">Qtd. Disp.</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-20 ">Qtd. Uso</th>
                                        <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 pl-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itensAtuais.map(chave => (
                                        <tr
                                            key={chave.id}
                                        >
                                            <td className="align-top p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[55%]">
                                                {chave.sala}
                                            </td>
                                            <td className="align-top p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] min-w-10 w-20 break-words flex-1">
                                                {chave.bloco}
                                            </td>
                                            <td className="align-top p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0]  break-words min-w-8 w-20">
                                                {chave.qtdDisponível}
                                            </td>
                                            <td className="align-top p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words min-w-8 w-20">
                                                {chave.qtdEmprestada}
                                            </td>

                                            <td className="pl-2">

                                                <button onClick={() => openChaveModal(chave.id)} className="flex gap-1 justify-start items-center font-medium text-[#646999] underline mobile:text-sm text-xs">
                                                    Ver mais
                                                </button>
                                            </td>
                                            {/* Adicionando pop up de descricao da chave */}
                                            {(isChaveModalOpen && chave.id === ChaveSelecionada) &&  (
                                                <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                                                    <form className="container flex flex-col gap-2 w-full px-1 py-4 h-auto rounded-[15px] bg-white mx-5 max-w-[400px]">
                                                        <div className="flex justify-center mx-auto w-full max-w-[90%]">
                                                            <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                                                                Chaves
                                                            </p>
                                                            <button
                                                                onClick={closeChaveModal}
                                                                type="button"
                                                                className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                                                            >
                                                                <X className=" mb-[5px] text-[#192160]" />
                                                            </button>
                                                        </div>

                                                        <div className="space-y-1 justify-center items-center ml-[40px] mr-8">

                                                            <h2 className="text-[#192160] font-semibold">{chave.sala}:</h2>

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