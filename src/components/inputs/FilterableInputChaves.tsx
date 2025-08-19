import { useMemo, useState, useRef, useEffect } from 'react';
import { buscarNomeChavePorIdSala } from '../../utils/buscarNomeChavePorIdSala';
import useGetSalas from '../../hooks/salas/useGetSalas';
import { useChaves } from '../../context/ChavesContext';
import { IChave } from '../../pages/chaves';


export interface IoptionChaves {
  id: number;
  sala: number;
  disponivel: boolean;
  usuarios: any[]; // Ou o tipo mais adequado para usuários
}

interface IdropdownResponsavelProps {
  // items: IoptionChaves[];
  onSelectItem: (id: number) => void, // Adicionei esta propriedade para o callback
  reset: boolean
}


export function FilterableInputChaves({ onSelectItem, reset}: IdropdownResponsavelProps) {

  const {chaves} = useChaves();
  const {salas} = useGetSalas();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [_selectedOption, setSelectedOption] = useState<number | null>(null);

  const filterdItems = useMemo<IChave[]>(() => {
    return chaves?.filter((item: IChave) => item.disponivel && buscarNomeChavePorIdSala(item.sala, chaves as IChave[], salas).toLowerCase().includes(searchTerm.toLowerCase()));
  }, [chaves, searchTerm]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: IChave) => {
    setSelectedOption(option.id);
    setSearchTerm(buscarNomeChavePorIdSala(option.sala, chaves, salas));
    setIsOpen(false);
    onSelectItem(option.id); // Chama o callback com o ID da chave selecionada
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setSearchTerm(Number(e.target.value));
    setSearchTerm(e.target.value);
    setIsOpen(true); // Sempre abrir o dropdown ao digitar
  };

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  useEffect(() => {
    if (reset) {
      setSearchTerm('');
      setSelectedOption(null);
    }
  }, [reset])
  
  return (
    <div ref={dropdownRef} className="relative">
      <div className="flex justify-between items-center relative">
        <input
            type="text"
            placeholder="Chave"
            value={searchTerm || ""}
            onChange={handleInputChange}
            className='w-full p-3 rounded-[10px] border-none focus:outline-none placeholder-[#646999] text-sm font-medium'
          />
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="#64748b"
            className="bi bi-search absolute right-3"
            viewBox="0 0 16 16"
        >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </div>

      {isOpen && filterdItems.length > 0 && (
        <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
          {filterdItems.map((option) => (
            <div
              key={option.id}
              onClick={() => handleSelect(option)}
              className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-[#646999]"
            >
              {buscarNomeChavePorIdSala(option.sala, chaves as IChave[], salas)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
