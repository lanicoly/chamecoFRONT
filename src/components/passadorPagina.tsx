
interface PassadorPaginaProps {
    voltarPagina: () => void;
    avancarPagina: () => void;
    paginaAtual: number;
    totalPaginas: number;
}

export function PassadorPagina ({voltarPagina, avancarPagina, paginaAtual, totalPaginas} : PassadorPaginaProps) {
    return (
        <div className=" mt-2 flex justify-end items-center absolute bottom-3 right-8 sm:right-10">

            <button onClick={voltarPagina} className="size-[22px] rounded-sm text-white text-sm flex items-center justify-center font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#075985" className="bi bi-chevron-left" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                </svg>
            </button>

            <div className="w-auto gap-1.5 px-1 py-1 flex items-center justify-center">
                <div className="size-[28px] rounded-full bg-[#8d93c9] text-white text-sm flex items-center justify-center font-semibold">{paginaAtual}</div>
                <div className="text-base text-sky-800 font-semibold">de <strong className="font-bold">{totalPaginas}</strong></div>
            </div>

            <button onClick={avancarPagina} className="size-[22px] rounded-sm text-white text-sm flex items-center justify-center font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#075985" className="bi bi-chevron-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
                </svg>
            </button>

        </div>
 
    )
}