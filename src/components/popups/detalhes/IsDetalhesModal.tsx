import { TriangleAlert, X } from "lucide-react";
import { useState } from "react";
import { Iemprestimo } from "../../../pages/emprestimos";

interface DetalhesModal{
  observacao: string | null;
  setObservacao: (value: string) => void, 
    emprestimoSelecionado: Iemprestimo | null, 
    // removeObservacao: () => void, 
    closeDetalhesModal: () => void,
    // editarObservacao: () => void,
    openDeleteModal: () => void,
    closeDeleteModal: () => void,
    isDeleteModalOpen: boolean, 
}

export function IsDetalhesModal ( {
    observacao, 
    setObservacao, 
    emprestimoSelecionado, 
    // removeObservacao, 
    closeDetalhesModal,
    // editarObservacao,
    openDeleteModal,
    closeDeleteModal,
    isDeleteModalOpen,
}: DetalhesModal){  
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    

    function openEditModal() {
        setIsEditModalOpen(true);
    }
    
    function closeEditModal() {
        setIsEditModalOpen(false);
    }


  function editarObservacao(e: React.FormEvent) {
    e.preventDefault();
    if (emprestimoSelecionado && observacao) {
      emprestimoSelecionado.observacao = observacao;
    }
    setObservacao("");
    closeEditModal();
  }

  //criando função de excluir observação de emprestimos
  function removeObservacao(e: React.FormEvent) {
    e.preventDefault();
    if (emprestimoSelecionado) {
      emprestimoSelecionado.observacao = "";
    }
    setObservacao("");
    closeDeleteModal();
  }

    return (
        // emprestimo.id === emprestimoSelecionado?.id &&
        <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
            <form className="container flex flex-col gap-2 w-full px-4 py-4 h-auto rounded-[15px] bg-white mx-5 max-w-[500px]">
                <div className="flex justify-between w-full px-3">
                    <p className="text-[#192160] text-left text-[20px] font-semibold pr-6">
                    DETALHES
                    </p>
                    <div className="flex justify-center items-center gap-3">
                    <button
                        type="button"
                        onClick={openEditModal}
                        className="flex gap-1 justify-end items-center font-medium text-sm text-[#646999] underline"
                    >
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        fill="#646999"
                        className="bi bi-pen"
                        viewBox="0 0 16 16"
                        >
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                        </svg>
                        Editar
                    </button>

                    {/* Começo do pop up de editar observacao*/}
                    {isEditModalOpen && (
                        <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                        <form
                            // onSubmit={editarObservacao}
                            className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px]"
                        >
                            <div className="flex justify-center mx-auto w-full max-w-[90%]">
                            <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] ">
                                EDITAR OBSERVAÇÃO
                            </p>

                            <button
                                onClick={closeEditModal}
                                type="button"
                                className="px-2 py-1 rounded w-[5px] flex-shrink-0 "
                            >
                                <X className=" mb-[5px] text-[#192160]" />
                            </button>
                            </div>

                            <div className="justify-center items-center ml-[40px] mr-8">
                            <p className="text-[#192160] text-sm font-medium mb-1">
                                Digite a nova observação
                            </p>

                            <input
                                className="w-full p-2 rounded-[10px] border border-[#646999] focus:outline-none text-[#777DAA] text-xs font-medium "
                                type="text"
                                placeholder="Observação"
                                value={
                                    observacao !== null ? observacao : ""
                                }
                                onChange={(e) =>
                                    setObservacao(e.target.value)
                                }
                            />
                            </div>

                            <div className="flex justify-center items-center mt-[10px] w-full">
                            <button
                                type="submit"
                                onClick={editarObservacao}
                                className="px-3 py-2 border-[3px] rounded-xl font-semibold  text-sm flex gap-[4px] justify-center items-center  bg-[#16C34D] text-[#FFF]"
                            >
                                SALVAR ALTERAÇÕES
                            </button>
                            </div>
                        </form>
                        </div>
                    )}
                    {/* Fim do pop up de editar observacao */}

                    <button
                        type="button"
                        onClick={openDeleteModal}
                        className="flex gap-1 justify-start items-center font-medium text-sm text-rose-600 underline"
                    >
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        fill="#e11d48"
                        className="bi bi-x-lg"
                        viewBox="0 0 16 16"
                        >
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                        </svg>
                        Excluir
                    </button>

                    {/* Adicionando pop up de deletar observacao */}
                    {isDeleteModalOpen && (
                        // emprestimo.id === emprestimoSelecionado?.id &&
                        <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-20">
                        <form
                            onSubmit={removeObservacao}
                            className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px] justify-center items-center"
                        >
                            <div className="flex justify-center mx-auto w-full max-w-[90%]">
                            <p className="text-[#192160] text-center text-[20px] font-semibold  ml-[10px] w-[85%] h-max">
                                EXCLUIR OBSERVAÇÃO
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
                            <strong className="font-semibold ">
                                definitiva
                            </strong>{" "}
                            e não pode ser desfeita.{" "}
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
                                onClick={removeObservacao}
                                className="px-4 py-2 border-[3px] rounded-xl font-semibold  text-sm flex gap-[4px] justify-center items-center  bg-red-700 text-[#FFF]"
                            >
                                EXCLUIR
                            </button>
                            </div>
                        </form>
                        </div>
                    )}
                    </div>
                    <button
                        onClick={() => {
                            closeDetalhesModal()
                        }}
                        type="button"
                        className="px-2 py-1 rounded flex-shrink-0 "
                    >
                    <X className=" mb-[5px] text-[#192160]" />
                    </button>
                </div>

                <div className="flex w-full h-auto px-[10px] py-2 mb-4 flex-col rounded-lg bg-[#B8BCE0]">
                    <p className="text-[#192160] font-medium p-1">
                    {emprestimoSelecionado?.observacao ||
                        "Detalhes sobre o empréstimo"}
                    </p>
                </div>
            </form>
        </div>
    )
}

export default IsDetalhesModal;