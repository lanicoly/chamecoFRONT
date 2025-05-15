
//Tive que fazer essa função para poder formatar a data e a hora que estavam vindo do banco.
export function formatarDataHora(dataFormatada: string) {
    const data = new Date(dataFormatada);
    const dataBr = data.toLocaleDateString("pt-BR");
    const horaBr = data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      data: dataBr,
      hora: horaBr,
    };
}