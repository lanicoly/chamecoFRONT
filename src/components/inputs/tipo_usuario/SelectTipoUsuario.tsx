interface IselectTipoUsuario {
    filtro: string;
    setFiltro: (f: string) => void;
}

function SelectTipoUsuario({filtro, setFiltro}: IselectTipoUsuario) {
    return (
        <div>
            <select
                name="filtrar_tipo_usuario"
                id="filtrar_tipo_usuario"
                value={filtro}
                onChange={(e) => {
                    setFiltro(e.target.value);
                }}
                className=" justify-between items-center px-2 py-[5px] border-solid border-[1px] border-slate-500 rounded-md text-sky-900 text-sm font-medium h-fit"
            >
                <option value="todos" selected>Tipo...</option>
                <option value="administrativo">Administrativo</option>
                <option value="codis">Codis</option>
                <option value="guarita">Guarita</option>
                <option value="servidor">Servidor</option>
                <option value="aluno">Aluno</option>
                <option value="serv.terceirizado">Serv.terceirizado</option>
                <option value="diretor.geral">Diretor.geral</option>
            </select>
        </div>
    )
};

export default SelectTipoUsuario;