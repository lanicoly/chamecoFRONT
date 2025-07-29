import { Plus, X } from "lucide-react";
import { useState } from "react";


function AdicionarUsuarioForm({closeUserModal}: any) {

    const [nome, setNome] = useState<string>("");
    const [tipo, setTipo] = useState<string>("");

    const criarUsuario = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Criar usuário", { nome, tipo });
    }

    return (
        <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                <form
                  onSubmit={criarUsuario}
                  className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px]"
                >
                  {/*cabeçalho modal add user*/}
                  <div className="flex justify-center mx-auto w-full max-w-[90%]">
                    <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                      ADICIONAR USUÁRIO
                    </p>
                    <button
                      onClick={closeUserModal}
                      type="button"
                      className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                    >
                      <X className=" mb-[5px] text-[#192160]" />
                    </button>
                  </div>
                  {/* fim cabeçalho modal add user*/}

                  <div className="space-y-3 justify-center items-center ml-[40px] mr-8">
                    {/*seção nome de usuáiro */}
                    <div>
                      <p className="text-[#192160] text-sm font-medium mb-1">
                        Digite o nome do usuário
                      </p>
                      <input
                        className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                        type="text"
                        placeholder="Nome do usuário"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                      />
                    </div>
                    {/* fim seção nome de usuário */}

                    {/*seção email de usuário*/}
                    {/* <div>
                      <p className="text-[#192160] text-sm font-medium mb-1">
                        Digite o e-mail do usuário
                      </p>
                      <input
                        className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                        type="text"
                        placeholder="Email do usuário"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div> */}
                    {/* fim seção email de usuário*/}

                    {/* seção tipo do usuário*/}
                    <div>
                      <p className="text-[#192160] text-sm font-medium mb-1">
                        Selecione o tipo do usuário
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
                    {/* fim seção tipo do usuário*/}
                  </div>
                  {/* botão salvar criação de  usuário*/}
                  <div className="flex justify-center items-center mt-[10px] w-full">
                    <button
                      type="submit"
                      className="px-3 py-2 border-[3px] rounded-xl font-semibold  text-sm flex gap-[4px] justify-center items-center  bg-[#16C34D] text-[#FFF]"
                    >
                      <Plus className="h-10px" /> CRIAR USUÁRIO
                    </button>
                  </div>
                  {/* fim botão salvar criação de  usuário*/}
                </form>
        </div>
    )
}

export default AdicionarUsuarioForm;