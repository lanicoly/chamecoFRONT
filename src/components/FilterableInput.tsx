import { useState, useMemo } from 'react';

interface FilterableItem {
  id: number ;
  nome: string;
}

interface FilterableInputProps {
  items: FilterableItem[];
  placeholder: string;
  selectedItemId: number;
  onSelectItem: (id: number ) => void;
  className?: string;
  inputClassName?: string;
  dropdownClassName?: string;
  itemClassName?: string;
}

export const FilterableInput = ({
  items,
  placeholder,
  selectedItemId,
  onSelectItem,
  className = '',
  inputClassName = '',
  dropdownClassName = '',
  itemClassName = '',
}: FilterableInputProps) => {
  const [busca, setBusca] = useState('');
  const [mostrarDropdown, setMostrarDropdown] = useState(false);

  const itemsFiltrados = useMemo(() => {
    const lowerBusca = busca.toLowerCase();
    return items.filter((item) => 
      item.nome.toLowerCase().includes(lowerBusca)
    );
  }, [busca, items]);

  const selectedItemName = selectedItemId
    ? items.find((item) => item.id === selectedItemId)?.nome
    : '';

  return (
    <div className={`relative ${className}`}>
      <div className="flex justify-between items-center relative">
        <input
          className={`w-full p-3 rounded-[10px] border-none focus:outline-none placeholder-[#646999] text-sm font-medium ${inputClassName}`}
          type="text"
          placeholder={placeholder}
          value={mostrarDropdown ? busca : selectedItemName}
          required
          onChange={(ev) => {
            setBusca(ev.target.value);
            setMostrarDropdown(true);
          }}
          onFocus={() => setMostrarDropdown(true)}
          onBlur={() => setTimeout(() => setMostrarDropdown(false), 200)}
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

      {mostrarDropdown && busca && (
        <ul className={`absolute top-full left-0 right-0 bg-white shadow-md z-10 max-h-60 overflow-y-auto ${dropdownClassName}`}>
          {itemsFiltrados.map((item) => (
            <li
              key={item.id}
              className={`p-2 hover:bg-gray-100 cursor-pointer ${itemClassName}`}
              onClick={() => {
                onSelectItem(item.id);
                setBusca(item.nome);
                setMostrarDropdown(false);
              }}
            >
              {item.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};