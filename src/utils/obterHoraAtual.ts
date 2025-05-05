  //hora atual
export function obterHoraAtual(): string {
    const dataAtual = new Date();
    const hora = String(dataAtual.getHours()).padStart(2, "0");
    const minutos = String(dataAtual.getMinutes()).padStart(2, "0");
    const horaFormatada = `${hora}:${minutos}`;
    return horaFormatada;
}