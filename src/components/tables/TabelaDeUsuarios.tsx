import { IUsuario } from "../../pages/chaves"

interface ItabelaDeUsuarios {
    filtrarUsuario: IUsuario[],
    userSelecionado: any,
    statusSelecao: (arg: number) => void,
}

export function TabelaDeUsuarios({filtrarUsuario, userSelecionado, statusSelecao}: ItabelaDeUsuarios) {

    console.log("Lista de usuários: ", filtrarUsuario)

    return (
        <div className="overflow-y-auto max-h-[248px] tablet:max-h-64 desktop:max-h-96">
              <table className="w-full border-separate border-spacing-y-2 tablet:mb-6 bg-white">
                <thead className="bg-white sticky top-0 z-10">
                  <tr>
                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 w-[45%]">
                      Nome de usuário
                    </th>
                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 flex-1 w-[30%]">
                      Setor
                    </th>
                    <th className="text-left text-[10px] sm:text-[12px] font-medium text-sky-900 ">
                      Tipo de Usuario
                    </th>
                  </tr>
                </thead>
                <tbody>
                    {filtrarUsuario.map((usuario: IUsuario) => (
                        <tr
                            key={usuario.id}
                            className={`hover:bg-[#d5d8f1] cursor-pointer px-2 ${
                                userSelecionado === usuario.id ? "bg-gray-200" : ""
                            }`}
                            onClick={() => statusSelecao(usuario.id)}
                        >
                        <td className="align-top p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] break-words w-[45%]">
                            {usuario.nome}
                        </td>
                        <td className="align-top p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[30%] break-words flex-1">
                            {usuario.setor !== "" ? usuario.setor : "Não informado"}
                        </td>
                        <td className="align-top p-2 text-xs text-[#646999] font-semibold border-2 border-solid border-[#B8BCE0] w-[25%] tablet:max-w-[200px] laptop:max-w-[400px] break-words">
                            {usuario.tipo}
                        </td>
                        </tr>
                    ))}
                </tbody>
              </table>
        </div>
    )
}