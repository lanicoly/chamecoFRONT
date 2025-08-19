// import { useMemo, useState, useRef, useEffect } from 'react';
// import { ISala } from '../../pages/chaves';

// export interface IoptionSalas {
//   superusuario: number;
//   nome: string;
// }

// interface IdropdownResponsavelProps {
//   items: ISala[];
//   onSelectItem: (id: number) => void; // Adicionei esta propriedade para o callback
//   reset: boolean; 
// }

// export function FilterableInputSalas({items, onSelectItem, reset}: IdropdownResponsavelProps) {

//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedOption, setSelectedOption] = useState<IoptionSalas | null>(null);

//   const filterdItems = useMemo(() => {
//     const lowerSearch = searchTerm.toLowerCase();
//     return items.filter((item) => item.nome.toLowerCase().includes(lowerSearch));
//   }, [items, searchTerm]);

//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const handleSelect = (option: IoptionSalas) => {
//     setSelectedOption(option);
//     setSearchTerm(option.nome);
//     setIsOpen(false);
//     onSelectItem(option.superusuario); // Chama o callback com o ID do item selecionado
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//     setIsOpen(true); // Sempre abrir o dropdown ao digitar
//   };

//   // Fecha o dropdown ao clicar fora
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

  
//   return (
//     <div ref={dropdownRef} className="relative">
//       <div className="flex justify-between items-center relative">
//         <input
//             type="text"
//             placeholder="Salas"
//             value={reset ? "" : searchTerm}
//             onChange={handleInputChange}
//             // className="flex-1 outline-none text-[#646999]"
//             className='w-full p-3 rounded-[10px] border-none focus:outline-none placeholder-[#646999] text-sm font-medium'
//           />
//         {/* <Search size={50} className="text-red-400" /> */}
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="14"
//             height="14"
//             fill="#64748b"
//             className="bi bi-search absolute right-3"
//             viewBox="0 0 16 16"
//         >
//             <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
//         </svg>
//       </div>

//       {isOpen && filterdItems.length > 0 && (
//         <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
//           {filterdItems.map((option) => (
//             <div
//               key={option.superusuario}
//               onClick={() => handleSelect(option)}
//               className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-[#646999]"
//             >
//               {option.nome}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }