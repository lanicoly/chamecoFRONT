import { Check, X } from "lucide-react";

interface IpopUpEditarUsuario {
    editaUser: (arg: any) => void,
    closeEditModal: (arg: any) => void,
    nome: string,
    setNome: (arg: string) => void,
    email: string,
    setEmail: (arg: string) => void,
    tipo: string,
    setTipo: (arg: string) => void,
}

export function PopUpEditarUsuario({editaUser, closeEditModal, nome, setNome, email, setEmail, tipo, setTipo}: IpopUpEditarUsuario) {
    return (
        <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
            <form
                    onSubmit={editaUser}
                    className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px]"
                  >
                    <div className="flex justify-center mx-auto w-full max-w-[90%]">
                      <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                        EDITAR USUÁRIO
                      </p>
                      <button
                        onClick={closeEditModal}
                        type="button"
                        className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                      >
                        <X className=" mb-[5px] text-[#192160]" />
                      </button>
                    </div>

                    <div className="space-y-3 justify-center items-center ml-[40px] mr-8">
                      <p className="text-[#192160] text-sm font-medium mb-1">
                        Digite o novo nome do usuário
                      </p>

                      <input
                        value={nome}
                        className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                        type="text"
                        placeholder="Nome do usuário"
                        onChange={(e) => setNome(e.target.value)}
                        required
                      />

                      <div>
                        <p className="text-[#192160] text-sm font-medium mb-1">
                          Digite o novo email do usuário
                        </p>

                        <input
                          className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                          type="text"
                          placeholder="Email do usuário"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <p className="text-[#192160] text-sm font-medium mb-1">
                          Selecione o novo tipo de usuário
                        </p>
                        <select
                          name="tipo_usuario"
                          id="tipo_usuario"
                          className=" justify-between items-center px-2 py-[5px] border-solid border-[1px] border-slate-500 rounded-md text-[#777DAA] text-xs font-medium w-full"
                          value={tipo}
                          onChange={(e) => setTipo(e.target.value)}
                          required
                        >
                          <option value="">Tipo de usuário</option>
                          <option value="administrativo">Administrativo</option>
                          <option value="codis">CODIS</option>
                          <option value="guarita">Guarita</option>
                          <option value="servidor">Servidor</option>
                          <option value="aluno">Aluno</option>
                        </select>
                      </div>
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
    )
}