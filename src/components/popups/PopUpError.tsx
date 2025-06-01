interface PopUpErrorProps{
  mensagem: string;
}

export function PopUpError({mensagem}:PopUpErrorProps){
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-red-600 rounded-lg shadow-lg p-6 w-1/3">
          <h2 className="text-xl font-semibold mb-4 text-[#fff]">{mensagem}</h2>
        </div>
      </div>
    );
}