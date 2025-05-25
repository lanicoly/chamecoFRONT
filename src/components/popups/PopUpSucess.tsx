
interface PopUpdeSucess{
    text: string
}

export function PopUpdeSucess({text}: PopUpdeSucess) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-primary-green rounded-lg shadow-lg p-6 w-1/3">
        <h2 className="text-xl font-semibold mb-4 text-[#fff]">{text}</h2>
      </div>
    </div>
  );
}