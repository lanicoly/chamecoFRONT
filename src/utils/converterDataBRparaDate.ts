
export function converterDataBRparaDate(dataStr: string): Date {
    const [dia, mes, ano] = dataStr.split("/");
    return new Date(Number(ano), Number(mes) - 1, Number(dia));
}