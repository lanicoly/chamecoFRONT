import { useState, useMemo } from 'react';

interface ItemFiltravel {
  id: number;
  nome: string;
}

interface FiltroState {
  busca: string;
  itemSelecionadoId: number | null;
  mostrarDropdown: boolean;
}

export function useFiltroDropdown(itens: ItemFiltravel[]) {
  const [filtro, setFiltro] = useState<FiltroState>({
    busca: '',
    itemSelecionadoId: null,
    mostrarDropdown: false
  });

  const itensFiltrados = useMemo(() => {
    const lowerBusca = filtro.busca.toLowerCase();
    return itens.filter(item => 
      item.nome.toLowerCase().includes(lowerBusca)
    );
  }, [filtro.busca, itens]);

  const atualizarFiltro = (updates: Partial<FiltroState>) => {
    setFiltro(prev => ({ ...prev, ...updates }));
  };

  const selecionarItem = (item: ItemFiltravel) => {
    atualizarFiltro({
      busca: item.nome,
      itemSelecionadoId: item.id,
      mostrarDropdown: false
    });
  };

  return {
    ...filtro,
    itensFiltrados,
    atualizarFiltro,
    selecionarItem
  };
}