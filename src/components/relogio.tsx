import { useEffect, useState } from "react";
import { Clock } from 'lucide-react';


export function Relogio() {
  const [horaAtual, setHoraAtual] = useState(new Date());

  useEffect(() => {
    const intervalo = setInterval(() => {
      setHoraAtual(new Date());
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  return (
 <div className="tablet:flex hidden text-sky-900 text-2xl font-medium gap-2 items-center">
      <Clock />
      <span className="inline-block w-20 text-center">
        {horaAtual.toLocaleTimeString("pt-BR", { hour12: false })}
      </span>
    </div>
  );
}
