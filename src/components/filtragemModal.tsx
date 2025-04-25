import { X } from "lucide-react";

interface FiltroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (e: React.FormEvent) => void;
  children: React.ReactNode;
  titulo?: string;
}

export function FiltroModal({ isOpen, onClose, onSubmit, children, titulo = "FILTRAR" }: FiltroModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-50">
      <form
        onSubmit={onSubmit}
        className="container flex flex-col gap-2 w-full p-[10px] h-auto rounded-[15px] bg-white mx-5 max-w-[400px]"
      >
        <div className="flex justify-center mx-auto w-full max-w-[90%]">
          <p className="text-[#192160] text-center text-[20px] font-semibold ml-[10px] w-[85%] ">
            {titulo}
          </p>
          <button
            onClick={onClose}
            type="button"
            className="px-2 py-1 rounded w-[5px] flex-shrink-0"
          >
            <X className="mb-[5px] text-[#192160]" />
          </button>
        </div>

        <div className="space-y-3 justify-center items-center ml-[40px] mr-8">
          {children}
        </div>

        {/* botão salvar */}
        <div className="flex justify-center items-center mt-[10px] w-full">
          <button
            type="submit"
            className="px-3 py-2 border-[3px] rounded-xl font-semibold text-sm flex gap-[4px] justify-center items-center bg-[#16C34D] text-[#FFF]"
          >
            FILTRAR
          </button>
        </div>
      </form>
    </div>
  );
}
