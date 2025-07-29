
interface IpesquisaProps {
    pesquisa: string;
    placeholder?: string;
    setPesquisa: (p:string) => void;
    setIsSearching: (s:boolean) => void;
}

export function Pesquisa ({pesquisa, placeholder, setIsSearching, setPesquisa}: IpesquisaProps) {
    return (
        <div className="h-fit items-center w-full tablet:w-auto">
            <div className="flex justify-between items-center px-2 py-1 border-solid border-[1px] border-slate-500 rounded-md ">
                <input
                    type="text"
                    value={pesquisa}
                    onChange={(e) => {
                        setPesquisa(e.target.value);
                        setIsSearching(e.target.value.trim().length > 0);
                    }}
                    placeholder={placeholder}
                    className="placeholder-sky-900 text-sm font-medium outline-none "
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#64748b" className="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
            </div>

        </div>
    )
}