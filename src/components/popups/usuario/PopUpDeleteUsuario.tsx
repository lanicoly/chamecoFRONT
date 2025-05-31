import { TriangleAlert, X } from "lucide-react";

interface IpopUpDeleteUsuario {
    removeUser: (arg: any) => void,
    closeDeleteModal: (arg: any) => void,
}

export function PopUpDeleteUsuario({removeUser, closeDeleteModal, }: IpopUpDeleteUsuario) {
    return (
            <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                  <form
                    onSubmit={removeUser}
                    className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px] justify-center items-center"
                  >
                    <div className="flex justify-center mx-auto w-full max-w-[90%]">
                      <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] h-max">
                        EXCLUIR USUÁRIO
                      </p>
                      <button
                        onClick={closeDeleteModal}
                        type="button"
                        className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                      >
                        <X className=" text-[#192160]" />
                      </button>
                    </div>
                    <TriangleAlert className="size-16 text-red-700" />

                    <p className="text-center px-2">
                      Essa ação é{" "}
                      <strong className="font-semibold ">definitiva</strong> e
                      não pode ser desfeita.{" "}
                      <strong className="font-semibold">
                        Tem certeza disso?
                      </strong>
                    </p>
                    <div className="flex justify-center items-center mt-[10px] w-full gap-3">
                      <button
                        onClick={closeDeleteModal}
                        type="button"
                        className="px-4 py-2 border-[3px] rounded-xl font-semibold  text-sm flex gap-[4px] justify-center items-center  bg-slate-500 text-[#FFF]"
                      >
                        CANCELAR
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border-[3px] rounded-xl font-semibold  text-sm flex gap-[4px] justify-center items-center  bg-red-700 text-[#FFF]"
                      >
                        EXCLUIR
                      </button>
                    </div>
                  </form>
            </div>
    )
}